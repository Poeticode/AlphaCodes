# Skeleton

A simple static-site generator using Handlebars templating.

### Version
1.0.0

### Tech

This is what this skeleton is packing:

* [Gulp](//gulp.js) - the streaming build system that manages *everything* below.
* [Handlebars](http://handlebarsjs.com/) - The main templating engine
* [Sass](http://sass-lang.com/) - For powerful & manageable CSS
* [Babel](https://babeljs.io/) - To write ES6 code today
* [Browserify](http://browserify.org/) - To encourage JS modularization
* [LiveReload](http://livereload.com/) - Because, like all good developers, I am lazy.
* [Gulp-SFTP](https://www.npmjs.com/package/gulp-sftp) - For deployment, easily configurable.
* [jQuery](//jquery.com) - I'm already writing ES6 code. Might as well go H.A.M.
* [GreenSock](https://greensock.com/) - My favorite animation library.
* [MinCSS](http://mincss.com/) - An insanely small CSS framework that's easy to override.

### Installation

You need Gulp installed globally:

```shell
$ npm install -g gulp
```

```shell
$ git clone git@gitlab.com:Poeticode/Skeleton.git [app_name]
$ cd [app_name]
$ npm install
```

### Development

##### LiveReload:

* Install the [LiveReload Chrome plugin](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en).
* In chrome://extensions/, check `Allow access to File URLs` for LiveReload.
* Go to your local site and toggle on the LiveReload Chrome plugin.

```shell
$ gulp watch
```

Any changes in `_src/` will be built & delivered to `dist/`, which in turn is live reloaded to your local site!

##### SFTP Upload:

* Create `.ftppass` at the root of your folder, with your sftp auth info.
  * [Gulp-SFTP](https://www.npmjs.com/package/gulp-sftp) has examples at the bottom.
* Create `.ftpdest` at the root of your folder, with your host/remotePath details.
  * Or just enter them directly in the gulpfile.
* Modify the **upload** task in `gulpfile.js` to use those credentials.

```sh
$ gulp upload
```

Everything in `dist/` should be uploaded to your server!

##### Handlebarz templating
* `hbs/data`, `hbs/helpers`, `hbs/partials` holds the data/helpers/partials your templates will use.
* `hbs/data/dynamic` creates individual pages based on whatever arrays you toss in there. Each array element requires three certain attributes.
  * The `partialsName` property determines which handlebars partial it'll use as a template.
  * The `slug` property determines the file's name.
  * The `dest` property determines the folder it's placed in.
  * All other attributes you add will be accessible in the Handlebars partial!
* Everything else should be template files that will be created and sent to the `dist` folder. (ie: `hbs/projects/greensock.html` will end up at `dist/projects/greensock.html` that will be accessible via `[url]/projects/greensock.html`)

### Todos

 - Write Tests
 - add basic client-side routing functionality to turn this baby into a [Lazymorphic app](https://blog.andyet.com/2015/05/18/lazymorphic-apps-bringing-back-static-web/)!

License
----

MIT