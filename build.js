var Metalsmith = require('metalsmith'),
markdown = require('metalsmith-markdown'),
templates = require('metalsmith-templates'),
inPlace = require('metalsmith-in-place'),
collections = require('metalsmith-collections'),
permalinks = require('metalsmith-permalinks'),
rssfeed = require('metalsmith-feed'),
sitemap = require('metalsmith-mapsite'),
sass = require('metalsmith-sass'),
browserify = require('metalsmith-browserify'),
devBuild = ((process.env.NODE_ENV || '').trim().toLowerCase() !== 'production'),
siteMeta = {
  devBuild: devBuild,
  name:     'AlphaCodes',
  desc:     'A demonstration static site built using Metalsmith',
  author:   'Silas Tippens',
  contact:  'silas@poeti.codes',
  domain:    'https://alpha.poeti.codes'            // set domain
//   rootpath:  devBuild ? null  : '/sitepoint-editors/metalsmith-demo/master/build/' // set absolute path (null for relative)
};

Metalsmith(__dirname).ignore('modules')
.use(collections({
    pages: {
        pattern: 'pages/*.md'
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
      }]

}))
.use(templates({
    engine: 'handlebars',
    partials: {
        header: 'partials/header',
        footer: 'partials/footer'
    }
}))
// .use(inPlace({
//     engine: 'handlebars'
//   }))
.use(sitemap({                          // generate sitemap.xml
    hostname:     siteMeta.domain + (siteMeta.rootpath || ''),
    omitIndex:    true
  }))
  .use(rssfeed({                          // generate RSS feed for articles
    collection:   'articles',
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
    sourcemaps: false,
    watch: false,
    transform: [["babelify", { "presets": ["es2015"] }]]
  }))
.destination('./build')
.build(function (err) { if(err) console.log(err) })