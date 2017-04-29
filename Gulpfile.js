'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');

gulp.task('sass', function () {
    return gulp.src('./sass/style.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});

gulp.task('js', function () {
    return gulp.src('./js/script/src/**/*.js')
            .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('./js/script/'));
});

gulp.task('lint', () => {
    return gulp.src(['./js/**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('default', function () {
    gulp.watch('./sass/**/*.sass', ['sass']);
    gulp.watch('./js/script/src/**/*.js', ['js']);
});