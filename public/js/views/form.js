define(function(require, exports, module){

	var _ = require("underscore");
	var util = require("views/util");

	var errorTemplate = require("text!templates/error.html");

	// FormView is the base view class. This class provides method to show errors
	// for invalid model and generic render that decompose tags object into
	// string. CreateView (for creating note) and EditView (for editing note) are
	// extended classes of FormView.
	var FormView = Backbone.View.extend({

		initialize: function(options) {
			this.router = options.router;
			this.model.bind("invalid", this.showErrors, this);
		},

		// Show error if model doesn't pass validation.
		showErrors: function(model, errors) {
			$(".error-message", this.$el).remove();

			_.each(_.keys(errors), _.bind(function(key){
				var val = errors[key];
				var parent = this.$el.find("*[name=" + key + "]").parent();

				parent.addClass("error");
				parent.append(_.template(errorTemplate)({message: val}));

			}, this));
		},

		// Generic render that decompose tags object into string.
		render: function() {
			var data = this.model.toJSON();

			data.strTags = "";
			if (!_.isUndefined(data.tags)) {
				if (!_.isUndefined(data.tags.toJSON)) {
					data.strTags = util.tags.decompose(data.tags.toJSON());
				} else {
					data.strTags = util.tags.decompose(data.tags);
				}
			}
			data.viewClass = this.className;

			this.$el.html(this.tpl(data));
			return this;
		}

	});

	module.exports = FormView;

});
