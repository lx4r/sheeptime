'use strict'

var gulp = require('gulp')
var browserify = require('browserify')
var vueify = require('vueify')
var source = require('vinyl-source-stream')

gulp.task('main-window', function () {
  return browserify('./app/main-window.js', {bundleExternal: false, builtins: false, commondir: false, insertGlobals: 'global'})
    .transform(vueify)
    .bundle()
    .pipe(source('main-window.js'))
    .pipe(gulp.dest('./app/assets/js'))
})

gulp.task('projects-window', function () {
  return browserify('./app/projects-window.js', {bundleExternal: false, builtins: false, commondir: false, insertGlobals: 'global'})
    .transform(vueify)
    .bundle()
    .pipe(source('projects-window.js'))
    .pipe(gulp.dest('./app/assets/js'))
})

gulp.task('js', ['main-window', 'projects-window'])
