(function () {
	'use strict';

	// Create a service for requesting all blog articles via the REST Api.
	angular.
		module('core.articleIndex').
		factory('ArticleIndex', ['$http', 'ServerConfig',
			function ArticleIndexService($http, ServerConfig) {
				var promise = $http.get(ServerConfig.baseUrl + '/blog/article-list');

				return {
					get : function (callback) {
						promise.success(callback);
					}
				};
			}
		]);
})();