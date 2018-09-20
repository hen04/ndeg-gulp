'use strict';

var gulp = require('gulp'),
		style = require('gulp-sass'),
		pug = require('gulp-pug'),
		sourcemaps = require('gulp-sourcemaps'),
		csso = require('gulp-csso'),
		autoprefixer = require('gulp-autoprefixer'),
		svgCheerio = require('gulp-cheerio'),
		svgReplace = require('gulp-replace'),
		svgSprite = require('gulp-svg-sprite'),
		svgMin = require('gulp-svgmin'),
		browserSync = require('browser-sync').create();

// pug
gulp.task('pug', function(){
	return gulp.src('src/*.pug')
		.pipe(pug({pretty: true}))
		.on('error', console.log)
		.pipe(gulp.dest('build/'))
		.on('end', browserSync.reload);
});


// style
gulp.task('style', function () {
	return gulp.src('src/sass/**/*.sass')
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(style({outputStyle: 'expanded'}).on('error', style.logError))
		.pipe(csso()) // минифицирует стили и склеивает одинаковые классы
		.pipe(autoprefixer({browsers: ['last 2 versions']}))
		.pipe(sourcemaps.write('/maps'))
		.pipe(gulp.dest('build/css/'))
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
				$('[fill]').removeAttr('fill');
				$('[stroke]').removeAttr('stroke');
				$('[style]').removeAttr('style');
			},
			parseOptions: {xmlMode: true}
		}))
		.pipe(svgReplace('&gt;', '>'))
		.pipe(svgSprite({
			mode: {
				view: {
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
	gulp.watch('src/*.pug',['pug']);
	gulp.watch('src/sass/*.sass',['style']);
});
