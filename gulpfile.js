// gulpfile.js
const gulp = require('gulp');
const eslint = require('gulp-eslint');

// Define the ESLint task
gulp.task('lint', function () {
    return gulp.src(['**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});


// Define the default task
gulp.task('default', gulp.series('lint'));