define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");
	var NestedModel = require("models/nested");
	var TagsCollection = require("collections/tags");

	var NoteModel = NestedModel.extend({
		defaults: {
			title: "",
			content: "",
		},

		relCollection: {
			tags: TagsCollection
		},

		initialize: function() {
			// To prevents wrong URL construction during filter.
			if (!_.isUndefined(this.collection) && !_.isUndefined(this.collection.getDefaultUrl)) {
				this.urlRoot = this.collection.getDefaultUrl();
			}
		},

		validate: function(attrs) {
			var errors = {};
			if (!attrs.title) errors.title = "Title can not be empty";
			if (!attrs.content) errors.content = "Content can not be empty";

			if (!_.isEmpty(errors)) {
				return errors;
			}
		}
	});

	module.exports = NoteModel;
});
