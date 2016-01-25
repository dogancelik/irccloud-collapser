const fs = require('fs');
const gulp = require('gulp');
const lazypipe = require('lazypipe');
const concat = require('gulp-concat');
const stylus = require('gulp-stylus');
const jade = require('gulp-jade');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const gutil = require('gulp-util');
const plumber = require('gulp-plumber');

// Browserify
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');

// Paths
const pathDest = 'build/';
const pathSrc = 'src/';
const pathLib = 'lib/';

const container = 'container.jade';
const basename = 'collapser';
const suffixUser = '.user';
const suffixMeta = '.meta';
const extJs = '.js';
const userJs = basename + suffixUser + extJs;
const metaJs = basename + suffixMeta + extJs;

// Metadata
const repoName = 'dogancelik/irccloud-collapser';
const iconUrl = 'https://www.irccloud.com/favicon.ico';

var locals = {};
locals.repoName = repoName;
locals.iconUrl = iconUrl;

// Tasks
var replacePipe = lazypipe()
  .pipe(replace, /^\n/gm, '')
  .pipe(replace, '$iconUrl$', iconUrl)
  .pipe(replace, '$repoName$', repoName)
  .pipe(replace, '$metaJs$', metaJs)
  .pipe(replace, '$userJs$', userJs);

function replaceInclude () {
  return lazypipe()
    .pipe(replace, '$includeContainer$', fs.readFileSync(`${pathDest}container.html`))
    .pipe(replace, '$includeStyle$', fs.readFileSync(`${pathDest}style.css`));
}

gulp.task('stylus', function () {
  return gulp
    .src(`${pathSrc}style.styl`)
    .pipe(plumber())
    .pipe(stylus({ compress: true }))
    .pipe(gulp.dest(pathDest));
});

gulp.task('jade', function () {
  return gulp
    .src(`${pathSrc}container.jade`)
    .pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest(pathDest));
});

gulp.task('meta', function () {
  return gulp
    .src(`${pathSrc}${metaJs}`)
    .pipe(replacePipe())
    .pipe(gulp.dest(pathDest));
});

gulp.task('user', ['meta', 'stylus', 'jade'], function () {
  return browserify(`${pathSrc}${userJs}`)
    .transform('babelify', { presets: [ 'es2015' ] })
    .bundle()
    .pipe(source(userJs))
    .pipe(buffer())
    .pipe(replaceInclude()())
    .pipe(gulp.dest(pathDest));
});

gulp.task('concat', ['user'], function () {
  var task = gulp
    .src([`${pathDest}${metaJs}`, `${pathDest}${userJs}`])
    .pipe(concat(userJs))
    .pipe(gulp.dest(pathDest));
  return (process.env.GM_DIR != null ? task.pipe(gulp.dest(process.env.GM_DIR)) : task);
});

gulp.task('watch', ['concat'], function () {
  gulp.watch(`${pathSrc}*.*`, ['concat']);
});

gulp.task('default', ['concat']);
