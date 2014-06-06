package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
)

const (
	version = "v1"
)

var m *martini.Martini

func init() {
	m = martini.New()

	// Setup middleware.
	m.Use(martini.Logger())
	m.Use(render.Renderer())

	if os.Getenv("SIMPLE_NOTE_DEV") == "1" {
		m.Use(martini.Static("./public"))
	} else {
		m.Use(martini.Static("./public/dist"))
	}

	// Routes.
	r := martini.NewRouter()
	r.Get(endpoint("notes"), GetNotesCollection)
	r.Get(endpoint("notes/tag/:id"), GetNotesCollectionByTagId)
	r.Get(endpoint("notes/:id"), GetNote)
	r.Post(endpoint("notes"), AddNote)
	r.Put(endpoint("notes/:id"), UpdateNote)
	r.Delete(endpoint("notes/:id"), DeleteNote)
	r.Get(endpoint("tags"), GetTags)

	// Inject collection.
	m.MapTo(collection, (*Collection)(nil))

	// Adds the router action.
	m.Action(r.Handle)
}

func main() {
	log.Println("Running server on 0.0.0.0:8000")
	panic(http.ListenAndServe(":8000", m))
}

func endpoint(ep string) string {
	return fmt.Sprintf("/api/%s/%s", version, ep)
}
