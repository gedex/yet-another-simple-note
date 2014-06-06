define(function(require, exports, module){
	"use strict";

	var $ = require("jquery");

	var NotesCollection = require("collections/notes");
	var NoteModel = require("models/note");

	var IndexView = require("views/index");
	var SingleView = require("views/view");
	var EditView = require("views/edit");
	var CreateView = require("views/create");

	var viewEmpty = require("text!templates/view_empty.html");

	var Router = Backbone.Router.extend({

		routes: {
			"note/new":      "create",
			"note/:id/edit": "edit",
			"note/:id/view": "view",
			"notes/index":   "index",
			"notes/tag/:id": "indexByTag",
			"":              "index",
			"*path":         "index"
		},

		initialize: function() {
			this.collection = new NotesCollection();
		},

		// Listing all notes and used as default route.
		index: function() {
			var indexView = new IndexView({
				collection: this.collection
			});
			$('#main').html(indexView.render().el);
		},

		// Listing all notes tagged with specified tag ID.
		indexByTag: function(tagId) {
			var indexView = new IndexView({
				collection: this.collection,
				tagId: tagId
			});
			$('#main').html(indexView.render().el);
		},

		// Creates a new note.
		create: function() {
			this._singleModel(null, CreateView);
		},

		// Edit a note specified by note id.
		edit: function(id) {
			this._singleModel(id, EditView);
		},

		// View a note specified by note id.
		view: function(id) {
			this._singleModel(id, SingleView);
		},

		// Render a single note. Used when creating, updating and viewing a note.
		_singleModel: function(id, viewClass) {
			this.currentView = viewClass;
			this.currentModelId = id;

			if (_.isNull(id)) {
				this.currentModel = new NoteModel();
			} else {
				this.currentModel = this.collection.get(id);
			}

			if (_.isEmpty(this.collection.models) || _.isUndefined(this.currentModel)) {
				this.collection.fetch({reset: true});
				this.collection.once("reset", this._onceResetOnSingle, this );
			} else {
				this._renderSingleModel();
			}
		},

		// Callback when notes collection is reseted. This sets the model and render
		// it.
		_onceResetOnSingle: function() {
			if (!_.isNull(this.currentModelId)) {
				this.currentModel = this.collection.get(this.currentModelId);
			}
			this._renderSingleModel();
		},

		// Renders a single note.
		_renderSingleModel: function() {
			var tpl;

			if (_.isUndefined(this.currentModel)) {
				tpl = viewEmpty;
			} else {
				var view = new this["currentView"]({
					model: this.currentModel,
					collection: this.collection,
					router: this
				});

				tpl = view.render().el;
			}

			$("#main").html(tpl);
		}

	});

	module.exports = Router;
});
