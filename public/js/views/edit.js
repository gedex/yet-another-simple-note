define(function(require, exports, module){

	var _ = require("underscore");
	var formTemplate = require("text!templates/form.html");

	var EditView = Backbone.View.extend({
		tpl: _.template(formTemplate),

		events: {
			"click button.save": "save"
		},

		render: function() {
			this.$el.html(this.tpl(this.model.toJSON()));
			return this;
		},

		save: function(e) {
			e.stopPropagation();
			e.preventDefault();

			this.model.set({
				title: this.$el.find("input[name=title]").val(),
				author: this.$el.find("input[name=author]").val(),
				description: this.$el.find("textarea[name=description]").val()
			});
			window.location.hash = "notes/index";
		}
	});

	module.exports = EditView;
});
