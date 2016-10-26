(function () {
	'use strict';

	angular.
		module('core.category').
		factory('Category', ['$http', 'ServerConfig',
			function ($http, ServerConfig) {
				var promise = $http({
					method : 'GET',
					url : ServerConfig.baseUrl + '/blog/category-list'
				});

				return {
					get : function (callback) {
						promise.success(callback);
					}
				};
			}
		]);
})();