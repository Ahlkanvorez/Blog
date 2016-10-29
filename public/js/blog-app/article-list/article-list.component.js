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

                console.log(Category);

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
                        getArticlesByDateRange(self.categoryName, dateStart, dateEnd);
                    } else if (self.authorName) {
                        getArticlesByAuthor(self.categoryName, self.authorName);
                    } else if (self.categoryName) {
                        getArticlesByCategory(self.categoryName);
                    }

                    /*            // TODO: Sort articles.

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
                function getArticlesByDateRange(category, start, end) {
                    /* Keep displaying all archive dates, so display them before restricting the
                     currently viewed articles to those between the start and end dates. */
                    displayArchiveDates();

                    // Convert the dates to an efficiently comparable format.
                    start = new Date(parseInt(start)).getTime();
                    end = new Date(parseInt(end)).getTime();

                    self.articles = self.articles.filter(function (article) {
                        var date = new Date(article.date).getTime();
                        return (category === 'Everything' || category === article.category) &&
                            start < date && date < end;
                    });

                    displayAuthorNames();
                }

                /* GET a list of articles by author, within a specified category. */
                function getArticlesByAuthor(category, author) {
                    /* When searching by author, limit archive searches to
                     for convenience. */
                    self.articles = self.articles.filter(function (article) {
                        return article.author.name === author &&
                            (category === 'Everything' || article.category === category);
                    });
                    displayArchiveDates();
                    // Obviously don't display author names, since only one author is being viewed.
                }

                /* GET a list of articles by category. */
                function getArticlesByCategory(categoryName) {
                    /* When searching within a category, limit archive
                     searches to that category for convenience. */
                    self.articles = self.articles.filter(function (article) {
                        return categoryName === 'Everything' || article.category === categoryName;
                    })
                    displayArchiveDates();
                    displayAuthorNames();
                }

                /*
                 Miscellaneous helping functions
                 */

                function displayArchiveDates() {
                    // Get a unique mapping of all relevant date ranges.
                    var articles = self.articles;
                    var dateSet = {};
                    for (var n in articles) {
                        var a = new Date(articles[n].date);
                        if (a.toString() !== 'Invalid Date') {
                            var start = new Date(a.getFullYear(), a.getMonth(), 1);
                            dateSet[start] = new Date(a.getFullYear(), a.getMonth() + 1, 1);
                        }
                    }

                    // Add the date ranges to self.dates
                    self.dates = [];
                    angular.forEach(dateSet, function (value, key) {
                        self.dates.push({
                            start: new Date(key), // Construct a date because the key is a String.
                            end: value
                        });
                    });
                }

                function displayAuthorNames() {
                    if (!self.authorName) {
                        // Create a list of distinct authors within the current category.
                        var authorMap = {};
                        self.articles.forEach(function (article, n, list) {
                            authorMap[article.author.name] = article.author;
                        });

                        self.authors = [];
                        for (var authorName in authorMap) {
                            self.authors.push(authorMap[authorName]);
                        }
                    } else {
                        /* Otherwise, since only one author is selected, don't load
                         an author list, and only load that author's articles. */
                        var authorsArticles = [];
                        self.articles.filter(function (article, n, articleList) {
                            return article.author.name === self.authorName;
                        });
                    }
                }

            }
        ]
    });
})();