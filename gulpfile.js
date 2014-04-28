var gulp = require('gulp');

var pkg = require('./package.json');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var compass = require('gulp-compass');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var runSequence = require('gulp-run-sequence');
var usemin = require('gulp-usemin');
var jshitStylishReporter = require('jshint-stylish');

var paths = {
    scripts: ['./js/**/*.js']
};

gulp.task('clean', function() {
    return gulp.src('build').pipe(clean());
});

gulp.task('compass', function() {
    // Compile the SASS
    return gulp.src('./sass/*.scss')
        .pipe(compass({
            config_file: './config.rb',
            style: 'compact',
            comments: false,
            debug: false
        }))
        .pipe(gulp.dest('css'));
});

gulp.task('css', function() {
    // minifies CSS
    return gulp.src('./css/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('build/css'));
});

gulp.task('styles', function(cb) {
    runSequence('compass', 'css', cb);
});

gulp.task('jshint', function() {
    return gulp.src([
            'gulpfile.js',
            'js/jquery.mediaQueryBreakDetector.js',
            'js/jquery.extractCoordinateFromMouseEvent.js',
            'js/jquery.equalizeHeights.js',
            'js/jquery.gentlyScrollTo.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('usemin', function() {
    gulp.src('./*.html')
        .pipe(usemin({
            css: [minifyCSS(), 'concat'],
            js: [uglify({ preserveComments: 'some' })]
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('copy-files', function() {
    gulp.src(['fonts/**'])
        .pipe(gulp.dest('build/fonts'));
    gulp.src(['images/**'])
        .pipe(gulp.dest('build/images'));
    gulp.src(['favicon.ico', 'package.json'])
        .pipe(gulp.dest('build/'));
});


// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts', 'styles']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', function(cb) {
    runSequence(['clean', 'jshint', 'compass', 'copy-files'], 'usemin', cb);
});