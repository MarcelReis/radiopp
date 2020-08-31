package main

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"regexp"
	"strconv"
	"strings"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go"
	"github.com/gocolly/colly"
	"google.golang.org/api/option"
)

// Radio ...
type Radio struct {
	ID          int      `firestore:"id"`
	Name        string   `firestore:"name"`
	URI         string   `firestore:"uri"`
	Website     string   `firestore:"website"`
	Thumb       string   `firestore:"thumb"`
	City        string   `firestore:"city"`
	Region      string   `firestore:"region"`
	State       string   `firestore:"state"`
	Country     string   `firestore:"country"`
	StreamURL   string   `firestore:"streamURL"`
	OriginalURL string   `firestore:"originalURL"`
	Schedule    Schedule `firestore:"schedule"`
}

// Schedule ...
type Schedule struct {
	Sun []DaySchedule `firestore:"sun"`
	Mon []DaySchedule `firestore:"mon"`
	Tue []DaySchedule `firestore:"tue"`
	Wed []DaySchedule `firestore:"wed"`
	Thu []DaySchedule `firestore:"thu"`
	Fri []DaySchedule `firestore:"fri"`
	Sat []DaySchedule `firestore:"sat"`
}

// DaySchedule ...
type DaySchedule struct {
	Time      string `firestore:"time"`
	Name      string `firestore:"name"`
	Presenter string `firestore:"presenter"`
}

// Location ...
type Location struct {
	City    string `firestore:"city"`
	Region  string `firestore:"region"`
	State   string `firestore:"state"`
	Country string `firestore:"country"`
}

var scheduleSelectors = []string{
	"#prog-Sun",
	"#prog-Mon",
	"#prog-Tue",
	"#prog-Wed",
	"#prog-Thu",
	"#prog-Fri",
	"#prog-Sat"}

func main() {
	dev := os.Args[1] != "production"

	ctx := context.Background()
	sa := option.WithCredentialsFile("./firebase-config.json")
	app, err := firebase.NewApp(ctx, nil, sa)
	if err != nil {
		log.Fatalln(err)
	}

	client, err := app.Firestore(ctx)
	if err != nil {
		log.Fatalln(err)
	}
	defer client.Close()

	radiosRef := client.Collection("radios")
	locationsRef := client.Collection("locations")

	knowLocation := make(map[string]Location)

	c, initialURL := setMainCollector(dev)
	c2 := hiddenRadioCollector()

	c.OnRequest(setMainCollectorCtx)

	scrapeRadioPage(c)

	c.OnHTML(".pagination-body a[href], .resultados-items a[href]", func(e *colly.HTMLElement) {
		e.Request.Visit(e.Attr("href"))
	})

	c.OnScraped(func(r *colly.Response) {
		idString := r.Ctx.Get("id")
		url := r.Request.URL.EscapedPath()

		id, err := strconv.Atoi(idString)
		if err != nil {
			log.Printf("Invalid id: %s", idString)
			return
		}

		radioDocRef := radiosRef.Doc(idString)

		reIsRadioPage := regexp.MustCompile(`\/aovivo\/`)
		if reIsRadioPage.MatchString(url) {
			radio := Radio{
				ID:          id,
				Name:        r.Ctx.Get("name"),
				Website:     r.Ctx.Get("website"),
				Thumb:       r.Ctx.Get("thumb"),
				OriginalURL: r.Ctx.Get("originalURL"),
			}

			URI := r.Ctx.Get("uri")
			if URI != "" {
				radio.URI = URI
			}

			streamURL := r.Ctx.Get("streamURL")
			if streamURL != "" {
				radio.StreamURL = streamURL
			}

			city := r.Ctx.Get("city")
			if city != "" {
				radio.City = city
			}

			region := r.Ctx.Get("region")
			if region != "" {
				radio.Region = region
			}

			state := r.Ctx.Get("state")
			if state != "" {
				radio.State = state
			}

			country := r.Ctx.Get("country")
			if country != "" {
				radio.Country = country
			}

			scheduleStr := r.Ctx.Get("schedule")
			if scheduleStr != "" {
				schedule := Schedule{}
				scheduleByt := []byte(scheduleStr)

				err = json.Unmarshal(scheduleByt, &schedule)
				if err != nil {
					log.Printf("Error when getting schedule of the radio with id %d: %s %s", id, scheduleStr, err)
				} else {
					radio.Schedule = schedule
				}
			}

			_, err = radioDocRef.Set(ctx, radio)
			if err != nil {
				log.Printf("Error when saving the radio with id %d: %s", id, err)
			}

			if streamURL == "" {
				c2.Visit("http://www.radios.com.br/play/" + strconv.Itoa(id))
			}

			if city != "" {
				knowLocation[city] = Location{city, region, state, country}
			}
		}
	})

	c2.OnScraped(func(r *colly.Response) {
		streamURL := r.Ctx.Get("streamURL")
		if streamURL == "" {
			return
		}

		url := r.Request.URL.EscapedPath()
		reRadioID := regexp.MustCompile(`\d+$`)
		radioID := reRadioID.FindString(url)

		id, err := strconv.Atoi(radioID)
		if err != nil {
			log.Printf("Invalid id: %s", radioID)
			return
		}

		radioDocRef := radiosRef.Doc(radioID)

		update := []firestore.Update{{Path: "streamURL", Value: r.Ctx.Get("streamURL")}}

		_, err = radioDocRef.Update(ctx, update)
		if err != nil {
			log.Printf("Error when updating the radio with id %d: %s", id, err)
			return
		}
	})

	c.Visit(initialURL)

	for city, location := range knowLocation {
		locationDocRef := locationsRef.Doc(city)

		_, err = locationDocRef.Set(ctx, location)
		if err != nil {
			log.Printf("Error when saving the location: %s", city)
		}
	}
}

func setMainCollector(dev bool) (*colly.Collector, string) {
	var filterRegex []*regexp.Regexp
	var initialURL string

	if dev {
		filterRegex = []*regexp.Regexp{
			regexp.MustCompile(`radios\.com.br\/aovivo\/`),
			regexp.MustCompile(`\/radio\/cidade\/belo-horizonte\/`)}
		initialURL = "https://www.radios.com.br/radio/cidade/belo-horizonte/8594"
	} else {
		filterRegex = []*regexp.Regexp{
			regexp.MustCompile(`radios\.com.br\/aovivo\/`),
			regexp.MustCompile(`\/busca\/`)}
		initialURL = "https://www.radios.com.br/busca/?q=brasil&qfilter=completo"
	}

	c := colly.NewCollector(
		colly.AllowedDomains("www.radios.com.br"),
		colly.CacheDir("./cache"),
		colly.IgnoreRobotsTxt(),
		colly.DetectCharset(),
		colly.URLFilters(filterRegex...))

	return c, initialURL
}

func setMainCollectorCtx(r *colly.Request) {
	url := r.URL.EscapedPath()

	reRadioID := regexp.MustCompile(`\d+$`)
	radioID := reRadioID.FindString(url)

	reURI := regexp.MustCompile(`\/aovivo\/.+\/`)
	uri := reURI.FindString(url)
	if uri != "" {
		uri = uri[8 : len(uri)-1]
	}

	r.Ctx.Put("id", radioID)
	r.Ctx.Put("name", "")
	r.Ctx.Put("uri", uri)
	r.Ctx.Put("originalURL", r.URL.EscapedPath())
	r.Ctx.Put("website", "")
	r.Ctx.Put("thumb", "")
	r.Ctx.Put("city", "")
	r.Ctx.Put("region", "")
	r.Ctx.Put("state", "")
	r.Ctx.Put("country", "")
	r.Ctx.Put("streamURL", "")
	r.Ctx.Put("schedule", "")
}

func scrapeRadioPage(c *colly.Collector) {
	c.OnHTML("script", getStreamFromScript)

	c.OnHTML(".header-radio > h1", func(e *colly.HTMLElement) {
		name := e.Text
		name = strings.ToValidUTF8(name, "")

		e.Request.Ctx.Put("name", name)
	})

	c.OnHTML(".logo-radio img", func(e *colly.HTMLElement) {
		thumb := e.Attr("src")
		e.Request.Ctx.Put("thumb", thumb)
	})

	c.OnHTML(".conteudo .info-radio", func(e *colly.HTMLElement) {
		e.ForEach("p", func(i int, e *colly.HTMLElement) {
			info := e.Text

			switch true {
			case strings.HasPrefix(info, "Cidade:"):
				e.Request.Ctx.Put("city", info[8:])

			case strings.HasPrefix(info, "Região:"):
				e.Request.Ctx.Put("region", info[9:])

			case strings.HasPrefix(info, "Estado:"):
				e.Request.Ctx.Put("state", info[8:])

			case strings.HasPrefix(info, "País"):
				e.Request.Ctx.Put("country", info[7:])

			case strings.HasPrefix(info, "Site:"):
				e.Request.Ctx.Put("website", info[6:])
			}
		})
	})

	c.OnHTML("#programacao .tab-content", func(e *colly.HTMLElement) {
		schedule := Schedule{}

		for index, selector := range scheduleSelectors {
			e.ForEach(selector+" tr", func(i int, e *colly.HTMLElement) {
				if i == 0 {
					return
				}

				daySchedule := DaySchedule{}

				e.ForEach("td", func(i int, e *colly.HTMLElement) {
					switch i {
					case 0:
						daySchedule.Time = e.Text
					case 1:
						daySchedule.Name = e.Text
					case 2:
						daySchedule.Presenter = e.Text
					}
				})

				switch index {
				case 0:
					schedule.Sun = append(schedule.Sun, daySchedule)
				case 1:
					schedule.Mon = append(schedule.Mon, daySchedule)
				case 2:
					schedule.Tue = append(schedule.Tue, daySchedule)
				case 3:
					schedule.Wed = append(schedule.Wed, daySchedule)
				case 4:
					schedule.Thu = append(schedule.Thu, daySchedule)
				case 5:
					schedule.Fri = append(schedule.Fri, daySchedule)
				case 6:
					schedule.Sat = append(schedule.Sat, daySchedule)
				}
			})
		}

		scheduleByte, err := json.Marshal(schedule)
		if err != nil {
			log.Printf("Error marshalling")
			return
		}

		scheduleString := string(scheduleByte)
		e.Request.Ctx.Put("schedule", scheduleString)
	})
}

func hiddenRadioCollector() *colly.Collector {
	c := colly.NewCollector(
		colly.AllowedDomains("www.radios.com.br"),
		colly.CacheDir("./cache"),
		colly.IgnoreRobotsTxt(),
		colly.DetectCharset(),
		colly.URLFilters(regexp.MustCompile(`radios\.com\.br\/play\/`)))

	c.OnHTML("script", getStreamFromScript)

	return c
}

var reRadioStreamURL = regexp.MustCompile("'url':'.*'")

func getStreamFromScript(e *colly.HTMLElement) {
	streamURL := reRadioStreamURL.FindString(e.Text)

	if streamURL != "" {
		streamURL = streamURL[7 : len(streamURL)-1]
		e.Request.Ctx.Put("streamURL", streamURL)
		return
	}
}
