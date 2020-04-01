const { src, dest, series } = require('gulp');
const fileinclude = require('gulp-file-include');
const concat = require('gulp-concat');
const clean = require('gulp-clean');

function includeHtmlComponents() {
  return src(['src/index.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(dest('./dist/'));
}

function concatCss() {
  return src(['src/css/base.css', 'src/css/custom.css', 'src/css/components/*'])
    .pipe(concat('style.css'))
    .pipe(dest('./tmp/'));
}

function removeTmpFiles() {
  return src('./tmp', { read: false })
    .pipe(clean());
}

exports.default = series(concatCss, includeHtmlComponents, removeTmpFiles);