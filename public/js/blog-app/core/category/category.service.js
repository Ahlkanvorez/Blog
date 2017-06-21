(function () {
    'use strict';

    /** Defines the Category service, which manages all interaction with the server concerning Category objects.
     *  The REST API presented by this service only allows HTTP GET operations, since the user will never need to, and
     *     is not allowed to, perform any other options.
     *
     *  - get will return all the categories on the server, but will only access the server once, caching the response
     *        in memory, and serving that data when re-requested.
     *
     * Requirements:
     *  - $http is required in order to send HTTP requests to the server (in this case, only GET).
     *  - ServerConfig is required in order to access the base URL of the server, which is only recorded in that one
     *      location, to prevent possible bugs if the server url ever changes.
     */
    angular.module('core.category').factory('Category', ['$http', 'ServerConfig',
        function ($http, ServerConfig) {
            /* Record the promise of an HTTP GET request for the category list. */
            const promise = $http.get(ServerConfig.baseUrl + '/blog/category-list');

            return {
                get: function (callback) {
                    /* Pass the given callback to the promise for use when the HTTP GET request is successful,
                     so that the caller interacts with this as if they were just making an HTTP GET request each
                     time get(callback) is called. */
                    promise.success(callback);
                }
            };
        }
    ]);
})();