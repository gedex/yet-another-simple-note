define(function(require, exports, module){

	var FormView = Backbone.View.extend({

		showErrors: function(model, errors) {
			$(".error-message", this.$el).remove();

			_.each(_.keys(errors), _.bind(function(key){
				var val = errors[key];
				var parent = this.$el.find("*[name=" + key + "]").parent();

				parent.addClass("error");
				parent.append('<span class="error-message"><span class="genericon genericon-warning"></span> ' + val + '</span>');

			}, this));
		},

		render: function() {
			this.$el.html(this.tpl(this.model.toJSON()));
			return this;
		}

	});

	module.exports = FormView;

});
