(function () {
    'use strict';

    // Create a service for requesting all blog articles via the REST Api.
    angular.module('core.articleIndex').factory('ArticleIndex', ['$http', 'ServerConfig',
        function ArticleIndexService($http, ServerConfig) {
            var allArticleListUrl = ServerConfig.baseUrl + '/blog/all-article-list';
            var promise = $http.get(allArticleListUrl);

            return {
                get: function (callback) {
                    promise.success(callback);
                },

                refresh: function (callback) {
                    promise = $http.get(allArticleListUrl);
                    promise.success(callback);
                },

                createArticle: function (category, successCallback, errorCallback) {
                    $http({
                        method: 'POST',
                        url: ServerConfig.baseUrl + '/blog/post-article/',
                        data: {
                            "title": "Title",
                            "author": {"name": "Author name", "email": "Author email"},
                            "content": "<p>This is some content.</p>",
                            "category": ((!category || category === 'Everything') ? 'Miscellany' : category),
                            "date": new Date().toString(),
                            "private": false
                        }
                    }).then(successCallback, errorCallback);
                },

                updateArticle: function (article, successCallback, errorCallback) {
                    $http({
                        method: 'PUT',
                        url: ServerConfig.baseUrl + '/blog/update-article/' + article._id,
                        data: article
                    }).then(successCallback, errorCallback);
                },

                deleteArticle: function (id, successCallback, errorCallback) {
                    $http({
                        method: 'DELETE',
                        url: ServerConfig.baseUrl + '/blog/remove-article/' + id
                    }).then(successCallback, errorCallback);
                }
            };
        }
    ]);
})();