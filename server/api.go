package main

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
)

// GetNotesCollection returns the list of notes.
func GetNotesCollection(c Collection, req *http.Request, r render.Render) {

	fetcher := &NotesFetcherParams{}
	if v := req.URL.Query().Get("tag_id"); v != "" {
		id, _ := strconv.Atoi(v)
		fetcher.Tag = tags.GetTagById(id)
	} else {
		fetcher = nil
	}

	notes := c.GetAll(fetcher)
	if notes == nil {
		r.JSON(http.StatusOK, []interface{}{}) // Returns as '[]'.
	} else {
		r.JSON(http.StatusOK, notes)
	}
}

// GetNotesCollectionByTagId returns the list of notes that's tagged with particular
// tag (specified by tag id).
func GetNotesCollectionByTagId(c Collection, params martini.Params, r render.Render) {

	fetcher := &NotesFetcherParams{}
	if v, ok := params["id"]; ok {
		id, _ := strconv.Atoi(v)
		fetcher.Tag = tags.GetTagById(id)
	}

	if fetcher.Tag == nil {
		r.JSON(http.StatusOK, []interface{}{}) // Returns as '[]'.
		return
	}

	notes := c.GetAll(fetcher)
	if notes == nil {
		r.JSON(http.StatusOK, []interface{}{}) // Returns as '[]'.
	} else {
		r.JSON(http.StatusOK, notes)
	}
}

// GetNote returns the requested note by its id.
func GetNote(c Collection, params martini.Params, r render.Render) {
	id, _ := strconv.Atoi(params["id"])
	note := c.Get(id)

	if note == nil {
		r.JSON(http.StatusNotFound, nil)
	} else {
		r.JSON(http.StatusOK, note)
	}

}

// AddNote creates new Note based on posted data.
func AddNote(req *http.Request, r render.Render, c Collection) {
	note, err := getSubmittedData(req, 0)
	if err != nil {
		r.JSON(http.StatusBadRequest, map[string]interface{}{"message": err.Error()})
		return
	}

	if newNote, errs := c.Add(note); errs != nil {
		r.JSON(errTypeHTTPStatus[errs.errType], map[string]interface{}{"message": "Validation Failed", "errors": errs.Errors()})
	} else {
		r.JSON(http.StatusCreated, newNote)
	}
}

// UpdateNote updates the note.
func UpdateNote(req *http.Request, r render.Render, c Collection, params martini.Params) {
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		r.JSON(http.StatusNotFound, nil)
		return
	}
	if v := c.Get(id); v == nil {
		r.JSON(http.StatusNotFound, nil)
		return
	}

	note, err := getSubmittedData(req, id)
	if err != nil {
		r.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}

	if updatedNote, errs := c.Update(note); errs != nil {
		r.JSON(errTypeHTTPStatus[errs.errType], map[string]interface{}{"message": "Validation Failed", "errors": errs.Errors()})
	} else {
		r.JSON(http.StatusOK, updatedNote)
	}
}

// DeleteNote destroys note from collection.
func DeleteNote(c Collection, params martini.Params, r render.Render) {
	id, err := strconv.Atoi(params["id"])
	if err != nil {
		r.JSON(http.StatusBadRequest, map[string]string{"message": err.Error()})
		return
	}

	if errs := c.Delete(id); errs != nil {
		r.JSON(errTypeHTTPStatus[errs.errType], map[string]interface{}{"message": "Bad Request", "errors": errs.Errors()})
	} else {
		r.JSON(http.StatusNoContent, "")
	}
}

// getSubmittedData returns note submitted through 'POST' or 'PUT'.
func getSubmittedData(r *http.Request, id int) (*Note, error) {
	decoder := json.NewDecoder(r.Body)

	note := &Note{}
	err := decoder.Decode(note)
	if err != nil {
		return nil, err
	}

	if r.Method == "PUT" {
		note.Id = id
	}

	return note, nil
}

// GetTags returns all tags.
func GetTags(r render.Render) {
	if len(tags.m) == 0 {
		r.JSON(http.StatusOK, []interface{}{}) // Returns as '[]'.
	} else {
		r.JSON(http.StatusOK, tags.GetAllTags())
	}
}
