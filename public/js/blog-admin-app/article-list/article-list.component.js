(function () {
  'use strict';

  /* Register 'articleList' component, along with it's associated
        controller and template */
  angular.
    module('articleList').
    component('articleList', {
      templateUrl : '/js/blog-admin-app/article-list/article-list.template.html',
      controller : ['$scope', '$window', '$routeParams', 'ArticleIndex', 'ServerConfig', 'Category', 'ViewModes',
        function ArticleListController($scope, $window, $routeParams, ArticleIndex, ServerConfig, Category, ViewModes) {
          var self = this;
          var operation = $routeParams.operation;
          var author = $routeParams.authorName;
          var articleId = $routeParams.articleId;
          var dateStart = $routeParams.startDate;
          var dateEnd = $routeParams.endDate;

          /*
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

          this.serverBaseUrl = ServerConfig.baseUrl;
          this.mode = ViewModes.view;

          $scope.box = {};

          // Pull a list of categories from the server.
          Category.get(function successCallback (categories) {
            // Pick the current category from the category list.
            self.categoryList = categories;
            for (var n in categories) {
              if (categories[n].name === self.categoryName) {
                // For reference, make a separate copy of the category.
                self.category = JSON.parse(JSON.stringify(categories[n]));
                $scope.box.category = categories[n];
                break;
              }
            }
          });

          ArticleIndex.get(function successCallback(articleList) {
            self.articles = articleList;
            filterArticles();

/*
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
            self.articles = self.allArticles.
              slice($scope.page * ARTICLES_PER_PAGE,
                  ($scope.page + 1) * ARTICLES_PER_PAGE);
          }; */

          /*
            Functions called by the View
          */

          $scope.enterEditMode = function enterEditMode () {
            self.mode = ViewModes.edit;
          };

          $scope.exitEditMode = function exitEditMode () {
            // Restore the editing category to it's original state.
            $scope.box.category = JSON.parse(JSON.stringify(self.category));
            self.mode = ViewModes.view;
          };

          $scope.viewNextPage = function viewNextPage () {
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

          $scope.viewPreviousPage = function viewPreviousPage () {
            if ($scope.page > 0) {
              $scope.page--;
              displayArticlesForPage();

              // For use in hiding buttons
              $scope.hasNextPage = true;
            }
            /* Not an else, because we always want to check
              if we need to disable a button. */
            if ($scope.page <= 0) {
              // For use in hiding buttons
              $scope.hasPreviousPage = false;
            }
          }

          /*
            DELETE operations
          */

          $scope.deleteCategory = function deleteCategory () {
            if (self.categoryName === 'Everything' || self.categoryName === 'Miscellany') {
              alert('Sorry, but even you cannot delete the "Everything" category, or the "Miscellany" category.');
              return;
            }
            if (confirm('Are you sure you would like to delete the category "' + self.categoryName
                        + '", and move all the articles therein to the category "Miscellany"?')) {
              Category.deleteCategory(self.category._id,
                function successCallback (response) {
                  self.articles.forEach(function (article) {
                    article.category = 'Miscellany';
                    ArticleIndex.updateArticle(article);
                  });
                  refreshAll('/admin#!/article-list/Miscellany');
                }, function errorCallback (response) {
                  console.log('Uh oh ...', response);
                }
              );
            }
          };

          /*
            PUT operations
          */

          $scope.saveCategory = function saveCategory () {
            var updates = $scope.box.category;
            Category.updateCategory(self.category._id, updates,
              function successCallback (response) {
                self.mode = ViewModes.view;
                // Save a distinct copy of the saved category for reference.
                self.category = JSON.parse(JSON.stringify(response.data));
                $scope.box.category = response.data;
              }, function errorCallback (response) {
                console.error(response);
              }
            );
          };

          /* 
            POST operations
          */

          $scope.newCategory = function newCategory () {
            Category.createCategory(
              function successCallback (response) {
                self.category = response.data.Ok;
                self.articles = [];

                refreshAll('/admin#!/article-list/' + self.category.name);
              }, function errorCallback (response) {
                console.error(response);
              }
            );
          };

          $scope.newArticle = function newArticle () {
            /* Create a new, templated article on the server,
                 then naviagate to view it for editing purposes. */
            ArticleIndex.createArticle(self.categoryName,
              function successCallback (response) {
                var articleId = response.data.Ok._id;
                refreshAll('/admin#!/articles/' + articleId);
              }, function errorCallback(response) {
                alert("Oops! It seems there's something wrong with the server. Try again in a few moments.");
              }
            );
          };

          /*
            GET operations
          */

          /* GET a list of articles by category within a specified range of dates. */
          function getArticlesByDateRange (category, start, end) {
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
          function getArticlesByAuthor (category, author) {
            self.articles = self.articles.filter(function (article, n, list) {
              return (category === 'Everything' || article.category === self.categoryName) && 
                  article.author.name === author;
            });
            displayArchiveDates();
          }

          /* GET a list of articles by category. */
          function getArticlesByCategory (categoryName) {
            self.articles = self.articles.filter(function (article) {
              return categoryName === 'Everything' ||
                  (article.category === categoryName);
            });
            // When searching within a category, limit archive
            //      searches to that category for convenience.
            displayArchiveDates();
            displayAuthorNames();
          }

          /*
            Miscellaneous helping functions
          */

          function filterArticles () {
            if (dateStart && dateEnd) {
              getArticlesByDateRange(self.categoryName, dateStart, dateEnd);
            } else if (author) {
              getArticlesByAuthor(self.categoryName, author);
            } else if (self.categoryName) {
              getArticlesByCategory(self.categoryName);
            }
          }

          function refreshAll (newUrl) {
            ArticleIndex.refresh(function () {
              Category.refresh(function () {
                $window.location = newUrl;
                filterArticles();
              });
            });
          }

          function displayArchiveDates () {
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
            angular.forEach(dateSet, function(value, key) {
              self.dates.push({
                start : new Date(key), // Construct a date because the key is a String.
                end : value
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
              /* Otherwise, since only one author is selected, 
                  don't load an author list, and only load that author's
                  articles. */
              var authorsArticles = [];
              self.articles.forEach(function (article, n, articleList) {
                if (article.author.name === self.authorName) {
                  self.articles.push(article);
                }
              });
            }
          }

        }
      ]
    });
})();