(function () {
    'use strict';

    /** Define the 'articleList' module, which encapsulates the View and Controller for pages which view a list of
     *     articles, by category name, author name, between two dates, or some combination thereof.
     * - ngSanitize is needed in order to allow Angular to inject the HTML data from the article retreived from the
     *     Server into the web-page, via the ng-bind-html modifier in the View.
     * - core.articleIndex is needed in order to access articles from the server, which can then be viewed by ID.
     * - core.category is needed in order to access categories from the server, which can then be viewed by name.
     */
    angular.module('articleList', [
        'ngSanitize',
        'core.articleIndex',
        'core.category'
    ]);
})();
