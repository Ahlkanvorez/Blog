(function () {
	'use strict'

	// Define the 'blogApp' module
	angular.module('blogApp',[
		'ngRoute',
		'core',
		'articleList',
		'articleView',
		'aboutView'
	]);
})();