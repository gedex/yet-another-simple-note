define(function(require, exports, module) {
	"use strict";

	var NoteModel = require("models/note");

	var NotesCollection = Backbone.Collection.extend({
		model: NoteModel,
		baseUrl: '/api/v1',

		initialize: function() {
			this.setDefaultUrl();
		},

		setDefaultUrl: function() {
			this.url = this.baseUrl + '/notes';
		},

		getDefaultUrl: function() {
			return this.baseUrl + '/notes';
		},

		// Must be called before fetch
		filterByTag: function(tagId) {
			this.url = this.baseUrl + '/notes/tag/' + tagId;
		},

		removeFilter: function() {
			this.setDefaultUrl();
		}

	});

	module.exports = NotesCollection;
});
