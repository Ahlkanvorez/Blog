(function () {
  'use strict';

  angular.
    module('articleView').
    component('articleView', {
      templateUrl : '/js/blog-admin-app/article-view/article-view.template.html',
      controller : ['$sanitize', '$window', '$scope', '$routeParams', 'ArticleIndex', 'ServerConfig', 'ViewModes', 'Category',
        function articleViewController($sanitize, $window, $scope, $routeParams, ArticleIndex, ServerConfig, ViewModes, Category) {
          var self = this;
          self.mode = ViewModes.view;
          $scope.ViewModes = ViewModes;
          $scope.box = {};

          self.articleId = $routeParams.articleId;
          ArticleIndex.get(function successCallback (articles) {
            // Filter out all but the article we want.
            var article = articles.filter(function (article, n, list) {
              return article._id === self.articleId;
            })[0];

            var category = article.category;

            self.similarArticles = articles.filter(function (article, n, list) {
              return category === article.category && article._id != self.articleId;
            });

            // Make a deep copy of the article to restore back to.
            self.article = JSON.parse(JSON.stringify(article));
            $scope.box.article = article;

            var categoryName = article.category;
            if (!categoryName) {
              categoryName = 'Miscellany';
            }

            // Get a list of all categories from the server.
            Category.get(function successCallback (categories) {
                self.categoryList = categories;
                for (var n in categories) {
                  if (categories[n].name === self.article.category) {
                    // For reference, make a separate copy of the category.
                    self.category = JSON.parse(JSON.stringify(categories[n]));
                    $scope.box.category = categories[n];
                    break;
                  }
                }
              });
          });

          self.serverBaseUrl = ServerConfig.baseUrl;

          /*
            Operations called from within the view
          */

          $scope.saveCategoryChange = function saveCategoryChange (category) {
            confirmBeforeSavingCategoryChange(category);
          };

          $scope.saveArticleUpdates = function saveArticleUpdates (article) {
            confirmBeforeSavingArticle(article);
          };

          $scope.saveCommentUpdates = function saveCommentUpdates (comment) {
            confirmBeforeSavingComment(comment);
          };

          $scope.enterEditMode = function enterEditMode () {
            self.mode = ViewModes.edit;
          };

          $scope.cancelEdits = function cancelEdits () {
            self.mode = ViewModes.view;
            // Copy the restore version back to the viewed version.
            $scope.box.article = JSON.parse(JSON.stringify(self.article));
          };

          $scope.deleteCurrentArticle = function deleteCurrentArticle () {
            confirmBeforeDeletingArticle();
          };

          $scope.deleteCommentById = function deleteCommentById (id) {
            confirmBeforeDeletingComment(id);
          };

          /*
            Helper functions for verification
          */

          /* Confirm the admin would like to save the updated category */
          function confirmBeforeSavingCategoryChange(category) {
            confirmBefore('change article category to ' + category.name, function confirmedCallback() {
              $scope.box.article.category = category.name;
              saveArticle($scope.box.article);
            }, function elseCallback () {
              $scope.box.article.category = self.article.category;
            });
          }

          /* Confirm the admin would like to save a comment */
          function confirmBeforeSavingComment(comment) {
            confirmBefore('save comment ' + comment._id, function confirmedCallback() {
              saveComment(comment);
            }, function elseCallback() {
            });
          }

          /* Confirm the admin would like to delete a comment */
          function confirmBeforeDeletingComment(commentId) {
            confirmBefore('delete comment ' + commentId, function confirmedCallback() {
              deleteComment(commentId);
            }, function elseCallback() {
            });
          }

          /* Confirm the admin would like to save the article */
          function confirmBeforeSavingArticle(article) {
            confirmBefore('save article ' + article._id, function confirmedCallback() {
              saveArticle(article);
            }, function elseCallback() {
            });
          }

          /* Confirm the admin would like to delete the article */
          function confirmBeforeDeletingArticle() {
            confirmBefore('delete article ' + self.articleId, function confirmedCallback() {
              deleteArticle(self);
            }, function elseCallback() {
            });
          }

          /* Confirm the desired operation, then execute the callback if affirmed. */
          function confirmBefore(description, confirmedCallback, elseCallback) {
            if (confirm('Are you sure you would like to ' + description + '?')) {
              confirmedCallback();
            } else {
              elseCallback();
            }
          }

          /*
            SAVE operations:
              - PUT a comment by ID from the current article
          */

          /* PUT updates to the current article, saving the new data on the server,
                  and refreshing the local data store. */
          function saveArticle(article) {
            /* If the article is (or will be) private, check to see if all
                the articles in it's category are private; if they are, make
                sure that the category is private. */
            if (article.private &&
                self.similarArticles.filter(function (a) { return !a.private; })
                  .length == 0) {
              if (!self.category.private) {
                self.category.private = true;
                Category.updateCategory(self.category._id, self.category,
                  function successCallback (response) {
                    // Ensure this article's category reflects that on the server.
                    self.category = JSON.parse(JSON.stringify(response.data));
                  }, function errorCallback (response) {
                    console.error(response);
                  }
                );
              }
            }

            ArticleIndex.updateArticle(article,
              function successCallback (response) {
                // Make a copy of the new article
                self.article = JSON.parse(JSON.stringify(response.data.Success));
                // And update the view to match the object saved and returned by the server.
                $scope.box.article = response.data.Success;
                ArticleIndex.refresh(function () {
                  self.mode = ViewModes.view;
                });
              }, function errorCallback (response) {
                console.log('Error: ', response);
              });
          }

          /*
            DELETE operations:
              - DELETE the current article, by ID.
          */

          /* DELETE the current article, by ID. */
          function deleteArticle() {
            ArticleIndex.deleteArticle(self.article._id,
              function successCallback(response) {
                // If successful, just reroute to the article & category list.
                ArticleIndex.refresh(function () {
                  Category.refresh(function () {
                    $window.location = '/admin#!/article-list';
                  });
                });
              }, function errorCallback(response) {
                // If an error occurrs, display it and don't navigate away from the page,
                //    so any work can be saved locally.
                console.log(response);
              }
            );
          }
        }
      ]
    });
})();