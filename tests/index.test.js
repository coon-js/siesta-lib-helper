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

import * as l8 from "@l8js/l8";
import {getPaths, configureWithExtJsLinkPaths} from "../src/index.js";


test("getPaths", () => {

    const config = {
        loaderPath: {
            "Ext.Package": "/node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/src/Package.js",
            "coon.core": "../src/"
        },
        preload: {
            css: [{
                extjs: {
                    modern: [
                        "/node_modules/@sencha/ext-modern-runtime/material/material-all_1.css",
                        "/node_modules/@sencha/ext-modern-runtime/material/material-all_2.css"
                    ],
                    classic: [
                        "/node_modules/@sencha/ext-classic-runtime/material/material-all_1.css",
                        "/node_modules/@sencha/ext-classic-runtime/material/material-all_2.css",
                        "/node_modules/@sencha/ext-classic-runtime/material/material-all_3.css"
                    ]
                }
            }],
            js: [
                "/node_modules/@l8js/l8/dist/l8.runtime.js", {
                    extjs: {
                        modern: "/node_modules/@sencha/ext-modern-runtime/modern.engine.enterprise.js",
                        classic: "/node_modules/@sencha/ext-modern-runtime/classic.engine.enterprise.js"
                    }}
            ]
        }};

    expect(getPaths(config, true)).toEqual({
        preload: [
            "/node_modules/@sencha/ext-modern-runtime/material/material-all_1.css",
            "/node_modules/@sencha/ext-modern-runtime/material/material-all_2.css",
            "/node_modules/@l8js/l8/dist/l8.runtime.js",
            "/node_modules/@sencha/ext-modern-runtime/modern.engine.enterprise.js"
        ],
        loaderPath: {
            "Ext.Package": "/node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/src/Package.js",
            "coon.core": "../src/"
        }
    });
    
});


test("configureWithExtJsLinkPaths()", async () => {

    const config = {
        loaderPath: {
            "Ext.Package": "/node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/src/Package.js",
            "coon.core": "../src/"
        },
        preload: {
            css: [{
                extjs: {
                    modern: [
                        "/node_modules/@sencha/ext-modern-runtime/material/material-all_1.css",
                        "/node_modules/@sencha/ext-modern-runtime/material/material-all_2.css"
                    ],
                    classic: [
                        "/node_modules/@sencha/ext-classic-runtime/material/material-all_1.css",
                        "/node_modules/@sencha/ext-classic-runtime/material/material-all_2.css",
                        "/node_modules/@sencha/ext-classic-runtime/material/material-all_3.css"
                    ]
                }
            }],
            js: [
                "/node_modules/@l8js/l8/dist/l8.runtime.js", {
                    extjs: {
                        modern: "/node_modules/@sencha/ext-modern-runtime/modern.engine.enterprise.js",
                        classic: "/node_modules/@sencha/ext-modern-runtime/classic.engine.enterprise.js"
                    }}
            ]
        }};

    let fileLoader = new l8.request.FileLoader();
    let spy = jest.spyOn(fileLoader, "load").mockReturnValue({

        "css": {
            "extjs": {
                "modern": "A",
                "classic": "B"
            }
        },

        "js": [{
            "extjs": {
                "classic": [
                    "C",
                    "D"
                ],
                "modern": [
                    "E",
                    "F"
                ]
            }
        }]

    });


    expect(configureWithExtJsLinkPaths(config, "url", true)).resolves.toEqual({
        preload: [
            "A",
            "/node_modules/@l8js/l8/dist/l8.runtime.js",
            "E"
        ],
        loaderPath: {
            "Ext.Package": "/node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/src/Package.js",
            "coon.core": "../src/"
        }
    });


});