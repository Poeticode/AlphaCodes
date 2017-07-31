var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCss = require('gulp-clean-css');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var rename = require('gulp-rename');
var hb = require('gulp-hb');
var browserify  = require('browserify');
var babelify    = require('babelify');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var uglify      = require('gulp-uglify');
var sourcemaps  = require('gulp-sourcemaps');
// var livereload  = require('gulp-livereload');
var sftp = require('gulp-sftp');
var fs = require('fs');
var data = require('gulp-data');
var glob = require("glob")
var babel = require('gulp-babel');
var runSequence = require('run-sequence');
var del = require('del');
var bump = require('gulp-bump');
var gutil = require('gulp-util');
const readAsJSON = (path) => JSON.parse(fs.readFileSync(path, 'utf8')); 
var packageVersion = readAsJSON('./package.json').version;

var paths = {};

/* SCSS/CSS files */
paths.css = '_src/scss/app/**/*.scss';
paths.cssVendor = '_src/scss/vendor/**/*.css';

/* Javascript files */
paths.js = '_src/js/app/**/*.js';
paths.jsVendor = '_src/js/vendor/**/*.js';

/* Handlebar templating files */
paths.partials = '_src/hbs/partials/**/*.hbs';
paths.helpers = '_src/hbs/helpers/*.js';
paths.data = '_src/hbs/data/**/*.{js,json}';
paths.hbs = [
    '_src/hbs/**/*.html', 
    '!'+paths.partials,
    '!'+paths.helpers,
    '!'+paths.data];

/* Miscellaneous files */
paths.static = [
    '_src/manifest.json',
    // '_src/firebase-messaging-sw.js',
    '_src/fonts/**/*',
    '_src/imgs/**/*'
];
paths.app = '_src/js/app/app.js';
paths.dest = 'dist';

/**
 * Create dynamic pages based on JSON files in our /hbs/data/dynamic directory
 */
gulp.task('createDynamicPages', function createDynamicPages(done) {
    var tasks = [];

    // Go through each JSON file in our special directory
    glob.sync("_src/hbs/data/dynamic/*.json").forEach(function(filePath) {
        // Read it as a JSON object
        var jsonFile = JSON.parse(fs.readFileSync(filePath));

        // They should all be arrays, so iterate over them
        jsonFile.forEach(function(fileData) {
            // create a file for each one, using the template + filename they specify
            var hbStream = hb()
                .partials(paths.partials)
                .helpers(paths.helpers)
                .data(paths.data)
                .data({
                    version: packageVersion
                });

            var currentTask = gulp.src("_src/hbs/partials/" + fileData.partialsName + ".hbs")
                .pipe(data( function(file) { 
                    return fileData
                }))
                .pipe(hbStream)
                .pipe(rename({
                    basename: fileData.slug,
                    extname: '.html'
                }))
                .pipe(gulp.dest(paths.dest + "/" + fileData.dest))
                .pipe(gulp.dest('dist/' + fileData.dest))
                // .pipe(livereload());
            tasks.push(currentTask);
        });
    });
    return merge(tasks);
});

/**
 * ES6 -> ES5 -> Uglified
 */
gulp.task('scripts', function(done) {

    var vendorTask = gulp.src([
        // './node_modules/three/build/three.min.js',
        '_src/js/vendor/*.js'
    ]);

    var appTask = browserify({entries: paths.app, debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer());

    return merge(vendorTask, appTask)
        // .pipe(sourcemaps.init({ loadMaps: true}))
        .pipe(concat('app.js'))
        // .pipe(uglify({mangle: true}))
        // .pipe(sourcemaps.write('./'))
        .pipe(rename({ extname : '.'+packageVersion+'.js'}))
        .pipe(gulp.dest(paths.dest+'/js'))
        .pipe(gulp.dest('dist/js/'))
        // .pipe(livereload());
});

/**
 * SASS -> CSS, then concat vendor css & minify
 */
gulp.task('sass', function() {
  var vendor = gulp.src(paths.cssVendor);
  var custom = gulp.src(paths.css, {base: '_src'})
    .pipe(sass())
    .on('error', sass.logError);
  
  return merge(vendor, custom)
    .pipe(concat('style.css'))
    .pipe(gulp.dest(paths.dest+'/css/'))
    .pipe(minifyCss())
    .pipe(rename({ extname: '.'+packageVersion+'.min.css' }))
    .pipe(gulp.dest(paths.dest+'/css/'))
    .pipe(gulp.dest('dist/css/'))
    // .pipe(livereload());
});

/**
 * Regular Handlebar stuff, should be self-evident
 */
gulp.task('handlebars', function (done) {
    // get all them handlebars data for all of our streams
    var hbStream = hb()
        .partials(paths.partials)
        .helpers(paths.helpers)
        .data(paths.data)
        .data({
            version: packageVersion
        });
        
    // create the files for regular ol' templates
    gulp
        .src(paths.hbs)
        .pipe(hbStream)
        .pipe(gulp.dest(paths.dest))
        .pipe(gulp.dest('dist/'))
        // .pipe(livereload())
        .on('end', done);
    
});

/**
 * Upload to my server using the secret key
 */
gulp.task('upload', function () {
    var creds = readAsJSON('./.ftpdest');
	return gulp.src('dist/**/*')
		.pipe(sftp({
			host: creds.host,
			auth: 'poetKey',
            remotePath: creds.remotePath
		}));
});

gulp.task('generate-service-worker', function(callback) {
  var path = require('path');
  var swPrecache = require('sw-precache');
  var rootDir = 'dist';

  swPrecache.write(path.join(rootDir, 'service-worker.js'), {
    staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,gif,svg,eot,ttf,woff}'],
    stripPrefix: rootDir
  }, callback);
});

var spawn = require('child_process').spawn;

gulp.task('serve', function() {
  spawn('node', ['server/server.js'], { stdio: 'inherit' });
});

gulp.task('clean', function() {
    return del([
        'dist/**/*'
    ]);
});

gulp.task('moveStatic', function() {
    return gulp.src(paths.static, {base: '_src'})
        .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['clean', 'bump'], function(cb) {
    runSequence(['sass', 'scripts', 'handlebars', 'createDynamicPages', 'moveStatic'], 'generate-service-worker', cb);
});

gulp.task('bump', function() {
    return gulp.src('./package.json')
        .pipe(bump())
        .pipe(gulp.dest('./'));
});

gulp.task('watch', ['build', 'serve'], function() {
    // livereload.listen();
    gulp.watch([paths.css, paths.cssVendor], ['sass']);
    gulp.watch([paths.js, paths.jsVendor], ['scripts']);
    gulp.watch([paths.hbs, paths.partials, paths.data, paths.helpers], ['handlebars', 'createDynamicPages']);
    gulp.watch('dist/**/*', ['generate-service-worker']);
});