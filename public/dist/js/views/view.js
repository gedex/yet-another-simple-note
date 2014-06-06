define(function(require, exports, module){
	"use strict";

	var _ = require("underscore");
	var viewTemplate = require("text!templates/view.html");
	var SingleView = Backbone.View.extend({
		className: "view",
		tpl: _.template(viewTemplate),

		render: function() {
			this.$el.html(this.tpl(this.model.toJSON()));
			return this;
		}
	});

	module.exports = SingleView;
});
