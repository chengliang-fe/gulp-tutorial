# gulp-tutorial

`gulp` 一款极其强大的构建工具。本文主要讲解 `gulp 3`。

# 了解

`gulp` 可以做的事情很多。

- 代码分析 (jsHint, jsCs, eslinet, cssLint)

- 编译（sass，less，es6，prefix，jade等等）

- 拼接文件(css, js)

- 压缩 (css, 图片, 雪碧图, 图标SVG)

- 混淆 (uglify)

- HTML生成 引用的注入(css,js)

- 文件重命名

- md5

- 测试

- 删除文件

- 自动上传，部署cdn

等等。。。

## 要求

需要安装 `nodejs` ,前往[官网](https://nodejs.org)下载。

## 安装 `gulp`

```
# 全局安装 gulp
gulp install -g gulp-cli
```

## 初始化一个 `gulpjs` 构建的项目

```
# 创建一个文件夹
mkdir gulp-tutorial

# 切换到 gulp-tutorial
cd gulp-tutorial

# 项目初始化
npm init

# 安装 gulp 到你的项目
npm install gulp --save-dev

# 安装一些库
npm install gulp-util del gulp-notify q through2 --save-dev
```

## 写 `gulpfile.js`

```
'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var notify = require('gulp-notify');
```

## 创建任务

`gulpjs` 是基于一系列可执行的同步或者异步任务。在项目根目录下创建一个名为 `gulpfile.js` 的文件

```
'use strict';
var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var notify = require('gulp-notify');

// 单个任务
gulp.task('start', function () {
    gutil.log(gutil.colors.yellow('start!'));
});
```

然后可以在终端执行：

```
# 使用 gulp taskname
gulp start
> start!
```

## 在命令行中传参数

在 `gulpfile.js` 添加如下任务：

```
// 任务带参数
gulp.task('sayName', function () {
    var name = gutil.env.name || 'No name';
    gutil.log(gutil.colors.red('Name：'), gutil.colors.red(name));
});
```

然后可以在终端执行：

```
gulp sayName --name qingzhui
> Name: qingzhui
```

## 任务依赖

gulp 的任务可以在三种不同的地方执行：

- 手动在终端执行

- 另一个任务的依赖关系

- 通过观察任务执行

```
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
```

然后可以在终端执行：

```
gulp release
> 项目任务: 压缩
> 项目任务: 添加md5
> 项目任务: 打包
> 项目发布!
```

## Watchers

Watchers 在可以在文件发生变化的时候，触发一个或者一组任务。

```
// 监听任务 回调
gulp.task('watcher2', function () {
    // 文件改变
    gulp.watch(['src/*'], function() {
        gutil.log(gutil.colors.red('src下面的文件有变动'));
    });
});
```

然后可以在终端执行：

```
gulp watcher2
> src下面的文件有变动
```

## Pipes（管道）, sources（来源） and destinations（目的地）

`gulp.src()`，是引入待处理的文件的，放入 `gulp.pipe()` 管道里经过处理，流入到另一个管道，一层层处理，最后通过 `gulp.dest()` 把处理过的文件放到目的地。

```
gulp.task('copyFiles', function () {
  return gulp.src(['./src/*'])
    .pipe(gulp.dest('./dist'));
    .pipe(notify('复制文件任务！'));
});
```

然后可以在终端执行：

```
gulp copyFiles
> gulp-notify: [Gulp notification] 复制文件任务！
```

## 深入知识点

- 学习 gulp 4.0 

- cli

- cdn部署

```
// https://github.com/babsley/gulpfile-4.0/blob/master/gulpfile.js

'use strict';

const config = require('./gulp/config');
const paths = require('./gulp/paths');
const gulp = require('gulp');
const $ = require('gulp-load-plugins')(config.gulpLoadPlugins);

console.log($);

// require task
function lazyRequireTask(taskName, options) {
    options = options || {};
    options.taskName = taskName;

    if (!options.path) {
        options.path = config.tasksPath + taskName;
    }

    gulp.task(taskName, function (callback) {
        let task = require(options.path).call(this, options);

        return task(callback);
    });
}

// clean task
lazyRequireTask('clean', {src: paths.dest});

// jade task
lazyRequireTask('jade', {src: paths.jade.src, dest: paths.jade.dest});

// scss task
lazyRequireTask('scss', {src: paths.scss.src, dest: paths.scss.dest});

// images task
lazyRequireTask('images', {src: paths.images.src, dest: paths.images.dest});

// scripts task
lazyRequireTask('scripts', {src: paths.scripts.src, dest: paths.scripts.dest});

// angular task
lazyRequireTask('angular', {src: paths.angular.src, dest: paths.angular.dest});

// bower task
lazyRequireTask('bower', {dest: {js: paths.bowerFiles.js, css: paths.bowerFiles.css}});

// bower task
lazyRequireTask('serve', {dest: paths.dest});

// sprites task
lazyRequireTask('sprites', {src: paths.sprites.src, dest: paths.sprites.dest});


// watch
gulp.task('watch', function () {
    // jade watch
    gulp.watch(paths.jade.src, gulp.series('jade'));

    // scss watch
    gulp.watch(paths.scss.all, gulp.series('scss')).on('unlink', function (filepath) {
        $.remember.forget('scss', $.path.resolve(filepath));
        delete $.cached.caches.scss[$.path.resolve(filepath)];
    });

    // scripts watch
    gulp.watch(paths.scripts.all, gulp.series('scripts')).on('unlink', function (filepath) {
        $.remember.forget('scripts', $.path.resolve(filepath));
        delete $.cached.caches.scripts[$.path.resolve(filepath)];
    });

    // images watch
    gulp.watch(paths.images.src, gulp.series('images'));

    // angular watch
    gulp.watch(paths.angular.src, gulp.series('angular')).on('unlink', function (filepath) {
        $.remember.forget('angular', $.path.resolve(filepath));
        delete $.cached.caches.angular[$.path.resolve(filepath)];
    });

    // bower watch
    gulp.watch(paths.bowerFiles.all, gulp.series('bower'));

    // sprites watch
    gulp.watch(paths.sprites.src, gulp.series('sprites'));
});

gulp.task('dev', gulp.series('clean', 'bower', gulp.parallel('jade', 'scss', 'sprites', 'images', 'scripts', 'angular'), gulp.parallel('serve', 'watch')));

gulp.task('build', gulp.series('clean', gulp.parallel('jade', 'scss', 'images', 'bower', 'scripts', 'angular')));

gulp.task('default', gulp.series('dev'));
```



## 资源

[gulp github](https://github.com/gulpjs/gulp/tree/4.0)

[指导](http://www.gulpjs.com.cn/docs/writing-a-plugin/guidelines/)

[Gulp 4 入门指南](https://github.com/cssmagic/blog/issues/62)

