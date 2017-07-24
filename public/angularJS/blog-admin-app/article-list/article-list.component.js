(function () {
    'use strict';

    /** Defines the ArticleList component, and registers it with the module, which contains the View in an HTML file
     *    (/angularJS/blog-app/article-list/article-list.template.html), with the associated Controller in this file.
     * - $scope is used to make certain variables and functions in the Controller available to the View.
     * - $window is used to refresh the page when the url changes, such as when the desired category to display changes.
     * - $routeParams is used to access the desired author name, category name, or range of dates, for use in filtering
     *     which articles are to be displayed.
     * - ArticleIndex is used to access the articles from the server, and acts like a REST API with a GET function.
     * - ServerConfig is used to access the global-constant base-url for the Server.
     * - Category is used to access the categories from the server, and acts like a REST API with a GET function.
     * - ViewModes is used to allow simple indication of state between editing the current category, and viewing it.
     */
    angular.module('articleList').component('articleList', {
        templateUrl: '/angularJS/blog-admin-app/article-list/article-list.template.html',
        controller: ['$scope', '$window', '$routeParams', 'ArticleIndex', 'ServerConfig', 'Category', 'ViewModes',
            function ArticleListController($scope, $window, $routeParams, ArticleIndex, ServerConfig, Category, ViewModes) {
                var self = this;
                var author = $routeParams.authorName;
                var dateStart = $routeParams.startDate;
                var dateEnd = $routeParams.endDate;

                /* TODO: If you enable pagination, this code may be useful.
                 $scope.page = 0;
                 $scope.numberOfPages = 1;
                 var ARTICLES_PER_PAGE = 5;

                 $scope.hasNextPage = false;
                 $scope.hasPreviousPage = false;
                 */

                self.categoryName = $routeParams.category;

                if (!self.categoryName) {
                    self.categoryName = 'Everything';
                }

                $scope.box = {};

                /* Pull a list of categories from the server. */
                Category.get(function successCallback(categories) {
                    /* Pick the current category from the category list. */
                    self.categoryList = categories;
                    for (var n in categories) {
                        if (categories[n].name === self.categoryName) {
                            /* For reference, make a separate copy of the category. */
                            self.category = JSON.parse(JSON.stringify(categories[n]));
                            $scope.box.category = categories[n];
                            break;
                        }
                    }
                });

                ArticleIndex.get(function successCallback(articleList) {
                    self.articles = articleList;
                    filterArticles();

                    /* TODO: If you implement pagination, this may be useful.
                     // TODO: Sort articles.
                     $scope.numberOfPages = (self.articles.length - (self.articles.length % ARTICLES_PER_PAGE)) / ARTICLES_PER_PAGE
                     + (self.articles.length % ARTICLES_PER_PAGE === 0 ? 0 : 1);

                     if (self.articles.length > ARTICLES_PER_PAGE) {
                     self.allArticles = self.articles;
                     self.articles = self.articles.slice(0, ARTICLES_PER_PAGE);
                     $scope.hasNextPage = true;
                     } */
                });

                /* TODO: Decide whether or not you want to paginate the articles.
                 function displayArticlesForPage() {
                 self.articles = self.allArticles.
                 slice($scope.page * ARTICLES_PER_PAGE,
                 ($scope.page + 1) * ARTICLES_PER_PAGE);
                 }; */

                /*
                 Functions called by the View
                 */

                /**
                 * Indicate to the View that the display should change so that the current category can be edited.
                 */
                $scope.enterEditMode = function enterEditMode() {
                    self.mode = ViewModes.edit;
                };

                /**
                 * Indicate to the View that the display should change to viewing, not editing, the current category.
                 */
                $scope.exitEditMode = function exitEditMode() {
                    /* Restore the editing category to it's original state. */
                    $scope.box.category = JSON.parse(JSON.stringify(self.category));
                    self.mode = ViewModes.view;
                };

                /**
                 * Used to view the next page if the article-list is paginated.
                 * TODO: Decide whether to use pagination or not.
                 */
                $scope.viewNextPage = function viewNextPage() {
                    if ($scope.page < $scope.numberOfPages) {
                        $scope.page++;
                        displayArticlesForPage();

                        /* For use in hiding buttons */
                        $scope.hasPreviousPage = true;
                    }
                    if ($scope.page >= $scope.numberOfPages) {
                        /* For use in hiding buttons */
                        $scope.hasNextPage = false;
                    }
                };

                /**
                 * Used to view the previous page if the article-list is paginated.
                 * TODO: Decide whether to use pagination or not.
                 */
                $scope.viewPreviousPage = function viewPreviousPage() {
                    if ($scope.page > 0) {
                        $scope.page--;
                        displayArticlesForPage();

                        /* For use in hiding buttons */
                        $scope.hasNextPage = true;
                    }
                    /* Not an else, because we always want to check if we need to disable a button. */
                    if ($scope.page <= 0) {
                        /* For use in hiding buttons */
                        $scope.hasPreviousPage = false;
                    }
                };

                /*
                 DELETE operations
                 */

                /**
                 * Deletes the currently viewed category.
                 */
                $scope.deleteCategory = function deleteCategory() {
                    if (self.categoryName === 'Everything' || self.categoryName === 'Miscellany') {
                        alert('Sorry, but even you cannot delete the "Everything" category, or the "Miscellany" category.');
                        return;
                    }
                    if (confirm('Are you sure you would like to delete the category "' + self.categoryName
                            + '", and move all the articles therein to the category "Miscellany"?')) {
                        Category.deleteCategory(self.category._id,
                            function successCallback(response) {
                                self.articles.forEach(function (article) {
                                    article.category = 'Miscellany';
                                    ArticleIndex.updateArticle(article);
                                });
                                refreshAll('/admin#!/article-list/Miscellany');
                            }, function errorCallback(response) {
                                console.log('Uh oh ...', response);
                            }
                        );
                    }
                };

                /*
                 PUT operations
                 */

                /**
                 * Saves the changes made to the current category.
                 */
                $scope.saveCategory = function saveCategory() {
                    var updates = $scope.box.category;
                    Category.updateCategory(self.category._id, updates,
                        function successCallback(response) {
                            self.mode = ViewModes.view;
                            /* Save a distinct copy of the saved category for reference. */
                            self.category = JSON.parse(JSON.stringify(response.data));
                            $scope.box.category = response.data;
                        }, function errorCallback(response) {
                            console.error(response);
                        }
                    );
                };

                /*
                 POST operations
                 */

                /**
                 * Creates a new category and navigates to view that category.
                 */
                $scope.newCategory = function newCategory() {
                    Category.createCategory(
                        function successCallback(response) {
                            self.category = response.data.Ok;
                            self.articles = [];

                            refreshAll('/admin#!/article-list/' + self.category.name);
                        }, function errorCallback(response) {
                            console.error(response);
                        }
                    );
                };

                /**
                 * Creates a new article and navigates to view that article.
                 */
                $scope.newArticle = function newArticle() {
                    /* Create a new, templated article on the server, then navigate to view it for editing purposes. */
                    ArticleIndex.createArticle(self.categoryName,
                        function successCallback(response) {
                            var article = response.data.Ok;
                            refreshAll('/admin#!/articles/' + article.title.split(' ').join('-'));
                        }, function errorCallback(response) {
                            alert("Oops! It seems there's something wrong with the server. Try again in a few moments.");
                        }
                    );
                };

                /*
                 GET operations
                 */

                /**
                 *  GET a list of articles by category within a specified range of dates.
                 */
                function getArticlesByDateRange(category, start, end) {
                    /* Keep displaying all archive dates, so display them before restricting the currently viewed
                     * articles to those between the start and end dates.
                     */
                    displayArchiveDates();

                    /* Convert the dates to an efficiently comparable format. */
                    start = new Date(parseInt(start)).getTime();
                    end = new Date(parseInt(end)).getTime();

                    self.articles = self.articles.filter(function (article) {
                        var date = new Date(article.date).getTime();
                        return (category === 'Everything' || category === article.category) &&
                            start < date && date < end;
                    });

                    displayAuthorNames();
                }

                /**
                 *  GET a list of articles by author, within a specified category.
                 */
                function getArticlesByAuthor(category, author) {
                    self.articles = self.articles.filter(function (article, n, list) {
                        return (category === 'Everything' || article.category === self.categoryName) &&
                            article.author.name === author;
                    });
                    displayArchiveDates();
                }

                /**
                 * GET a list of articles by category.
                 */
                function getArticlesByCategory(categoryName) {
                    self.articles = self.articles.filter(function (article) {
                        return categoryName === 'Everything' ||
                            (article.category === categoryName);
                    });
                    /* When searching within a category, limit archive searches to that category for convenience. */
                    displayArchiveDates();
                    displayAuthorNames();
                }

                /*
                 Miscellaneous helping functions
                 */

                /**
                 * Filters articles to display according to the preferences chosen in the URL.
                 */
                function filterArticles() {
                    if (dateStart && dateEnd) {
                        getArticlesByDateRange(self.categoryName, dateStart, dateEnd);
                    } else if (author) {
                        getArticlesByAuthor(self.categoryName, author);
                    } else if (self.categoryName) {
                        getArticlesByCategory(self.categoryName);
                    }
                }

                /**
                 * Refreshes the display to reflect the new url, either changing the articles/category displayed, or
                 * navigating to view an individual article in the ArticleView.
                 *
                 * @param newUrl the new url reflecting the desired state of the application.
                 */
                function refreshAll(newUrl) {
                    ArticleIndex.refresh(function () {
                        Category.refresh(function () {
                            $window.location = newUrl;
                            filterArticles();
                        });
                    });
                }

                /**
                 * Display appropriate archive dates in the View under the 'Archive' subsection in the right column, for
                 * the current category and article filter preferences.
                 */
                function displayArchiveDates() {
                    /* Get a unique mapping of all relevant date ranges. */
                    var articles = self.articles;
                    var dateSet = {};
                    for (var n in articles) {
                        var a = new Date(articles[n].date);
                        if (a.toString() !== 'Invalid Date') {
                            var start = new Date(a.getFullYear(), a.getMonth(), 1);
                            dateSet[start] = new Date(a.getFullYear(), a.getMonth() + 1, 1);
                        }
                    }

                    /* Add the date ranges to self.dates */
                    self.dates = [];
                    angular.forEach(dateSet, function (value, key) {
                        self.dates.push({
                            start: new Date(key), /* Construct a date because the key is a String. */
                            end: value
                        });
                    });
                }

                /**
                 * Display appropriate author names in the View under the 'Authors' subsection in the right column, for
                 * the current category and article filter preferences.
                 */
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
