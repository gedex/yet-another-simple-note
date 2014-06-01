define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var NoteModel = Backbone.Model.extend({
		defaults: {
			title: "",
			description: "",
			author: ""
		},

		validate: function(attrs) {
			var errors = {};
			if (!attrs.title) errors.title = "Title can not be empty";
			if (!attrs.description) errors.description = "Description can not be empty";
			if (!attrs.author) errors.author = "Author can not be empty";

			if (!_.isEmpty(errors)) {
				return errors;
			}
		}
	});

	module.exports = NoteModel;
});
