"use strict";

var gulp = require('gulp'), $ = require('gulp-load-plugins')();
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var reactify = require('reactify');

gulp.task('fonts', function () {
    return gulp.src([
        './node_modules/bootstrap-sass/assets/fonts/bootstrap/glyphicons-halflings-regular.*'
    ])
        .pipe(gulp.dest('./wwwroot/assets/fonts'));
});

gulp.task('bundle-styles-global', [], function () {
    return gulp.src('./assets/sass/**/*.scss')
        .pipe($.sass({
            includePaths: [
                './node_modules/bootstrap-sass/assets/stylesheets'
            ]
        }).on('error', $.sass.logError)).pipe(gulp.dest('./wwwroot/assets/css'));
});

gulp.task('bundle-libs', function () {
    browserify()
        .require('jquery', { expose: 'jquery' })
        .require('react', { expose: 'react' })
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle-libs.js'))
        .pipe(gulp.dest('./wwwroot/assets/js'));
});

gulp.task('bundle-app', function () {
    browserify('./assets/js/app/app.js')
        .transform(reactify)
        .external('jquery')
        .external('react')
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle-app.js'))
        .pipe(gulp.dest('./wwwroot/assets/js'));
});

gulp.task('default', [
    'fonts', 
    'bundle-libs',
    'bundle-app', 
    'bundle-styles-global'
], function () {

});