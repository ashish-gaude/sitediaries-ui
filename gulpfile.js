var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var pkg = require('./package.json');

// Set the banner content
var banner = ['/*!\n',
  ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' * Licensed under <%= pkg.license %> \n',
  ' */\n',
  ''
].join('');

// Compiles SCSS files from /scss into /css
gulp.task('sass', function () {
  return gulp.src('src/scss/opalus-sitediaries.scss')
    .pipe(sass())
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Minify compiled CSS
gulp.task('minify-css', ['sass'], function () {
  return gulp.src('src/css/opalus-sitediaries.css')
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Minify custom JS
gulp.task('minify-js', function () {
  return gulp.src('src/js/opalus-sitediaries.js')
    .pipe(uglify())
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('src/js'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Copy vendor files from /node_modules into /vendor
// NOTE: requires `npm install` before running!
gulp.task('copy', function () {
  gulp.src([
    'node_modules/materialize-css/dist/**/*',
    '!**/npm.js',
    '!**/bootstrap-theme.*',
    '!**/*.map',
    '!**/*.css'
  ])
    .pipe(gulp.dest('src/vendor/materialize'))
})


gulp.task('sass-mat', function () {
  return gulp.src('src/scss/materialize/materialize.scss')
    .pipe(sass())
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(gulp.dest('src/vendor/materialize/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('copy-mat-sass', function () {
  gulp.src([
    'node_modules/materialize-css/sass/**/*'
  ])
    .pipe(gulp.dest('src/scss/materialize'))
})

// Minify compiled CSS
gulp.task('minify-css-mat', ['sass-mat'], function () {
  return gulp.src('src/vendor/materialize/css/materialize.css')
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('src/vendor/materialize/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});


// Default task
gulp.task('default', ['sass', 'minify-css', 'minify-js', 'copy', 'copy-mat-sass']);

// Configure the browserSync task
gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: './src'
    },
  })
})

// Dev task with browserSync
gulp.task('dev', ['browserSync', 'sass', 'minify-css', 'minify-js', 'minify-css-mat'], function () {
  gulp.watch('src/scss/*.scss', ['sass']);
  gulp.watch('src/css/*.css', ['minify-css']);
  gulp.watch('src/js/*.js', ['minify-js']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('src/**/*.html', browserSync.reload);
  gulp.watch('src/js/**/*.js', browserSync.reload);
});
