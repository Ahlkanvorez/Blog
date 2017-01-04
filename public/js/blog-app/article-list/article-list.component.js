(function () {
    'use strict';

    /** Defines the ArticleList component, and registers it with the module, which contains the View in
     *     an HTML file (/js/blog-app/article-list/article-list.template.html), with the associated Controller in this
     *     file.
     * - $sanitize is needed in order to allow Angular to inject the HTML data from the article retreived from the
     *     Server into the web-page, via the ng-bind-html modifier in the View.
     * - $routeParams is used to access the desired author name, category name, or range of dates, for use in filtering
     *     which articles are to be displayed.
     * - ArticleIndex is used to access the articles from the server, and acts like a REST API with a GET function.
     * - Category is used to access the categories from the server, and acts like a REST API with a GET function.
     */
    angular.module('articleList').component('articleList', {
        templateUrl: '/js/blog-app/article-list/article-list.template.html',
        controller: ['$sanitize', '$routeParams', 'ArticleIndex', 'Category',
            /* NOTE: If you uncomment the code for pagination, you'll need to import $scope again. */
            function ArticleListController($sanitize, $routeParams, ArticleIndex, Category) {
                const self = this;
                const dateStart = $routeParams.startDate;
                const dateEnd = $routeParams.endDate;

                self.authorName = $routeParams.authorName;
                self.categoryName = $routeParams.category;

                /*
                $scope.page = 0;
                $scope.numberOfPages = 1;
                var ARTICLES_PER_PAGE = 5;

                $scope.hasNextPage = false;
                $scope.hasPreviousPage = false;
                */

                if (!self.categoryName) {
                    self.categoryName = 'Everything';
                }

                // Pull a (usually cached) list of categories from the server.
                Category.get(function successCallback(categories) {
                    // Pick the current category from the category list.
                    self.categoryList = categories;
                    for (var n in categories) {
                        if (categories[n].name === self.categoryName) {
                            // For reference, make a separate copy of the category.
                            self.category = categories[n];
                            break;
                        }
                    }
                });

                ArticleIndex.get(function successCallback(articleList) {
                    self.articles = articleList;
                    if (dateStart && dateEnd) {
                        getArticlesByDateRange(dateStart, dateEnd);
                    } else if (self.authorName) {
                        getArticlesByAuthor();
                    } else if (self.categoryName) {
                        getArticlesByCategory();
                    }

                    /* For pagination
                     // TODO: Sort articles.
                     $scope.numberOfPages = (self.articles.length - (self.articles.length % ARTICLES_PER_PAGE)) / ARTICLES_PER_PAGE
                     + (self.articles.length % ARTICLES_PER_PAGE === 0 ? 0 : 1);

                     if (self.articles.length > ARTICLES_PER_PAGE) {
                     self.allArticles = self.articles;
                     self.articles = self.articles.slice(0, ARTICLES_PER_PAGE);
                     $scope.hasNextPage = true;
                     } */
                });

                /* Paginate the articles.
                function displayArticlesForPage() {
                    self.articles = self.allArticles.slice($scope.page * ARTICLES_PER_PAGE,
                        ($scope.page + 1) * ARTICLES_PER_PAGE);
                };
                */

                /*
                 Functions called by the view
                 */

                /* Pagination functions
                $scope.viewNextPage = function viewNextPage() {
                    if ($scope.page < $scope.numberOfPages) {
                        $scope.page++;
                        displayArticlesForPage();

                        // For use in hiding buttons
                        $scope.hasPreviousPage = true;
                    }
                    if ($scope.page >= $scope.numberOfPages) {
                        // For use in hiding buttons
                        $scope.hasNextPage = false;
                    }
                };

                $scope.viewPreviousPage = function viewPreviousPage() {
                    if ($scope.page > 0) {
                        $scope.page--;
                        displayArticlesForPage();

                        // For use in hiding buttons
                        $scope.hasNextPage = true;
                    }
                    // Not an else, because we always want to check if we need to disable a button.
                    if ($scope.page <= 0) {
                        // For use in hiding buttons
                        $scope.hasPreviousPage = false;
                    }
                } */

                /*
                 GET operations
                 */

                /* GET a list of articles by category within a specified range of dates. */
                function getArticlesByDateRange(start, end) {
                    /* Keep displaying all archive dates, so display them before restricting the
                     currently viewed articles to those between the start and end dates. */
                    displayArchiveDates();

                    /* Convert the dates to an efficiently comparable format, viz. integers. */
                    start = new Date(parseInt(start)).getTime();
                    end = new Date(parseInt(end)).getTime();

                    /* Filter the articles so that only those which fall within the date range, and are of the correct
                         category, remain in the list. If the category is 'Everything', then this only checks whether
                         they fall within the date range. */
                    self.articles = self.articles.filter(function (article) {
                        const date = new Date(article.date).getTime();
                        return (self.categoryName === 'Everything' || self.categoryName === article.category) &&
                            start < date && date < end;
                    });

                    displayAuthorNames();
                }

                /* GET a list of articles by author, within a specified category. */
                function getArticlesByAuthor() {
                    /* When searching by author, limit archive searches to those of that author for convenience. */
                    self.articles = self.articles.filter(function (article) {
                        return article.author.name === self.authorName &&
                            (self.categoryName === 'Everything' || article.category === self.category);
                    });
                    displayArchiveDates();
                    /* Obviously don't display author names, since only one author is being viewed. */
                }

                /* GET a list of articles by category. */
                function getArticlesByCategory() {
                    /* When searching within a category, limit archive searches to that category for convenience. */
                    self.articles = self.articles.filter(function (article) {
                        return self.categoryName === 'Everything' || article.category === self.categoryName;
                    })
                    displayArchiveDates();
                    displayAuthorNames();
                }

                /* Miscellaneous helping functions:
                 - displayArchiveDates sets up the data for the View to display month-long ranges of dates in which
                     currently viewed articles were written.
                 - displayAuthorNames sets up the data for the View to display all the author names for articles in the
                     currently displayed set. However, if authorName is one of the currently used filters, this function
                     will have no effect.
                 */

                function displayArchiveDates() {
                    /* Get a unique mapping of all relevant date ranges from the selected articles,
                        mapping from the start of the date range, to the end of the date range, which is always
                        one month in length (i.e. end = start + one_month). */
                    const articles = self.articles;
                    const dateSet = {};
                    for (var n in articles) {
                        /* Only make archive dates for articles in the current category. Of course, if the current
                             category is 'Everything', then make archives for everything. */
                        if (self.categoryName != 'Everything' && articles[n].category !== self.categoryName) {
                            continue;
                        }
                        const a = new Date(articles[n].date);
                        if (a.toString() !== 'Invalid Date') {
                            const start = new Date(a.getFullYear(), a.getMonth(), 1);
                            dateSet[start] = new Date(a.getFullYear(), a.getMonth() + 1, 1);
                        }
                    }

                    /* Add the date ranges to self.dates, for display in the View under 'Archives' */
                    self.dates = [];
                    angular.forEach(dateSet, function (value, key) {
                        self.dates.push({
                            start: new Date(key), /* Construct a date because the key is a String. */
                            end: value /* The value was already a date, so no need to instantiate a new Date object. */
                        });
                    });
                }

                function displayAuthorNames() {
                    /* If no particular author is selected for use in filtering articles, then list all the authors who
                            have available articles in the side bar under 'Authors'. */
                    if (!self.authorName) {
                        /* Create a list of distinct authors within the current category. */
                        const authorMap = {};
                        self.articles.forEach(function (article) {
                            authorMap[article.author.name] = article.author;
                        });

                        self.authors = [];
                        for (var authorName in authorMap) {
                            self.authors.push(authorMap[authorName]);
                        }
                    }
                }

            }
        ]
    });
})();
