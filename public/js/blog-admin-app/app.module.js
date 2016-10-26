(function () {
	'use strict'

	// Define the 'blogAdminApp' module
	angular.module('blogAdminApp',[
		'ngRoute',
		'core',
		'articleList',
		'articleView',
		'aboutView'
	]);
})();