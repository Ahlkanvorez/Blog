(function () {
  'use strict';

  angular.
    module('core.category').
    factory('Category', ['$http', 'ServerConfig',
      function ($http, ServerConfig) {
        var allCategoryListUrl = ServerConfig.baseUrl + '/blog/all-category-list';
        var promise = $http.get(allCategoryListUrl);

        return {
          get : function (callback) {
            promise.success(callback);
          },

          refresh : function (callback) {
            promise = $http.get(allCategoryListUrl);
            promise.success(callback);
          },

          createCategory : function (successCallback, errorCallback) {
            $http({
              method : 'POST',
              url : ServerConfig.baseUrl + '/blog/post-category/',
              data : {
                name : 'name',
                description : 'description',
                aboutAuthor : 'About author'
              }
            }).then(successCallback, errorCallback);
          },

          updateCategory : function (id, updates, successCallback, errorCallback) {
            $http({
              method : 'PUT',
              url : ServerConfig.baseUrl + '/blog/update-category/' + id,
              data : updates
            }).then(successCallback, errorCallback);
          },

          deleteCategory : function (id, successCallback, errorCallback) {
            $http({
              method : 'DELETE',
              url : ServerConfig.baseUrl + '/blog/remove-category/' + id
            }).then(successCallback, errorCallback);
          }
        };

        /*
        return $resource(ServerConfig.baseUrl + '/blog/get-category/:name', {}, {
          query : {
            method : 'GET',
            params : { name : 'Everything' },
            isArray : true
          }
        }); */
      }
    ]);
})();