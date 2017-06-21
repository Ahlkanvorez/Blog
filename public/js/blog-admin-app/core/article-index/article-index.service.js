(function () {
    'use strict';

    /** Defines the ArticleIndex service, which manages all interaction with the server concerning Article objects.
     *  The REST API presented by this service allows GET, POST, PUT, and DELETE operations, since the admin will need
     *     to be able to view, create, edit, and delete articles.
     *
     *  - get will return all the articles on the server, but will only access the server once, caching the response in
     *        memory, and serving that data when re-requested.
     *  - refresh will reload the local data from the server, by creating a new HTTP request and saving a new promise.
     *  - createArticle creates a new article via a POST request.
     *  - updateArticle allows changes to an existing article to be made by ID, via a PUT request.
     *  - deleteArticle removes an article from the database by ID, via a DELETE request.
     *
     * Requirements:
     *  - $http is required in order to send HTTP requests to the server.
     *  - ServerConfig is required in order to access the base URL of the server, which is only recorded in that one
     *      location, to prevent possible bugs if the server url ever changes.
     *
     */
    angular.module('core.articleIndex').factory('ArticleIndex', ['$http', 'ServerConfig',
        function ArticleIndexService($http, ServerConfig) {
            const allArticleListUrl = ServerConfig.baseUrl + '/blog/all-article-list';
            /* Record the promise for article objects */
            var promise = $http.get(allArticleListUrl);

            return {
                get: function (success, error) {
                    /* Feed the promise the given callback, so the data can be retrieved as if it were a fresh request
                     * each time.
                     */
                    promise.then(success, error);
                },

                refresh: function (success, error) {
                    /* Create a new promise and feed that the callback, so that the data is actually reloaded from the
                     * server, and then appears to be a fresh request on each subsequent access.
                     */
                    promise = $http.get(allArticleListUrl);
                    promise.then(success, error);
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
                            "private": true
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
