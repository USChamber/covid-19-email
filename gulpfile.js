const { src, dest, watch, series, parallel } = require('gulp');
const fileinclude = require('gulp-file-include');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const gls = require('gulp-live-server');

const files = {
  html: {
    dev: ['./src/index.html'],
    components: ['./src/components/*.html']
  },
  css: {
    dev: ['./src/css/base.css', './src/css/custom.css', './src/components/*.css'],
    tmp: {
      name: 'style.css',
      path: './.tmp'
    }  
  },
  dest: {
    path: './dist'
  }
}

function includeHtmlComponents() {
  return src(files.html.dev)
    .pipe(fileinclude({
      prefix: '##',
      basepath: '@file'
    }))
    .pipe(dest(files.dest.path));
}

function concatCss() {
  return src(files.css.dev)
    .pipe(concat(files.css.tmp.name))
    .pipe(dest(files.css.tmp.path));
}

function removeTmpFiles() {
  return src([files.css.tmp.path], { read: false })
    .pipe(clean());
}

function startServer() {
  const server = gls.static(files.dest.path, 3256);
  server.start();
  console.log('watching the following files', [...files.html.dev, ...files.css.dev]);
  watch([...files.html.dev, ...files.css.dev, ...files.html.components], series(concatCss, includeHtmlComponents, removeTmpFiles));
}

function build() {
  console.log('building fresh copy...');
  return series(concatCss, parallel(includeHtmlComponents, copyAssets), removeTmpFiles);
}

function copyAssets() {
  return src('./src/img/*')
    .pipe(dest('./dist/'));
}

exports.default = build();
exports.dev = series(build(), startServer);
exports.test = series(concatCss, includeHtmlComponents, removeTmpFiles);