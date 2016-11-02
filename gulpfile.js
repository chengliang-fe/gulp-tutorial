/**
 * Created by qingzhui on 2016/11/1.
 */

'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var notify = require('gulp-notify');

// 单个任务
gulp.task('start', function () {
    gutil.log(gutil.colors.yellow('start!'));
});

gulp.task('end', function () {
    gutil.log(gutil.colors.yellow('end!'));
});

// 任务带参数
gulp.task('sayName', function () {
    var name = gutil.env.name || 'No name';
    gutil.log(gutil.colors.red('Name：'), gutil.colors.red(name));
});

// 系列任务
gulp.task('project:optimiz', function () {
    gutil.log(gutil.colors.red('项目任务:'), gutil.colors.red('压缩'));
});

gulp.task('project:md5', ['project:optimiz'], function () {
    gutil.log(gutil.colors.red('项目任务:'), gutil.colors.red('添加md5'));
});

gulp.task('project:zip', ['project:optimiz', 'project:md5'], function () {
    gutil.log(gutil.colors.red('项目任务:'), gutil.colors.red('打包'));
});

gulp.task('release', ['project:zip'], function () {
    gutil.log(gutil.colors.red('项目发布!'));
});

// 监听任务
gulp.task('watcher1', function () {
    // 文件改变，会触发 release 任务
    gulp.watch(['src/*'], ['release']);
});

// 监听任务 回调
gulp.task('watcher2', function () {
    // 文件改变
    gulp.watch(['src/*'], function() {
        gutil.log(gutil.colors.red('src下面的文件有变动'));
    });
});

// 任务 复制文件1
gulp.task('copyFiles', function () {
    return gulp.src(['./src/*'])
        .pipe(gulp.dest('./dist'))
        .pipe(notify('复制文件任务！'));
});

// 默认任务
gulp.task('default', function() {
    gutil.log(gutil.colors.red('默认任务!'));
});


