(function () {
    'use strict';

    /** Define the 'blogApp' module.
     * - ngRoute is needed for the controllers to determine parameters passed, such as which category of articles should
     *         be listed, or what the ID of the article requested to be displayed is.
     *
     * - core contains all code which contacts the server, and any requesting of articles or categories happens through it.
     *
     * - articleList, articleView, and aboutView each contain their respective Views and Controllers.
     */
    angular.module('blogApp', [
        'ngRoute',
        'updateMeta',
        'core',
        'articleList',
        'articleView',
        'aboutView'
    ]);
})();