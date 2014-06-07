package main

import (
	"sync"
	"time"

	"github.com/russross/blackfriday"
)

// Note represents a Note.
type Note struct {
	Id          int    `json:"id"`
	Title       string `json:"title"`
	Content     string `json:"content"`
	ContentHTML string `json:"content_html"`
	Tags        []*Tag `json:"tags"`
}

// Tag represents a tag.
type Tag struct {
	Id   int    `json:"id"`
	Name string `json:"name"`
}

// Collection defines operations available Notes collection.
type Collection interface {
	Get(id int) *Note
	GetAll(params *NotesFetcherParams) []*Note
	Add(note *Note) (*Note, *NoteError)
	Update(note *Note) (*Note, *NoteError)
	Delete(id int) *NoteError
	Validate(note *Note) *NoteError
}

// NotesCollection represents thread-safe in-memory map of notes collection.
type NotesCollection struct {
	sync.RWMutex
	m      map[int]*Note
	lastId int
}

// NotesFetcherParams represents parameter to fetch notes collection. For example
// it can be used to filter notes collection by tag.
type NotesFetcherParams struct {
	Tag   *Tag
	Limit int
}

// TagsCollection represents thread-safe in-memory map of tags collection.
type TagsCollection struct {
	sync.RWMutex
	m      map[int]*Tag
	byName map[string]*Tag
	lastId int
}

// notesMapById represents notes collection keyed by note ID.
type notesMapById map[int]*Note

// notesByTags maps notes by tag ID.
type NotesByTagsCollection struct {
	sync.RWMutex
	m map[int]notesMapById
}

// Acts as DB instance.
var collection *NotesCollection
var tags *TagsCollection
var notesByTag *NotesByTagsCollection

// Markdown renderer.
var markdownRenderer blackfriday.Renderer
var markdownRendererExtensions int

func init() {
	initMarkdownRenderer()
	initDB()
	resetDB()
	resetDBEach(time.Hour)
}

func initDB() {
	collection = &NotesCollection{}
	tags = &TagsCollection{}
	notesByTag = &NotesByTagsCollection{}
}

func initMarkdownRenderer() {
	flags := 0
	flags |= blackfriday.HTML_SKIP_HTML
	flags |= blackfriday.HTML_SKIP_STYLE
	flags |= blackfriday.HTML_SKIP_SCRIPT
	flags |= blackfriday.HTML_SAFELINK

	markdownRenderer = blackfriday.HtmlRenderer(flags, "", "")

	markdownRendererExtensions |= blackfriday.EXTENSION_NO_INTRA_EMPHASIS
	markdownRendererExtensions |= blackfriday.EXTENSION_FENCED_CODE
	markdownRendererExtensions |= blackfriday.EXTENSION_AUTOLINK
	markdownRendererExtensions |= blackfriday.EXTENSION_STRIKETHROUGH
	markdownRendererExtensions |= blackfriday.EXTENSION_SPACE_HEADERS
	markdownRendererExtensions |= blackfriday.HTML_SKIP_SCRIPT
}

// GetAll returns Notes collection.
func (nc *NotesCollection) GetAll(params *NotesFetcherParams) []*Note {
	nc.RLock()
	defer nc.RUnlock()

	if len(nc.m) == 0 {
		return nil
	}

	ret := []*Note{}
	for _, v := range nc.m {
		if params == nil {
			ret = append(ret, v)
			continue
		}

		// Tag doesn't exists.
		if params.Tag != nil && !tags.IsTagIdExists(params.Tag.Id) {
			continue
		}

		// Note doesn't tagged with specified tag.
		if params.Tag != nil && !notesByTag.IsNoteTaggedWith(v.Id, params.Tag.Id) {
			continue
		}

		ret = append(ret, v)
	}

	return ret
}

// Get returns a single Note identified by the id, or nil if doesn't exists.
func (nc *NotesCollection) Get(id int) *Note {
	nc.RLock()
	defer nc.RUnlock()

	return nc.m[id]
}

// Add creates new Note.
func (nc *NotesCollection) Add(note *Note) (*Note, *NoteError) {
	nc.Lock()
	defer nc.Unlock()

	if err := nc.Validate(note); err != nil {
		return nil, err
	}

	nc.lastId++
	note.Id = nc.lastId

	note.InsertHTMLContent()

	notesByTag.MapNoteByTag(note)
	nc.m[note.Id] = note

	return note, nil
}

// Update changes the Note identified by the id. Returns an error if the updated
// Note is a duplicate.
func (nc *NotesCollection) Update(note *Note) (*Note, *NoteError) {
	nc.Lock()
	defer nc.Unlock()

	if _, ok := nc.m[note.Id]; !ok {
		err := NewNoteError(BadRequest)
		err.Add(ErrorNoteDoesNotExists)

		return nil, err
	}

	if err := nc.Validate(note); err != nil {
		return nil, err
	}

	// Remove previous mapped note .
	if v, ok := nc.m[note.Id]; ok {
		notesByTag.RemoveMappedNote(v)
	}

	note.InsertHTMLContent()
	notesByTag.MapNoteByTag(note)
	nc.m[note.Id] = note

	return note, nil
}

// Delete destroys note specified by the id.
func (nc *NotesCollection) Delete(id int) *NoteError {
	nc.Lock()
	defer nc.Unlock()

	if note, ok := nc.m[id]; !ok {
		err := NewNoteError(BadRequest)
		err.Add(ErrorNoteDoesNotExists)

		return err
	} else {
		notesByTag.RemoveMappedNote(note)
		delete(nc.m, id)

		return nil
	}
}

// Validate does validation on given note.
func (nc *NotesCollection) Validate(note *Note) *NoteError {
	err := NewNoteError(ValidationFailed)

	if note.Title == "" {
		err.Add(ErrorEmptyTitle)
	}

	if note.Content == "" {
		err.Add(ErrorEmptyContent)
	}

	if !err.HasError() {
		return nil
	} else {
		return err
	}
}

// InsertHTMLContent will inserts processed Markdown (from content) into content_html.
func (n *Note) InsertHTMLContent() {
	md := blackfriday.Markdown([]byte(n.Content), markdownRenderer, markdownRendererExtensions)
	n.ContentHTML = string(md)
}

// MapNoteByTag will maps note to NotesByTagsCollection so that all notes tagged
// by particular tag can be retrieved by specifying tag.Id.
func (n *NotesByTagsCollection) MapNoteByTag(note *Note) {
	n.RemoveMappedNote(note)

	n.Lock()
	defer n.Unlock()

	for i, tag := range note.Tags {
		tagName := tag.Name
		tag = tags.GetTagByName(tagName)

		if tag == nil {
			tag = tags.NewTag(tagName)
		}

		if _, ok := n.m[tag.Id]; !ok {
			n.m[tag.Id] = make(notesMapById)
		}

		n.m[tag.Id][note.Id] = note

		// Update the note too as there's tag creation via `tags.NewTag`.
		note.Tags[i] = tag
	}
}

// RemoveMappedNote will removes note from NotesByTagsCollection.
func (n *NotesByTagsCollection) RemoveMappedNote(note *Note) {
	n.Lock()
	defer n.Unlock()

	for _, tag := range note.Tags {
		tag = tags.GetTagByName(tag.Name)
		if tag == nil {
			continue
		}

		if _, ok := n.m[tag.Id]; !ok {
			continue
		}

		delete(n.m[tag.Id], note.Id)
	}
}

// IsNoteTaggedWith returns true if note, specified by noteId, is tagged with
// a tag specified by tagId. Otherwise false is returned.
func (n *NotesByTagsCollection) IsNoteTaggedWith(noteId, tagId int) bool {
	if _, ok := n.m[tagId]; !ok {
		return false
	}

	if v, ok := n.m[tagId][noteId]; ok && v != nil {
		return true
	} else {
		return false
	}
}

// NewTag creates new tag.
func (tg *TagsCollection) NewTag(name string) *Tag {
	tg.Lock()
	defer tg.Unlock()

	// If tag already exists.
	if v, ok := tg.byName[name]; ok {
		return v
	}

	tg.lastId++

	tag := &Tag{
		Id:   tg.lastId,
		Name: name,
	}
	tg.m[tg.lastId] = tag
	tg.byName[name] = tag

	return tag
}

// GetTagByName returns tag specified by name. Nil is returned if tag doesn't
// exists.
func (tg *TagsCollection) GetTagByName(name string) *Tag {
	tg.RLock()
	defer tg.RUnlock()

	if tag, ok := tg.byName[name]; ok {
		return tag
	} else {
		return nil
	}
}

// GetTagById returns tag specified by id. Nil is returned if tag doesn't exists.
func (tg *TagsCollection) GetTagById(id int) *Tag {
	tg.RLock()
	defer tg.RUnlock()

	if tag, ok := tg.m[id]; ok {
		return tag
	} else {
		return nil
	}
}

// IsTagIdExists return true if tag, specified by id, is exists. Otherwise false
// is returned. This seems redundant with GetTagById existence, but can be useful
// for boolean evaluation.
func (tg *TagsCollection) IsTagIdExists(id int) bool {
	tg.RLock()
	defer tg.RUnlock()

	if _, ok := tg.m[id]; ok {
		return true
	} else {
		return false
	}
}

// GetAllTags returns all tags.
func (tg *TagsCollection) GetAllTags() []*Tag {
	tg.RLock()
	defer tg.RUnlock()

	if len(tg.m) == 0 {
		return nil
	}

	ret := []*Tag{}
	for _, v := range tg.m {
		ret = append(ret, v)
	}

	return ret
}
