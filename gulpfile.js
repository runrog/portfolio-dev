const gulp = require('gulp');
const babel = require('gulp-babel');
const watch = require('gulp-watch');
const browserSync = require('browser-sync');
const autoClose = require('browser-sync-close-hook');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const imagemin = require('gulp-imagemin');
const ejs = require('gulp-ejs');
// @TODO - add in vendor prefix settings

const reload = browserSync.reload;

const sassTask = function buildSass() {
  return gulp.src('styles/**/*.scss')
    .pipe(sass({ outputStyle: 'compressed' })
    .on('error', sass.logError))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('./dist/css'))
    .on('end', () => {
      console.log('Successfully Built SASS');
      browserSync.reload();
    });
};

const jsTask = function buildJS() {
  return gulp.src('js/**/*.js')
  .pipe(concat('app.js'))
  .pipe(babel({
    presets: ['env'],
  }))
  .pipe(minify({
    ext: {
      min: '.min.js',
    },
  }))
  .pipe(gulp.dest('dist/js/'))
  .on('end', () => {
    console.log('Successfully Built JS');
  });
};

const imgTask = function buildJS() {
  return gulp.src('images/*')
   .pipe(imagemin([
     imagemin.optipng({ optimizationLevel: 5 }),
   ]))
   .pipe(gulp.dest('dist/images'))
   .on('end', () => {
     console.log('Successfully compressed images');
   });
};

gulp.task('build-sass', sassTask);
gulp.task('build-js', jsTask);
gulp.task('build-images', imgTask);

gulp.task('build-dist', () => {
  gulp.src('index.ejs')
   .pipe(ejs({}, {}, { ext: '.html' }))
   .pipe(gulp.dest('./dist'));
  // run sass/js tasks
  sassTask();
  jsTask();
  imgTask();
});

gulp.task('browser-sync', ['nodemon'], () => {
  browserSync.use({
    plugin() {},
    hooks: {
      'client:js': autoClose,
    },
  });
  browserSync({
    proxy: 'localhost:3002',
    port: 3003,
    notify: false,
    ui: false,
  });
});

gulp.task('nodemon', (cb) => {
  let called = false;
  return nodemon({
    script: 'server.js',
    ignore: [
      'gulpfile.js',
      'node_modules/',
    ],
  })
  .on('start', () => {
    if (!called) {
      called = true;
      cb();
    }
  })
  .on('restart', () => {
    setTimeout(() => {
      reload({ stream: false });
    }, 1000);
  });
});

gulp.task('default', [
  'browser-sync',
  'build-sass',
  'build-js',
], () => {
  watch([
    '**/*.ejs',
  ], reload);
  gulp.watch([
    'styles/**/*.scss',
  ], ['build-sass']);
  gulp.watch([
    'js/**/*.js',
  ], ['build-js']);
});
