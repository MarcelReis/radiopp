package main

import (
	"fmt"
	"regexp"

	"github.com/gocolly/colly"
)

func main() {
	c := colly.NewCollector(
		colly.AllowedDomains("www.radios.com.br"),
		colly.CacheDir("./cache"),
		colly.IgnoreRobotsTxt(),
		colly.URLFilters(regexp.MustCompile(".*aovivo.*"), regexp.MustCompile(".*belo-horizonte.*")))

	re := regexp.MustCompile("'url':'.*'")

	c.OnHTML("script", func(e *colly.HTMLElement) {
		match := re.FindString(e.Text)

		if match != "" {
			fmt.Println("Found", match)
		}
	})

	c.OnHTML("h1", func(e *colly.HTMLElement) {
		fmt.Println("Title", e.Text)
	})

	c.OnHTML("h2", func(e *colly.HTMLElement) {
		fmt.Println("SubTitle", e.Text)
	})

	// Find and visit all links
	c.OnHTML("a[href]", func(e *colly.HTMLElement) {
		e.Request.Visit(e.Attr("href"))
	})

	c.OnRequest(func(r *colly.Request) {
	})

	c.Visit("https://www.radios.com.br/radio/cidade/belo-horizonte/8594")
}
