const path = require('path');
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

const renderDOM = async (filename) => {
    const filepath = path.join(process.cwd(), filename);

    const dom = await JSDOM.fromFile(filepath, {
        runScripts: 'dangerously',
        resources: 'usable'
    });

    return new Promise((resolve, _) => {
        dom.window.document.addEventListener('DOMContentLoaded', () => {
            resolve(dom);
        });
    });
};


module.exports = {
    renderDOM
};

// write all test file names to ignore when running helper.js

// test('dummy test', () => {
//   expect(true).toBe(true);
// });