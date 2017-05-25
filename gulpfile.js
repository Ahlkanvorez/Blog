(function () {
    'use strict';

    /* For more information on gulp, see:
     * - https://medium.com/@dickeyxxx/best-practices-for-building-angular-js-apps-266c1a4a6917#.qqvku5dxw
     * - http://gulpjs.com/
     */
    var gulp = require('gulp');
    var concat = require('gulp-concat');
    var sourcemaps = require('gulp-sourcemaps');
    var ngAnnotate = require('gulp-ng-annotate');
    var uglify = require('gulp-uglify');

    /* Turn off sourcemaps once this section is completed. It doubles the size of the js file,
         and is only needed for testing. */

    /* Concatenate all the requisite files for either of the angular apps. */
    gulp.task('js', function () {
        /* Make file for public app */
        gulp.src(['public/js/twitter.js',
            'public/js/blog-app/**/*.module.js',
            'public/js/blog-app/**/*.js'])
            .pipe(concat('blog-app.js'))
//            .pipe(sourcemaps.init())
            .pipe(ngAnnotate())
            .pipe(uglify())
//            .pipe(sourcemaps.write())
            .pipe(gulp.dest('./public'));

        /* Make file for admin app */
        gulp.src(['public/js/twitter.js',
            'public/js/blog-admin-app/**/*.module.js',
            'public/js/blog-admin-app/**/*.js'])
            .pipe(concat('blog-admin-app.js'))
//            .pipe(sourcemaps.init())
            .pipe(ngAnnotate())
            .pipe(uglify())
//            .pipe(sourcemaps.write())
            .pipe(gulp.dest('./public'));
    });

    /* Watch for changes in either the admin or normal app. */
    gulp.task('watch', ['js'], function () {
        gulp.watch('public/js/blog-app/**/*.js');
        gulp.watch('public/js/blog-admin-app/**/*.js');
    });
})();
