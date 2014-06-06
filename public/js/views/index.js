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

		initialize: function(options) {
			if (!_.isEmpty(options.tagId)) {
				this.tagId = options.tagId;
				this.collection.filterByTag(this.tagId);
			} else {
				this.removeFilter();
			}
			this.collection.fetch({reset: true});

			this.listenTo(this.collection, "sync", this.render);
			this.listenTo(this.collection, "remove", this.render);
		},

		render: function() {
			this.$el.html( indexTemplate );
			this.$el.find(".well").append(searchForm);

			if (!_.isNull(this.tagId)) {
				var tagId = parseInt(this.tagId, 10);
				var target = this.$el.find(".well");
				$.get("/api/v1/tags", function(resp) {

					var tag = _.findWhere(resp, {id: tagId});
					if (!_.isUndefined(tag)) {
						var filterInfo = _.template(filterTemplate)({tag: tag});
						target.append(filterInfo);
					}
				});
			}

			if (_.isEmpty(this.collection.models)) {
				$(this.el).find("tbody").html(emptyRowTemplate);
			} else {
				_.each(this.collection.models, $.proxy(this, 'renderRow'));
			}

			return this;
		},

		renderRow: function(model) {
			var tags = model.get("tags");

			if (!_.isUndefined(tags) && !_.isUndefined(tags.toJSON)) {
				model.set("tags", tags.toJSON());
			} else {
				model.set("tags", tags);
			}

			var row = new RowView({
				collection: this.collection,
				model: model
			});
			$(this.el).find("tbody").append(row.render().el);
		},

		removeFilter: function() {
			this.collection.removeFilter();
			this.tagId = null;
		}
	});

	module.exports = IndexView;
});
