define(function(require, exports, module) {
	"use strict";

	var indexTemplate = require("text!templates/index.html");
	var RowView = require("views/row");

	var IndexView = Backbone.View.extend({
		className: "index",

		initialize: function() {
			this.collection.bind("reset sync request", this.render);
		},

		render: function() {
			this.$el.html( indexTemplate );
			_.each(this.collection.models, $.proxy(this, 'renderRow'));
			return this;
		},

		renderRow: function(model) {
			var row = new RowView({
				collection: this.collection,
				model: model
			});
			this.$el.find("tbody").append(row.render().el);
		}
	});

	module.exports = IndexView;
});
