define(function(require, exports, module) {
	"use strict";

	var indexTemplate = require("text!templates/index.html");
	var searchForm = require("text!templates/search-form.html");
	var RowView = require("views/row");
	var emptyRowTemplate = require("text!templates/row_empty.html");
	var filterTemplate = require("text!templates/filter.html");

	var IndexView = Backbone.View.extend({
		className: "index",
		tagId: null,
		searchKeyword: "",
		events: {
			"keyup #search": "search",
			"keydown #search": "search",
			"click .back-to-index": "resetFilter"
		},

		initialize: function(options) {
			this.tags = options.tags;

			if (!_.isEmpty(options.tagId)) {
				this.tagId = options.tagId;
				this.collection.filterByTag(this.tagId);
			} else {
				this._removeTagFilter();
			}

			this.tags.fetch({reset: true});
			this.collection.fetch({reset: true});

			this.listenTo(this.collection, "sync", this.render);
			this.listenTo(this.collection, "remove", this.render);
			this.listenTo(this.collection, "search", this.renderSearchResults);
		},

		search: function() {
			this.searchKeyword = $("#search").val();
			this.searchResults = this.collection.search(this.searchKeyword);
		},

		resetFilter: function(e) {
			e.stopPropagation();
			e.preventDefault();

			$("#search").val("");
			this.searchKeyword = "";

			this._removeTagFilter();

			this.collection.fetch({reset: true});
		},

		render: function() {
			this._renderLayout();
			this._renderSetProperties();
			this._renderSearchForm();
			this._renderFilterInfo();
			this._renderTable();

			return this;
		},

		renderSearchResults: function() {
			this._renderSetProperties();
			this._renderFilterInfo();

			this._removeTable();
			this._renderTable(this.searchResults);
		},

		_renderLayout: function() {
			this.$el.html( indexTemplate );
		},

		_renderSetProperties: function() {
			// Sets propeties for subsequence sections.
			this.topSection = this.$el.find(".well");
			this.searchContainer = this.topSection.find("#search-container");
			this.filterContainer = this.topSection.find("#filter-container");
			this.filterTemplate = _.template(filterTemplate);
			this.filterContent = "";
			this.topSectionVars = {
				"tag"    : null,
				"keyword": this.searchKeyword
			};
		},

		_renderSearchForm: function() {
			this.searchContainer.html(_.template(searchForm)(this.topSectionVars));
		},

		_renderFilterInfo: function() {
			if (!_.isNull(this.tagId)) {
				var _tagId = parseInt(this.tagId, 10);
				var _tag = this.tags.findWhere({id: _tagId});

				if (!_.isUndefined(_tag) && !_.isUndefined(_tag.toJSON)) {
					this.topSectionVars.tag = _tag.toJSON();
				}
			}

			this.filterContent = this.filterTemplate(this.topSectionVars);
			this.filterContainer.html(this.filterContent);
		},

		_renderTable: function(collection) {
			if (_.isUndefined(collection)) {
				collection = this.collection.models;
			}

			if (_.isEmpty(collection)) {
				$(this.el).find("tbody").html(emptyRowTemplate);
			} else {
				_.each(collection, $.proxy(this, '_renderRow'));
			}
		},

		_removeTable: function() {
			if (!_.isEmpty(this.collection.models)) {
				$(this.el).find("tbody tr").remove();
			}
		},

		_renderRow: function(model) {
			var tags = model.get("tags");

			if (!_.isUndefined(tags) && !_.isUndefined(tags.toJSON)) {
				model.set("tags", tags.toJSON());
			} else {
				model.set("tags", tags);
			}

			var row = new RowView({
				model: model
			});
			$(this.el).find("tbody").append(row.render().el);
		},

		_removeTagFilter: function() {
			this.collection.removeFilter();
			this.tagId = null;
		}
	});

	module.exports = IndexView;
});
