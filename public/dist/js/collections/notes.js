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

		search: function(keyword) {
			var pattern = new RegExp(keyword, "gi");
			var results = this.filter(function(model){
				if (pattern.test(model.get("title"))) return true;
				if (pattern.test(model.get("content"))) return true;

				return false;
			});

			this.trigger("search");

			return results;
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
