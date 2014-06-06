define("run", function(require){
	var Backbone = require("backbone");
	var Router = require("router");
	var router = new Router();

	Backbone.history.start({pustState: true});
});

require(["config"], function(){
	require(["run"]);
});
