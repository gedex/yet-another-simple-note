module.exports = function(grunt) {
	"use strict";

	grunt.initConfig({
		clean: ["dist/"],

		jshint: ["js/collections/*.js", "js/models/*.js", "js/views/*.js", "js/config.js", "js/main.js", "js/router.js"],

		requirejs: {
			release: {
				options: {
					mainConfigFile: "js/config.js",
					generateSourceMaps: true,
					include: ["main"],
					out: "dist/source.min.js",
					optimize: "uglify2",
					findNestedDependencies: true,
					name: "almond",
					baseUrl: "dist/js",
					wrap: true,
					preserveLicenseComments: false
				}
			}
		},

		cssmin: {
			release: {
				files: {
					"dist/css/style.min.css": ["css/font.css", "css/genericons.css", "css/style.css"]
				}
			}
		},

		processhtml: {
			release: {
				files: {
					"dist/index.html": ["index.html"]
				}
			}
		},

		copy: {
			relase: {
				files: [
					{ src: ["js/**"], dest: "dist/" },
					{ src: ["css/font/*"], dest: "dist/" }
				]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-processhtml");
	grunt.loadNpmTasks("grunt-bbb-requirejs");
	grunt.loadNpmTasks("grunt-bbb-styles");

	grunt.registerTask("default", [
		"clean",
		"jshint",
		"processhtml",
		"copy",
		"requirejs",
		"cssmin"
	]);
};
