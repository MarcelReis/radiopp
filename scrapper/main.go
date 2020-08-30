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
	id          int
	name        string
	website     string
	thumb       string
	city        string
	state       string
	country     string
	streamURL   string
	originalURL string
	schedule    Schedule
}

// Schedule ...
type Schedule struct {
	sunday    DaySchedule
	monday    DaySchedule
	tuesday   DaySchedule
	wednesday DaySchedule
	thursday  DaySchedule
	friday    DaySchedule
	saturday  DaySchedule
}

// DaySchedule ...
type DaySchedule struct {
	time      string
	name      string
	presenter string
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
			regexp.MustCompile(`radios\.com\\.br\\/play\\/`),
			regexp.MustCompile(`\/radio\/cidade\/belo-horizonte\/`)}
		initialURL = "https://www.radios.com.br/radio/cidade/belo-horizonte/8594"
	}

	c := colly.NewCollector(
		colly.AllowedDomains("www.radios.com.br"),
		colly.CacheDir("./cache"),
		colly.IgnoreRobotsTxt(),
		colly.DetectCharset(),
		colly.URLFilters(filterRegex...))

	c.OnRequest(cleanContext)

	reRadioStreamURL := regexp.MustCompile("'url':'.*'")

	c.OnHTML("script", func(e *colly.HTMLElement) {
		streamURL := reRadioStreamURL.FindString(e.Text)

		if streamURL != "" {
			streamURL = streamURL[7 : len(streamURL)-1]
			e.Request.Ctx.Put("streamURL", streamURL)
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
				e.Request.Ctx.Put("city", strings.ToLower(info[8:]))

			case strings.HasPrefix(info, "Estado:"):
				e.Request.Ctx.Put("state", stateMap[info[8:]])

			case strings.HasPrefix(info, "Pa"):
				e.Request.Ctx.Put("country", info[6:])

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
		url := r.Request.URL.EscapedPath()
		reRadioID := regexp.MustCompile(`\d+$`)
		radioID := reRadioID.FindString(url)

		if radioID == "" {
			return
		}

		id, err := strconv.Atoi(radioID)

		if err != nil {
			log.Printf("Invalid id: %s", radioID)
			return
		}

		radioDocRef := radiosRef.Doc(radioID)

		reIsPlayPage := regexp.MustCompile(`play\/d+$`)
		if reIsPlayPage.MatchString(url) {
			_, err = radioDocRef.Update(ctx, []firestore.Update{{Path: "streamURL", Value: r.Ctx.Get("streamURL")}})
			if err != nil {
				log.Printf("Error when updating the radio with id %d: %s", id, err)
				return
			}
			log.Printf("Updating inner radio of: %d", id)
		}

		_, err = radioDocRef.Set(ctx, Radio{
			id:          id,
			name:        r.Ctx.Get("name"),
			website:     r.Ctx.Get("website"),
			thumb:       r.Ctx.Get("thumb"),
			city:        r.Ctx.Get("city"),
			state:       r.Ctx.Get("state"),
			country:     r.Ctx.Get("country"),
			streamURL:   r.Ctx.Get("streamURL"),
			originalURL: url,
		})
		if err != nil {
			log.Printf("Error when saving the radio with id %d: %s", id, err)
		}
	})

	c.Visit(initialURL)
}

func cleanContext(r *colly.Request) {
	r.Ctx.Put("id", 0)
	r.Ctx.Put("name", "")
	r.Ctx.Put("originalURL", "")
	r.Ctx.Put("website", "")
	r.Ctx.Put("thumb", "")
	r.Ctx.Put("city", "")
	r.Ctx.Put("state", "")
	r.Ctx.Put("country", "")
	r.Ctx.Put("streamURL", "")
}
