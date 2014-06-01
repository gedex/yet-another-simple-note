define(function(require, exports, module) {

	var _ = require("underscore");
	var formTemplate = require("text!templates/form.html");

	var CreateView = Backbone.View.extend({
		tpl: _.template(formTemplate),

		events: {
			"click button.save": "add"
		},

		initialize: function() {
			this.model.bind("invalid", this.showErrors, this);
		},

		showErrors: function(model, errors) {
			$(".error-message", this.$el).remove();

			_.each(_.keys(errors), _.bind(function(key){
				var val = errors[key];
				var parent = this.$el.find("*[name=" + key + "]").parent();

				parent.addClass("error");
				parent.append('<span class="error-message">' + val + '</span>');

			}, this));
		},

		render: function() {
			this.$el.html(this.tpl(this.model.toJSON()));
			return this;
		},

		add: function(e) {
			e.stopPropagation();
			e.preventDefault();

			this.model.set({
				id: this.collection.length + 1,
				title: this.$el.find("input[name=title]").val(),
				author: this.$el.find("input[name=author]").val(),
				description: this.$el.find("textarea[name=description]").val()
			});

			if (this.model.isValid()) {
				this.collection.add(this.model);

				window.location.hash = "notes/index";
			}
		}
	});

	module.exports = CreateView;
});
