define(function(require, exports, module){
	"use strict";

	var $ = require("jquery");

	var NotesCollection = require("collections/notes");
	var NoteModel = require("models/note");

	var IndexView = require("views/index");
	var SingleView = require("views/view");
	var EditView = require("views/edit");
	var CreateView = require("views/create");

	var Router = Backbone.Router.extend({

		routes: {
			"note/new":      "create",
			"notes/index":   "index",
			"note/:id/edit": "edit",
			"note/:id/view": "view",
			"":              "index"
		},

		initialize: function() {
			this.collection = new NotesCollection();
			this.collection.fetch({reset: true});
		},

		create: function() {
			var createView = new CreateView({
				model: new NoteModel(),
				collection: this.collection
			});
			$("#main").html(createView.render().el);
		},

		index: function() {
			var indexView = new IndexView({
				collection: this.collection
			});
			$('#main').html(indexView.render().el);
		},

		edit: function(id) {
			var editView = new EditView({
				model: this.collection.get(id)
			});
			$("#main").html(editView.render().el);
		},

		view: function(id) {
			var singleView = new SingleView({
				model: this.collection.get(id)
			});
			$("#main").html(singleView.render().el);
		}

	});

	module.exports = Router;
});
