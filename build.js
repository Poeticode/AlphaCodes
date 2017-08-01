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
offline = require('metalsmith-offline'),
copy = require('metalsmith-copy'),
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
    sourcemaps: false,
    watch: false,
    transform: [["babelify", { "presets": ["es2015"] }]]
  }))
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
.use(offline({
  trailingSlash: false
}))
.destination('./build')
.build(function (err) { if(err) console.log(err) })