(function () {
	'use strict';

	// Define the 'articleList' module
	angular.module('articleList', [
		'ngSanitize',
		'core.articleIndex',
		'core.category'
	]);
})();