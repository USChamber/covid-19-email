const { src, dest, watch, series, parallel } = require('gulp');
const fileinclude = require('gulp-file-include');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const gls = require('gulp-live-server');
const cheerio = require('gulp-cheerio');

const files = {
  html: {
    index: ['./src/index.html'],
    head: ['./src/head.html'],
    components: ['./src/components/**/*.html']
  },
  css: {
    dev: ['./src/css/style.css', './src/css/custom.css', './src/components/**/*.css'],
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
  return src(files.html.index)
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
  watch(
    [...files.html.index, ...files.html.head, ...files.css.dev, ...files.html.components],
    series(concatCss, includeHtmlComponents, removeTmpFiles)
  );
}

function build() {
  console.log('building fresh copy...');
  return series(concatCss, parallel(includeHtmlComponents, copyAssets), removeTmpFiles);
}

function copyAssets() {
  return src('./src/img/*')
    .pipe(dest('./dist/'));
}

// would be cool to populate the template in dev with the default values. This pulls them, not sure how to pipe them in
function getTokenValues() {
  const variables = {};
  return src(files.html.head)
    .pipe(
      cheerio({
        run: ($, file) => {
          // Each file will be run through cheerio and each corresponding `$` will be passed here.
          // `file` is the gulp file object
          // Make all h1 tags uppercase
          $('meta').each(function () {
            const meta = $(this);
            variables[meta.attr('id')] = meta.attr('default');
            console.log(variables);
          })
        },
      }),
    )
    .pipe(dest('dist/'));
}

exports.default = build();
exports.dev = series(build(), startServer);
exports.test = series(concatCss, includeHtmlComponents, removeTmpFiles);
