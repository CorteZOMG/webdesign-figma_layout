const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const imagemin = require('gulp-imagemin'); 
const browserSync = require('browser-sync').create();
const { deleteAsync } = require('del');

const paths = {
    html: {
        src: 'html/**/*.html', 
        dest: 'dist/'
    },
    css: {
        src: 'css/**/*.css',   
        dest: 'dist/css/'
    },
    js: {
        src: 'js/**/*.js',     
        dest: 'dist/js/'
    },
    images: {
        src: 'img/**/*',       
        dest: 'dist/images/'   
    }
};

function clean() {
    return deleteAsync(['dist/']);
}

function html() {
    return gulp.src(paths.html.src)
        .pipe(gulp.dest(paths.html.dest))
        .pipe(browserSync.stream());
}

function css() {
    return gulp.src(paths.css.src)
        .pipe(autoprefixer.default({ cascade: false })) 
        .pipe(gulp.dest(paths.css.dest))
        .pipe(browserSync.stream());
}

function js() {
    return gulp.src(paths.js.src)
        .pipe(terser())
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browserSync.stream());
}

function images() {
    return gulp.src(paths.images.src)
        .pipe(imagemin()) 
        .pipe(gulp.dest(paths.images.dest))
        .pipe(browserSync.stream());
}

function watchFiles() {
    browserSync.init({
        server: {
            baseDir: './dist/' 
        },
        port: 3000,
        notify: false
    });

    gulp.watch(paths.html.src, html);
    gulp.watch(paths.css.src, css);
    gulp.watch(paths.js.src, js);
    gulp.watch(paths.images.src, images);
}

const build = gulp.series(clean, gulp.parallel(html, css, js, images));

const dev = gulp.series(build, watchFiles);

exports.clean = clean;
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.build = build; 
exports.dev = dev;     
exports.default = dev; 