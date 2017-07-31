var Metalsmith = require('metalsmith'),
markdown = require('metalsmith-markdown'),
templates = require('metalsmith-templates'),
collections = require('metalsmith-collections'),
permalinks = require('metalsmith-permalinks');

Metalsmith(__dirname)
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
    pattern: ':collections/:title'
}))
.use(templates({
    engine: 'handlebars',
    partials: {
        header: 'partials/header',
        footer: 'partials/footer'
    }
}))
.destination('./build')
.build(function (err) { if(err) console.log(err) })