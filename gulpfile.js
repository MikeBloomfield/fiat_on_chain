const gulp = require('gulp'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	del = require('gulp-clean'),
	cache = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer'),
	plumber = require('gulp-plumber'),
	stylus = require('gulp-stylus'),
	cleanCSS = require('gulp-clean-css'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	rigger = require('gulp-rigger'),
	sourcemaps = require('gulp-sourcemaps'),
	tinypng = require('gulp-tinypng-compress'),
	watch = require('gulp-watch');

/* Start DEV version */

const browser = () => {
	browserSync.init({
		server: {
			baseDir: `./build`,
		},
		notify: false
	});
};

const cacheClear = () => {
	cache.clearAll();
};

const libsJs = (cb) => {
	return gulp.src('app/libs/libs.js')
		.pipe(plumber())
		.pipe(rigger())
		.pipe(uglify())
		.pipe(concat('libs.min.js'))
		.pipe(gulp.dest('build/js/'))
		.pipe(browserSync.reload({
			stream: true
		}));
	cb();
};

const mainJs = (cb) => {
	return gulp.src('app/js/common.js')
		.pipe(plumber())
		.pipe(rename('common.min.js'))
		.pipe(gulp.dest('build/js/'))
		.pipe(browserSync.reload({
			stream: true
		}));
	cb();
};

const libsCss = (cb) => {
	return gulp.src('app/libs/libs.styl')
		.pipe(plumber())
		.pipe(stylus({
			'include css': true
		}))
		.pipe(cleanCSS({
			level: { 2: { restructureRules: true } }
		}))
		.pipe(concat('libs.min.css'))
		.pipe(gulp.dest('build/css/'))
		.pipe(browserSync.reload({
			stream: true
		}));
	cb();
};

const mainCssDev = (cb) => {
	return gulp.src('app/stylus/index.styl')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(stylus({
			'include css': true
		}))
		.pipe(autoprefixer('last 2 versions'))
		.pipe(sourcemaps.write())
		.pipe(rename('style.min.css'))
		.pipe(gulp.dest('build/css/'))
		.pipe(browserSync.reload({
			stream: true
		}));
	cb();
};

const htmlDev = (cb) => {
	return gulp.src('app/*.html')
		.pipe(plumber())
		.pipe(rigger())
		.pipe(gulp.dest('build/'))
		.pipe(browserSync.reload({
			stream: true
		}));
	cb();
};

const copyImg = (cb) => {
	return gulp.src('app/img/**/*.*')
		.pipe(gulp.dest('build/img/'))
		.pipe(browserSync.reload({
			stream: true
		}));
	cb();
};

const copySupport = (cb) => {
	return gulp.src(['manifest.json', 'browserconfig.xml'])
		.pipe(gulp.dest('build/'));
	cb();
};

const copyVideo = (cb) => {
	return gulp.src('app/video/**/*.*')
		.pipe(gulp.dest('build/video/'))
		.pipe(browserSync.reload({
			stream: true
		}));
	cb();
};

const copyFonts = (cb) => {
	return gulp.src('app/fonts/**/*.*')
		.pipe(gulp.dest('build/fonts/'))
		.pipe(browserSync.reload({
			stream: true
		}));
	cb();
};

const watcher = () => {
	watch('app/img/**/*.*', gulp.series(copyImg, cacheClear));
	watch('app/video/**/*.*', gulp.series(copyVideo, cacheClear));
	watch('app/fonts/**/*.*', gulp.series(copyFonts, cacheClear));
	watch('app/libs/**/*.*', gulp.series(libsCss, libsJs, cacheClear));
	watch('app/js/**/*.*', gulp.series(mainJs, cacheClear));
	watch('app/stylus/**/*.*', gulp.series(mainCssDev, cacheClear));
	watch('app/parts/*.html', gulp.series(htmlDev, cacheClear));
	watch('app/*.html', gulp.series(htmlDev, cacheClear));
};

exports.default = gulp.series(gulp.parallel(copyImg, copySupport, copyVideo, copyFonts, libsCss, libsJs, mainJs, mainCssDev, htmlDev), gulp.parallel(browser, watcher));

/* End DEV version */

/* Start Production */

const mainJsBuild = (cb) => {
	return gulp.src('build/js/common.min.js')
		.pipe(plumber())
		.pipe(uglify())
		.pipe(concat('common.min.js'))
		.pipe(gulp.dest('build/js/'));
	cb();
};

const mainCssBuild = (cb) => {
	return gulp.src('build/css/style.min.css')
		.pipe(plumber())
		.pipe(cleanCSS({ level: { 2: { restructureRules: true } } }))
		.pipe(gulp.dest('build/css/'));
	cb();
};

const compressImg = (cb) => {
	return gulp.src('build/img/main/**/*.{png,jpg}')
		.pipe(plumber())
		.pipe(tinypng({
			key: 'DJWdZ2G4jL51dl3S2k7SdHFVlhc960DN',
			log: true,
			parallelMax: 30,
			sameDest: true
		}))
		.pipe(gulp.dest('build/img/main/'));
	cb();
};

const removeModules = (cb) => {
	return gulp.src('node_modules', { read: false })
		.pipe(del());
	cb();
};


exports.production = gulp.series(mainJsBuild, mainCssBuild, compressImg, removeModules);
/* End Production */
