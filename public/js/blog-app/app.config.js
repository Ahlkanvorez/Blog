(function () {
	'use strict';

	angular.
		module('blogApp').
		config(['$locationProvider', '$routeProvider',
			function config($locationProvider, $routeProvider) {
				$locationProvider.hashPrefix('!');

				$routeProvider.
					when('/about', {
						template : '<about-view></about-view>'
					}).
					when('/article-list/', {
						template : '<article-list></article-list>'
					}).
					when('/article-list/:category', {
						template : '<article-list></article-list>'
					}).
					when('/article-list/:category/:authorName/', {
						template : '<article-list></article-list>'
					}).
					when('/article-list/:category/:startDate/:endDate/', {
						template : '<article-list></article-list>'
					}).
					when('/article-list/:category/:authorName/:startDate/:endDate/', {
						template : '<article-list></article-list>'
					}).
					when('/articles/:articleId', {
						template : '<article-view></article-view>'
					}).
					otherwise('/article-list');
			}
		]);
})();