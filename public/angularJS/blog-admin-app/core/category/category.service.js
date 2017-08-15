(function () {
    'use strict';

    /** Defines the Category service, which manages all interaction with the
     * server concerning Category objects.
     * The REST API presented by this service allows HTTP GET, PUT, POST, and
     * DELETE operations, since the admin will need to be able to view, edit,
     * delete, and create new categories.
     *
     *  - get will return all the categories on the server, but will only access
     *    the server once, caching the response in memory, and serving that data
     *    when re-requested.
     *  - refresh will reload the local data from the server, by creating a new
     *    HTTP request and saving a new promise.
     *  - createCategory creates a new category via a POST request
     *  - updateCategory allows changes to an existing category to be made by
     *    ID, via a PUT request.
     *  - deleteCategory removes a category from the database by ID, via a
     *    DELETE request.
     *
     * Requirements:
     *  - $http is required in order to send HTTP requests to the server.
     *  - ServerConfig is required in order to access the base URL of the server
     *    which is only recorded in that one location, to prevent possible bugs
     *    if the server url ever changes.
     * 
     * @param {object} $http the angularJS HTTP module.
     * @param {object} ServerConfig app constants including the server URL.
     * 
     * @return {object} an abstraction of a REST api for category objects.
     */
    angular.module('core.category')
           .factory('Category', [ '$http', 'ServerConfig',
        function ($http, ServerConfig) {
            const allCategoryListUrl = ServerConfig.baseUrl
                + '/blog/all-category-list';
            let promise = $http.get(allCategoryListUrl);

            return {
                get: function (callback) {
                    promise.success(callback);
                },

                refresh: function (callback) {
                    promise = $http.get(allCategoryListUrl);
                    promise.success(callback);
                },

                createCategory: function (successCallback, errorCallback) {
                    $http({
                        method: 'POST',
                        url: ServerConfig.baseUrl + '/blog/post-category/',
                        data: {
                            name: 'name',
                            description: 'description',
                            aboutAuthor: 'About author'
                        }
                    }).then(successCallback, errorCallback);
                },

                updateCategory: function (id, updates, successCallback,
                                          errorCallback) {
                    $http({
                        method: 'PUT',
                        url: ServerConfig.baseUrl + '/blog/update-category/'
                            + id,
                        data: updates
                    }).then(successCallback, errorCallback);
                },

                deleteCategory: function (id, successCallback, errorCallback) {
                    $http({
                        method: 'DELETE',
                        url: ServerConfig.baseUrl + '/blog/remove-category/'
                            + id
                    }).then(successCallback, errorCallback);
                }
            };
        }
    ]);
})();
