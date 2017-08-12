var Metalsmith = require('metalsmith'),
path = require('path'),
markdown = require('metalsmith-markdown'),
templates = require('metalsmith-templates'),
inPlace = require('metalsmith-in-place'),
collections = require('metalsmith-collections'),
permalinks = require('metalsmith-permalinks'),
rssfeed = require('metalsmith-feed'),
sitemap = require('metalsmith-mapsite'),
sass = require('metalsmith-sass'),
browserify = require('metalsmith-browserify'),
imagemin = require('metalsmith-imagemin'),
offline = require('metalsmith-offline'),
copy = require('metalsmith-copy'),
copyAssets = require('metalsmith-copy-assets-540'),
fs = require('fs'),
glob = require('globby'),
swPrecache = require('sw-precache'),
devBuild = ((process.env.NODE_ENV || '').trim().toLowerCase() !== 'production'),
siteMeta = {
  devBuild: devBuild,
  name:     'AlphaCodes',
  desc:     'A demonstration static site built using Metalsmith',
  author:   'Silas Tippens',
  contact:  'silas@poeti.codes',
  domain:    'https://alpha.poeti.codes',            // set domain
  cacheManifestLoc: './build/precache.appcache'
//   rootpath:  devBuild ? null  : '/sitepoint-editors/metalsmith-demo/master/build/' // set absolute path (null for relative)
};
var cleanNow = function(files, metalsmith, done){
    var dest = metalsmith.destination();
    rm(dest);
};
var rootDir = "./build";
var sw_config = {
    cacheId: siteMeta.name,
    /*
    dynamicUrlToDependencies: {
      'dynamic/page1': [
        path.join(rootDir, 'views', 'layout.jade'),
        path.join(rootDir, 'views', 'page1.jade')
      ],
      'dynamic/page2': [
        path.join(rootDir, 'views', 'layout.jade'),
        path.join(rootDir, 'views', 'page2.jade')
      ]
    },
    */
    // If handleFetch is false (i.e. because this is called from generate-service-worker-dev), then
    // the service worker will precache resources but won't actually serve them.
    // This allows you to test precaching behavior without worry about the cache preventing your
    // local changes from being picked up during the development cycle.
    handleFetch: true,
    logger: console.logger,
    runtimeCaching: [{
      // See https://github.com/GoogleChrome/sw-toolbox#methods
      urlPattern: /runtime-caching/,
      handler: 'cacheFirst',
      // See https://github.com/GoogleChrome/sw-toolbox#options
      options: {
        cache: {
          maxEntries: 1,
          name: 'runtime-cache'
        }
      }
    }],
    staticFileGlobs: [
      rootDir + '/styles/**.css',
      rootDir + '/**/*.html',
      rootDir + '/images/**/*.*',
      rootDir + '/js/**.js'
    ],
    stripPrefix: rootDir + '/',
    // verbose defaults to false, but for the purposes of this demo, log more.
    verbose: true
};

function writeAppCacheManifest() {
    glob(sw_config.staticFileGlobs).then(files => {
        // filter out directories
        files = files.filter(file => fs.statSync(file).isFile());

        // strip out prefix
        files = files.map(file => file.replace(sw_config.stripPrefix, ''));

        // add the header and join to string
        const out = ['CACHE MANIFEST', ...files].join('\n');

        // write the file
        fs.writeFileSync(path.join(__dirname, siteMeta.cacheManifestLoc), out);

        // we're done!
        console.log(`Wrote ${siteMeta.cacheManifestLoc} with ${files.length} resources.`);
    });
}

function writeServiceWorkerFile(callback) {
    swPrecache.write(path.join(rootDir, 'service-worker.js'), sw_config, callback);
}

Metalsmith(__dirname).ignore('modules')
.clean(false)
.use(copyAssets({
    src: 'build/images/uploads',
    dest: '../src/images/uploads'
}))
.use(cleanNow)
.use(imagemin({
    optimizationLevel: 3,
    svgoPlugins: [{ removeViewBox: false }]
  }))
.use(collections({
    pages: {
        pattern: 'pages/*.md'
    },
    poetry: {
        pattern: 'poetry/*.md',
        sortBy: 'date'
    },
    articles: {
        pattern: 'articles/*.md',
        sortBy: 'date'
    }
}))
.use(markdown())
.use(permalinks({
    // original options would act as the keys of a `default` linkset, 
      pattern: ':title',
      date: 'mmddyy',

      // each linkset defines a match, and any other desired option
      linksets: [{
          match: { collection: 'articles' },
          pattern: ':directory/:title',
          date: 'mmddyy'
      }, {
          match: { collection: 'poetry' },
          pattern: ':directory/:title',
          date: 'mmddyy'
      }]

}))
.use(templates({
    engine: 'handlebars',
    partials: {
        header: 'partials/header',
        footer: 'partials/footer'
    }
}))
.use(sitemap({                          // generate sitemap.xml
    hostname:     siteMeta.domain + (siteMeta.rootpath || ''),
    omitIndex:    true
  }))
  .use(rssfeed({                          // generate RSS feed for poetry
    collection:   'poetry',
    site_url:     siteMeta.domain + (siteMeta.rootpath || ''),
    title:        siteMeta.name,
    description:  siteMeta.desc
  }))
.use(sass({
    sourceMap: true,
    sourceMapContents: true,
    outputStyle: "expanded",
    outputDir: 'styles/'
}))
.use(browserify({
    dest: 'js/bundle.js',
    entries: ['./src/js/app.js'],
    sourceType: 'module',
    sourcemaps: true,
    watch: false,
    transform: [["babelify", { "presets": ["es2015"] }], ["uglifyify", { global: true}]]
}))
// .use(uglify({
//     sourceMap: true,
//     compress: true
// }))
.use(copy({
    pattern: 'admin/*.yml',
    directory: "admin/"
}))
.use(copy({
    pattern: 'images/uploads/**/*.[jpg,png]',
    directory: "images/uploads/"
}))
.use(copy({
    pattern: 'favicon.ico',
    directory: "./"
}))
.destination('./build')
.build(function (err) { 
    if(err) console.log(err)
    else {
        writeServiceWorkerFile(writeAppCacheManifest);
    }
})
