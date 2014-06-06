define(function(require, exports, module) {
	"use strict";

	var indexTemplate = require("text!templates/index.html");
	var searchForm = require("text!templates/search-form.html");
	var RowView = require("views/row");

	var IndexView = Backbone.View.extend({
		className: "index",

		initialize: function() {
			this.collection.fetch({reset: true});

			this.listenTo(this.collection, "sync", this.render);
		},

		render: function() {
			this.$el.html( indexTemplate );
			this.$el.find(".well").append(searchForm);
			_.each(this.collection.models, $.proxy(this, 'renderRow'));
			return this;
		},

		renderRow: function(model) {
			var tags = model.get("tags");

			if (!_.isUndefined(tags) && !_.isEmpty(tags)) {
				console.log(model);
				model.set("tags", tags.toJSON());
			}

			var row = new RowView({
				collection: this.collection,
				model: model
			});
			$(this.el).find("tbody").append(row.render().el);
		}
	});

	module.exports = IndexView;
});
