import gulp from 'gulp';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import concat from 'gulp-concat';
import sourcemaps from 'gulp-sourcemaps';
import cleanCss from 'gulp-clean-css';
import browserSync from 'browser-sync';

const sass = gulpSass(dartSass);

const config = {
    paths: {
        sass: './src/sass/**/*.scss',
        html: './public/index.html'
    },
    output: {
        cssName: 'bundle.min.css',
        path: './public/css/'
    }
};

function compileSass() {
    return gulp.src(config.paths.sass)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(concat(config.output.cssName))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCss())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(config.output.path))
        .pipe(browserSync.stream());
}

function serve() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });

    gulp.watch(config.paths.sass, compileSass);
    gulp.watch(config.paths.html).on('change', browserSync.reload);
}

gulp.task('default', gulp.parallel(compileSass, serve));

