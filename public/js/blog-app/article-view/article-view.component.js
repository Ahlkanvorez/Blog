(function () {
    'use strict';

    /** Defines the ArticleView module, and registers it with the module, which contains the View in
     *     an HTML file (/js/blog-app/article-view/article-view.template.html), with the associated Controller in this
     *     file.
     * - $routeParams is used to access the title of the article which is to be displayed.
     * - ArticleIndex is used to access the articles from the server, and acts like a REST API with a GET function.
     * - Category is used to access the categories from the server, and acts like a REST API with a GET function.
     */
    angular.module('articleView').component('articleView', {
        templateUrl: '/js/blog-app/article-view/article-view.template.html',
        controller: ['$routeParams', 'ArticleIndex', 'Category',
            function articleViewController($routeParams, ArticleIndex, Category) {
                const self = this;

                /* Check what the name of the desired article is. */
                self.title = $routeParams.title;
                ArticleIndex.get(function successCallback(articleList) {
                    /* Look through all the articles from the server, and save the desired one. */
                    for (var n = 0; n < articleList.length; ++n) {
                        if (self.title === articleList[n].title.split(' ').join('-')) {
                            self.article = articleList[n];
                            break; /* article titles are unique, so we do not need to look any further. */
                        }
                    }

                    /* Save all the other articles in the same category as the one being displayed, to be listed as
                          'similar articles' on the page. */
                    self.similarArticles = articleList.filter(function (article) {
                        return article.category === self.article.category && article._id != self.article._id;
                    });

                    /* This really shouldn't ever be the case ... but if somehow no article is found with the given ID,
                         log an error, and redirect to the home (#!/article-list) page. */
                    if (!self.article) {
                        console.error('Invalid title: %s.', self.title);
                        // TODO: Redirect to #!/article-list
                        return;
                    }

                    /* Record the name of the category of the current article, and if it doesn't have one,
                        then it belongs to the category 'Miscellany'. */
                    const categoryName = self.article.category ? self.article.category : 'Miscellany';

                    /* Get a list of all categories from the server. */
                    Category.get(function successCallback(categories) {
                        /* Record the list of categories, so they can be displayed under the 'Categories' tab in
                              the View. */
                        self.categoryList = categories;
                        for (var n in categories) {
                            /* Find the full category data for the category of the current article, so that the
                                 'About' section in the View can be filled (that information is saved in the Category). */
                            if (categories[n].name === categoryName) {
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
