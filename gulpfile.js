'use strict';

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const style = require('gulp-sass');
const clean = require('gulp-clean');
const svgCheerio = require('gulp-cheerio');
const svgReplace = require('gulp-replace');
const svgSprite = require('gulp-svg-sprite');
const svgMin = require('gulp-svgmin');
const browserSync = require('browser-sync').create();

// Пути для сборки
// var path = {
// 	build: {
// 		root: ''
// 	}
// }


// pug
gulp.task('pug', function(){
	return gulp.src('src/pug/**/*.pug')
		.pipe(plugins.pug({pretty: true}))
		.on('error', console.log)
		.pipe(gulp.dest('build/'))
		.on('end', browserSync.reload);
});


// style
gulp.task('style', function () {
	return gulp.src('src/sass/**/*.sass')
		.pipe(plugins.sourcemaps.init({loadMaps: true}))
		.pipe(style({outputStyle: 'expanded'}).on('error', style.logError))
		.pipe(plugins.csso()) // минифицирует стили и склеивает одинаковые классы
		.pipe(plugins.autoprefixer({browsers: ['last 2 versions']}))
		.pipe(plugins.sourcemaps.write('/maps'))
		.pipe(gulp.dest('build/css/'))
		.on('end', browserSync.reload);
});

// style только для разработки, без склеивания и автопрефиксера
gulp.task('style:dev', function () {
	return gulp.src('src/sass/**/*.sass')
		.pipe(plugins.sourcemaps.init({loadMaps: true}))
		.pipe(style({outputStyle: 'expanded'}).on('error', style.logError))
		.pipe(plugins.sourcemaps.write('/maps'))
		.pipe(gulp.dest('build/css/'))
		.on('end', browserSync.reload);
});


// js
gulp.task('js', function () {
	return gulp.src('src/js/*.js')
		.pipe(gulp.dest('build/js/'))
		.on('end', browserSync.reload);
});


// svg-sprite
gulp.task('svg', function() {
	return gulp.src('src/img/svg/*.svg')
		.pipe(svgMin({
			js2svg: {
				pretty: true
			}
		}))
		.pipe(svgCheerio({
			run: function($) {
				//$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parseOptions: {xmlMode: true}
		}))
		.pipe(svgReplace('&gt;', '>'))
		.pipe(svgSprite({
			mode: {
				css: {
					dest: '.',
					bust: false,
					sprite: 'sprite.svg',
					render: {
						scss: {
							dest: 'sass/_sprite.scss',
							template: 'src/sass/templates/_sprite_template.scss'
						}
					}
				}
			}
		}))
		.pipe(gulp.dest('./build/img/svg/'));
});


// imagemin
gulp.task('img', function () {
	return gulp.src('src/img/*')
		.pipe(plugins.imagemin())
		.pipe(gulp.dest('build/img/'))
});


gulp.task('clean', function() {
	return gulp.src('build/', {read: false})
		.pipe(clean());
});

// webserver
gulp.task('webserver', function () {
	return browserSync.init({
		server: {
			baseDir: './build/',
			tunnel: true
		}
	});
});


// watch
gulp.task('default', ['webserver'], function(){
	gulp.watch('src/pug/**/*.pug',['pug']);
	gulp.watch('src/sass/*.sass',['style:dev']);
	gulp.watch('src/js/*.js',['js']);
});

gulp.task('build', ['webserver'], function(){
	gulp.watch('src/pug/**/*.pug',['pug']);
	gulp.watch('src/sass/*.sass',['style']);
	gulp.watch('src/js/*.js',['js']);
});

