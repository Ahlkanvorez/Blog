(function () {
    'use strict';

    /** Define the 'articleView' module, which encapsulates the View and Controller for pages which view individual
     *     articles, by ID. This module also allows the creation, editing, and deletion of categories, which includes
     *     making them public or private.
     * - ngSanitize is needed in order to allow injecting HTML into the page via ng-bind-html
     * - core.articleIndex is needed in order to access articles from the server, which can then be viewed by ID.
     * - core.category is needed in order to access categories from the server, which can then be viewed by name.
     */
    angular.module('articleView', [
        'ngSanitize',
        'core.articleIndex',
        'core.category'
    ]);
})();