(function () {
    'use strict';

    /* For more information on gulp, see:
     * - https://medium.com/@dickeyxxx/best-practices-for-building-angular-js-apps-266c1a4a6917#.qqvku5dxw
     * - http://gulpjs.com/
     */
    var gulp = require('gulp');
    var concat = require('gulp-concat');
    var ngAnnotate = require('gulp-ng-annotate');
    var babili = require('gulp-babili');

    /* Concatenate all the requisite files for either of the angular apps. */
    gulp.task('js', function () {
        /* Make file for public app */
        gulp.src(['public/angularJS/twitter.js',
            'public/angularJS/blog-app/**/*.module.js',
            'public/angularJS/blog-app/**/*.js'])
            .pipe(concat('blog-app.js'))
            .pipe(babili({ mangle: { keepClassName: true } }))
            .pipe(ngAnnotate())
            .pipe(gulp.dest('./public'));

        /* Make file for admin app */
        gulp.src(['public/angularJS/twitter.js',
            'public/angularJS/blog-admin-app/**/*.module.js',
            'public/angularJS/blog-admin-app/**/*.js'])
            .pipe(concat('blog-admin-app.js'))
            .pipe(babili({ mangle: { keepClassName: true } }))
            .pipe(ngAnnotate())
            .pipe(gulp.dest('./public'));
    });

    /* Watch for changes in either the admin or normal app. */
    gulp.task('watch', ['js'], function () {
        gulp.watch('public/angularJS/blog-app/**/*.js');
        gulp.watch('public/angularJS/blog-admin-app/**/*.js');
    });
})();
