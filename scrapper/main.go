package main

import (
	"fmt"
	"regexp"
	"strings"

	"github.com/gocolly/colly"
)

// Radio ...
type Radio struct {
	name        string
	thumb       string
	city        string
	state       string
	country     string
	site        string
	originalURL string
	streamURL   []string
	genres      []string
}

// Context ...
type Context struct {
	radio Radio
}

func main() {
	c := colly.NewCollector(
		colly.AllowedDomains("www.radios.com.br"),
		colly.CacheDir("./cache"),
		colly.IgnoreRobotsTxt(),
		colly.URLFilters(regexp.MustCompile(".*aovivo.*"), regexp.MustCompile(".*belo-horizonte.*")))

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
		e.Request.Ctx.Put("name", name)
	})

	c.OnHTML(".conteudo .info-radio", func(e *colly.HTMLElement) {
		e.ForEach("p", func(i int, e *colly.HTMLElement) {
			info := e.Text

			switch true {
			case strings.HasPrefix(info, "Cidade:"):
				e.Request.Ctx.Put("city", info)

			case strings.HasPrefix(info, "Estado:"):
				e.Request.Ctx.Put("state", info)

			case strings.HasPrefix(info, "Pa"):
				e.Request.Ctx.Put("country", info)

			case strings.HasPrefix(info, "Site:"):
				e.Request.Ctx.Put("site", info)
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
		fmt.Println(r.Ctx.Get("name"))
		fmt.Println(r.Ctx.Get("streamURL"))
	})

	c.Visit("https://www.radios.com.br/radio/cidade/belo-horizonte/8594")
}
