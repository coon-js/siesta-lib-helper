#!/usr/bin/env node
/**
 * coon.js
 * siesta-lib-helper
 * Copyright (C) 2021 Thorsten Suckow-Homberg https://github.com/coon-js/siesta-lib-helper
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


import fs from "fs-extra";
import path from "path";

/**
 * - Copies html-files from html-folder to target package.
 */
const files = [{
    "from": path.dirname(import.meta.url).replace("file:///", "") + "/src/html/index.extjs-browser.html",
    "to": path.resolve("./tests/index.extjs-browser.html")
}, {
    "from":path.dirname(import.meta.url).replace("file:///", "") + "/src/html/tests.redirect.html",
    "to": path.resolve("./tests.redirect.html")
}];


// +--------------------------------------------
// |                  int main
// +--------------------------------------------
/* eslint-disable-next-line  no-console*/
console.log([
    "-----------------------------------------------------------",
    "----         [@coon-js/siesta-lib-helper]              ----",
    "----   https://github.com/coon-js/siesta-lib-helper    ----",
    "------------------------------------------------------------"
].join("\n"));

files.forEach(file => {
    try {
        /* eslint-disable-next-line  no-console */
        console.log(`Copying ${file.from} to ${file.to}`);
        fs.copySync(file.from, file.to);
        /* eslint-disable-next-line  no-console */
        console.log("Success!");
    } catch (err) {
        /* eslint-disable-next-line  no-console */
        console.error(err);
        process.exit(1);
    }

});


process.exit(0);