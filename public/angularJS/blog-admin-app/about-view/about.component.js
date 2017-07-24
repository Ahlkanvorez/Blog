(function () {
    'use strict';

    /** Defines the ArticleView module, and registers it with the module, which contains the View in
     * an HTML file (/angularJS/blog-app/about-view/about.template.html), with the associated Controller in this file.
     * Note, that since this View is a static HTML page, the controller is empty. Moreover, this module has no
     * dependencies.
     */
    angular.module('aboutView').component('aboutView', {
        templateUrl: '/angularJS/blog-admin-app/about-view/about.template.html',
        controller: [
            function aboutViewController() {

            }
        ]
    });
})();