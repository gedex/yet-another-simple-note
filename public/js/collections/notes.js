define(function(require, exports, module) {
	"use strict";

	var NoteModel = require("models/note");

	var NotesCollection = Backbone.Collection.extend({
		model: NoteModel,
		url: '/api/v1/books'
	});

	module.exports = NotesCollection;
});
