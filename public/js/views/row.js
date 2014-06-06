define(function(require, exports, module){
	"use strict";

	var _ = require("underscore");
	var rowTemplate = require("text!templates/row.html");
	var RowView = Backbone.View.extend({
		tagName: "tr",
		className: "row-note",

		tpl: _.template( rowTemplate ),

		events: {
			"click a.delete": "remove"
		},

		render: function() {
			this.$el.html(this.tpl(this.model.toJSON()));
			return this;
		},

		remove: function(e) {
			e.stopPropagation();
			e.preventDefault();

			this.model.destroy({wait: true});
			this.$el.remove();
		}
	});

	module.exports = RowView;
});
