require.config({
	paths: {
		"almond":     "libs/almond/almond",
		"backbone":   "libs/backbone/backbone",
		"jquery":     "libs/jquery/dist/jquery.min",
		"require":    "libs/requirejs/require",
		"text":       "libs/requirejs-text/text",
		"underscore": "libs/underscore/underscore",
	},

	shim: {
		"backbone": {
			deps:    ["jquery", "underscore"],
			exports: "Backbone"
		}
	}
});
