(function () {
  'use strict';

  angular.
    module('articleView').
    component('articleView', {
      templateUrl : '/js/blog-app/article-view/article-view.template.html',
      controller : ['$scope', '$routeParams', 'ArticleIndex', 'Category',
        function articleViewController($scope, $routeParams, ArticleIndex, Category) {
          var self = this;

          self.articleId = $routeParams.articleId;
          ArticleIndex.get(function successCallback (articleList) {
            for (var n = 0; n < articleList.length; ++n) {
              if (self.articleId === articleList[n]._id) {
                self.article = articleList[n];
              }
            }

            self.similarArticles = articleList.filter(function (article, n, list) {
              return article.category === self.article.category && article._id != self.articleId;
            });

            if (!self.article) {
              console.error('Invalid article id: %d.', self.articleId);
              return;
            }

            var categoryName = self.article.category;
            if (!categoryName) {
              categoryName = 'Miscellany';
            }

            // Get a list of all categories from the server.
            Category.get(function successCallback (categories) {
              self.categoryList = categories;
              for (var n in categories) {
                if (categories[n].name === self.article.category) {
                  self.category = categories[n];
                  break;
                }
              }
            });
          });
        }
      ]
    });
})();