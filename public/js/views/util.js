define(function(require, exports, module) {

	var TagsCollection = require("collections/tags");
	var TagModel = require("models/tag");

	var ViewUtil = {
		tags: {
			compose: function(strTags) {
				// Will be returned by this function.
				var tags = new TagsCollection();

				// To removes duplicates.
				var cleaned = {};

				_.each(strTags.split(","), function(tag){
					tag = tag.trim();
					if (!_.isEmpty(tag) && !cleaned[tag]) {
						tags.add(new TagModel({
							id: null,
							name: tag
						}));
					}
				});

				return tags;
			},

			decompose: function(arrTags) {
				return _.pluck(arrTags, "name").join(", ");
			}
		}
	};

	module.exports = ViewUtil;

});
