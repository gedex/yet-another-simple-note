define(function(require, exports, module){

	var _ = require("underscore");
	var FormView = require("views/form");
	var formTemplate = require("text!templates/form.html");

	var EditView = FormView.extend({
		className: "edit",
		tpl: _.template(formTemplate),

		events: {
			"click button.save": "save"
		},

		initialize: function() {
			this.model.bind("invalid", this.showErrors, this);
		},

		save: function(e) {
			e.stopPropagation();
			e.preventDefault();

			this.model.set({
				title: this.$el.find("input[name=title]").val(),
				content: this.$el.find("textarea[name=content]").val()
			});

			if (this.model.isValid()) {
				this.model.save();
				window.location.hash = "notes/index";
			}
		}
	});

	module.exports = EditView;
});
