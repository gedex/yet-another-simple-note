package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/GeertJohan/go.rice"
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
	m.Use(staticHandler())

	// Routes.
	r := martini.NewRouter()
	r.Get(endpoint("notes"), GetNotesCollection)
	r.Get(endpoint("notes/:id"), GetNote)
	r.Post(endpoint("notes"), AddNote)
	r.Put(endpoint("notes/:id"), UpdateNote)
	r.Delete(endpoint("notes/:id"), DeleteNote)

	// Inject collection.
	m.MapTo(collection, (*Collection)(nil))

	// Adds the router action.
	m.Action(r.Handle)
}

func main() {
	panic(http.ListenAndServe(":8000", m))
}

func endpoint(ep string) string {
	return fmt.Sprintf("/api/%s/%s", version, ep)
}

func staticHandler() http.HandleFunc {
	box := rice.MustFindBox("../public")
	static := http.FileServer(box.HTTPBox())
	return func(rw http.ResponseWriter, req *http.Request) {
		if req.URL.Path == "/" || strings.HasPrefix(req.URL.Path, "/css/") || strings.HasPrefix(req.URL.Path, "/js/") {
			static.ServeHTTP(rw, req)
		}
	}
}
