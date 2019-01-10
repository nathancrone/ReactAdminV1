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
                './node_modules/bootstrap-sass/assets/stylesheets', 
                './node_modules/toastr'
            ]
        }).on('error', $.sass.logError)).pipe(gulp.dest('./wwwroot/assets/css'));
});

gulp.task('bundle-libs', function () {
    browserify()
        .require('jquery', { expose: 'jquery' })
        .require('lodash', { expose: 'lodash' })
        .require('object-assign', { expose: 'object-assign' })
        .require('react', { expose: 'react' })
        .require('react-router', { expose: 'react-router' })
        .require('flux', { expose: 'flux' })
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle-libs.js'))
        .pipe(gulp.dest('./wwwroot/assets/js'));
});

gulp.task('bundle-react-admin', function () {
    browserify('./assets/js/react_admin/main.js')
        .transform(reactify)
        .external('jquery')
        .external('lodash')
        .external('object-assign')
        .external('react')
        .external('react-router')
        .external('flux')
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle-react-admin.js'))
        .pipe(gulp.dest('./wwwroot/assets/js'));
});

gulp.task('default', [
    'fonts', 
    'bundle-libs',
    'bundle-react-admin', 
    'bundle-styles-global'
], function () {

});