'use strict'

var gulp = require('gulp')
var browserify = require('browserify')
var vueify = require('vueify')
var source = require('vinyl-source-stream')

gulp.task('js', function () {
  return browserify('./app/index.js', {bundleExternal: false, builtins: false, commondir: false, insertGlobals: 'global'})
    .transform(vueify)
    .bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('./app/assets/js'))
})


gulp.task('assets', ['js'])
