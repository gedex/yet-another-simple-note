define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var TagModel = Backbone.Model.extend({
		defaults: {
			name: "",
		},

		validate: function(attrs) {
			var errors = {};
			if (!attrs.name) errors.name = "Name can not be empty";

			if (!_.isEmpty(errors)) {
				return errors;
			}
		}
	});

	module.exports = TagModel;
});
