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


/**
 * Uses the specified testConfig for teh preLoader-section and applies the related paths found at
 * pathConfigUrl (config-file url()) to it, then passes it to getPaths() and returns the value.
 * content found at pathConfigUrl should be in a format @coon-js/extjs-link produces.
 *
 * @example
 *
 *  json at "pathConfigUrl.json":
 *
 *  {
 *       css: [{
 *               modern: [
 *                   "foo.css"
 *               ],
 *               classic: [
 *                   "bar.css"
 *               ]
 *
 *       }],
 *       js: {
 *               modern: "modern.js",
 *               classic: "classic.js"
 *
 *      }
 *   }
 *
 *
 *  const config = {
 *      loaderPath: {
 *       "Ext.Package": "/node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/src/Package.js",
 *       "coon.core": "../src/",
 *   },
 *   preloads: {
 *       css: [{
 *               modern: [
 *                   "/node_modules/@sencha/ext-modern-runtime/material/material-all_1.css",
 *                   "/node_modules/@sencha/ext-modern-runtime/material/material-all_2.css"
 *               ],
 *               classic: [
 *                   "/node_modules/@sencha/ext-classic-runtime/material/material-all_1.css",
 *                   "/node_modules/@sencha/ext-classic-runtime/material/material-all_2.css",
 *                   "/node_modules/@sencha/ext-classic-runtime/material/material-all_3.css"
 *               ]
 *       }],
 *       js: [
 *           "/node_modules/@l8js/l8/dist/l8.runtime.js", {
 *               modern: "/node_modules/@sencha/ext-modern-runtime/modern.engine.enterprise.js",
 *               classic: "/node_modules/@sencha/ext-modern-runtime/classic.engine.enterprise.js"
 *           }
 *       ]
 *   }};
 *
 *  configureWithExtJsLinkPaths(config, "pathConfigUrl.json", true); // returns {
 *   //   preload : [
 *   //       "foo.css",
 *   //       "/node_modules/@l8js/l8/dist/l8.runtime.js",
 *   //       "/node_modules/@sencha/ext-modern-runtime/modern.engine.enterprise.js"
 *   //       "modern.js"
 *   //   ],
 *   //   loaderPath : {
 *   //       "Ext.Package": "/node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/src/Package.js",
 *   //       "coon.core": "../src/"
 *   //   }
 *  // };
 *
 *
 * @param {Object} testConfig
 * @param {String} pathConfigUrl
 * @param {Boolean} isModern
 * @returns {Promise<{loaderPath: {}, preload: *[]}>}
 */
export const configureWithExtJsLinkPaths = async function (testConfig, pathConfigUrl, isModern) {

    const
        loader = new l8.request.FileLoader();

    if (await loader.ping(pathConfigUrl)) {

        const
            extjsLinkConfig = JSON.parse(await loader.load(pathConfigUrl)),
            mergedCss = {}, mergedJs = {},
            collect = (section, toolkit) => {
                let res = [];
                section.forEach(entry => {
                    if (l8.isString(entry)) {
                        res.push(entry);
                    } else if (l8.ispo(entry)) {
                        res = res.concat(entry[toolkit] ?? []);
                    }
                });
                return res;
            };

        ["classic", "modern"].forEach(toolkit => {

            let ff = l8.ff.bind(null, toolkit),
                css = collect([].concat(l8.nchn("preload.css", testConfig)), toolkit),
                js = collect([].concat(l8.nchn("preload.js", testConfig)), toolkit),
                extCss = l8.nchn("css", extjsLinkConfig, ff),
                extJs =  l8.nchn("js", extjsLinkConfig, ff);



            l8.chn(toolkit, mergedCss, [].concat(css, [].concat(extCss)));
            l8.chn(toolkit, mergedJs, [].concat(js, [].concat(extJs)));
        });


        l8.chn("preload.css", testConfig, mergedCss, true);
        l8.chn("preload.js", testConfig, mergedJs, true);
    }

    return getPaths(testConfig, isModern);

};


/**
 * Consumes a configuration object and looks up js/css-related path information,
 * then returns it pre-configured to be used with Siestas Siesta.Harness.Browser.ExtJS()#config.
 *
 * @example
 *
 *  const config = {
 *      loaderPath: {
 *       "Ext.Package": "/node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/src/Package.js",
 *       "coon.core": "../src/",
 *   },
 *   preloads: {
 *       css: [{
 *               modern: [
 *                   "/node_modules/@sencha/ext-modern-runtime/material/material-all_1.css",
 *                   "/node_modules/@sencha/ext-modern-runtime/material/material-all_2.css"
 *               ],
 *               classic: [
 *                   "/node_modules/@sencha/ext-classic-runtime/material/material-all_1.css",
 *                   "/node_modules/@sencha/ext-classic-runtime/material/material-all_2.css",
 *                   "/node_modules/@sencha/ext-classic-runtime/material/material-all_3.css"
 *               ]
 *       }],
 *       js: [
 *           "/node_modules/@l8js/l8/dist/l8.runtime.js", {
 *               modern: "/node_modules/@sencha/ext-modern-runtime/modern.engine.enterprise.js",
 *               classic: "/node_modules/@sencha/ext-modern-runtime/classic.engine.enterprise.js"
 *          }
 *       ]
 *   }};
 *
 *  getPaths(config, true); // returns {
 *   //   preload : [
 *   //       "/node_modules/@sencha/ext-modern-runtime/material/material-all_1.css",
 *   //       "/node_modules/@sencha/ext-modern-runtime/material/material-all_2.css",
 *   //       "/node_modules/@l8js/l8/dist/l8.runtime.js",
 *   //       "/node_modules/@sencha/ext-modern-runtime/modern.engine.enterprise.js"
 *   //   ],
 *   //   loaderPath : {
 *   //       "Ext.Package": "/node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/src/Package.js",
 *   //       "coon.core": "../src/"
 *   //   }
 *  // };
 *
 *
 *
 */
export const getPaths = (config, isModern) => {

    const
        result = {preload: [], loaderPath: {}},
        isObject = l8.isObject,
        isArray = l8.isArray,
        isString = l8.isString,
        toolkit = isModern ? "modern" : isModern === false ? "classic" : null,
        parseSection = (section) => {

            section = [].concat(section);

            section.forEach((entry) => {

                if (isString(entry)) {
                    result.preload.push(entry);
                } else if (isObject(entry) && toolkit !== null) {
                    if (isArray(entry[toolkit])) {
                        result.preload = result.preload.concat(entry[toolkit]);
                    } else if (isString(entry[toolkit])) {
                        result.preload.push(entry[toolkit]);
                    }
                }

            });

        };

    l8.assign(
        result.loaderPath,
        [config.loaderPath || {}, "classic", "modern"],
        config.loaderPath && config.loaderPath[toolkit] ? config.loaderPath[toolkit] : {}
    );

    const {js, css} = config.preload || {};

    parseSection(css);
    parseSection(js);

    return result;

};