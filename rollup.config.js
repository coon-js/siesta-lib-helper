/**
 * coon.js
 * siesta-lib-helper
 * Copyright (C) 2021-2022 Thorsten Suckow-Homberg https://github.com/coon-js/siesta-lib-helper
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

const alias = require('@rollup/plugin-alias');

export default [{
    input: './src/index.js',
    output : {
        file :'./dist/siesta-lib-helper.runtime.esm.js',
        format: 'esm',
        sourcemap: 'inline',
        name : "default"
    },
    plugins: [
        alias({
            entries: [
                { find: '@l8js/l8', replacement: './node_modules/@l8js/l8/dist/l8.packages.esm.js' }
            ]
        })
    ],
    external: ["crypto-js/md5"]
}, {
    input: './src/BoilerPlate.js',
    output : {
        file :'./dist/BoilerPlate.esm.js',
        format: 'esm',
        sourcemap: 'inline',
        name : "default"
    },
    plugins: [
        alias({
            entries: [
                { find: '@l8js/l8', replacement: './node_modules/@l8js/l8/dist/l8.packages.esm.js' }
            ]
        })
    ],
    external: ["crypto-js/md5"]
}];