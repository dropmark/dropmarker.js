var gulp = require('gulp'),
  bundle = require('gulp-bundle-assets'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify');

gulp.task('default', function() {
  return gulp.src('./bundle.config.js')
    .pipe(bundle())
    .pipe(gulp.dest('./dist'))
    .pipe(uglify())
    .pipe(rename('dropmarker.min.js'))
    .pipe(gulp.dest('./dist'));
});