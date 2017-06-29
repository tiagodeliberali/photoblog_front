/// <binding />
var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var clean = require('gulp-clean');

var bases = {
    sourceList: ['./index.html', './favicon.ico', './app/**/*.html', './script/app.js', './style/main.css'],
    dist: './dist/',
    js: {
        sourceList: ['./app/app.module.js', './app/**/*.js', './bower_components/ngGallery/src/js/ngGallery.js'],
        destFile: 'app.js',
        destFolder: './script/'
    },
    css: {
        sourceList: './style/third_party/*.css',
        destFile: './style/main.css'
    }
};

gulp.task('concat', function() {
    return gulp
        .src(bases.js.sourceList)
        .pipe(concat(bases.js.destFile))
        .pipe(uglify())
        .pipe(gulp.dest(bases.js.destFolder));
});

gulp.task('concat-debug', function() {
    return gulp
        .src(bases.js.sourceList)
        .pipe(concat(bases.js.destFile))
        .pipe(gulp.dest(bases.js.destFolder));
});

gulp.task('css', function() {
    return gulp
        .src(bases.css.sourceList)
        .pipe(concat(bases.css.destFile))
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest('.'));
});

gulp.task('clean', function() {
 return gulp
    .src(bases.dist)
    .pipe(clean());
});

gulp.task('dist', ['clean', 'concat', 'css'], function() {
    return gulp
        .src(bases.sourceList,  {base: './'})
        .pipe(gulp.dest(bases.dist));
});

var exec = require('child_process').exec;
gulp.task('docker-build', ['dist'], function() {
  exec('docker build -t photoblog_front .', function(err) {
    if (err) {
        console.log(err);
    }
  });
});

// A development task to run anytime a file changes
gulp.task('watch', function() {
 gulp.watch('app/**/*', ['concat', 'copy']);
});