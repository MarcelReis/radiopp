package main

import (
	"context"
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
	Website     string   `firestore:"website"`
	Thumb       string   `firestore:"thumb"`
	City        string   `firestore:"city"`
	State       string   `firestore:"state"`
	Country     string   `firestore:"country"`
	StreamURL   string   `firestore:"streamURL"`
	OriginalURL string   `firestore:"originalURL"`
	Schedule    Schedule `firestore:"schedule"`
}

// Schedule ...
type Schedule struct {
	Sunday    []DaySchedule `firestore:"sunday"`
	Monday    []DaySchedule `firestore:"monday"`
	Tuesday   []DaySchedule `firestore:"tuesday"`
	Wednesday []DaySchedule `firestore:"wednesday"`
	Thursday  []DaySchedule `firestore:"thursday"`
	Friday    []DaySchedule `firestore:"friday"`
	Saturday  []DaySchedule `firestore:"saturday"`
}

// DaySchedule ...
type DaySchedule struct {
	Time      string `firestore:"time"`
	Name      string `firestore:"name"`
	Presenter string `firestore:"presenter"`
}

func main() {
	os.Setenv("FIRESTORE_EMULATOR_HOST", "localhost:8080")
	saveTo := os.Args[1]

	stateMap := map[string]string{
		"Acre":                "AC",
		"Alagoas":             "AL",
		"Amapá":               "AP",
		"Amazonas":            "AM",
		"Bahia":               "BA",
		"Ceará":               "CE",
		"Espírito Santo":      "ES",
		"Goiás":               "GO",
		"Maranhão":            "MA",
		"Mato Grosso":         "MT",
		"Minas Gerais":        "MG",
		"Pará":                "PA",
		"Paraná":              "PR",
		"Pernambuco":          "PE",
		"Piauí":               "PI",
		"Rio de Janeiro":      "RJ",
		"Rio Grande do Norte": "RN",
		"Rio Grande do Sul":   "RS",
		"Rondônia":            "RO",
		"Roraima":             "RR",
		"Santa Catarina":      "SC",
		"São Paulo":           "SP",
		"Sergipe":             "SE",
		"Tocantins":           "TO",
		"Distrito Federal":    "DF",
	}

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
	radiosRef := client.Collection("radios")

	defer client.Close()

	var filterRegex []*regexp.Regexp
	var initialURL string
	if saveTo == "production" {
		filterRegex = []*regexp.Regexp{
			regexp.MustCompile(`radios\.com.br\/aovivo\/`),
			regexp.MustCompile(`radios\.com\.br\/play\/`),
			regexp.MustCompile(`\/busca\/`)}
		initialURL = "https://www.radios.com.br/busca/?q=brasil&qfilter=completo"
	} else {
		filterRegex = []*regexp.Regexp{
			regexp.MustCompile(`radios\.com.br\/aovivo\/`),
			regexp.MustCompile(`radios\.com\.br\/play\/`),
			regexp.MustCompile(`\/radio\/cidade\/belo-horizonte\/`)}
		initialURL = "https://www.radios.com.br/radio/cidade/belo-horizonte/8594"
	}

	c := colly.NewCollector(
		colly.AllowedDomains("www.radios.com.br"),
		colly.CacheDir("./cache"),
		colly.IgnoreRobotsTxt(),
		colly.DetectCharset(),
		colly.URLFilters(filterRegex...))

	c.OnRequest(setRadioCtx)

	reRadioStreamURL := regexp.MustCompile("'url':'.*'")
	reRadioPlayURL := regexp.MustCompile(`https:\/\/www\.radios\.com\.br\/play\/\d+`)

	c.OnHTML("script", func(e *colly.HTMLElement) {
		streamURL := reRadioStreamURL.FindString(e.Text)

		if streamURL != "" {
			streamURL = streamURL[7 : len(streamURL)-1]
			e.Request.Ctx.Put("streamURL", streamURL)
			return
		}

		playURL := reRadioPlayURL.FindString(e.Text)
		if playURL != "" {
			e.Request.Visit(playURL)
		}
	})

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

			case strings.HasPrefix(info, "Estado:"):
				e.Request.Ctx.Put("state", stateMap[info[8:]])

			case strings.HasPrefix(info, "País"):
				e.Request.Ctx.Put("country", info[7:])

			case strings.HasPrefix(info, "Site:"):
				e.Request.Ctx.Put("website", info[6:])
			}
		})
	})

	// Find and visit all links
	c.OnHTML(".pagination-body a[href], .resultados-items a[href]", func(e *colly.HTMLElement) {
		e.Request.Visit(e.Attr("href"))
	})

	c.OnScraped(func(r *colly.Response) {
		idString := r.Ctx.Get("name")
		url := r.Request.URL.EscapedPath()

		id, err := strconv.Atoi(idString)
		if err != nil {
			log.Printf("Invalid id: %s", idString)
			return
		}

		radioDocRef := radiosRef.Doc(idString)

		reIsPlayPage := regexp.MustCompile(`play\/d+$`)
		if reIsPlayPage.MatchString(url) {
			update := []firestore.Update{{Path: "streamURL", Value: r.Ctx.Get("streamURL")}}

			_, err = radioDocRef.Update(ctx, update)
			if err != nil {
				log.Printf("Error when updating the radio with id %d: %s", id, err)
				return
			}
		}

		reIsRadioPage := regexp.MustCompile(`\/aovivo/\`)
		if reIsRadioPage.MatchString(url) {
			radio := Radio{
				ID:          id,
				Name:        r.Ctx.Get("name"),
				Website:     r.Ctx.Get("website"),
				Thumb:       r.Ctx.Get("thumb"),
				City:        r.Ctx.Get("city"),
				State:       r.Ctx.Get("state"),
				Country:     r.Ctx.Get("country"),
				StreamURL:   r.Ctx.Get("streamURL"),
				OriginalURL: r.Ctx.Get("originalURL"),
			}

			_, err = radioDocRef.Set(ctx, radio)
			if err != nil {
				log.Printf("Error when saving the radio with id %d: %s", id, err)
			}
		}

	})

	c.Visit(initialURL)
}

func setRadioCtx(r *colly.Request) {
	url := r.URL.EscapedPath()

	reRadioID := regexp.MustCompile(`\d+$`)
	radioID := reRadioID.FindString(url)

	r.Ctx.Put("id", radioID)
	r.Ctx.Put("name", "")
	r.Ctx.Put("originalURL", r.URL.EscapedPath())
	r.Ctx.Put("website", "")
	r.Ctx.Put("thumb", "")
	r.Ctx.Put("city", "")
	r.Ctx.Put("state", "")
	r.Ctx.Put("country", "")
	r.Ctx.Put("streamURL", "")
}
