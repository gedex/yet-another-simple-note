package main

import (
	"log"
	"time"
)

func resetDB() {
	log.Println("DB reset...")

	resetNotes()
	resetTags()
	resetNotesByTags()

	tag1, tag2, tag3 := createSampleTags()
	createSampleNotes(tag1, tag2, tag3)
}

func resetNotes() {
	collection.Lock()
	defer collection.Unlock()

	collection.m = make(map[int]*Note)
	collection.lastId = 0
}

func resetTags() {
	tags.Lock()
	defer tags.Unlock()

	tags.m = make(map[int]*Tag)
	tags.byName = make(map[string]*Tag)
	tags.lastId = 0
}

func resetNotesByTags() {
	notesByTag.Lock()
	defer notesByTag.Unlock()

	notesByTag.m = make(map[int]notesMapById)
}

func createSampleTags() (tag1, tag2, tag3 *Tag) {
	tag1 = tags.NewTag("awesome")
	tag2 = tags.NewTag("note")
	tag3 = tags.NewTag("example")
	return
}

func createSampleNotes(tag1, tag2, tag3 *Tag) {
	// Fills the collections.
	collection.Add(&Note{
		Id:    1,
		Title: "Example Note #1 With Long Long Title",
		Content: `This is awesome note #1.
========================

Lets try with *Markdown*.`,
		Tags: []*Tag{tag1, tag2, tag3},
	})
	collection.Add(&Note{
		Id:      2,
		Title:   "Example Note #2",
		Content: "This is awesome note #2",
		Tags:    []*Tag{tag1, tag2},
	})
	collection.Add(&Note{
		Id:      3,
		Title:   "Example Note #3",
		Content: "This is awesome note #3",
		Tags:    []*Tag{tag1},
	})
}

func resetDBEach(dur time.Duration) {
	time.AfterFunc(dur, func() {
		resetDB()
		resetDBEach(dur)
	})
}
