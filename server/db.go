package main

import (
	"sync"
)

// Note represents a Note.
type Note struct {
	Id          int    `json:"id"`
	Title       string `json:"title"`
	Author      string `json:"author"`
	Description string `json:"description"`
}

// Collection defines operations available Notes collection.
type Collection interface {
	Get(id int) *Note
	GetAll() []*Note
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

// Acts as DB instance.
var collection *NotesCollection

func init() {
	collection = &NotesCollection{
		m: make(map[int]*Note),
	}

	// Fills the collections.
	collection.Add(&Note{1, "Example Note #1", "Akeda", "This is awesome note #1"})
	collection.Add(&Note{2, "Example Note #2", "Dwi", "This is awesome note #2"})
	collection.Add(&Note{3, "Example Note #3", "Myesha", "This is awesome note #3"})
}

// GetAll returns Notes collection.
func (nc *NotesCollection) GetAll() []*Note {
	nc.RLock()
	defer nc.RUnlock()

	if len(nc.m) == 0 {
		return nil
	}

	ret := make([]*Note, len(nc.m))
	i := 0
	for _, v := range nc.m {
		ret[i] = v
		i++
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

	nc.m[note.Id] = note

	return note, nil
}

// Delete destroys note specified by the id.
func (nc *NotesCollection) Delete(id int) *NoteError {
	nc.Lock()
	defer nc.Unlock()

	if _, ok := nc.m[id]; !ok {
		err := NewNoteError(BadRequest)
		err.Add(ErrorNoteDoesNotExists)

		return err
	} else {
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

	if note.Author == "" {
		err.Add(ErrorEmptyAuthor)
	}

	if note.Description == "" {
		err.Add(ErrorEmptyDescription)
	}

	if !err.HasError() {
		return nil
	} else {
		return err
	}
}
