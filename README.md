# AlphaCodes
A simple static site using [MetalSmith](http://www.metalsmith.io/) and [Netlify CMS](https://github.com/netlify/netlify-cms).

## Process
* Markdown files in `/src` have YAML data and reference a handlebars template from `/templates` to create a page in `/build`. 
* `/src/styles` contains sass
* `/src/js/app.js` is the entry point for Babel
* `/src/admin` has the netlify CMS data. You can make a page editable by setting it up in `config.yml` within the folder.

## TODO
Place images uploaded through the CMS into the source folder. See [#1](https://github.com/Poeticode/AlphaCodes/issues/1)