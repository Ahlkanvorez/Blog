(function () {
	'use strict';

	// Create a service for requesting blog articles by ID via the REST Api.
	angular.
		module('core.article').
		factory('Article', ['$resource', 'ServerConfig',
			function ArticleResource($resource, ServerConfig) {
				return $resource(ServerConfig.baseUrl + '/blog/get-article/:articleId', {}, {
					query : {
						method : 'GET',
						params : { articleId : '@id'}
					}
				});
			}
		]);
})();