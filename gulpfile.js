'use strict';

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const style = require('gulp-sass');

const clean = require('gulp-clean');

const svgCheerio = require('gulp-cheerio');
const svgReplace = require('gulp-replace');
const svgSprite = require('gulp-svg-sprite');
const svgMin = require('gulp-svgmin');

const pngquant = require('imagemin-pngquant');

const browserSync = require('browser-sync').create();

// Пути для сборки
var path = {
	build: {
		root: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		maps: '/maps',
		img: 'build/img/',
		svg: './build/img/svg/'
	},
	src: {
		root: 'src/',
		pug: 'src/pug/**/*.pug',
		sass: 'src/sass/**/*.sass',
		img: 'src/img/*.*',
		svg: 'src/img/svg/*.svg',
		spriteStyle: 'sass/_sprite.scss',
		spriteTemplate: 'src/sass/templates/_sprite_template.scss',
		js: 'src/js/*.js'
	},
	watch: {
		root: './build'
	}
}

// pug
gulp.task('pug', function(){
	return gulp.src(path.src.pug)
		.pipe(plugins.pug({pretty: true}))
		.on('error', console.log)
		.pipe(gulp.dest(path.build.root))
		.on('end', browserSync.reload);
});


// style
gulp.task('style', function () {
	return gulp.src(path.src.sass)
		.pipe(style({outputStyle: 'compressed'}))
		.pipe(plugins.csso()) // минифицирует стили и склеивает одинаковые классы
		.pipe(plugins.autoprefixer({browsers: ['last 2 versions']}))
		.pipe(gulp.dest(path.build.css))
		.on('end', browserSync.reload);
});

// style только для разработки, без склеивания и автопрефиксера
gulp.task('style:dev', function () {
	return gulp.src(path.src.sass)
		.pipe(plugins.sourcemaps.init({loadMaps: true}))
		.pipe(style({outputStyle: 'expanded'}).on('error', style.logError))
		.pipe(plugins.sourcemaps.write(path.build.maps))
		.pipe(gulp.dest(path.build.css))
		.on('end', browserSync.reload);
});


// js
gulp.task('js', function () {
	return gulp.src(path.src.js)
		.pipe(gulp.dest(path.build.js))
		.on('end', browserSync.reload);
});


// svg-sprite
gulp.task('svg', function() {
	return gulp.src(path.src.svg)
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
							dest: path.src.spriteStyle,
							template: path.src.spriteTemplate
						}
					}
				}
			}
		}))
		.pipe(gulp.dest(path.build.svg));
});


// imagemin
gulp.task('img', function () {
	return gulp.src(path.src.img)
		.pipe(plugins.imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.img))
});


// очистка папки build
gulp.task('clean', function() {
	return gulp.src(path.build.root, {read: false})
		.pipe(clean());
});

// webserver
gulp.task('webserver', function () {
	return browserSync.init({
		server: {
			baseDir: path.watch.root,
			tunnel: true
		}
	});
});


// watch
gulp.task('default', ['webserver'], function(){
	gulp.watch(path.src.pug, ['pug']);
	gulp.watch(path.src.sass, ['style:dev']);
	gulp.watch(path.src.js, ['js']);
});

gulp.task('build', ['webserver'], function(){
	gulp.watch(path.src.pug, ['pug']);
	gulp.watch(path.src.sass, ['style']);
	gulp.watch(path.src.js, ['js']);
});

