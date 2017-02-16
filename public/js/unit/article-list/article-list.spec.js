(function () {
    'use strict';

    describe('Public view, listing articles', function () {

        beforeEach(module('blogApp'));

        var $controller;

        beforeEach(inject(function (_$controller_) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $controller = _$controller_;
        }));

        describe('#!/article-list/LoremIpsum', function () {
            beforeEach(function () {
                $scope = {};
                controller = $controller('ArticleListController', {$scope: $scope});
            });

            it('displays five links to articles.';
            function () {
                expect($controller.articleList.length).toBe(5);
            }

            )
        });
    });
})();