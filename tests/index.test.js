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
            "coon.core": "../src/",
            "modern": {
                "modern" : "included"
            },
            "classic": {
                "classic" : "included"
            }
        },
        preload: {
            css: [{
                modern: [
                    "/node_modules/@sencha/ext-modern-runtime/material/material-all_1.css",
                    "/node_modules/@sencha/ext-modern-runtime/material/material-all_2.css"
                ],
                classic: [
                    "/node_modules/@sencha/ext-classic-runtime/material/material-all_1.css",
                    "/node_modules/@sencha/ext-classic-runtime/material/material-all_2.css",
                    "/node_modules/@sencha/ext-classic-runtime/material/material-all_3.css"
                ]
            }],
            js: [
                "/node_modules/@l8js/l8/dist/l8.runtime.js", {
                    modern: "/node_modules/@sencha/ext-modern-runtime/modern.engine.enterprise.js",
                    classic: "/node_modules/@sencha/ext-modern-runtime/classic.engine.enterprise.js"
                }
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
            "coon.core": "../src/",
            "modern": "included"
        }
    });
    
});

const testConfigureWithExtJsLinkPaths = async function (extjsLinkConfig, config, result, isModern = true) {

    const mockLoader = {
        ping : jest.fn().mockResolvedValue(true),
        load : jest.fn().mockResolvedValue(JSON.stringify(extjsLinkConfig))
    };

    l8.request.FileLoader.prototype.ping = mockLoader.ping;
    l8.request.FileLoader.prototype.load = mockLoader.load;

    let exp = await configureWithExtJsLinkPaths(config, "url", isModern);
    expect(exp).toEqual(result);
};

test("configureWithExtJsLinkPaths() - 1", async () => {

    const extjsLinkConfig = {
            "css": {
                "modern": ["modernCssA"]
            },

            "js": [{
                "modern": "modernJsA"
            }]
        },
        config = {
            preload: {
                css: {
                    modern: "preloadModernCssA"
                },
                js: "/node_modules/@l8js/l8/dist/l8.runtime.js"
            }
        },
        result = {
            loaderPath : {},
            preload: [
                "preloadModernCssA",
                "modernCssA",
                "/node_modules/@l8js/l8/dist/l8.runtime.js",
                "modernJsA"
            ]
        };

    await testConfigureWithExtJsLinkPaths(extjsLinkConfig, config, result);
});

test("configureWithExtJsLinkPaths() - 2", async () => {

    const extjsLinkConfig = {
            "css": {
                "modern": "modernCssA",
                "classic": "classicCssB"
            },

            "js": [{
                "classic": [
                    "classicJsC",
                    "classicJsD"
                ],
                "modern": [
                    "modernJsE",
                    "modernJsF"
                ]
            }]
        },
        config = {
            loaderPath: {
                "Ext.Package": "/node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/src/Package.js",
                "coon.core": "../src/",
                "modern": {
                    "modern": "included"
                },
                "classic": {
                    "classic": "included"
                }
            },
            preload: {
                css: [{
                    modern: [
                        "/node_modules/@sencha/ext-modern-runtime/material/material-all_1.css",
                        "/node_modules/@sencha/ext-modern-runtime/material/material-all_2.css"
                    ],
                    classic: [
                        "/node_modules/@sencha/ext-classic-runtime/material/material-all_1.css",
                        "/node_modules/@sencha/ext-classic-runtime/material/material-all_2.css",
                        "/node_modules/@sencha/ext-classic-runtime/material/material-all_3.css"
                    ]
                }],
                js: [
                    "/node_modules/@l8js/l8/dist/l8.runtime.js", {
                        modern: "/node_modules/@sencha/ext-modern-runtime/modern.engine.enterprise.js",
                        classic: "/node_modules/@sencha/ext-modern-runtime/classic.engine.enterprise.js"
                    }
                ]
            }
        },
        result = {
            preload: [
                "/node_modules/@sencha/ext-modern-runtime/material/material-all_1.css",
                "/node_modules/@sencha/ext-modern-runtime/material/material-all_2.css",
                "modernCssA",
                "/node_modules/@l8js/l8/dist/l8.runtime.js",
                "/node_modules/@sencha/ext-modern-runtime/modern.engine.enterprise.js",
                "modernJsE",
                "modernJsF"
            ],
            loaderPath: {
                "Ext.Package": "/node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/src/Package.js",
                "coon.core": "../src/",
                "modern": "included"
            }
        };

    await testConfigureWithExtJsLinkPaths(extjsLinkConfig, config, result);
});


test("testConfigureWithExtJsLinkPaths - 3" , async () =>{

    const extjsLinkConfig = {
            css : {
                modern : "modernCssA",
                classic : "classicCssA"
            },
            js : {
                modern : "modernJsA",
                classic : "classicJsA"
            }
        },
        config = {
            loaderPath: {
                "Ext.Package": "../node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/Package.js",
                "Ext.package": "../node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/package",
                "coon.core.overrides.core": "../overrides",
                "coon.core.fixtures": "./fixtures",
                "coon.core": "../src/",
                "coon.test": "./src"
            },
            preload: {
                js: ["../node_modules/@l8js/l8/dist/l8.runtime.umd.js", {
                    classic: "../build/extjs-build/packages/ux/classic/ux-debug.js",
                    modern: "../build/extjs-build/packages/ux/modern/ux-debug.js"
                }]
            }
        },
        result = {
            preload: [
                "classicCssA",
                "../node_modules/@l8js/l8/dist/l8.runtime.umd.js",
                "../build/extjs-build/packages/ux/classic/ux-debug.js",
                "classicJsA"
            ],
            loaderPath: {
                "Ext.Package": "../node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/Package.js",
                "Ext.package": "../node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/package",
                "coon.core.overrides.core": "../overrides",
                "coon.core.fixtures": "./fixtures",
                "coon.core": "../src/",
                "coon.test": "./src"
            }
        };

    await testConfigureWithExtJsLinkPaths(extjsLinkConfig, config, result, false);
});