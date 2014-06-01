package main

import (
	"errors"
	"net/http"
)

type ErrorType int

const (
	ValidationFailed ErrorType = 1 + iota
	BadRequest
)

var (
	ErrorNoteDoesNotExists = errors.New("Note does not exists")
	ErrorEmptyTitle        = errors.New("Title can not be empty")
	ErrorEmptyAuthor       = errors.New("Author can not be empty")
	ErrorEmptyDescription  = errors.New("Description can not be empty")
)

// map ErrorType to HTTP Status.
var errTypeHTTPStatus = map[ErrorType]int{
	ValidationFailed: http.StatusNotAcceptable,
	BadRequest:       http.StatusBadRequest,
}

// NoteError represents error(s) in Note during adding/updating.
type NoteError struct {
	errors  []error
	errType ErrorType
}

// NewNoteError creates new instance of NoteError.
func NewNoteError(t ErrorType) *NoteError {
	return &NoteError{
		errors:  []error{},
		errType: t,
	}
}

// Append new error.
func (ne *NoteError) Add(err ...error) {
	for _, v := range err {
		ne.errors = append(ne.errors, v)
	}
}

// Clear all errors.
func (ne *NoteError) Clear() {
	ne.errors = []error{}
}

// HasError checks if it has errors.
func (ne *NoteError) HasError() bool {
	return len(ne.errors) > 0
}

func (ne *NoteError) Errors() []string {
	ret := []string{}
	for _, e := range ne.errors {
		ret = append(ret, e.Error())
	}
	return ret
}
