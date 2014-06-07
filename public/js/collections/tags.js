define(function(require, exports, module) {
	"use strict";

	var TagModel = require("models/tag");

	var TagsCollection = Backbone.Collection.extend({
		model: TagModel,
		url: '/api/v1/tags',
	});

	module.exports = TagsCollection;
});
