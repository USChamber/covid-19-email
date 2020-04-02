const inlineCss = require('inline-css');
const fs = require('fs');
const path = require('path');

const htmlPath = './dist/index.html';

const init = () => {
    const html = fs.readFileSync(path.join(__dirname, htmlPath));

    inlineCss(html, {
            removeStyleTags: false,
            url: 'https://uschamber-webassets.s3.amazonaws.com/email-assets/daily-bulletin/',
            // applyTableAttributes: true,
        })
        .then(function (result) {
            const dir = path.join(__dirname, 'dist');
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            fs.writeFileSync(path.join(dir, 'index_inlined.html'), result, { encoding: 'utf8' });
        });
};

init();