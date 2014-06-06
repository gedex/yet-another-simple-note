define(function(require, exports, module) {

	var _ = require("underscore");
	var FormView = require("views/form");
	var formTemplate = require("text!templates/form.html");
	var util = require("views/util");

	var CreateView = FormView.extend({
		className: "new",
		tpl: _.template(formTemplate),

		events: {
			"click button.save": "add"
		},

		add: function(e) {
			e.stopPropagation();
			e.preventDefault();

			this.model.set({
				id: null,
				title: this.$el.find("input[name=title]").val(),
				content: this.$el.find("textarea[name=content]").val(),
				tags: util.tags.compose(this.$el.find("input[name=newtag]").val())
			});

			if (this.model.isValid()) {
				this.collection.create(this.model.toJSON(), {wait: true});

				this.router.navigate("notes/index", {trigger: true});
			}
		}

	});

	module.exports = CreateView;
});
