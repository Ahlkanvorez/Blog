(function () {
    'use strict';

    /* For more information on gulp, see:
     * - https://medium.com/@dickeyxxx/best-practices-for-building-angular-js-apps-266c1a4a6917#.qqvku5dxw
     * - http://gulpjs.com/
     * - https://stackoverflow.com/questions/34103905/minify-not-transpile-es2015-code-with-gulp
     */
    var gulp = require('gulp');
    var concat = require('gulp-concat');
    var babel = require('gulp-babel');

    /* Turn off sourcemaps once this section is completed. It doubles the size of the js file,
         and is only needed for testing. */

    /* Concatenate all the requisite files for either of the angular apps. */
    gulp.task('js', function () {
        /* Make file for public app */
        gulp.src(['public/js/twitter.js',
            'public/js/blog-app/**/*.module.js',
            'public/js/blog-app/**/*.js'])
            .pipe(concat('blog-app.js'))
            .pipe(babel({presets: ['babili']}))
            .pipe(gulp.dest('./public'));

        /* Make file for admin app */
        gulp.src(['public/js/twitter.js',
            'public/js/blog-admin-app/**/*.module.js',
            'public/js/blog-admin-app/**/*.js'])
            .pipe(concat('blog-admin-app.js'))
            .pipe(babel({presets: ['babili']}))
            .pipe(gulp.dest('./public'));
    });

    /* Watch for changes in either the admin or normal app. */
    gulp.task('watch', ['js'], function () {
        gulp.watch('public/js/blog-app/**/*.js');
        gulp.watch('public/js/blog-admin-app/**/*.js');
    });
})();
