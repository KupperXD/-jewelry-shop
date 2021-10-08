// Include gulp
const gulp = require('gulp');

// Include Our Plugins
const autoprefixer = require('gulp-autoprefixer');
const babel        = require('gulp-babel');
const concat       = require('gulp-concat');
const del          = require('del');
const newer        = require('gulp-newer');
const plumber      = require('gulp-plumber');
const rename       = require('gulp-rename');
const gulpSass         = require('gulp-sass');
const dartSass = require('sass');
const sass = gulpSass(dartSass);
const sassGlob     = require('gulp-sass-glob');
const svgo         = require('gulp-svgo');
const svgstore     = require('gulp-svgstore');
const uglify       = require('gulp-uglify-es').default;
const server       = require("browser-sync").create();
const posthtml     = require("gulp-posthtml");
const include      = require("gulp-file-include");

const pluginsJSPaths = [
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/sweetalert2/dist/sweetalert2.js',
    'node_modules/select2/dist/js/select2.min.js',
];

const pluginsCSSPaths = [
    'node_modules/sweetalert2/dist/sweetalert2.min.css',
    'node_modules/select2/dist/css/select2.min.css',
];

const copySrc = [
    'source/fonts/*.*'
];

const paths = {
    styles: {
        src: 'source/scss/styles.scss',
        dest: 'dist/css/',
        watch: [
            'source/scss/**/*.scss',
        ],
    },
    scripts: {
        src: [
            'source/js/_custom_plugins/*.js',
            'source/js/*.js',
        ],
        dest: 'dist/js/',
        watch: [
            'source/js/_custom_plugins/*.js',
            'source/js/*.js',
        ],
    },
    images: {
        src: 'source/img/official/*',
    },
    svg : {
        src: 'source/img/svg/*.svg',
        dest: 'dist/img/svg/',
    },

};

//////////////////////////////////////////////

function styles() {
    return gulp.src(paths.styles.src, { sourcemaps: true })
        .pipe(plumber())
        .pipe(sassGlob())
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.styles.dest, { sourcemaps: '.' }))
        .pipe(server.stream());
}

function scripts() {
    return gulp.src(paths.scripts.src, { sourcemaps: true })
        .pipe(plumber())
        .pipe(concat('scripts.js'))
        .pipe(babel())
        .pipe(gulp.dest(paths.scripts.dest, { sourcemaps: '.' }));
}

function images() {
    return gulp.src('source/img/official/**/*')
        .pipe(plumber())
        .pipe(newer(paths.images.src))
        .pipe(gulp.dest('dist/img/official'));
}

function svg() {
    return gulp.src(paths.svg.src)
        .pipe(plumber())
        .pipe(svgo({
            plugins: [
                { prefixIds: true },
                { removeXMLNS: true },
                { removeViewBox: false },
                { removeRasterImages: true },
                { removeStyleElement: true },
                { removeScriptElement: true }
            ]
        }))
        .pipe(svgstore({
            inlineSvg: true
        }))
        .pipe(rename('sprite.svg'))
        .pipe(gulp.dest(paths.svg.dest));
}

function html() {
    return gulp.src(['source/*.html', '!source/components/**/*.html'])
        .pipe(include())
        .pipe(gulp.dest('dist/'));
}

function copy() {
    return gulp.src(copySrc)
        .pipe(gulp.dest('dist/fonts/'));
}

function serverLive() {
    server.init({
        server: 'dist/',
        notify: false,
        open: true,
        cors: true,
        ui: false
    });

    gulp.watch(paths.scripts.watch, {interval: 200}, scripts);
    gulp.watch(paths.styles.watch, {interval: 200}, styles);
    gulp.watch(paths.svg.src, {interval: 200}, svg);
    gulp.watch(paths.images.src, {interval: 200}, images);
    gulp.watch('source/**/*.html', html).on('change', server.reload);
}

function pluginsJS() {
    return gulp.src(pluginsJSPaths)
        .pipe(plumber())
        .pipe(concat('_plugins-all.min.js'))
        .pipe(uglify({
            compress: false,
            mangle: false
        }))
        .pipe(gulp.dest('dist/js/'));
}

function pluginsCSS() {
    return gulp.src(pluginsCSSPaths, { sourcemaps: true })
        .pipe(plumber())
        .pipe(concat('_plugins-all.css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.styles.dest, { sourcemaps: '.' }));
}

function clean() {
    return del('dist');
}

//////////////////////////////////////////////

gulp.task('plugins-css', gulp.series(pluginsCSS));
gulp.task('plugins-js', gulp.series(pluginsJS));
gulp.task('plugins', gulp.parallel('plugins-js', 'plugins-css'));
gulp.task('images', gulp.parallel(images, svg));
gulp.task('scss', gulp.series(styles));
gulp.task('js', gulp.series(scripts));
gulp.task('clean', gulp.series(clean));
gulp.task('serverLive', gulp.series(serverLive));

gulp.task('build', gulp.series(clean, copy, images,styles, pluginsJS, pluginsCSS, scripts, svg, html));
gulp.task('watch', function () {
    gulp.watch(paths.scripts.watch, {interval: 200}, scripts);
    gulp.watch(paths.styles.watch, {interval: 200}, styles);
    gulp.watch(paths.svg.src, {interval: 200}, svg);
});
gulp.task('default', gulp.series('build', 'serverLive'));
gulp.task('start', gulp.series('build', 'serverLive'));