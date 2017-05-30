(function () {
    'use strict';

    /** Defines the ArticleView module, and registers it with the module, which contains the View in
     * an HTML file (/js/blog-app/about-view/about.template.html), with the associated Controller in this file.
     * Note, that since this View is a static HTML page, the controller is empty. Moreover, this module has no
     * dependencies.
     */
    angular.module('aboutView').component('aboutView', {
        templateUrl: '/js/blog-app/about-view/about.template.html',
        controller:
            function aboutViewController($window, $timeout) {
                /* manually update meta information. */
                var about = {
                    'title' : "About | Robert Mitchell"
                };
                console.log($window.prerenderReady);
                document.title = about.title;
                $("meta[name='og:title']").attr("content", about.title);
                $("meta[name='twitter:title']").attr("content", about.title);
                $timeout(function () {
                    $window.prerenderReady = true;
                    console.log($window.prerenderReady);
                }, 3000);
            }
    });
})();
