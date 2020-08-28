package main

import (
	"context"
	"log"
	"os"
	"regexp"
	"strings"

	firebase "firebase.google.com/go"
	"github.com/gocolly/colly"
	"google.golang.org/api/option"
)

func main() {
	os.Setenv("FIRESTORE_EMULATOR_HOST", "localhost:8080")

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

	c := colly.NewCollector(
		colly.AllowedDomains("www.radios.com.br"),
		colly.CacheDir("./cache"),
		colly.IgnoreRobotsTxt(),
		colly.URLFilters(regexp.MustCompile(".*aovivo.*"), regexp.MustCompile(".*belo-horizonte.*")))

	c.OnRequest(func(r *colly.Request) {
		r.Ctx.Put("name", "")
		r.Ctx.Put("website", "")
		r.Ctx.Put("thumb", "")
		r.Ctx.Put("city", "")
		r.Ctx.Put("state", "")
		r.Ctx.Put("streamURL", "")
	})

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
		e.Request.Ctx.Put("name", strings.ToValidUTF8(name, ""))
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
				e.Request.Ctx.Put("state", info[8:])

			case strings.HasPrefix(info, "Pa"):
				e.Request.Ctx.Put("country", info[6:])

			case strings.HasPrefix(info, "Site:"):
				e.Request.Ctx.Put("website", info[6:])
			}
		})
	})

	// Find and visit all links
	c.OnHTML(".pagination-body a[href], .resultados-items a[href]", func(e *colly.HTMLElement) {
		url := e.Request.URL.EscapedPath()
		if strings.Contains(url, "belo-horizonte") {
			e.Request.Visit(e.Attr("href"))
		}
	})

	c.OnScraped(func(r *colly.Response) {
		url := r.Request.URL.EscapedPath()
		reRadioID := regexp.MustCompile("\\d+$")
		radioID := reRadioID.FindString(url)

		if radioID == "" {
			return
		}

		_, err := client.Collection("radios").Doc(radioID).Set(ctx, map[string]interface{}{
			"name":        r.Ctx.Get("name"),
			"website":     r.Ctx.Get("website"),
			"thumb":       r.Ctx.Get("thumb"),
			"city":        r.Ctx.Get("city"),
			"state":       r.Ctx.Get("state"),
			"streamURL":   r.Ctx.Get("streamURL"),
			"originalURL": url,
		})
		if err != nil {
			// Handle any errors in an appropriate way, such as returning them.
			log.Printf("An error has occurred: %s", err)
		}
	})

	c.Visit("https://www.radios.com.br/radio/cidade/belo-horizonte/8594")
}
