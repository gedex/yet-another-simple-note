define(function(require, exports, module){

	var _ = require("underscore");
	var FormView = require("views/form");
	var formTemplate = require("text!templates/form.html");
	var util = require("views/util");

	var EditView = FormView.extend({
		className: "edit",
		tpl: _.template(formTemplate),

		events: {
			"click button.save": "save",
			"click a.delete": "remove"
		},

		save: function(e) {
			e.stopPropagation();
			e.preventDefault();

			this.model.set({
				title: this.$el.find("input[name=title]").val(),
				content: this.$el.find("textarea[name=content]").val(),
				tags: util.tags.compose(this.$el.find("input[name=newtag]").val())
			});

			if (this.model.isValid()) {
				this.model.save();
				this.router.navigate("notes/index", {trigger: true});
			}
		},

		remove: function(e) {
			e.stopPropagation();
			e.preventDefault();

			this.model.destroy({wait: true});
			this.model.once("remove", function(){
				this.$el.remove();
				this.router.navigate("notes/index", {trigger: true});
			}, this);
		}
	});

	module.exports = EditView;
});
