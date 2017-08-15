(function () {
    'use strict';

    /** Defines the ArticleView module, and registers it with the module, which
     * contains the View in an HTML file
     * (/angularJS/blog-admin-app/article-view/article-view.component.html),
     * with the associated Controller in this file. This controller & view also
     * manage creation, editing, and deletion of articles, which include
     * altering which category they belong to.
     * - $sanitize is used to allow injecting HTML into the page via the
     *   ng-bind-html tag.
     * - $window is used to redirect the page to 'admin#!/article-list' after
     *   successfully deleting the article currently being viewed.
     * - $scope is used to make available a few functions so the view can
     *   indicate to the controller that the article has been edited and should
     *   be saved, or that editing should cease/begin, etc.
     * - $routeParams is used to access the title of the article which is to be
     *   displayed.
     * - ArticleIndex is used to access the articles from the server, and acts
     *   like a REST API with a GET function.
     * - ServerConfig is used to allow access to the app-wide constant value of
     *   the base-url of the server.
     * - ViewModes is used as a simple enum indicating which state of viewing is
     *   currently happening: whether the article is being edited, or simply
     *   viewed without text areas on screen.
     * - Category is used to access the categories from the server, and acts
     *   like a REST API with a GET function.
     * 
     */
    angular.module('articleView').component('articleView', {
        templateUrl:
          '/angularJS/blog-admin-app/article-view/article-view.component.html',
        controller: [ '$sanitize', '$window', '$scope', '$routeParams',
                      'ArticleIndex', 'ServerConfig', 'ViewModes', 'Category',
            function articleViewController ($sanitize, $window, $scope,
                                            $routeParams, ArticleIndex,
                                            ServerConfig, ViewModes, Category) {
                const self = this;
                self.mode = ViewModes.view;
                $scope.ViewModes = ViewModes;
                $scope.box = {};

                self.title = $routeParams.title;
                ArticleIndex.get(function successCallback (articles) {
                    // Filter out all but the article we want; viz. the unique
                    // article with the desired title.
                    for (let n = 0; n < articles.length; ++n) {
                        if (self.title === articles[n].title
                                .split(' ').join('-')) {
                            // Make a deep copy of the article for restoration.
                            $scope.box.article = articles[n];
                            self.article = JSON.parse(
                                JSON.stringify(articles[n]));
                            // article titles are unique, so we do not need to
                            // look any further.
                            break;
                        }
                    }

                    // The twitter button doesn't play nicely with normal
                    // Angular data-binding, so this will dynamically inject the
                    // proper title into the tweet.
                    document.getElementsByClassName('twitter-share-button')[0]
                        .setAttribute('data-text', self.article.title);
                    twttr.widgets.load();

                    // Record for use in the View (in the 'Similar' side area)
                    // all other articles within the same category.
                    self.similarArticles = articles.filter(function (article) {
                        return self.article.category === article.category
                            && article._id != self.article._id;
                    });

                    // Get a list of all categories from the server.
                    Category.get(function successCallback (categories) {
                        self.categoryList = categories;
                        // Having saved the list of all categories for use in
                        // the View (in the 'Categories' side area) select the
                        // category corresponding to the current article.
                        for (let n in categories) {
                            if (categories[n].name === self.article.category) {
                                // Make a separate copy of the category.
                                self.category = JSON.parse(
                                    JSON.stringify(categories[n]));
                                $scope.box.category = categories[n];
                                break;
                            }
                        }
                    });
                });

                // Save the base-url in the Controller, so it can be accessed
                // throughout the View and Controller.
                self.serverBaseUrl = ServerConfig.baseUrl;

                // Operations called from within the view

                $scope.enterEditMode = function enterEditMode () {
                    self.mode = ViewModes.edit;
                };

                $scope.cancelEdits = function cancelEdits () {
                    self.mode = ViewModes.view;
                    // Copy the restore version back to the viewed version.
                    $scope.box.article = JSON.parse(
                        JSON.stringify(self.article));
                };

                // Confirm the admin would like to save the updated category
                $scope.saveCategoryChange = function (category) {
                    confirmBefore('change article category to ' + category.name,
                        function confirmedCallback () {
                            $scope.box.article.category = category.name;
                            saveArticle($scope.box.article);
                        }, function elseCallback () {
                            $scope.box.article.category = self.article.category;
                        }
                    );
                };

                // Confirm the admin would like to save the article
                $scope.saveArticleUpdates = function (article) {
                    confirmBefore('save article ' + article.title,
                        function confirmedCallback () {
                            saveArticle(article);
                        }, function elseCallback () {
                        }
                    );
                };

                // Confirm the admin would like to delete the article
                $scope.deleteCurrentArticle = function () {
                    confirmBefore('delete article ' + self.article.title,
                        function confirmedCallback () {
                            deleteArticle(self);
                        }, function elseCallback () {
                        }
                    );
                };

                // Confirm the desired operation, then execute the callback if
                // affirmed.
                function confirmBefore (description, confirmedCallback,
                                        elseCallback) {
                    if (confirm('Are you sure you would like to '
                                + description + '?')) {
                        confirmedCallback();
                    } else {
                        elseCallback();
                    }
                }

                // PUT updates to the current article, saving the new data on
                // the server, and refreshing the local data store.
                function saveArticle (article) {
                    // If the article is (or will be) private, check to see if
                    // all the articles in it's category are private; if they
                    // are, make sure that the category is private.
                    if (article.private && self.similarArticles
                            .filter(a => !a.private).length == 0) {
                        if (!self.category.private) {
                            self.category.private = true;
                            Category.updateCategory(self.category._id,
                                self.category,
                                function successCallback (response) {
                                    // Ensure this article's category reflects
                                    // that on the server.
                                    self.category = JSON.parse(
                                        JSON.stringify(response.data));
                                }, function errorCallback (response) {
                                    console.error(response);
                                }
                            );
                        }
                    }

                    ArticleIndex.updateArticle(article,
                        function successCallback (response) {
                            // Make a copy of the new article
                            self.article = JSON.parse(
                                JSON.stringify(response.data.Success));
                            // And update the view to match the object saved and
                            // returned by the server.
                            $scope.box.article = response.data.Success;
                            ArticleIndex.refresh(function () {
                                self.mode = ViewModes.view;
                            });
                        }, function errorCallback (response) {
                            console.error('Error: ', response);
                        });
                }

                // DELETE the current article, by ID.
                function deleteArticle () {
                    ArticleIndex.deleteArticle(self.article._id,
                        function successCallback (response) {
                            // If successful, just reroute to the article &
                            // category list, making sure to refresh the data
                            // model for both categories and articles before
                            // doing so; admins should always see the most
                            // up-to-date information.
                            ArticleIndex.refresh(function () {
                                Category.refresh(function () {
                                    $window.location = '/admin#!/article-list';
                                });
                            });
                        }, function errorCallback (response) {
                            // If an error occurs, display it and don't navigate
                            // away from the page, so any work can be saved
                            // locally.
                            console.error(response);
                        }
                    );
                }
            }
        ]
    });
})();
