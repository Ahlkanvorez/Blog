(function () {
	'use strict';

	// Define the 'articleView' module
	angular.module('articleView', [
		'ngSanitize',
		'core.articleIndex',
		'core.category'
	]);
})();