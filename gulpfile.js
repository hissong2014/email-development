var gulp = require('gulp');
var emailBuilder = require('gulp-email-builder');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var runSequence = require('run-sequence');
var removeHtml = require('gulp-remove-html');
var clean = require('gulp-clean');
var nunjucksRender = require('gulp-nunjucks-render');
var concatCss = require('gulp-concat-css');
var data = require('gulp-data');
var rename = require("gulp-rename");

gulp.task('browserSync',function(){
  browserSync.init({
    server:{
      baseDir:"./build"
    }
  });
});

gulp.task('inlineSass', function () {
  return gulp.src('./src/scss/styles-inline.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/'))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('mediaSass',function(){
  return gulp.src('./src/scss/styles-mobile.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('build/'))
  .pipe(browserSync.reload({stream:true}));
});

gulp.task('nunjucks', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('src/*.+(html|nunjucks)')
  // Adding data to Nunjucks
    .pipe(data(function() {
      return require('./src/trackers/links.json')
    }))
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['src/templates']
    }))
  // output files in app folder
  .pipe(gulp.dest('build'))
  .pipe(browserSync.reload({stream:true}))
});

gulp.task('nunjucksMD', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('src/*.+(html|nunjucks)')
  // Adding data to Nunjucks
    .pipe(data(function() {
      return require('./src/trackers/md.json')
    }))
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['src/templates']
    }))
  // output files in app folder
  .pipe(rename("md.html"))
  .pipe(gulp.dest('build'))
  .pipe(browserSync.reload({stream:true}))
});

gulp.task('nunjucksNP', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('src/*.+(html|nunjucks)')
  // Adding data to Nunjucks
    .pipe(data(function() {
      return require('./src/trackers/np.json')
    }))
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['src/templates']
    }))
  // output files in app folder
  .pipe(rename("np.html"))
  .pipe(gulp.dest('build'))
  .pipe(browserSync.reload({stream:true}))
});

gulp.task('nunjucksPA', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('src/*.+(html|nunjucks)')
  // Adding data to Nunjucks
    .pipe(data(function() {
      return require('./src/trackers/pa.json')
    }))
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['src/templates']
    }))
  // output files in app folder
  .pipe(rename("pa.html"))
  .pipe(gulp.dest('build'))
  .pipe(browserSync.reload({stream:true}))
});

gulp.task('nunjucksPHARM', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('src/*.+(html|nunjucks)')
  // Adding data to Nunjucks
    .pipe(data(function() {
      return require('./src/trackers/pharm.json')
    }))
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['src/templates']
    }))
  // output files in app folder
  .pipe(rename("pharm.html"))
  .pipe(gulp.dest('build'))
  .pipe(browserSync.reload({stream:true}))
});

gulp.task('cleanUp', function(){
  return gulp.src('dist/*',{read:false})
  .pipe(clean());
});

gulp.task('cleanUpBuild', function(){
  return gulp.src('build/*',{read:false})
  .pipe(clean());
});

gulp.task('inlineStyles', function(){
  return gulp.src(['./build/*.html'])
  .pipe(emailBuilder().build())
  .pipe(gulp.dest('./dist'));
});

gulp.task('images', function(){
  return gulp.src('./src/images/*')
  .pipe(gulp.dest('./dist/images/'))
  .pipe(gulp.dest('./build/images/'))
  .pipe(browserSync.reload({stream:true}));
});

gulp.task('sass', function (callback) {
  runSequence(['inlineSass','mediaSass'],
    callback
  )

});

gulp.task('build',['cleanUp','sass','nunjucks'], function (callback) {
  runSequence(['inlineStyles','images'],
    callback
  )
});

gulp.task('buildmd',['cleanUp','sass','nunjucksMD'], function (callback) {
  runSequence(['inlineStyles','images'],
    callback
  )
});

gulp.task('buildnp',['cleanUp','sass','nunjucksNP'], function (callback) {
  runSequence(['inlineStyles','images'],
    callback
  )
});

gulp.task('buildpa',['cleanUp','sass','nunjucksPA'], function (callback) {
  runSequence(['inlineStyles','images'],
    callback
  )
});

gulp.task('buildpharm',['cleanUp','sass','nunjucksPHARM'], function (callback) {
  runSequence(['inlineStyles','images'],
    callback
  )
});

gulp.task('watch', ['sass','browserSync','images','nunjucks'], function(){
  gulp.watch('src/scss/*.scss', ['sass']);
  gulp.watch('src/images/*',['images']);
  gulp.watch('src/*.html', ['nunjucks']);
  gulp.watch('src/templates/**/*.+(html|nunjucks)',['nunjucks']);
});

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
});
