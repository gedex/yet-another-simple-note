define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone");

	var NestedModel = Backbone.Model.extend({

		// Related Model.
		relModel: {},

		// Related Collections.
		relCollection: {},

		parse: function(resp) {
			_.each(this.relModel, function(Model, key) {
				resp[key] = new Model(resp[key], {parse: true});
			});

			_.each(this.relCollection, function(Collection, key) {
				if (!_.isNull(resp[key])) {
					resp[key] = new Collection(resp[key]);
				}
			});

			return resp;
		}

	});

	module.exports = NestedModel;
});
