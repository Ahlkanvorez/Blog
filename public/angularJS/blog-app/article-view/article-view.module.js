(function () {
    'use strict';

    /** Define the 'articleView' module, which encapsulates the View and
     * Controller for pages which view individual articles, by ID.
     * - core.articleIndex is needed in order to access articles from the
     *   server, which can then be viewed by ID.
     * - core.category is needed in order to access categories from the server,
     *   which can then be viewed by name.
     */
    angular.module('articleView', [
        'core.articleIndex',
        'core.category'
    ]);
})();
