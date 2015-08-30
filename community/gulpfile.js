/*global -$ */
'use strict';
// generated on 2015-04-08 using generator-sisyphus-game 0.0.2

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var path = require('path');

var browserify = require('browserify'),
  reactify = require('reactify'),
  source = require('vinyl-source-stream');

var config = require('./package.json'),
    name = config.name;

gulp.task('styles', function() {
  return gulp.src('src/less/**/*.less')
    .pipe($.less({
      paths: [ path.join(__dirname, 'less', 'includes')]
    }))
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    .pipe(gulp.dest('.tmp/' + name + '/css'));
});

gulp.task('images', function () {
  return gulp.src('src/img/**/*')
    .pipe(gulp.dest(path.join('../../front/static/', 'img', name)));
});

gulp.task('html', ['styles'], function () {
  var assets = $.useref.assets({
    searchPath: ['.tmp/' + name, 'node_modules/*', 'src/js']
  });
  return gulp.src('src/html/**/*.html')
    .pipe(assets)
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist/' + name));
});

gulp.task('submit-html', ['styles'], function () {
  var assets = $.useref.assets({
    searchPath: ['.tmp/' + name, 'node_modules/*', 'src/js']
  });
  return gulp.src('src/html/**/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist/' + name));
});

gulp.task('b-i', ['images', 'browserify'], function() {
  gulp.start('copy');
});

gulp.task('copy-dist-css', function() {
  return gulp.src(path.join(__dirname, 'dist', name, 'css/**/*'))
    .pipe(gulp.dest(path.join('../../front/static/', 'css')));
});

gulp.task('copy-css', function() {
  return gulp.src(path.join(__dirname, 'src/css/**/*'))
    .pipe(gulp.dest(path.join('../../front/static/', 'css', name)));
});

gulp.task('copy-dist-js', function() {
  return gulp.src(path.join(__dirname, 'dist', name, 'js/**/*'))
    .pipe(gulp.dest(path.join('../../front/static/', 'js')));
});

gulp.task('copy-html', function() {
  return gulp.src(path.join(__dirname, 'dist', name, '/**/*.html'))
    .pipe(gulp.dest(path.join('../../front/tpls/', name)));
});

gulp.task('browserify', function() {
  return  browserify(path.join(__dirname, 'src/js', 'app.js'))
    .transform(reactify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('dist/' + name + '/js/' + name));
});

gulp.task('copy', ['copy-dist-css', 'copy-css', 'copy-dist-js', 'copy-html'], function() {

});

gulp.task('build', ['html'], function () {
  gulp.start('b-i');
});

gulp.task('build-submit', ['submit-html'], function () {
  gulp.start('b-i');
});

gulp.task('clean', require('del').bind(null, ['.tmp/' + name, 'dist/' + name,
  path.resolve('../../front/static/css/' + name),
  path.resolve('../../front/static/js/' + name),
  path.resolve('../../front/static/img/' + name),
  path.resolve('../../front/tpls/' + name)
], {
  force: true
}));

gulp.task('default', ['clean'], function () {
  gulp.start('build');
  gulp.watch(['src/js/**/*.js', 'src/css/**/*.css', 'src/less/**/*.less',
    'src/img/**/*', 'src/html/**/*.html'
  ], function() {
    gulp.start('build');
  })
});

gulp.task('submit', ['clean'], function () {
  gulp.start('build-submit');
});