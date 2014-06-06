define(function(require, exports, module) {

	var _ = require("underscore");
	var FormView = require("views/form");
	var formTemplate = require("text!templates/form.html");
	var TagModel = require("models/tag");
	var TagsCollection = require("collections/tags");

	var CreateView = FormView.extend({
		className: "new",
		tpl: _.template(formTemplate),

		events: {
			"click button.save": "add"
		},

		initialize: function(options) {
			this.model.bind("invalid", this.showErrors, this);
			this.router = options.router;
		},

		add: function(e) {
			e.stopPropagation();
			e.preventDefault();

			var tags = new TagsCollection();
			var cleaned = {}; // To removes duplicates.

			_.each(this.$el.find("input[name=newtag]").val().split(","), function(tag){
				tag = tag.trim();
				if (!_.isEmpty(tag) && !cleaned[tag]) {
					tags.add(new TagModel({
						id: null,
						name: tag
					}));
				}
			});

			this.model.set({
				id: null,
				title: this.$el.find("input[name=title]").val(),
				content: this.$el.find("textarea[name=content]").val(),
				tags: tags
			});

			if (this.model.isValid()) {
				this.collection.create(this.model.toJSON(), {wait: true});

				this.router.navigate("notes/index");
			}
		}
	});

	module.exports = CreateView;
});
