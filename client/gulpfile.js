var args = require('yargs').argv;
var bower = require('bower');
var cleanCss = require('gulp-clean-css');
var concat = require('gulp-concat');
var fsp = require('fs-promise');
var gulp = require('gulp');
var gutil = require('gulp-util');
var inject = require('gulp-inject');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sh = require('shelljs');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('serve:before', [
  'env',
  'sass',
  'inject',
  'watch'
]);

gulp.task('default', ['env', 'sass']);

gulp.task('env', function (done) {
  var env = args.env || 'development';
  var srcpath = './www/env/' + env + '.js';
  var destpath = './www/env/env.js';
  fsp.copy(srcpath, destpath, { clobber: true })
  .then(done);
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(cleanCss({ keepSpecialComments: 0 }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('inject', function(done) {
  gulp.src('./www/index.html')
    .pipe(inject(gulp.src('./www/app/**/*.js', { read: false }), {
      name: 'app',
      ignorePath: '/www/',
      relative: true
    }))
    .pipe(inject(gulp.src('./www/components/**/*.js', { read: false }), {
      name: 'components',
      ignorePath: '/www/',
      relative: true
    }))
    .pipe(gulp.dest('./www'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
