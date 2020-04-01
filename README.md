# COVID-19 Email Creator

This is a simple gulp-powered dev env to output HTML. 

It's actually only partially gulp powered. To actually inline all the css you need to run `npm run build` and it will hit gulp and then the build.js file. 

## Installation and Usage

`$ npm install` 
`$ npm run dev`

This will spin up a local server and give you a preview on localhost. Check the console for the port. 

It also watches for changes, though it requires you to reload the page. 

### Editing

All files can be edited within the src view. CSS is concat'd and included in the HTML. HTML component files are also included within the main index.html file. 

If you need more css files or html files, just create them within the src/components directory, make sure the html file is `include`d in the index.html, and then restart gulp. 

### Pushing Files to S3

`$ npm run deploy`