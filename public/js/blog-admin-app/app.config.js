(function () {
    'use strict';

    /** Defines the directory structure for each page of the site.
     *
     *   - #!/about is a static page describing the author of the Blog, me, Robert Mitchell.
     *   - #!/article-list is a dynamic page which lists all the articles on the blog. None of the
     *            article-list pages are currently paginated.
     *   - #!/article-list/:category lists all the articles in the specified category.
     *   - #!/article-list/:category/:authorName lists all the articles in the specified category which were written
     *            by the specified author.
     *   - #!/article-list/:category/:startDate/:endDate lists all the articles in the specified category which were
     *            posted between the specified dates.
     *   - #!/article-list/:category/:authorName/:startDate/:endDate lists all the articles in the specified category
     *            which were written by the specified author and posted between the specified dates.
     *   - #!/articles/:articleId is a dynamic page which displays the unique article with the specified ID.
     *
     *   Any other url will be defaulted to admin#!/article-list
     */
    angular.module('blogAdminApp').config(['$locationProvider', '$routeProvider',
        function config($locationProvider, $routeProvider) {
            $locationProvider.hashPrefix('!');

            $routeProvider.when('/about', {
                template: '<about-view></about-view>'
            }).when('/article-list/', {
                template: '<article-list></article-list>'
            }).when('/article-list/:category', {
                template: '<article-list></article-list>'
            }).when('/article-list/:category/:authorName/', {
                template: '<article-list></article-list>'
            }).when('/article-list/:category/:startDate/:endDate/', {
                template: '<article-list></article-list>'
            }).when('/article-list/:category/:authorName/:startDate/:endDate/', {
                template: '<article-list></article-list>'
            }).when('/articles/:articleId', {
                template: '<article-view></article-view>'
            }).otherwise('/article-list');
        }
    ]);
})();