define(function(require, exports, module){
	"use strict";

	var _ = require("underscore");
	var Backbone = require("backbone");

	var viewTemplate = require("text!templates/view.html");
	var viewEmptyTemplate = require("text!templates/view_empty.html");

	var SingleView = Backbone.View.extend({
		className: "view",
		tpl: _.template(viewTemplate),

		render: function() {
			if (_.isUndefined(this.model)) {
				this.$el.html(viewEmptyTemplate);
			} else {
				this._normalizeTags();
				this.$el.html(this.tpl(this.model.toJSON()));
			}
			return this;
		},

		_normalizeTags: function() {
			var tags = this.model.get("tags");

			if (!_.isUndefined(tags) && !_.isUndefined(tags.toJSON)) {
				this.model.set("tags", tags.toJSON());
			}
		}
	});

	module.exports = SingleView;
});
