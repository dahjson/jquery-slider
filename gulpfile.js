// require plugins
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const changed = require('gulp-changed');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const browsersync = require('browser-sync').create();

// html task
function htmlTask(src, dest) {
  gulp.src(src)
    .pipe(plumber())
    .pipe(changed(dest, {extension: '.html'}))
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest(dest))
    .pipe(browsersync.stream({match: '**/*.html'}));
}

gulp.task('html', function() {
  htmlTask('./src/*.pug', './dist/');
});

// css task
function cssTask(src, dest) {
  gulp.src(src)
    .pipe(plumber())
    .pipe(changed(dest, {extension: '.css'}))
    .pipe(sass())
    .pipe(autoprefixer({browsers: ['last 4 versions']}))
    .pipe(cleancss())
    .pipe(gulp.dest(dest))
    .pipe(browsersync.stream({match: '**/*.css'}));
}

gulp.task('css', function() {
  cssTask('./src/*.scss', './dist/');
});

// js task
function jsTask(src, dest) {
  gulp.src(src)
    .pipe(plumber())
    .pipe(changed(dest, {extension: '.js'}))
    .pipe(babel({presets: ['env']}))
    .pipe(uglify())
    .pipe(gulp.dest(dest))
    .pipe(browsersync.stream({match: '**/*.js'}));
}

gulp.task('js', function() {
  jsTask('./src/*.js', './dist/');
});

// start server
gulp.task('server', function() {
  browsersync.init({
    server: './dist/', // static server
    open: false
  });
});

// watch task
gulp.task('watch', function() {
  gulp.watch('./src/**/*.pug', ['html']);
  gulp.watch('./src/**/*.scss', ['css']);
  gulp.watch('./src/**/*.js', ['js']);
});

// default task
gulp.task('default', ['server', 'watch']);
