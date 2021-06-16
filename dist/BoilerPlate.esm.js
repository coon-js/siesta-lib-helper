/**
 * l8.js
 * l8
 * Copyright (C) 2021 Thorsten Suckow-Homberg https://github.com/l8js/l8
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

/**
 *
 * @param target
 * @return {boolean}
 */
const isString = target => typeof target === "string";
const iss = isString;

/**
 * 
 * @param target
 * @return {boolean}
 */
const isObject = target => typeof target === "object";
const iso = isObject;


/**
 *
 * @param target
 * @return {boolean}
 */
const isPlainObject = target => typeof target === "object" &&
                                       Object.prototype.toString.call(target) === "[object Object]" &&
                                       target.constructor === Object;
const ispo = isPlainObject;


/**
 * 
 * @param target
 * @return {boolean}
 */
const isFunction = target => typeof target === "function";

/**
 *
 * @param target
 * @return {any}
 */
const isArray = target =>  Array.isArray ? Array.isArray(target) : Object.prototype.toString.call(target) === "[object Array]";
const isa = isArray;

/**
 *
 * @param target
 * @return {any}
 */
const isRegExp = target => target instanceof RegExp;
const isrx = isRegExp;

/**
 * Searches for the first entry in source. Looks up the key in source if it is an object and returns the first
 * match found, otherwise iterates through the array and returns the first match.
 *
 * @example
 *
 *  l8.findFirst("bar", {foo : {}, bar : {snafu : ""}}; // returns the bar-object
 *  l8.findFirst("bar", [{foo : {}}, {bar : {snafu : ""}}]; // returns the bar-object
 *
 * @param {String} key
 * @param {(Array|cObject)} source
 *
 * @return {?*}
 */
const findFirst = (key, source) => {

    let match = null,
        iso$1 = iso(source);

    (isa(source) ? source : iso$1 ? Object.entries(source) : []).some(item => {

        if (iso$1 && item[0] === key) {
            match = item[1];
            return true;
        } else if (iso(item) && item[key] !== undefined) {
            match = item[key];
            return true;
        }
    });

    return match;
};
const ff = findFirst;

/**
 * l8.js
 * l8
 * Copyright (C) 2021 Thorsten Suckow-Homberg https://github.com/l8js/l8
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

/**
 * Replaces all tokens specified in search with the tokens specified in replace in the
 * target string.
 * Will replace from left to right if more than one search token is specified.
 * If token is an array and replace is a string, all tokens will be replaced with this string.
 * If tokens and replace are both arrays, and replace has less entries, items in tokens matching a non existent
 * index in replace will be replaced with an empty value.
 *
 *      @example
 *      let str = l8.replace(["foo", "bar"], ["oof", "rab"], "this foo is bar");
 *      // this oof is rab
 *
 *       let str = l8.replace(["A", "B"], ["B", "D"], "A");
 *      // D
 *
 *      let str = l8.replace(["A", "C"], "B", "AC");
 *      // BB
 *
 *      let str = l8.replace(["A", "C"], ["B"], "AC");
 *      // B
 *
 *      let str = l8.replace("A", "B", "A");
 *      // B
 *
 *
 * @param {(String|Array<String>)} tokens
 * @param {(String|Array<String>)} replace
 * @param {String} target
 *
 * @return {String}
 *
 * @throws {Error} if str was not a string
 *
 * @see escapeRegExp
 */
const replace = function (tokens, replace, target) {

    if (!iss(target)) {
        throw new Error("\"str\" must be a string");
    }

    tokens  = [].concat(tokens);
    replace = !iss(replace) ? [].concat(replace) : new Array(tokens.length).fill(replace);

    tokens.forEach((item, index) => {
        target = target.replace(new RegExp(escapeRegExp(item), "g"), replace[index] ?? "");
    });


    return target;
};
const rpl = replace;


/**
 * Unifies the string by removing subsequent entries of duplicates of token.
 *
 * @example
 *
 *     l8.unify("foo//bar///", "/"); // "foo/bar/"
 *
 * @param {String} token
 * @param {String} target
 *
 * throws {Error} if target or token are not strings
 */
const unify = function (target, token) {

    if (!iss(target) || !iss(token)) {
        throw new Error("\"str\" must be a string");
    }

    return target.split(token).filter(
        (x, index, source) => index === 0 || index === source.length - 1 || x !== ""
    ).join(token);

};


/**
 * Returns true if the specified string is not any of the passed arguments. Matches are strict.
 *
 * @example
 *  l8.isNot("string", "string"); // false
 *  l8.isNot("string", "String"); // true
 *  l8.isNot("string", "foo", "bar"); // true
 *  l8.isNot("string", "foo", "bar", "string"); // false
 *
 * @param {String} target
 * @param {...String} excludes
 *
 * @return {Boolean}
 */
const isNot = function (target) {

    const
        expr = "(?!(" + Array.prototype.slice.call(arguments, 1).join("|") + "))^",
        regex = new RegExp(expr, "g");

    return target.match(regex) !== null;
};


/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
 */
function escapeRegExp (string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

var string = /*#__PURE__*/Object.freeze({
    __proto__: null,
    replace: replace,
    rpl: rpl,
    unify: unify,
    isNot: isNot
});


/**
 * Utilities
 */


/**
 * Creates an object chain on the target object and initializes it with
 * the defaultValue, if specified.
 * Returns the target object.
 * The third argument can be a function that gets called with the chain's name created as its argument.
 * Overrides any value found on the object if override is set to true
 *
 * @example
 *    let obj = {};
 *    l8.chain("a.b.c.d", obj, "foo");
 *
 *    // obj
 *    // { a : { b : {c : { d : "foo"}}}}
 *
 * This method lets you pass a list of properties as the first argument that will be chained.
 * The third argument can be a function that gets called with each property upon chaining.
 * The return value of this function is used as the value for the chained property.
 * Otherwise, the third argument will be used as the value.
 *
 * @example
 * let obj = {};
 *    l8.chain(["a.b", "e.f"], obj, (chain) => console.log(chain.toUpperCase()));
 *
 *    // obj
 *    // { a : { b : "B"}, {e : {f : "F"}}}
 *
 *
 * @param {!(String|Array)} chains
 * @param {Object} target
 * @param {?(*|function)} defaultValue
 * @param {Boolean} [override=false]
 *
 * @return {Object} target
 */
const chain = function (chains, target = {}, defaultValue = undefined, override = false) {

    chains = [].concat(chains);

    chains.forEach((str) => {
        /**
         * @todo O(n) ?
         */
        const
            keys = str.split("."),
            cr = (obj, keys) => {

                let key;

                key = keys.shift();

                if (!obj[key] || (override === true && !keys.length)) {
                    obj[key] = keys.length ? {} : (isFunction(defaultValue) ? defaultValue(str) : defaultValue) ;
                }

                if (keys.length) {
                    cr(obj[key], keys);
                }

                return obj;
            };

        cr(target, keys);
    });


    return target;
};

/**
 * Alias for chain()
 * @type {function(!(String|Array), Object=, ?(*|Function)=): Object}
 */
const chn = chain;


/**
 * Splits the specified string by looking for "." as separators and returns
 * undefined if the evaluated property is not available, otherwise the value
 * of the property.
 *
 *      @example
 *      var foo = { 1 : { 2 : { 3 : { 4 : 'bar'}}}};
 *
 *      l8.unchain('1.2.3.4', foo); // 'bar'
 *
 * @param {String} chain The object chain to resolve
 * @param {Object} scope The scope where the chain should be looked up
 * @param {(*|Function)} defaultValue a defaultValue to return in case the chain is not existing.
 * if this argument is a function, the function gets called. If the chain existed, it will be called with the
 * value of the chain, and the return value of this function is returned.
 * @example
 * const cb = value => value.toUpperCase(),
 *      foo = { 1 : { 2 : { 3 : { 4 : 'bar'}}}};
 *
 *  l8.unchain('1.2.3.4', foo, cb); // 'BAR'
 *
 * @return {*} undefined if either scope was not found or the chain could
 * not be resolved, otherwise the value found in [scope][chain]
 */
const unchain = function (chain, scope, defaultValue = undefined) {

    var parts = chain.split("."),
        obj   = scope;

    while (obj !== undefined && parts.length) {
        obj = obj[parts.shift()];
    }

    if (isFunction(defaultValue)) {
        return defaultValue(obj);
    }

    if (obj === undefined) {
        return defaultValue;
    }

    return obj;
};

/**
 * Alias for unchain()
 * @type {function(!(String|Array), Object=, ?(*|Function)=): Object}
 */
const nchn = unchain;

/**
 * Lets you specify a regular expression to make sure only those
 * keys are assigned from source to target that match the expression.
 *
 * @example
 *     l8.assign({}, {"foo": "bar"}, [{"snafu" : "foobar", "key": "value"}, /(?!(snafu))^/g]);
 *     // results in {"foo": "bar", "key": "value"}
 *
 *      l8.assign({}, {"foo": "bar"}, [{"snafu" : "foobar", "key": "value", "some": "obj"}, "snafu", "key"]);
 *     // results in {"foo": "bar", "some": "obj"}
 *
 *
 * @param {!Object} target The target object to assign tto
 * @param {...(Object|[Object, (RegExp|...String])} The objects to use for assigning. If an array is submitted, the first
 * index is the object source to assign from, and the second argument ist the regular expression that must match
 * the object keys to use for assignment. If there is no RegExp as a second argument but instead a string, this string will
 * be used for comparison. Can also be an arbitrary number of strings. All the keys not strict equaling to the submitted
 * arguments will then be assigned their values to target.
 *
 * @return {Object} target
 */
const assign = function (target) {

    let sources = Array.prototype.slice.call(arguments, 1);

    sources = sources.map( source => {

        if (isPlainObject(source)) {
            return source;
        }


        if (isArray(source)) {
            const [obj, ...args] = source,
                regexp = args[0];

            return Object.fromEntries(
                Object.entries(obj).filter(entry => {
                    let key = entry[0];
                    if (isrx(regexp)) {
                        return key.match(regexp) !== null;
                    } else {
                        return isNot.apply(string, [key].concat(args));
                    }
                })
            );
        }
    });

    return Object.assign(target, ...sources);
};

/**
 * l8.js
 * l8
 * Copyright (C) 2021 Thorsten Suckow-Homberg https://github.com/l8js/l8
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

/**
 * ResourceRequestor-implementation using XmlHttpRequest api.
 *
 * @example
 *
 *    // existing json-file at "./app-cn_mail.conf.json"
 *    const fileLoader = new XmlHttpResourceRequestor();
 *    const res = await fileLoader.request("./app-cn_mail.conf.json");
 *    console.log(res); // plain text contents of the file on success
 *
 */
class FileLoader {


    /**
     * Sends a HEAD request to the specified resource location.
     *
     *
     * @param url
     *
     * @return {Promise<void>} false if any exception occures while trying to access the resource,
     * indicating that the resource might not exist.
     *
     * @throws if url was not a string
     */
    async ping (url) {

        let request;

        try {
            request = await this.request(url, "HEAD");
        } catch (e) {
            return false;
        }

        return request.status === 200;
    }


    /**
     * Initiates loading the file specified with the given url and returns a
     * Promise or a mixed value representing the file contents if used with async/await.
     * Implementing APIs should be aware of ping to send a HEAD-request to the resource
     * before an attempt to load it is made.
     *
     * @example
     * // thenable
     * loader.load("app-cn_mail.conf.json").then(
     *      (conf) => {console.log(conf);}, // console.logs the plain text from the loaded file
     *      (exc) => {console.log(exc);} // console logs the exception, if any occured,
     *                                   // which is a coon.core.data.request.HttpRequestException
     * );
     * // or
     * let txt;
     * try {
     *    txt = await loader.load("app-cn_mail.conf.json");
     * } catch (e) {
     *    // exception handling for  coon.core.data.request.HttpRequestException
     * }
     * console.log(txt); // file contents
     *
     * @param {String} url The location to read the file from
     *
     * @return {Promise<*>}
     *
     * @throws if any exception occured, or if url was not a string
     */
    async load (url) {
        let request = await this.request(url, "GET");
        return request.responseText;
    }


    /**
     * @private
     * @param url
     * @param method
     */
    async request (url, method) {

        if (["GET", "HEAD"].indexOf(method) === -1) {
            throw new Error(`"method" (${method}) is not supported`);
        }

        if (!isString(url)) {
            throw new Error("\"url\" must be a string representing the resource location");
        }

        let ret = await new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open(method, url);

            request.onload = (progressEvent) => {
                const httpRequest = progressEvent.target;
                if (httpRequest.status === 200) {
                    resolve(httpRequest);
                } else {
                    reject(new Error(
                        httpRequest.status + " " + httpRequest.statusText
                    ));
                }
            };

            request.onerror = (progressEvent) => {
                const httpRequest = progressEvent.target;
                reject(new Error(
                    `An unexpected error occured while trying to load from "${httpRequest.responseURL}"`
                ));
            };

            request.send();
        });

        return ret;
    }


}

/**
 * l8.js
 * l8
 * Copyright (C) 2021 Thorsten Suckow-Homberg https://github.com/l8js/l8
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

var _l8js = /*#__PURE__*/Object.freeze({
    __proto__: null,
    FileLoader: FileLoader
});

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
const configureWithExtJsLinkPaths = async function (testConfig, pathConfigUrl, isModern) {

    const
        loader = new _l8js.FileLoader();

    if (await loader.ping(pathConfigUrl)) {

        const
            extjsLinkConfig = JSON.parse(await loader.load(pathConfigUrl)),
            mergedCss = {}, mergedJs = {},
            collect = (section, toolkit) => {
                let res = [];
                section.forEach(entry => {
                    if (isString(entry)) {
                        res.push(entry);
                    } else if (ispo(entry)) {
                        res = res.concat(entry[toolkit] ?? []);
                    }
                });
                return res;
            };

        ["classic", "modern"].forEach(toolkit => {

            let ff$1 = ff.bind(null, toolkit),
                css = collect([].concat(nchn("preload.css", testConfig)), toolkit),
                js = collect([].concat(nchn("preload.js", testConfig)), toolkit),
                extCss = nchn("css", extjsLinkConfig, ff$1),
                extJs =  nchn("js", extjsLinkConfig, ff$1);



            chn(toolkit, mergedCss, [].concat(css, [].concat(extCss)));
            chn(toolkit, mergedJs, [].concat(js, [].concat(extJs)));
        });


        chn("preload.css", testConfig, mergedCss, true);
        chn("preload.js", testConfig, mergedJs, true);
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
const getPaths = (config, isModern) => {

    const
        result = {preload: [], loaderPath: {}},
        isObject$1 = isObject,
        isArray$1 = isArray,
        isString$1 = isString,
        toolkit = isModern ? "modern" : isModern === false ? "classic" : null,
        parseSection = (section) => {

            section = [].concat(section);

            section.forEach((entry) => {

                if (isString$1(entry)) {
                    result.preload.push(entry);
                } else if (isObject$1(entry) && toolkit !== null) {
                    if (isArray$1(entry[toolkit])) {
                        result.preload = result.preload.concat(entry[toolkit]);
                    } else if (isString$1(entry[toolkit])) {
                        result.preload.push(entry[toolkit]);
                    }
                }

            });

        };

    assign(
        result.loaderPath,
        [config.loaderPath || {}, "classic", "modern"],
        config.loaderPath && config.loaderPath[toolkit] ? config.loaderPath[toolkit] : {}
    );

    const {js, css} = config.preload || {};

    parseSection(css);
    parseSection(js);

    return result;

};

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

if (!coonjs.siestaTestConfigObj || !coonjs.siestaGroupsConfigObj || ! coonjs.extjsLinkConfigUrl) {
    throw new Error("Config missing");
}

const
    testConfig = coonjs.siestaTestConfigObj,
    groups = coonjs.siestaGroupsConfigObj,
    extjsLinkConfigUrl = coonjs.extjsLinkConfigUrl;

let toolkitGroups,
    urlParams = new URLSearchParams(document.location.search.substring(1)),
    timeout =  urlParams.get("timeout") ? parseInt(urlParams.get("timeout")) : testConfig.timeout,
    toolkit = urlParams.get("toolkit") ?? "classic";

const
    browser = new Siesta.Harness.Browser.ExtJS(),
    paths = await configureWithExtJsLinkPaths(testConfig, extjsLinkConfigUrl, toolkit === "modern");
debugger;
toolkitGroups = groups.filter(entry => ["universal", toolkit].indexOf(entry.group) !== -1);
// we need to check if the loader specifies different classes for modern/classic here, as the tests
// might be declared as "universal", but the test cases load different files for the toolkits
toolkit = toolkitGroups.length ? toolkitGroups[0].group : "universal";
if (toolkit === "universal" && (testConfig.loaderPath.clrassic || testConfig.loaderPath.mordern)) {
    toolkit =  urlParams.get("toolkit") || (testConfig.loaderPath.classic ? "classic" : "modern");
}


browser.configure(Object.assign({
    title: `${testConfig.name} [${toolkit}]`,
    isEcmaModule: true,
    disableCaching: true,
    config : {
        TIMEOUT : timeout
    }
}, paths));

browser.start(toolkitGroups.length ? toolkitGroups : groups);

// classic | modern | timeout options
document.getElementById("cn_timeout").value = timeout;
if (["classic", "modern"].indexOf(toolkit) !== -1) {
    document.getElementById(`cn_${toolkit}`).checked = true;
} else {
    ["classic", "modern"].forEach(toolkit => document.getElementById(`cn_${toolkit}`).disabled = true);
}
document.getElementById("cn_configBtn").onclick = () => {
    let timeout = document.getElementById("cn_timeout").value,
        toolkit = document.getElementById("cn_classic").checked
            ? "classic"
            : document.getElementById("cn_modern").checked
                ? "modern"
                : "";
    window.location.href = `./index.extjs-browser.html?toolkit=${toolkit}&timeout=${timeout}`;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9pbGVyUGxhdGUuZXNtLmpzIiwic291cmNlcyI6WyIuLi9ub2RlX21vZHVsZXMvQGw4anMvbDgvZGlzdC9sOC5wYWNrYWdlcy5lc20uanMiLCIuLi9zcmMvaW5kZXguanMiLCIuLi9zcmMvQm9pbGVyUGxhdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbi8qKlxuICpcbiAqIEBwYXJhbSB0YXJnZXRcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmNvbnN0IGlzU3RyaW5nID0gdGFyZ2V0ID0+IHR5cGVvZiB0YXJnZXQgPT09IFwic3RyaW5nXCI7XG5jb25zdCBpc3MgPSBpc1N0cmluZztcblxuLyoqXG4gKiBcbiAqIEBwYXJhbSB0YXJnZXRcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmNvbnN0IGlzT2JqZWN0ID0gdGFyZ2V0ID0+IHR5cGVvZiB0YXJnZXQgPT09IFwib2JqZWN0XCI7XG5jb25zdCBpc28gPSBpc09iamVjdDtcblxuXG4vKipcbiAqXG4gKiBAcGFyYW0gdGFyZ2V0XG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5jb25zdCBpc1BsYWluT2JqZWN0ID0gdGFyZ2V0ID0+IHR5cGVvZiB0YXJnZXQgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0YXJnZXQpID09PSBcIltvYmplY3QgT2JqZWN0XVwiICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuY29uc3RydWN0b3IgPT09IE9iamVjdDtcbmNvbnN0IGlzcG8gPSBpc1BsYWluT2JqZWN0O1xuXG5cbi8qKlxuICogXG4gKiBAcGFyYW0gdGFyZ2V0XG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5jb25zdCBpc0Z1bmN0aW9uID0gdGFyZ2V0ID0+IHR5cGVvZiB0YXJnZXQgPT09IFwiZnVuY3Rpb25cIjtcbmNvbnN0IGlzZiA9IGlzRnVuY3Rpb247XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB0YXJnZXRcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmNvbnN0IGlzTnVtYmVyID0gdGFyZ2V0ID0+IHR5cGVvZiB0YXJnZXQgPT09IFwibnVtYmVyXCI7XG5jb25zdCBpc24gPSBpc051bWJlcjtcblxuLyoqXG4gKlxuICogQHBhcmFtIHRhcmdldFxuICogQHJldHVybiB7YW55fVxuICovXG5jb25zdCBpc0FycmF5ID0gdGFyZ2V0ID0+ICBBcnJheS5pc0FycmF5ID8gQXJyYXkuaXNBcnJheSh0YXJnZXQpIDogT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRhcmdldCkgPT09IFwiW29iamVjdCBBcnJheV1cIjtcbmNvbnN0IGlzYSA9IGlzQXJyYXk7XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB0YXJnZXRcbiAqIEByZXR1cm4ge2FueX1cbiAqL1xuY29uc3QgaXNSZWdFeHAgPSB0YXJnZXQgPT4gdGFyZ2V0IGluc3RhbmNlb2YgUmVnRXhwO1xuY29uc3QgaXNyeCA9IGlzUmVnRXhwO1xuXG4vKipcbiAqIFxuICogQHBhcmFtIHRhcmdldFxuICogQHJldHVybiB7e2E6IChmdW5jdGlvbigqKTogYm9vbGVhbiksIG9mOiAoZnVuY3Rpb24oKik6IGJvb2xlYW4pfX1cbiAqL1xuY29uc3QgaXMgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgcmV0dXJuICB7XG4gICAgICAgIGE6IHR5cGUgPT4gdHlwZW9mIHRhcmdldCA9PT0gdHlwZSxcbiAgICAgICAgb2Y6IGNscyA9PiBpc0Z1bmN0aW9uKGNscykgPyB0YXJnZXQgaW5zdGFuY2VvZiBjbHMgOiBmYWxzZVxuICAgIH07XG59O1xuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuLyoqXG4gKiBQcm94eSBmb3Igb2JqZWN0cyB0byBjcmVhdGUgZmx1ZW50IGludGVyZmFjZXMgb3V0IG9mIGFzeW5jIG1ldGhvZHMuXG4gKlxuICogQGV4YW1wbGVcbiAqICAgY29uc3Qgc291cmNlID0ge1xuICogICAgIGZvbyA6IGFzeW5jIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sXG4gKiAgICAgYmFyIDogYXN5bmMgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSxcbiAqICAgICBzbmFmdSA6IGFzeW5jIGZ1bmN0aW9uICgpIHsgcmV0dXJuIFwic25hZnVcIjsgfVxuICogICB9O1xuICpcbiAqICAgY29uc29sZS5sb2coXG4gKiAgICAgICAvLyBpbnN0ZWFkIG9mXG4gKiAgICAgICBhd2FpdCBzb3VyY2UuZm9vKClcbiAqICAgICAgICAgICAgIC50aGVuKHZhbHVlID0+IHNvdXJjZS5iYXIoKSlcbiAqICAgICAgICAgICAgIC50aGVuKHZhbHVlID0+IHNvdXJjZS5zbmFmdSgpKVxuICogICApOyAvLyBcInNuYWZ1XG4gKiAgIC8vIC4uLnlvdSBjYW4gd3JpdGUgaXQuLi5cbiAqICAgY29uc29sZS5sb2coXG4gKiAgICAgIC8vIC4uLiBsaWtlIHRoaXM6XG4gKiAgICAgIGF3YWl0IGxpcXVpZnkoc291cmNlKS5mb28oKVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAuYmFyKClcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNuYWZ1KClcbiAqICAgKTsgLy8gc25hZnVcbiAqXG4gKiBQcmVyZXF1aXNpdGVzOlxuICogPT09PT09PT09PT09PT1cbiAqIC0geW91ciBhc3luYyBtZXRob2RzIGhhdmUgdG8gcmV0dXJuIFwidGhpc1wiLCBpLmUuIHRoZSBzb3VyY2Ugb2JqZWN0IG9mXG4gKiAgIHRoZSBhc3luYyBtZXRob2QsIHNpbmNlIHRoZSBvbkZ1bGxmaWxsZWQgbWV0aG9kcyBuZWVkIHRvIGZvcndhcmRcbiAqICAgdGhpcyBleGFjdCBzYW1lIG9iamVjdC5cbiAqXG4gKiAgIEBleGFtcGxlXG4gKiAgIGNvbnN0IHNvdXJjZSA9IHtcbiAqICAgICBmb28gOiBhc3luYyBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LFxuICogICAgIGJhciA6IGFzeW5jIGZ1bmN0aW9uICgpIHsgcmV0dXJuIFwic29tZXJhbmRvbXN0cmluZ1wiOyB9LFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBeXl5eXl5eXl5eXl5eXl5eXl5cbiAqICAgICBzbmFmdSA6IGFzeW5jIGZ1bmN0aW9uICgpIHsgcmV0dXJuIFwic25hZnVcIjsgfVxuICogICB9O1xuICogIGF3YWl0IGxpcXVpZnkoc291cmNlKS5mb28oKS5iYXIoKS5zbmFmdSgpIC8vIHdpbGwgdGhyb3cgYW4gZXJyb3Igc2luY2UgXCJzbmFmdVwiXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2Fubm90IGJlIGxvb2tlZCB1cCBhbnltb3JlXG4gKlxuICpcbiAqIFRoZW9yeTpcbiAqID09PT09PT1cbiAqICAgLSBsaXF1aWZ5KHNvdXJjZSkuZm9vKCkuYmFyKClcbiAqICAxLiBsaXF1aWZ5KHNvdXJjZSlcbiAqICAgICAgVGhpcyBjYWxsIHdpbGwgY3JlYXRlIGEgUHJveHkgdGhhdCB0cmFwcyBmdXJ0aGVyIGNhbGxzIC8gbG9va3VwcyBvbiB0aGlzIGV4YWN0IHNhbWVcbiAqICAgICAgb2JqZWN0LlxuICpcbiAqICAyLiBsaXF1aWZ5KHNvdXJjZSkuZm9vXG4gKiAgICAgSXMgdHJhcHBlZCBieSB0aGUgaGFuZGxlcidzIGdldCBtZXRob2QuIFJldHVybnMgYSBwcm94aWVzLCBib3VuZCghKSBmdW5jdGlvbjpcbiAqICAgICB0YXJnZXQ6IHNvdXJjZVxuICogICAgIHByb3BlcnR5OiBmb29cbiAqICAgICA9PiByZXR1cm5zOiBsaXF1aWZ5KHRhcmdldFtwcm9wZXJ0eV0uYmluZCh0YXJnZXQpKVxuICpcbiAqICAzLiBsaXF1aWZ5KHNvdXJjZSkuZm9vKClcbiAqICAgICBBIHByZXZpb3VzIGNhbGwgdG8gXCJsaXF1aWZ5KHNvdXJjZSkuZm9vXCIgcmV0dXJuZWQgYSBib3VuZCBmdW5jdGlvbiB0aGF0IHdhcyBhZ2FpbiBwcm94aWVkXG4gKiAgICAgaW4gc3RlcCAyLiBBdCB0aGlzIHBvaW50LCB0aGUgbWV0aG9kIGNhbGwgb3JpZ2luYXRpbmcgZnJvbSBcImZvbygpXCIgaXMgbm93IHRyYXBwZWQgaW4gdGhlXG4gKiAgICAgUHJveHkncyBcImFwcGx5KClcIiBoYW5kbGVyLlxuICogICAgIFRoZSByZXR1cm5lZCBQcm9taXNlIGlzIHByb3hpZWQgYWdhaW4uXG4gKiAgICAgPT4gcmV0dXJuczogbGlxdWlmeSh0YXJnZXQuYXBwbHkodGhpc0FyZywgYXJndW1lbnRzTGlzdClcbiAqXG4gKiAgNC4gbGlxdWlmeShzb3VyY2UpLmZvbygpLmJhclxuICogICAgIFN0ZXAgMy4gcmV0dXJuZWQgYSBwcm9taXNlLCBzbyBcImJhclwiIGFzIGEgcHJvcGVydHkgaXMgbm93IGluaXRpYWxseSBsb29rZWQgdXAgb24gdGhlIFByb21pc2UuXG4gKiAgICAgVGhlIHByb2JsZW0gaXMsIG9mIGNvdXJzZSwgdGhhdCB0aGUgUHJvbWlzZSBkb2VzIG5vdCBoYXZlIGEgcHJvcGVydHkgY2FsbGVkIFwiYmFyXCIuIFdlIG5vd1xuICogICAgIGhhdmUgdG8gdGFrZSBjYXJlIG9mIHBpcGluZyB0aGUgc291cmNlIG9iamVjdCB0aHJvdWdoIHNvIHRoZSBmb2xsb3dpbmcgbWV0aG9kIGNhbGwgY2FuXG4gKiAgICAgcHJvcGVybHkgcmVzb2x2ZSB0byBcInNvdXJjZS5iYXIoKVwiLlxuICogICAgIFdlIGRvIHRoaXMgYnkgaW1wbGVtZW50aW5nIHRoZSBmdWxsZmlsbGVkLW1ldGhvZC4gVGhlIGdldC1oYW5kbGVyIHdpbGwgY2hlY2tcbiAqICAgICBpZiB0aGUgdGFyZ2V0IG93bnMgYSBcInRoZW5cIi1tZXRob2QgYW5kIHJldHVybiB0aGUgZm9sbG93aW5nOlxuICogICAgIGxpcXVpZnkodGFyZ2V0LnRoZW4odmFsdWUgPT4gdmFsdWVbcHJvcGVydHldLmJpbmQodmFsdWUpKSk7XG4gKiAgICAgXl4gMSogXl4gICAgIF5eIDIqIF5eICAgIF5eXl5eXl5eXiAzKiBeXl5eXl5eXl5eXG4gKiAgICAgMSogdGhpcyBpcyB0aGUgUHJvbWlzZSB0aGF0IHdhcyBwcm94aWVkIGluIHN0ZXAgM1xuICogICAgIDIqIHZhbHVlIGlzIHRoZSByZXR1cm4tdmFsdWUgb2YgdGhlIG9yaWdpbmFsIGFzeW5jIG1ldGhvZCBpbXBsZW1lbnRhdGlvblxuICogICAgICAgIG9mIHNvdXJjZS5mb28oKVxuICogICAgIDMqIFwicHJvcGVydHlcIiBpcyBrbm93biB0byB0aGUgaW1wbGVtZW50YXRpb24gb2YgdGhlIFwiZnVsbGZpbGxlZFwiLW1ldGhvZCB3aGVuIGl0XG4gKiAgICAgICAgIGdldHMgY2FsbGVkIChzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9HdWlkZS9GdW5jdGlvbnMpLlxuICogICAgICAgIFRoZSByZXR1cm4gdmFsdWUgb2YgdGhpcyBmdWxsZmlsbGVkLW1ldGhvZCBpcyB0aGUgbWV0aG9kIFwiYmFyXCIsIGJvdW5kIHRvIFwic291cmNlXCIsIGl0J3Mgb3JpZ2luLlxuICpcbiAqICAgNS4gbGlxdWlmeShzb3VyY2UpLmZvbygpLmJhcigpXG4gKiAgICAgIGJhcigpIGlzIG5vdyBjYWxsZWQuIFRoZSBhcHBseS1oYW5kbGVyIG5vdyBleHBlY3RzIGEgY2FsbGFibGUgbWV0aG9kLiBTaW5jZSB3ZSBoYXZlIHJldHVybmVkIGEgUHJvbWlzZVxuICogICAgICBpbiBzdGVwIDQsIGFuZCBhIFByb21pc2UgaXMgbm90IGEgY2FsbGFibGUgbWV0aG9kLCB0aGUgaW50ZXJuYWxzIG9mIGxpcXVpZnkoKSBzaG93IHRoZWlyIGFkdmFudGFnZTpcbiAqICAgICAgV2UgYXJlIG5vdCBkaXJlY3RseSB3cmFwcGluZyB0aGUgYXJndW1lbnQgcGFzc2VkIHRvIGxpcXVpZnkgd2l0aCB0aGUgUHJveHksIGJ1dCByYXRoZXIgY3JlYXRlIGEgY2FsbGFibGVcbiAqICAgICAgbWV0aG9kIHRoYXQgaXMgdGhlbiBjYWxsZWQuIFdlIFwidGFnXCIgdGhpcyBtZXRob2Qgd2l0aCBhIF9fbGlxdWlkX18gcHJvcGVydHkgdGhhdCBoZWxwcyB0aGUgaGFuZGxlclxuICogICAgICB0byBpZGVudGlmeSBhIHByb3hpZWQsIGNhbGxhYmxlIG1ldGhvZC4gVGhlIGludGVybmFsIGltcGxlbWVudGF0aW9uIGxvb2tzIGxpa2UgdGhpczpcbiAqICAgICAgICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKVxuICogICAgICAgICAgbGlxdWlmeShwcm9taXNlKTtcbiAqICAgICAgICAgIGZ1bmN0aW9uIGxpcXVpZnkodGFyZ2V0KSB7XG4gKiAgICAgICAgICAgICAgbGV0IGNiID0gZnVuY3Rpb24gKCkge1xuICogICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICogICAgICAgICAgICAgIH07XG4gKiAgICAgICAgICAgICAgY2IuX19saXF1aWRfXyA9IHRydWU7XG4gKiAgICAgICAgICB9XG4gKiAgICAgICAgICByZXR1cm4gbmV3IFByb3h5KGNiLCBoYW5kbGVyKTtcbiAqICAgICAgV2hhdCBoYXBwZW5zIG5vdyB0aGF0IHRoaXMgZXhhY3QgY2FsbGFibGUgaXMgcHJvY2Vzc2VkIGJ5IHRoZSBhcHBseS1oYW5kbGVyOlxuICogICAgICAgPT4gYmFyKCkgLS0gY2FsbHMgLS0+IGNiKCkgLS0gcmV0dXJucyAtLT4gcHJvbWlzZVxuICogICAgICAuLiBhbmQgdGhlIGFwcGx5IGhhbmRsZXIgY2hlY2tzIGlmIHRoZSB2YWx1ZSBpcyBhIHByb21pc2UgYW5kIG1ha2VzIHN1cmUgdGhlIGZ1bGxmaWxsZWQtbWV0aG9kXG4gKiAgICAgIGlzIGltcGxlbWVudGVkLCBhbmQgcmV0dXJucyB0aGUgcmVzdWx0aW5nIFByb21pc2UgLSBhZ2FpbiAtIHByb3hpZWQuXG4gKiAgICAgIGxpcXVpZnkocHJvbWlzZS50aGVuKHZhbHVlID0+IFJlZmxlY3QuYXBwbHkodmFsdWUsIHRoaXNBcmcsIGFyZ3VtZW50c0xpc3QpKSk7XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgXl4gMSogXl4gIF5eXl5eXl5eXl5eXl5eXl5eXl5eXiAyKiBeXl5eXl5eXl5eXl5eXl5eXl5eXl5eXG4gKiAgICAgIDEqIFRoaXMgaXMgdGhlIGJvdW5kIG1ldGhvZCB0aGF0IHdhcyByZXR1cm5lZCBpbiB0aGUgZnVsbGZpbGxlZC1tZXRob2QgaW1wbGVtZW50ZWQgaW4gc3RlcCA0LlxuICogICAgICAyKiBUaGlzIGlzIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZ1bGxmaWxsZWQtbWV0aG9kcywgd2hpY2gsIGluIHRoaXMgY2FzZSwgaXMgdGhlIGNhbGwgdG9cbiAqICAgICAgICAgc291cmNlLmJhcigpXG4gKiAgICAgIEl0IGlzIGltcG9ydGFudCB0byB1c2UgXCJhcmd1bWVudHNMaXN0XCIgaGVyZSBzaW5jZSB0aGlzIHdpbGwgaG9sZCByZWZlcmVuY2VzIHRvIHRoZSByZXNvbHZlL3JlamVjdC1tZXRob2RzXG4gKiAgICAgIGZvciB0aGUgbGFzdCBjYWxsIGluIHRoZSBjaGFpbi5cbiAqICAgIDYuIHRoZW4oKVxuICogICAgICAgVGhlIGxhc3QgY2FsbCBpbiB0aGUgY2hhaW4gaXMgYSBpbXBsaWNpdCBjYWxsIHRvIFwidGhlbigpXCIgdHJpZ2dlcmVkIGJ5IHRoZSBQcm9taXNlLWluc3RhbmNlIHRoYXQgd2FzXG4gKiAgICAgICBwcm94aWVkIGluIHN0ZXAgNS4gU2luY2Ugbm8gbW9yZSBjdXN0b20gcHJvcGVydGllcyBoYXZlIHRvIGJlIGxvb2tlZCB1cCBzaW5jZSB0aGUgY2hhaW4gZW5kcyBhdCB0aGlzIHBvaW50LFxuICogICAgICAgdGhlIFByb21pc2UgZm9yd2FyZHMgaXRzIHByb2Nlc3NpbmcgdG8gIHRoZSBmdWxmaWxsbWVudCBieSBjYWxsaW5nIHRoZW4oKS4gVGhlIFwidGhlblwiIGlzIGEgcHJvcGVydHkgb24gYVxuICogICAgICAgcHJveGllZCBQcm9taXNlLCBzbyB0aGUgaGFuZGxlciBjYW4gdHJhcCBpdCBhbmQgc2ltcGx5IGJpbmRzIHRoZSBtZXRob2QgdG8gdGhlIHByb21pc2UuIFRoZSByZXN1bHRpbmcgdmFsdWVcbiAqICAgICAgIG91dCBvZiBcImFzeW5jIGJhcigpXCIgaXMgcmV0dXJuZWQsIHRoZSBjaGFpbiBlbmRzIGhlcmUuXG4gKlxuICovXG5cblxuLyoqXG4gKiBUaGUgaGFuZGxlciB1c2VkIGJ5IHRoZSBsaXF1aWZ5LVByb3h5LlxuICpcbiAqIEB0eXBlIHt7YXBwbHkoKiwgKiwgKiksIGdldCgqLCAqLCAqKX19XG4gKi9cbmNvbnN0IGhhbmRsZXIgPSB7XG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBoYW5kbGVyLmFwcGx5KCkgbWV0aG9kIGlzIGEgdHJhcCBmb3IgYSBmdW5jdGlvbiBjYWxsLlxuICAgICAqIHRoaXMgaXMgYm91bmQgdG8gdGhlIGhhbmRsZXIuXG4gICAgICogV2lsbCBjaGVjayBpZiB0aGUgdGFyZ2V0IGlzIGEgUHJvbWlzZSBhbmQgUHJveHkgdGhlIHJldHVybi12YWx1ZSBvZiBhIGNhbGwgdG8gaXQncyBcInRoZW5cIi1tZXRob2QsXG4gICAgICogYnkgbWFraW5nIHN1cmUgdGhhdCB0aGUgcmVzb2x2ZXIgaXMgcHJvcGVybHkgY2FsbGVkLlxuICAgICAqIE90aGVyd2lzZSwgdGhpcyBoYW5kbGVyIGFzc3VtZXMgdGhhdCB0YXJnZXQgaXMgYWxyZWFkeSBhIGJvdW5kLW1ldGhvZC4gSW4gYW55IGNhc2UgaXQgaXMgbWFkZSBzdXJlXG4gICAgICogdGhhdCB0aGUgYXJndW1lbnRzIGFyZSBwcm9wZXJseSBwYXNzZWQgdG8gdGhlIG1ldGhvZHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gezwqPn0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0aGlzQXJnIFRoZSB0aGlzIGFyZ3VtZW50IGZvciB0aGUgY2FsbC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcmd1bWVudHNMaXN0IFRoZSBsaXN0IG9mIGFyZ3VtZW50cyBmb3IgdGhlIGNhbGwuXG4gICAgICovXG4gICAgYXBwbHkgKHRhcmdldCwgdGhpc0FyZywgYXJndW1lbnRzTGlzdCkge1xuXG4gICAgICAgIHRhcmdldCA9IHRhcmdldC5fX2xpcXVpZF9fID8gdGFyZ2V0KCkgOiB0YXJnZXQ7XG5cbiAgICAgICAgaWYgKGlzRnVuY3Rpb24odGFyZ2V0LnRoZW4pKSB7XG4gICAgICAgICAgICByZXR1cm4gbGlxdWlmeSh0YXJnZXQudGhlbigodmFsdWUpID0+ICBSZWZsZWN0LmFwcGx5KHZhbHVlLCB0aGlzQXJnLCBhcmd1bWVudHNMaXN0KSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhpcyBzaG91bGQgYWxyZWFkeSBiZSBhIGJvdW5kIGZ1bmN0aW9uXG4gICAgICAgIC8vIGlmIHRoZSB0YXJnZXQgaXMgYSBib3VuZCB0aGVuIG1ldGhvZCwgdGhlIGFyZ3VtZW50c0xpc3Qgd2lsbCBob2xkXG4gICAgICAgIC8vIHRoZSByZXNvbHZlKCkvcmVqZWN0KCkgbWV0aG9kLlxuICAgICAgICByZXR1cm4gbGlxdWlmeSh0YXJnZXQuYXBwbHkodGhpc0FyZywgYXJndW1lbnRzTGlzdCkpO1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBoYW5kbGVyLmdldCgpIG1ldGhvZCBpcyBhIHRyYXAgZm9yIGdldHRpbmcgYSBwcm9wZXJ0eSB2YWx1ZS5cbiAgICAgKiBcInRoaXNcIiBpcyBib3VuZCB0byB0aGUgaGFuZGxlci5cbiAgICAgKiBSZWNlaXZlcyB0aGUgcHJvcGVydHkgb2YgdGhlIHByb3hpZXMgdGFyZ2V0LlxuICAgICAqIFdpbGwgcHJveHkgdGhlIHJldHVybmVkIFByb21pc2Ugb2YgdGhlIHRhcmdldCdzIFwidGhlbigpXCItbWV0aG9kIGlmIGEgUHJvbWlzZSBpc1xuICAgICAqIHJlcHJlc2VudGVkIGJ5IHRhcmdldC5cbiAgICAgKiBPdGhlcndpc2UsIGEgUHJveHkgZm9yIHRoZSBmdW5jdGlvbiBpcyBjcmVhdGVkLCB3aGljaCBpcyBib3VuZCghKSB0byB0aGUgdGFyZ2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHs8Kj59IHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHkgVGhlIG5hbWUgb3IgU3ltYm9sIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gICAgICogQHBhcmFtIHtQcm94eX0gcmVjZWl2ZXIgRWl0aGVyIHRoZSBwcm94eSBvciBhbiBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIHRoZSBwcm94eS5cbiAgICAgKi9cbiAgICBnZXQgKHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyKSB7XG5cbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0Ll9fbGlxdWlkX18gPyB0YXJnZXQoKSA6IHRhcmdldDtcblxuICAgICAgICBpZiAocHJvcGVydHkgIT09IFwidGhlblwiICYmIGlzRnVuY3Rpb24odGFyZ2V0LnRoZW4pKSB7XG4gICAgICAgICAgICByZXR1cm4gbGlxdWlmeSh0YXJnZXQudGhlbih2YWx1ZSA9PiB2YWx1ZVtwcm9wZXJ0eV0uYmluZCh2YWx1ZSkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNGdW5jdGlvbih0YXJnZXRbcHJvcGVydHldKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wZXJ0eV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGlxdWlmeSh0YXJnZXRbcHJvcGVydHldLmJpbmQodGFyZ2V0KSk7XG4gICAgfVxuXG59O1xuXG5cbi8qKlxuICogQ3JlYXRlcyBhIFByb3h5IGZvciB0aGUgc3BlY2lmaWVkIHRhcmdldCwgaWYgdGhlIHRhcmdldCBpcyBhbiBvYmplY3Qgb3IgYSBmdW5jdGlvbixcbiAqIGFuZCByZXR1cm5zIGl0LiBPdGhlcndpc2UsIHRoZSB0YXJnZXQgd2lsbCBiZSByZXR1cm5lZC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdH0gdGFyZ2V0XG4gKiBAcmV0dXJuIHsqfVxuICpcbiAqIEBzZWUgaGFuZGxlclxuICovXG5jb25zdCBsaXF1aWZ5ID0gZnVuY3Rpb24gKHRhcmdldCkge1xuXG4gICAgaWYgKGlzT2JqZWN0KHRhcmdldCkpIHtcbiAgICAgICAgY29uc3Qgd3JhcHBlZCA9ICgpID0+IHRhcmdldDtcbiAgICAgICAgd3JhcHBlZC5fX2xpcXVpZF9fID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eSh3cmFwcGVkLCBoYW5kbGVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaXNGdW5jdGlvbih0YXJnZXQpID8gbmV3IFByb3h5KHRhcmdldCwgaGFuZGxlcikgOiB0YXJnZXQ7XG59O1xuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuLyoqXG4gKiBFeHBlY3RzIGEgbnVtZXJpYyBhcnJheSBhbmQgcmV0dXJucyBhbiBhcnJheSB3aGVyZSB0aGUgZW50cmllcyBhcmUgc3Vic2VxdWVudFxuICogbmVpZ2hib3VycyBvZiB0YXJnZXQsIHNvcnRlZCBmcm9tIGxvd2VzdCB0byBoaWdoZXN0LCB1bmlxdWUgdmFsdWVzLlxuICogVGhlIG1ldGhvZCB3aWxsIHRyeSB0byBwYXJzZSB0aGUgdmFsdWVzIHRvIG51bWVyaWMgaW50ZWdlciB2YWx1ZXNcbiAqXG4gKiAgICAgIEBleGFtcGxlXG4gKiAgICAgIHZhciBsaXN0ICAgPSBbJzQnLCA1LCAnMScsICczJywgNiwgJzgnXTtcbiAqICAgICAgdmFyIHRhcmdldCA9IDU7XG4gKlxuICogICAgICBsaXN0TmVpZ2hib3VycyhsaXN0LCB0YXJnZXQpOyAvLyBbMywgNCwgNSwgNl1cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IG9mIHZhbHVlcyB0byByZXR1cm4gdGhlIG5laWdoYm91cnMgZnJvbVxuICogQHBhcmFtIHtOdW1iZXJ9IHRhcmdldCBUaGUgaW5pdGlhbCB2YWx1ZSB0byBsb29rIHVwIGl0cyBuZWlnaGJvdXJzIGZvclxuICpcbiAqIEByZXR1cm4ge0FycmF5fSBUaGUgb3JkZXJlZCwgdW5pcXVlIGxpc3Qgb2YgbmVpZ2hib3VycyBmb3IgdGFyZ2V0XG4gKi9cbmNvbnN0IGxpc3ROZWlnaGJvdXJzID0gZnVuY3Rpb24gKGxpc3QsIHRhcmdldCkge1xuXG4gICAgdmFyIHBhZ2VzID0gW10sXG4gICAgICAgIHJhbmdlID0gW10sXG4gICAgICAgIHBpbmQsIGksIGxlbjtcblxuICAgIC8vIHBhcnNlLCBmaWx0ZXIsIHNvcnRcbiAgICBwYWdlcyA9IGxpc3QubWFwKGZ1bmN0aW9uICh2KXtyZXR1cm4gcGFyc2VJbnQodiwgMTApO30pO1xuICAgIHBhZ2VzID0gcGFnZXMuZmlsdGVyKGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgsIHNlbGYpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuaW5kZXhPZih2YWx1ZSwgMCkgPT09IGluZGV4O1xuICAgIH0pO1xuICAgIHBhZ2VzLnNvcnQoZnVuY3Rpb24gKGEsIGIpe3JldHVybiBhLWI7fSk7XG5cblxuICAgIHBpbmQgPSBwYWdlcy5pbmRleE9mKHBhcnNlSW50KHRhcmdldCwgMTApKTtcblxuICAgIC8vIGZpbGwgbGVmdFxuICAgIGZvciAoaSA9IHBpbmQgLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBpZiAocGFnZXNbaV0gPT09IHBhZ2VzW2kgKyAxXSAtIDEpIHtcbiAgICAgICAgICAgIHJhbmdlLnVuc2hpZnQocGFnZXNbaV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBmaWxsIGNlbnRlclxuICAgIHJhbmdlLnB1c2gocGFnZXNbcGluZF0pO1xuXG4gICAgLy8gZmlsbCByaWdodFxuICAgIGZvciAoaSA9IHBpbmQgKyAxLCBsZW4gPSBwYWdlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAocGFnZXNbaV0gPT09IHBhZ2VzW2kgLSAxXSArIDEpIHtcbiAgICAgICAgICAgIHJhbmdlLnB1c2gocGFnZXNbaV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJhbmdlO1xuXG59O1xuXG5cbi8qKlxuICogRXhwZWN0cyBhIG51bWVyaWMgYXJyYXkgYW5kIHJldHVybnMgYW4gYXJyYXkgd2hlcmUgdGhlIGVudHJpZXMgYXJlIGl0c2VsZlxuICogYXJyYXlzIHJlcHJlc2VudGluZyBwb3NzaWJsZSBncm91cHMgb2Ygc3Vic2VxdWVudCBpbmRpY2VzLCBvcmRlcmVkIGZyb21cbiAqIGxvd2VzdCB0byBoaWdoZXN0LiBEdXBsaWNhdGUgaXRlbXMgd2lsbCBiZSByZW1vdmVkLlxuICpcbiAqICAgICAgdmFyIGxpc3QgICA9IFsnNCcsIDUsICcxJywgJzMnLCA2LCAnOCddO1xuICogICAgICBncm91cEluZGljZXMobGlzdCk7IC8vIFtbMV0sIFszLCA0LCA1XSwgWzZdXVxuICpcbiAqICAgICAgdmFyIGxpc3QgICA9IFsnMScsIDIsICczJ107XG4gKiAgICAgIGdyb3VwSW5kaWNlcyhsaXN0KTsgLy8gW1sxLCAyLCAzXV1cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IG9mIHZhbHVlcyB0byByZXR1cm4gdGhlIGdyb3VwZWQgaW5kaWNlcyBmcm9tXG4gKlxuICogQHJldHVybiB7QXJyYXl9IFRoZSBvcmRlcmVkLCBncm91cGVkIGxpc3Qgb2YgaW5kaWNlc1xuICpcbiAqIEB0aHJvd3MgaWYgbGlzdCBpcyBub3QgYW4gYXJyYXlcbiAqL1xuY29uc3QgZ3JvdXBJbmRpY2VzID0gZnVuY3Rpb24gKGxpc3QpIHtcblxuICAgIHZhciBncm91cHMgPSBbXSxcbiAgICAgICAgcGFnZXM7XG5cbiAgICBpZiAoIWlzQXJyYXkobGlzdCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ2xpc3QnIG11c3QgYmUgYW4gYXJyYXlcIik7XG4gICAgfVxuXG4gICAgLy8gcGFyc2UsIGZpbHRlciwgc29ydFxuICAgIHBhZ2VzID0gbGlzdC5tYXAoZnVuY3Rpb24gKHYpe3JldHVybiBwYXJzZUludCh2LCAxMCk7fSk7XG4gICAgcGFnZXMgPSBwYWdlcy5maWx0ZXIoZnVuY3Rpb24gKHZhbHVlLCBpbmRleCwgc2VsZikge1xuICAgICAgICByZXR1cm4gc2VsZi5pbmRleE9mKHZhbHVlKSA9PT0gaW5kZXg7XG4gICAgfSk7XG4gICAgcGFnZXMuc29ydChmdW5jdGlvbiAoYSwgYil7cmV0dXJuIGEtYjt9KTtcblxuICAgIHBhZ2VzLnJlZHVjZShmdW5jdGlvbiAocHJldmlvdXNWYWx1ZSwgY3VycmVudFZhbHVlLCBpbmRleCwgYXJyYXkpe1xuICAgICAgICBpZiAoY3VycmVudFZhbHVlID4gcHJldmlvdXNWYWx1ZSArIDEpIHtcbiAgICAgICAgICAgIGdyb3Vwcy5wdXNoKFtdKTtcbiAgICAgICAgfVxuICAgICAgICBncm91cHNbZ3JvdXBzLmxlbmd0aCAtIDFdLnB1c2goY3VycmVudFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRWYWx1ZTtcbiAgICB9LCAtMSk7XG5cbiAgICByZXR1cm4gZ3JvdXBzO1xufTtcblxuXG4vKipcbiAqIENyZWF0ZXMgdGhlIHJhbmdlIGZvciB0aGUgc3BlY2lmaWVkIHN0YXJ0IGFuZCBlbmQuXG4gKlxuICogQGV4YW1wbGVcbiAqICAgICAgY3JlYXRlUmFuZ2UoMywgNCkgLy8gWzMsIDQsIDVdXG4gKlxuICogICAgICBjcmVhdGVSYW5nZSg1LCA1KSAvLyBbNV1cbiAqXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0XG4gKiBAcGFyYW0ge051bWJlcn0gZW5kXG4gKlxuICogQHJldHVybiB7QXJyYXl9XG4gKlxuICogQHRocm93cyBpZiBzdGFydCBpcyBub3QgYSBudW1iZXIgb3IgbGVzcyB0aGFuIDEsIG9yIGlmIGVuZCBpcyBub3QgYSBudW1iZXJcbiAqIG9yIGlmIGVuZCBpcyBsZXNzIHRoYW4gc3RhcnRcbiAqL1xuY29uc3QgY3JlYXRlUmFuZ2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuXG4gICAgdmFyIHJldDtcblxuICAgIGlmICghaXNuKHN0YXJ0KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCInc3RhcnQnIG11c3QgYmUgYSBudW1iZXJcIik7XG4gICAgfVxuXG4gICAgaWYgKCFpc24oZW5kKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCInZW5kJyBtdXN0IGJlIGEgbnVtYmVyXCIpO1xuICAgIH1cblxuICAgIHN0YXJ0ID0gcGFyc2VJbnQoc3RhcnQsIDEwKTtcbiAgICBlbmQgICA9IHBhcnNlSW50KGVuZCwgMTApO1xuXG4gICAgaWYgKGVuZCA8IHN0YXJ0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgXCJlbmRcIiAoJHtlbmR9KSBtdXN0IGJlIGEgbnVtYmVyIGVxdWFsIHRvIG9yIGdyZWF0ZXIgdGhhbiBcInN0YXJ0XCIgKCR7c3RhcnR9KWApO1xuICAgIH1cblxuXG4gICAgcmV0ID0gKG5ldyBBcnJheSgoZW5kIC0gc3RhcnQpICsgMSkpLmZpbGwodW5kZWZpbmVkKTtcblxuICAgIHJldHVybiByZXQubWFwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHN0YXJ0Kys7XG4gICAgfSk7XG5cbn07XG5cbi8qKlxuICogU2VhcmNoZXMgZm9yIHRoZSBmaXJzdCBlbnRyeSBpbiBzb3VyY2UuIExvb2tzIHVwIHRoZSBrZXkgaW4gc291cmNlIGlmIGl0IGlzIGFuIG9iamVjdCBhbmQgcmV0dXJucyB0aGUgZmlyc3RcbiAqIG1hdGNoIGZvdW5kLCBvdGhlcndpc2UgaXRlcmF0ZXMgdGhyb3VnaCB0aGUgYXJyYXkgYW5kIHJldHVybnMgdGhlIGZpcnN0IG1hdGNoLlxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogIGw4LmZpbmRGaXJzdChcImJhclwiLCB7Zm9vIDoge30sIGJhciA6IHtzbmFmdSA6IFwiXCJ9fTsgLy8gcmV0dXJucyB0aGUgYmFyLW9iamVjdFxuICogIGw4LmZpbmRGaXJzdChcImJhclwiLCBbe2ZvbyA6IHt9fSwge2JhciA6IHtzbmFmdSA6IFwiXCJ9fV07IC8vIHJldHVybnMgdGhlIGJhci1vYmplY3RcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0geyhBcnJheXxjT2JqZWN0KX0gc291cmNlXG4gKlxuICogQHJldHVybiB7Pyp9XG4gKi9cbmNvbnN0IGZpbmRGaXJzdCA9IChrZXksIHNvdXJjZSkgPT4ge1xuXG4gICAgbGV0IG1hdGNoID0gbnVsbCxcbiAgICAgICAgaXNvJDEgPSBpc28oc291cmNlKTtcblxuICAgIChpc2Eoc291cmNlKSA/IHNvdXJjZSA6IGlzbyQxID8gT2JqZWN0LmVudHJpZXMoc291cmNlKSA6IFtdKS5zb21lKGl0ZW0gPT4ge1xuXG4gICAgICAgIGlmIChpc28kMSAmJiBpdGVtWzBdID09PSBrZXkpIHtcbiAgICAgICAgICAgIG1hdGNoID0gaXRlbVsxXTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGlzbyhpdGVtKSAmJiBpdGVtW2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbWF0Y2ggPSBpdGVtW2tleV07XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG1hdGNoO1xufTtcbmNvbnN0IGZmID0gZmluZEZpcnN0O1xuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuLyoqXG4gKiBSZXBsYWNlcyBhbGwgdG9rZW5zIHNwZWNpZmllZCBpbiBzZWFyY2ggd2l0aCB0aGUgdG9rZW5zIHNwZWNpZmllZCBpbiByZXBsYWNlIGluIHRoZVxuICogdGFyZ2V0IHN0cmluZy5cbiAqIFdpbGwgcmVwbGFjZSBmcm9tIGxlZnQgdG8gcmlnaHQgaWYgbW9yZSB0aGFuIG9uZSBzZWFyY2ggdG9rZW4gaXMgc3BlY2lmaWVkLlxuICogSWYgdG9rZW4gaXMgYW4gYXJyYXkgYW5kIHJlcGxhY2UgaXMgYSBzdHJpbmcsIGFsbCB0b2tlbnMgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoaXMgc3RyaW5nLlxuICogSWYgdG9rZW5zIGFuZCByZXBsYWNlIGFyZSBib3RoIGFycmF5cywgYW5kIHJlcGxhY2UgaGFzIGxlc3MgZW50cmllcywgaXRlbXMgaW4gdG9rZW5zIG1hdGNoaW5nIGEgbm9uIGV4aXN0ZW50XG4gKiBpbmRleCBpbiByZXBsYWNlIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCBhbiBlbXB0eSB2YWx1ZS5cbiAqXG4gKiAgICAgIEBleGFtcGxlXG4gKiAgICAgIGxldCBzdHIgPSBsOC5yZXBsYWNlKFtcImZvb1wiLCBcImJhclwiXSwgW1wib29mXCIsIFwicmFiXCJdLCBcInRoaXMgZm9vIGlzIGJhclwiKTtcbiAqICAgICAgLy8gdGhpcyBvb2YgaXMgcmFiXG4gKlxuICogICAgICAgbGV0IHN0ciA9IGw4LnJlcGxhY2UoW1wiQVwiLCBcIkJcIl0sIFtcIkJcIiwgXCJEXCJdLCBcIkFcIik7XG4gKiAgICAgIC8vIERcbiAqXG4gKiAgICAgIGxldCBzdHIgPSBsOC5yZXBsYWNlKFtcIkFcIiwgXCJDXCJdLCBcIkJcIiwgXCJBQ1wiKTtcbiAqICAgICAgLy8gQkJcbiAqXG4gKiAgICAgIGxldCBzdHIgPSBsOC5yZXBsYWNlKFtcIkFcIiwgXCJDXCJdLCBbXCJCXCJdLCBcIkFDXCIpO1xuICogICAgICAvLyBCXG4gKlxuICogICAgICBsZXQgc3RyID0gbDgucmVwbGFjZShcIkFcIiwgXCJCXCIsIFwiQVwiKTtcbiAqICAgICAgLy8gQlxuICpcbiAqXG4gKiBAcGFyYW0geyhTdHJpbmd8QXJyYXk8U3RyaW5nPil9IHRva2Vuc1xuICogQHBhcmFtIHsoU3RyaW5nfEFycmF5PFN0cmluZz4pfSByZXBsYWNlXG4gKiBAcGFyYW0ge1N0cmluZ30gdGFyZ2V0XG4gKlxuICogQHJldHVybiB7U3RyaW5nfVxuICpcbiAqIEB0aHJvd3Mge0Vycm9yfSBpZiBzdHIgd2FzIG5vdCBhIHN0cmluZ1xuICpcbiAqIEBzZWUgZXNjYXBlUmVnRXhwXG4gKi9cbmNvbnN0IHJlcGxhY2UgPSBmdW5jdGlvbiAodG9rZW5zLCByZXBsYWNlLCB0YXJnZXQpIHtcblxuICAgIGlmICghaXNzKHRhcmdldCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXFxcInN0clxcXCIgbXVzdCBiZSBhIHN0cmluZ1wiKTtcbiAgICB9XG5cbiAgICB0b2tlbnMgID0gW10uY29uY2F0KHRva2Vucyk7XG4gICAgcmVwbGFjZSA9ICFpc3MocmVwbGFjZSkgPyBbXS5jb25jYXQocmVwbGFjZSkgOiBuZXcgQXJyYXkodG9rZW5zLmxlbmd0aCkuZmlsbChyZXBsYWNlKTtcblxuICAgIHRva2Vucy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICB0YXJnZXQgPSB0YXJnZXQucmVwbGFjZShuZXcgUmVnRXhwKGVzY2FwZVJlZ0V4cChpdGVtKSwgXCJnXCIpLCByZXBsYWNlW2luZGV4XSA/PyBcIlwiKTtcbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIHRhcmdldDtcbn07XG5jb25zdCBycGwgPSByZXBsYWNlO1xuXG5cbi8qKlxuICogVW5pZmllcyB0aGUgc3RyaW5nIGJ5IHJlbW92aW5nIHN1YnNlcXVlbnQgZW50cmllcyBvZiBkdXBsaWNhdGVzIG9mIHRva2VuLlxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogICAgIGw4LnVuaWZ5KFwiZm9vLy9iYXIvLy9cIiwgXCIvXCIpOyAvLyBcImZvby9iYXIvXCJcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdG9rZW5cbiAqIEBwYXJhbSB7U3RyaW5nfSB0YXJnZXRcbiAqXG4gKiB0aHJvd3Mge0Vycm9yfSBpZiB0YXJnZXQgb3IgdG9rZW4gYXJlIG5vdCBzdHJpbmdzXG4gKi9cbmNvbnN0IHVuaWZ5ID0gZnVuY3Rpb24gKHRhcmdldCwgdG9rZW4pIHtcblxuICAgIGlmICghaXNzKHRhcmdldCkgfHwgIWlzcyh0b2tlbikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXFxcInN0clxcXCIgbXVzdCBiZSBhIHN0cmluZ1wiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0LnNwbGl0KHRva2VuKS5maWx0ZXIoXG4gICAgICAgICh4LCBpbmRleCwgc291cmNlKSA9PiBpbmRleCA9PT0gMCB8fCBpbmRleCA9PT0gc291cmNlLmxlbmd0aCAtIDEgfHwgeCAhPT0gXCJcIlxuICAgICkuam9pbih0b2tlbik7XG5cbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHNwZWNpZmllZCBzdHJpbmcgaXMgbm90IGFueSBvZiB0aGUgcGFzc2VkIGFyZ3VtZW50cy4gTWF0Y2hlcyBhcmUgc3RyaWN0LlxuICpcbiAqIEBleGFtcGxlXG4gKiAgbDguaXNOb3QoXCJzdHJpbmdcIiwgXCJzdHJpbmdcIik7IC8vIGZhbHNlXG4gKiAgbDguaXNOb3QoXCJzdHJpbmdcIiwgXCJTdHJpbmdcIik7IC8vIHRydWVcbiAqICBsOC5pc05vdChcInN0cmluZ1wiLCBcImZvb1wiLCBcImJhclwiKTsgLy8gdHJ1ZVxuICogIGw4LmlzTm90KFwic3RyaW5nXCIsIFwiZm9vXCIsIFwiYmFyXCIsIFwic3RyaW5nXCIpOyAvLyBmYWxzZVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0YXJnZXRcbiAqIEBwYXJhbSB7Li4uU3RyaW5nfSBleGNsdWRlc1xuICpcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmNvbnN0IGlzTm90ID0gZnVuY3Rpb24gKHRhcmdldCkge1xuXG4gICAgY29uc3RcbiAgICAgICAgZXhwciA9IFwiKD8hKFwiICsgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKS5qb2luKFwifFwiKSArIFwiKSleXCIsXG4gICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChleHByLCBcImdcIik7XG5cbiAgICByZXR1cm4gdGFyZ2V0Lm1hdGNoKHJlZ2V4KSAhPT0gbnVsbDtcbn07XG5cblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvR3VpZGUvUmVndWxhcl9FeHByZXNzaW9ucyNlc2NhcGluZ1xuICovXG5mdW5jdGlvbiBlc2NhcGVSZWdFeHAgKHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xufVxuXG52YXIgc3RyaW5nID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICAgIF9fcHJvdG9fXzogbnVsbCxcbiAgICByZXBsYWNlOiByZXBsYWNlLFxuICAgIHJwbDogcnBsLFxuICAgIHVuaWZ5OiB1bmlmeSxcbiAgICBpc05vdDogaXNOb3Rcbn0pO1xuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuLyoqXG4gKiBDcmVhdGVzIGEgbm9uZS1jb25maWd1cmFibGUsIG5vbmUtd3JpdGVhYmxlIChsaXN0IG9mKSBwcm9wZXJ0KHl8aWVzKSBvbiB0aGUgdGFyZ2V0IG9iamVjdC5cbiAqXG4gKiBAZXhhbXBsZVxuICogICAgICBsZXQgdGFyZ2V0ID0gbGNrKHt9LCBcImZvb1wiKTsgLy8gdGFyZ2V0ID0ge2ZvbyA6IHVuZGVmaW5lZH07XG4gKiAgICAgIGxldCB0YXJnZXQgPSBsY2soe30sIFwiZm9vXCIsIDEpOyAvLyB0YXJnZXQgPSB7Zm9vIDogMX07XG4gKiAgICAgIGxldCB0YXJnZXQgPSBsY2soe30sIFtcImZvb1wiLCBcImJhclwiXSwge1wiZm9vXCIgOiAxLCBcImJhclwiIDogMn0pOyAvLyB0YXJnZXQgPSB7Zm9vIDogMSwgYmFyIDogMn07XG4gKiAgICAgIGxldCB0YXJnZXQgPSBsY2soe30sIFwiZm9vXCIsIFwiYmFyXCIsIHtcImZvb1wiIDogMSwgXCJiYXJcIiA6IDJ9KTsgLy8gdGFyZ2V0ID0ge2ZvbyA6IDEsIGJhciA6IDJ9O1xuICpcbiAqIEBwYXJhbSB7IU9iamVjdH0gdGFyZ2V0XG4gKiBAcGFyYW0geyEoU3RyaW5nfEFycmF5fSBwcm9wIEVpdGhlciB0aGUgcHJvcGVydHkgbmFtZSBvciBhbiBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lc1xuICogdGhhdCBzaG91bGQgYmUgY3JlYXRlZCBvbiBcInRhcmdldFwiIHdpdGggdGhlaXIgY29ycmVzcG9uZGluZyB2YWx1ZXMgZm91bmQgaW4gXCJ2YWx1ZVwiXG4gKlxuICogQHBhcmFtIHsqPX0gdmFsdWVcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRhcmdldFxuICpcbiAqIEB0aHJvd3Mge0Vycm9yfSBpZiB0YXJnZXQgaXMgbm90IGV4dGVuc2libGUsIGlmIFwicHJvcFwiIGlzIG5vdCBhIHZhbGlkIHN0cmluZyBvciBpZiBhIGxpc3Qgb2YgcHJvcGVydGllc1xuICogaXMgc3VwcGxpZWQsIGJ1dCBubyB2YWx1ZS1vYmplY3QuXG4gKi9cbmNvbnN0IGxvY2sgPSBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wLCB2YWx1ZSkge1xuXG4gICAgaWYgKCFpc09iamVjdCh0YXJnZXQpIHx8IE9iamVjdC5pc0Zyb3plbih0YXJnZXQpIHx8IE9iamVjdC5pc1NlYWxlZCh0YXJnZXQpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlxcXCJ0YXJnZXRcXFwiIG11c3QgYmUgYW4gZXh0ZW5zaWJsZSBvYmplY3QuXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgICB2YWx1ZSA9IGFyZ3VtZW50c1tsZW4gLSAxXTtcblxuICAgIGlmIChsZW4gPCAyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlxcXCJwcm9wZXJ0eVxcXCIgbXVzdCBiZSBhIHZhbGlkIHByb3BlcnR5IG5hbWUuXCIpO1xuICAgIH1cblxuICAgIGlmIChsZW4gPiAzICYmICFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXFxcInZhbHVlXFxcIiBtdXN0IGJlIGFuIG9iamVjdC5cIik7XG4gICAgfVxuXG4gICAgaWYgKGxlbiA9PT0gMyAmJiBpc0FycmF5KHByb3ApICYmICFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXFxcInZhbHVlXFxcIiBtdXN0IGJlIGFuIG9iamVjdC5cIik7XG4gICAgfVxuXG4gICAgbGV0IGlzQXJyID0gaXNBcnJheShwcm9wKSxcbiAgICAgICAgcHJvcHMgPSBpc0FyciA/IHByb3AgOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJndW1lbnRzLCBbMSwgbGVuIC0gMV0pO1xuXG4gICAgcHJvcHMuZm9yRWFjaCggcHJvcCA9PiB7XG4gICAgICAgIGlmICghaXNTdHJpbmcocHJvcCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlxcXCJwcm9wZXJ0eVxcXCIgbXVzdCBiZSBhIHZhbGlkIHByb3BlcnR5IG5hbWUuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcCwge1xuICAgICAgICAgICAgd3JpdGFibGUgOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZSA6IGZhbHNlLFxuICAgICAgICAgICAgdmFsdWUgOiBsZW4gPiAzIHx8IGlzQXJyID8gdmFsdWVbcHJvcF0gOiB2YWx1ZVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIHRhcmdldDtcbn07XG5jb25zdCBsY2sgPSBsb2NrO1xuXG4vKipcbiAqIFRoaXMgY2FsbGJhY2sgaXMgZGlzcGxheWVkIGFzIHBhcnQgb2YgdGhlIFJlcXVlc3RlciBjbGFzcy5cbiAqIEBjYWxsYmFjayB2aXNpdH52aXNpdG9yXG4gKiBAcGFyYW0geyp9IGxlYWZcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gKi9cblxuLyoqXG4gKiBUcmF2ZXJzZXMgYW4gb2JqZWN0IGFuZCBjYWxscyB0aGUgcGFzc2VkIGZ1bmN0aW9uIG9uIGVhY2ggcHJvcGVydHkuXG4gKlxuICogQGV4YW1wbGVcbiAqICAgICAgbGV0IHRyZWUgPSB7XG4gKiAgICAgICAgICBub2RlIDoge1xuICogICAgICAgICAgICAgIG5vZGVfYSA6IHtcbiAqICAgICAgICAgICAgICAgICAgbm9kZSA6IFwiZm9vXCJcbiAqICAgICAgICAgICAgICB9XG4gKiAgICAgICAgICB9LFxuICogICAgICAgICAgbm9kZV9jIDogXCJiYXJcIlxuICogICAgICB9O1xuICpcbiAqIGw4LnZpc2l0KHRyZWUsIChsZWFmLCBwYXRoKSA9PiBwYXRoOyAvLyBjaGFuZ2VzIHRoZSB0cmVlIHRvXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCBUaGUgdGFyZ2V0IFwidHJlZVwiIHRoYXQgc2hvdWxkIGJlIHZpc2l0ZWQuXG4gKiBAcGFyYW0ge3Zpc2l0fnZpc2l0b3J9IHZpc2l0b3IgLSBUaGUgY2FsbGJhY2sgdGhhdCBoYW5kbGVzIHRoZSByZXNwb25zZS4gVGhlIHBhc3NlZCBhcmd1bWVudHMgdG8gdGhpcyBmdW5jdGlvbnNcbiAqIGFyZSB0aGUgdmFsdWUgb2YgdGhlIG5vZGUgYW5kIHRoZSBwYXRoIChzdHJpbmcpIHRvIHRoaXMgbm9kZS5cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRhcmdldCBUaGUgdmlzaXRlZCB0YXJnZXQuXG4gKlxuICovXG5jb25zdCB2aXNpdCA9IGZ1bmN0aW9uICh0YXJnZXQsIHZpc2l0b3IpIHtcblxuICAgIGNvbnN0IHRyYXZlcnNlID0gKHRhcmdldCwgcGFyZW50S2V5KSA9PiB7XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHRhcmdldCkubWFwKChba2V5LCBwcm9wZXJ0eV0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSBwYXJlbnRLZXkuY29uY2F0KGtleSk7XG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IGlzbyhwcm9wZXJ0eSkgPyB0cmF2ZXJzZShwcm9wZXJ0eSwgcGF0aCkgOiB2aXNpdG9yKHByb3BlcnR5LCBwYXRoLmpvaW4oXCIuXCIpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfTtcblxuICAgIHRyYXZlcnNlKHRhcmdldCwgW10pO1xuICAgIHJldHVybiB0YXJnZXQ7XG59O1xuY29uc3QgdnN0ID0gdmlzaXQ7XG5cblxuLyoqXG4gKiBVdGlsaXRpZXNcbiAqL1xuXG5cbi8qKlxuICogQ3JlYXRlcyBhbiBvYmplY3QgY2hhaW4gb24gdGhlIHRhcmdldCBvYmplY3QgYW5kIGluaXRpYWxpemVzIGl0IHdpdGhcbiAqIHRoZSBkZWZhdWx0VmFsdWUsIGlmIHNwZWNpZmllZC5cbiAqIFJldHVybnMgdGhlIHRhcmdldCBvYmplY3QuXG4gKiBUaGUgdGhpcmQgYXJndW1lbnQgY2FuIGJlIGEgZnVuY3Rpb24gdGhhdCBnZXRzIGNhbGxlZCB3aXRoIHRoZSBjaGFpbidzIG5hbWUgY3JlYXRlZCBhcyBpdHMgYXJndW1lbnQuXG4gKiBPdmVycmlkZXMgYW55IHZhbHVlIGZvdW5kIG9uIHRoZSBvYmplY3QgaWYgb3ZlcnJpZGUgaXMgc2V0IHRvIHRydWVcbiAqXG4gKiBAZXhhbXBsZVxuICogICAgbGV0IG9iaiA9IHt9O1xuICogICAgbDguY2hhaW4oXCJhLmIuYy5kXCIsIG9iaiwgXCJmb29cIik7XG4gKlxuICogICAgLy8gb2JqXG4gKiAgICAvLyB7IGEgOiB7IGIgOiB7YyA6IHsgZCA6IFwiZm9vXCJ9fX19XG4gKlxuICogVGhpcyBtZXRob2QgbGV0cyB5b3UgcGFzcyBhIGxpc3Qgb2YgcHJvcGVydGllcyBhcyB0aGUgZmlyc3QgYXJndW1lbnQgdGhhdCB3aWxsIGJlIGNoYWluZWQuXG4gKiBUaGUgdGhpcmQgYXJndW1lbnQgY2FuIGJlIGEgZnVuY3Rpb24gdGhhdCBnZXRzIGNhbGxlZCB3aXRoIGVhY2ggcHJvcGVydHkgdXBvbiBjaGFpbmluZy5cbiAqIFRoZSByZXR1cm4gdmFsdWUgb2YgdGhpcyBmdW5jdGlvbiBpcyB1c2VkIGFzIHRoZSB2YWx1ZSBmb3IgdGhlIGNoYWluZWQgcHJvcGVydHkuXG4gKiBPdGhlcndpc2UsIHRoZSB0aGlyZCBhcmd1bWVudCB3aWxsIGJlIHVzZWQgYXMgdGhlIHZhbHVlLlxuICpcbiAqIEBleGFtcGxlXG4gKiBsZXQgb2JqID0ge307XG4gKiAgICBsOC5jaGFpbihbXCJhLmJcIiwgXCJlLmZcIl0sIG9iaiwgKGNoYWluKSA9PiBjb25zb2xlLmxvZyhjaGFpbi50b1VwcGVyQ2FzZSgpKSk7XG4gKlxuICogICAgLy8gb2JqXG4gKiAgICAvLyB7IGEgOiB7IGIgOiBcIkJcIn0sIHtlIDoge2YgOiBcIkZcIn19fVxuICpcbiAqXG4gKiBAcGFyYW0geyEoU3RyaW5nfEFycmF5KX0gY2hhaW5zXG4gKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0XG4gKiBAcGFyYW0gez8oKnxmdW5jdGlvbil9IGRlZmF1bHRWYWx1ZVxuICogQHBhcmFtIHtCb29sZWFufSBbb3ZlcnJpZGU9ZmFsc2VdXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSB0YXJnZXRcbiAqL1xuY29uc3QgY2hhaW4gPSBmdW5jdGlvbiAoY2hhaW5zLCB0YXJnZXQgPSB7fSwgZGVmYXVsdFZhbHVlID0gdW5kZWZpbmVkLCBvdmVycmlkZSA9IGZhbHNlKSB7XG5cbiAgICBjaGFpbnMgPSBbXS5jb25jYXQoY2hhaW5zKTtcblxuICAgIGNoYWlucy5mb3JFYWNoKChzdHIpID0+IHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEB0b2RvIE8obikgP1xuICAgICAgICAgKi9cbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIGtleXMgPSBzdHIuc3BsaXQoXCIuXCIpLFxuICAgICAgICAgICAgY3IgPSAob2JqLCBrZXlzKSA9PiB7XG5cbiAgICAgICAgICAgICAgICBsZXQga2V5O1xuXG4gICAgICAgICAgICAgICAga2V5ID0ga2V5cy5zaGlmdCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFvYmpba2V5XSB8fCAob3ZlcnJpZGUgPT09IHRydWUgJiYgIWtleXMubGVuZ3RoKSkge1xuICAgICAgICAgICAgICAgICAgICBvYmpba2V5XSA9IGtleXMubGVuZ3RoID8ge30gOiAoaXNGdW5jdGlvbihkZWZhdWx0VmFsdWUpID8gZGVmYXVsdFZhbHVlKHN0cikgOiBkZWZhdWx0VmFsdWUpIDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgY3Iob2JqW2tleV0sIGtleXMpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIGNyKHRhcmdldCwga2V5cyk7XG4gICAgfSk7XG5cblxuICAgIHJldHVybiB0YXJnZXQ7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciBjaGFpbigpXG4gKiBAdHlwZSB7ZnVuY3Rpb24oIShTdHJpbmd8QXJyYXkpLCBPYmplY3Q9LCA/KCp8RnVuY3Rpb24pPSk6IE9iamVjdH1cbiAqL1xuY29uc3QgY2huID0gY2hhaW47XG5cbi8qKlxuICogRXhwZWN0cyBhbiBPYmplY3QgYW5kIGZsaXBzIGtleS92YWx1ZS9wYWlycy5cbiAqXG4gKiAgICAgIEBleGFtcGxlXG4gKiAgICAgIHZhciBmb28gPSB7IDEgOiBcImZvb1wiLCAyIDogXCJiYXJcIiwgMyA6IFwic25hZnVcIn07XG4gKlxuICogICAgICBsOC5mbGlwKGZvbyk7IC8vIHtcImJhclwiIDogMSwgXCJiYXJcIjogMiwgXCJzbmFmdVwiIDogM31cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IGEgbmV3IG9iamVjdCB3aGVyZSB0aGUga2V5L3ZhbHVlIHBhaXJzIGFyZSBmbGlwcGVkXG4gKi9cbmNvbnN0IGZsaXAgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgLi4uT2JqZWN0LmVudHJpZXMoaW5wdXQpLm1hcCgoW2ssIHZdKSA9PiAgKHtbdl0gOiBrfSkpKTtcbn07XG5cblxuLyoqXG4gKiBFeHBlY3RzIGFuIE9iamVjdCBhbmQgcmVtb3ZlcyBhbGwgdGhlIGVudHJpZXMgd2hpY2ggc3RyaWN0IGVxdWFsIHRvIG1hdGNoLlxuICpcbiAqICAgICAgQGV4YW1wbGVcbiAqICAgICAgdmFyIGZvbyA9IHsgMSA6IFwiXCIsIDIgOiBcImJhclwiLCAzIDogXCJcIn07XG4gKlxuICogICAgICBsOC5wdXJnZShmb28sIFwiXCIpOyAvLyB7MiA6IFwiYmFyXCJ9XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGlucHV0XG4gKiBAcGFyYW0ge01peGVkfSBtYXRjaCwgZGVmYXVsdHMgdG8gdW5kZWZpbmVkXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSBhIG5ldyBmaWx0ZXJlZCBvYmplY3RcbiAqL1xuY29uc3QgcHVyZ2UgPSBmdW5jdGlvbiAoaW5wdXQsIG1hdGNoPSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKE9iamVjdC5lbnRyaWVzKGlucHV0KS5maWx0ZXIoKFssIHZdKSA9PiB2ICE9PSBtYXRjaCkpO1xufTtcblxuXG4vKipcbiAqIFNwbGl0cyB0aGUgc3BlY2lmaWVkIHN0cmluZyBieSBsb29raW5nIGZvciBcIi5cIiBhcyBzZXBhcmF0b3JzIGFuZCByZXR1cm5zXG4gKiB1bmRlZmluZWQgaWYgdGhlIGV2YWx1YXRlZCBwcm9wZXJ0eSBpcyBub3QgYXZhaWxhYmxlLCBvdGhlcndpc2UgdGhlIHZhbHVlXG4gKiBvZiB0aGUgcHJvcGVydHkuXG4gKlxuICogICAgICBAZXhhbXBsZVxuICogICAgICB2YXIgZm9vID0geyAxIDogeyAyIDogeyAzIDogeyA0IDogJ2Jhcid9fX19O1xuICpcbiAqICAgICAgbDgudW5jaGFpbignMS4yLjMuNCcsIGZvbyk7IC8vICdiYXInXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGNoYWluIFRoZSBvYmplY3QgY2hhaW4gdG8gcmVzb2x2ZVxuICogQHBhcmFtIHtPYmplY3R9IHNjb3BlIFRoZSBzY29wZSB3aGVyZSB0aGUgY2hhaW4gc2hvdWxkIGJlIGxvb2tlZCB1cFxuICogQHBhcmFtIHsoKnxGdW5jdGlvbil9IGRlZmF1bHRWYWx1ZSBhIGRlZmF1bHRWYWx1ZSB0byByZXR1cm4gaW4gY2FzZSB0aGUgY2hhaW4gaXMgbm90IGV4aXN0aW5nLlxuICogaWYgdGhpcyBhcmd1bWVudCBpcyBhIGZ1bmN0aW9uLCB0aGUgZnVuY3Rpb24gZ2V0cyBjYWxsZWQuIElmIHRoZSBjaGFpbiBleGlzdGVkLCBpdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZVxuICogdmFsdWUgb2YgdGhlIGNoYWluLCBhbmQgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGlzIGZ1bmN0aW9uIGlzIHJldHVybmVkLlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGNiID0gdmFsdWUgPT4gdmFsdWUudG9VcHBlckNhc2UoKSxcbiAqICAgICAgZm9vID0geyAxIDogeyAyIDogeyAzIDogeyA0IDogJ2Jhcid9fX19O1xuICpcbiAqICBsOC51bmNoYWluKCcxLjIuMy40JywgZm9vLCBjYik7IC8vICdCQVInXG4gKlxuICogQHJldHVybiB7Kn0gdW5kZWZpbmVkIGlmIGVpdGhlciBzY29wZSB3YXMgbm90IGZvdW5kIG9yIHRoZSBjaGFpbiBjb3VsZFxuICogbm90IGJlIHJlc29sdmVkLCBvdGhlcndpc2UgdGhlIHZhbHVlIGZvdW5kIGluIFtzY29wZV1bY2hhaW5dXG4gKi9cbmNvbnN0IHVuY2hhaW4gPSBmdW5jdGlvbiAoY2hhaW4sIHNjb3BlLCBkZWZhdWx0VmFsdWUgPSB1bmRlZmluZWQpIHtcblxuICAgIHZhciBwYXJ0cyA9IGNoYWluLnNwbGl0KFwiLlwiKSxcbiAgICAgICAgb2JqICAgPSBzY29wZTtcblxuICAgIHdoaWxlIChvYmogIT09IHVuZGVmaW5lZCAmJiBwYXJ0cy5sZW5ndGgpIHtcbiAgICAgICAgb2JqID0gb2JqW3BhcnRzLnNoaWZ0KCldO1xuICAgIH1cblxuICAgIGlmIChpc0Z1bmN0aW9uKGRlZmF1bHRWYWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZShvYmopO1xuICAgIH1cblxuICAgIGlmIChvYmogPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgIH1cblxuICAgIHJldHVybiBvYmo7XG59O1xuXG4vKipcbiAqIEFsaWFzIGZvciB1bmNoYWluKClcbiAqIEB0eXBlIHtmdW5jdGlvbighKFN0cmluZ3xBcnJheSksIE9iamVjdD0sID8oKnxGdW5jdGlvbik9KTogT2JqZWN0fVxuICovXG5jb25zdCBuY2huID0gdW5jaGFpbjtcblxuLyoqXG4gKiBMZXRzIHlvdSBzcGVjaWZ5IGEgcmVndWxhciBleHByZXNzaW9uIHRvIG1ha2Ugc3VyZSBvbmx5IHRob3NlXG4gKiBrZXlzIGFyZSBhc3NpZ25lZCBmcm9tIHNvdXJjZSB0byB0YXJnZXQgdGhhdCBtYXRjaCB0aGUgZXhwcmVzc2lvbi5cbiAqXG4gKiBAZXhhbXBsZVxuICogICAgIGw4LmFzc2lnbih7fSwge1wiZm9vXCI6IFwiYmFyXCJ9LCBbe1wic25hZnVcIiA6IFwiZm9vYmFyXCIsIFwia2V5XCI6IFwidmFsdWVcIn0sIC8oPyEoc25hZnUpKV4vZ10pO1xuICogICAgIC8vIHJlc3VsdHMgaW4ge1wiZm9vXCI6IFwiYmFyXCIsIFwia2V5XCI6IFwidmFsdWVcIn1cbiAqXG4gKiAgICAgIGw4LmFzc2lnbih7fSwge1wiZm9vXCI6IFwiYmFyXCJ9LCBbe1wic25hZnVcIiA6IFwiZm9vYmFyXCIsIFwia2V5XCI6IFwidmFsdWVcIiwgXCJzb21lXCI6IFwib2JqXCJ9LCBcInNuYWZ1XCIsIFwia2V5XCJdKTtcbiAqICAgICAvLyByZXN1bHRzIGluIHtcImZvb1wiOiBcImJhclwiLCBcInNvbWVcIjogXCJvYmpcIn1cbiAqXG4gKlxuICogQHBhcmFtIHshT2JqZWN0fSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3QgdG8gYXNzaWduIHR0b1xuICogQHBhcmFtIHsuLi4oT2JqZWN0fFtPYmplY3QsIChSZWdFeHB8Li4uU3RyaW5nXSl9IFRoZSBvYmplY3RzIHRvIHVzZSBmb3IgYXNzaWduaW5nLiBJZiBhbiBhcnJheSBpcyBzdWJtaXR0ZWQsIHRoZSBmaXJzdFxuICogaW5kZXggaXMgdGhlIG9iamVjdCBzb3VyY2UgdG8gYXNzaWduIGZyb20sIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IGlzdCB0aGUgcmVndWxhciBleHByZXNzaW9uIHRoYXQgbXVzdCBtYXRjaFxuICogdGhlIG9iamVjdCBrZXlzIHRvIHVzZSBmb3IgYXNzaWdubWVudC4gSWYgdGhlcmUgaXMgbm8gUmVnRXhwIGFzIGEgc2Vjb25kIGFyZ3VtZW50IGJ1dCBpbnN0ZWFkIGEgc3RyaW5nLCB0aGlzIHN0cmluZyB3aWxsXG4gKiBiZSB1c2VkIGZvciBjb21wYXJpc29uLiBDYW4gYWxzbyBiZSBhbiBhcmJpdHJhcnkgbnVtYmVyIG9mIHN0cmluZ3MuIEFsbCB0aGUga2V5cyBub3Qgc3RyaWN0IGVxdWFsaW5nIHRvIHRoZSBzdWJtaXR0ZWRcbiAqIGFyZ3VtZW50cyB3aWxsIHRoZW4gYmUgYXNzaWduZWQgdGhlaXIgdmFsdWVzIHRvIHRhcmdldC5cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRhcmdldFxuICovXG5jb25zdCBhc3NpZ24gPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG5cbiAgICBsZXQgc291cmNlcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cbiAgICBzb3VyY2VzID0gc291cmNlcy5tYXAoIHNvdXJjZSA9PiB7XG5cbiAgICAgICAgaWYgKGlzUGxhaW5PYmplY3Qoc291cmNlKSkge1xuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYgKGlzQXJyYXkoc291cmNlKSkge1xuICAgICAgICAgICAgY29uc3QgW29iaiwgLi4uYXJnc10gPSBzb3VyY2UsXG4gICAgICAgICAgICAgICAgcmVnZXhwID0gYXJnc1swXTtcblxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgICAgICAgICAgICBPYmplY3QuZW50cmllcyhvYmopLmZpbHRlcihlbnRyeSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBrZXkgPSBlbnRyeVswXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzcngocmVnZXhwKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGtleS5tYXRjaChyZWdleHApICE9PSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzTm90LmFwcGx5KHN0cmluZywgW2tleV0uY29uY2F0KGFyZ3MpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih0YXJnZXQsIC4uLnNvdXJjZXMpO1xufTtcblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbi8qKlxuICogVHJhbnNmb3JtZXIgZm9yIHRyYW5zZm9ybWluZyBxdW90ZWQgcGxhaW4tdGV4dCAocXVvdGUgbWFya3M6IFwiPlwiKVxuICogdG8gYSB0ZXh0IGNvbnRhaW5pbmcgYmxvY2txdW90ZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqICBsZXQgdGV4dCA9IFtcbiAqICAgICAgXCI+IFRoaXMgaXNcIixcbiAqICAgICAgXCI+IHNvbWUgcXVvdGVkXCIsXG4gKiAgICAgIFwiPj4gVGV4dCB0aGF0IGRvZXMgMVwiLFxuICogICAgICBcIj4+IFRleHQgdGhhdCBkb2VzIDJcIixcbiAqICAgICAgXCI+aG0gZ29vZFwiLFxuICogICAgICBcInN0ZmYgdGhhdFwiLFxuICogICAgICBcInVzdWFsbHkgbGlrZXNcIixcbiAqICAgICAgXCI+PiB0byBiZSBwYXJzZWRcIixcbiAqICAgICAgXCI+PllPIVwiLFxuICogIF0uam9pbihcIlxcblwiKTtcbiAqXG4gKiAgbGV0IHRyYW5zZm9ybWVyID0gbmV3IEJsb2NrcXVvdGVUcmFuc2Zvcm1lclxuICpcbiAqICB0cmFuc2Zvcm1lci50cmFuc2Zvcm0odGV4dCk7XG4gKlxuICogIC8vIHJldHVybnM6XG4gKiAgLy8gPGJsb2NrcXVvdGU+XG4gKiAgLy8gICBUaGlzIGlzXG4gKiAgLy8gICBzb21lIHF1b3RlZFxuICogIC8vICAgPGJsb2NrcXVvdGU+XG4gKiAgLy8gICAgICBUZXh0IHRoYXQgZG9lcyAxXG4gKiAgLy8gICAgICBUZXh0IHRoYXQgZG9lcyAyXG4gKiAgLy8gICA8L2Jsb2NrcXVvdGU+XG4gKiAgLy8gICBobSBnb29kXG4gKiAgLy8gPC9ibG9ja3F1b3RlPlxuICogIC8vIHN0ZmYgdGhhdFxuICogIC8vIHVzdWFsbHkgbGlrZXNcbiAqICAvLyA8YmxvY2txdW90ZT5cbiAqICAvLyAgPGJsb2NrcXVvdGU+XG4gKiAgLy8gICB0byBiZSBwYXJzZWRcbiAqICAvLyAgIFlPIVxuICogIC8vICA8L2Jsb2NrcXVvdGU+XG4gKiAgLy8gPC9ibG9ja3F1b3RlPlxuICpcbiAqL1xuY2xhc3MgQmxvY2txdW90ZVRyYW5zZm9ybWVyIHtcblxuXG4gICAgLyoqXG4gICAgICogSW52b2tlcyB0cmFuc2Zvcm1pbmcgdGhlIHBhc3NlZCBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKi9cbiAgICB0cmFuc2Zvcm0gKHZhbHVlKSB7XG5cbiAgICAgICAgY29uc3QgbWUgPSB0aGlzO1xuXG4gICAgICAgIGxldCBncm91cHMgPSBtZS5ncm91cCh2YWx1ZSksXG4gICAgICAgICAgICB0ZXh0cyA9IFtdO1xuXG4gICAgICAgIGdyb3Vwcy5mb3JFYWNoKGdyb3VwID0+IHtcbiAgICAgICAgICAgIHRleHRzLnB1c2gobWUucXVvdGUoZ3JvdXApKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRleHRzLmpvaW4oXCJcIik7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFRha2VzIGNhcmUgb2YgZ3JvdXBpbmcgdGhlIHRleHQgaW50byBibG9ja3Mgb2ZcbiAgICAgKiBxdW90ZWQgLyB1bnF1b3RlZCBwYXJ0cy4gVGFrZXMgY2FyZSBvZiBzYW5pdGl6aW5nIHRoZSBxdW90ZSBtYXJrcywgdG9vLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAgICBsZXQgdGV4dCA9IFtcbiAgICAgKiAgICAgIFwiID4gVGhpcyBpc1wiLFxuICAgICAqICAgICAgXCI+IHNvbWUgcXVvdGVkXCIsXG4gICAgICogICAgICBcIiAgPiA+IFRleHQgdGhhdCBkb2VzIDFcIixcbiAgICAgKiAgICAgIFwiPiAgICA+IFRleHQgdGhhdCBkb2VzIDJcIixcbiAgICAgKiAgICAgIFwiPmhtIGdvb2RcIixcbiAgICAgKiAgICAgIFwic3R1ZmYgdGhhdFwiLFxuICAgICAqICAgICAgXCJ1c3VhbGx5IGxpa2VzXCIsXG4gICAgICogICAgICBcIj4+IHRvIGJlIHBhcnNlZFwiLFxuICAgICAqICAgICAgXCI+PllPIVwiLFxuICAgICAqICAgIF0uam9pbihcIlxcblwiKTtcbiAgICAgKlxuICAgICAqICB0cmFuc2Zvcm1lci5ncm91cCh0ZXh0KTtcbiAgICAgKiAgLy8gW1xuICAgICAqICAvLyAgIFtcIj4gVGhpcyBpc1wiLCBcIj4gc29tZSBxdW90ZWRcIiwgXCI+PiBUZXh0IHRoYXQgZG9lcyAxXCIsIFwiPj4gVGV4dCB0aGF0IGRvZXMgMlwiLCBcIj5obSBnb29kXCJdLFxuICAgICAqICAvLyAgIFtcInN0dWZmIHRoYXRcIiwgXCJ1c3VhbGx5IGxpa2VzXCJdLFxuICAgICAqICAvLyAgIFtcIj4+IHRvIGJlIHBhcnNlZFwiLCBcIj4+WU8hXCJdXG4gICAgICogIC8vIF1cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0XG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdyb3VwICh0ZXh0KSB7XG5cbiAgICAgICAgY29uc3QgbWUgPSB0aGlzO1xuXG4gICAgICAgIGxldCBsaW5lcyA9IHRleHQuc3BsaXQoXCJcXG5cIiksXG4gICAgICAgICAgICB0b1F1b3RlID0gW10sXG4gICAgICAgICAgICBncm91cHMgPSAtMSxcbiAgICAgICAgICAgIHByZXYgPSBudWxsO1xuXG4gICAgICAgIGxpbmVzLmZvckVhY2gobGluZSA9PiB7XG5cbiAgICAgICAgICAgIGxpbmUgPSBtZS5zYW5pdGl6ZUxpbmUobGluZSk7XG5cbiAgICAgICAgICAgIGlmIChwcmV2ICE9PSBsaW5lLmluZGV4T2YoXCI+XCIpKSB7XG4gICAgICAgICAgICAgICAgZ3JvdXBzKys7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHByZXYgPSBsaW5lLmluZGV4T2YoXCI+XCIpO1xuXG4gICAgICAgICAgICBpZiAoIXRvUXVvdGVbZ3JvdXBzXSkge1xuICAgICAgICAgICAgICAgIHRvUXVvdGVbZ3JvdXBzXSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG9RdW90ZVtncm91cHNdLnB1c2gobGluZSk7XG5cbiAgICAgICAgfSk7XG5cblxuICAgICAgICByZXR1cm4gdG9RdW90ZTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFRha2VzIGNhcmUgb2YgcHJvcGVyIHF1b3RpbmcgdGhlIHBhc3NlZCBncm91cC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGdyb3VwXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBxdW90ZSAoZ3JvdXApIHtcblxuICAgICAgICBpZiAoZ3JvdXBbMF0uaW5kZXhPZihcIj5cIikgIT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBncm91cC5qb2luKFwiXFxuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9wID0gcXVvdGVkID0+IHtcbiAgICAgICAgICAgIGlmIChxdW90ZWRbcXVvdGVkLmxlbmd0aCAtIDFdID09PSBcIlxcblwiKSB7XG4gICAgICAgICAgICAgICAgcXVvdGVkLnBvcCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBjdXJyZW50SW50ZW5kID0gMCxcbiAgICAgICAgICAgIGludGVuZGF0aW9uLFxuICAgICAgICAgICAgcXVvdGVkID0gW10sXG4gICAgICAgICAgICBtYXRjaDtcblxuICAgICAgICBncm91cC5mb3JFYWNoKGxpbmUgPT4ge1xuXG4gICAgICAgICAgICBtYXRjaCA9IChsaW5lICsgXCJcIikudHJpbSgpLm1hdGNoKC9eKCg+KSspICo/KC4qPyQpL21zKTtcblxuICAgICAgICAgICAgaW50ZW5kYXRpb24gPSBtYXRjaFsxXS5sZW5ndGg7XG5cbiAgICAgICAgICAgIHdoaWxlIChpbnRlbmRhdGlvbiA+IGN1cnJlbnRJbnRlbmQpIHtcbiAgICAgICAgICAgICAgICBwb3AocXVvdGVkKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50SW50ZW5kKys7XG4gICAgICAgICAgICAgICAgcXVvdGVkLnB1c2goXCI8YmxvY2txdW90ZT5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHdoaWxlIChjdXJyZW50SW50ZW5kID4gaW50ZW5kYXRpb24pIHtcbiAgICAgICAgICAgICAgICBwb3AocXVvdGVkKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50SW50ZW5kLS07XG4gICAgICAgICAgICAgICAgcXVvdGVkLnB1c2goXCI8L2Jsb2NrcXVvdGU+XCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBxdW90ZWQucHVzaChtYXRjaFszXSk7XG4gICAgICAgICAgICBxdW90ZWQucHVzaChcIlxcblwiKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICB3aGlsZSAoY3VycmVudEludGVuZCA+IDApIHtcbiAgICAgICAgICAgIHBvcChxdW90ZWQpO1xuICAgICAgICAgICAgY3VycmVudEludGVuZC0tO1xuICAgICAgICAgICAgcXVvdGVkLnB1c2goXCI8L2Jsb2NrcXVvdGU+XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHF1b3RlZC5qb2luKFwiXCIpO1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBTYW5pdGl6ZXMgYSBzaW5nbGUgbGluZSBieSBncm91cGluZyBxdW90ZSBtYXJrcyBwcm9wZXJseS5cbiAgICAgKlxuICAgICAqICogQGV4YW1wbGVcbiAgICAgKiAgICBsZXQgbGluZSA9IFwiICA+ID4gICAgVGV4dCB0aGF0IGRvZXMgMVwiXCI7XG4gICAgICpcbiAgICAgKiAgbGluZSA9IHRyYW5zZm9ybWVyLnNhbml0aXplTGluZShsaW5lKTtcbiAgICAgKiAgLy8gXCI+PiBUZXh0IHRoYXQgZG9lcyAxXCJcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBsaW5lXG4gICAgICpcbiAgICAgKiBAcmV1cm4ge1N0cmluZ31cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgc2FuaXRpemVMaW5lIChsaW5lKSB7XG5cbiAgICAgICAgbGV0IHJlZ2V4ID0gL14oICopKD4rKSggPiopKig/ISQpL207XG5cbiAgICAgICAgcmV0dXJuIGxpbmUucmVwbGFjZShcbiAgICAgICAgICAgIHJlZ2V4LFxuICAgICAgICAgICAgKGFyZ3MpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJncy5yZXBsYWNlKC8oXFxzKSooPyEkKS9nLCBcIlwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxufVxuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuLyoqXG4gKiBUcmFuc2Zvcm1lciBmb3IgdHJhbnNmb3JtaW5nIHBsYWluIHRleHQgY29udGFpbmluZyBFbWFpbC1BZGRyZXNzZXNcbiAqIGludG8gdGV4dCB0aGF0IHdyYXBzIHRob3NlIEVtYWlsLUFkZHJlc2VzIGluIFwiPGE+XCItdGFncyBhbG9uZyB3aXRoIHRoZSBocmVmLWF0dHJpYnV0ZSdzXG4gKiB2YWx1ZSAoaS5lLiB0aGUgRW1haWwtQWRkcmVzcyBpdHNlbGYpIHByZWZpeGVkIHdpdGggXCJtYWlsdG86XCJcbiAqXG4gKiBAZXhhbXBsZVxuICogIGxldCB0ZXh0ID0gXCJQbGVhc2UgY29udGFjdCBpbmZvQGNvbmpvb24uY29tIGZvciBmdXJ0aGVyIGluZm9ybWF0aW9uLlwiO1xuICpcbiAqICBsZXQgdHJhbnNmb3JtZXIgPSBuZXcgRW1haWxBZGRyZXNzVHJhbnNmb3JtZXI7XG4gKlxuICogIHRyYW5zZm9ybWVyLnRyYW5zZm9ybSh0ZXh0KTtcbiAqXG4gKiAgLy8gcmV0dXJuczpcbiAqICAvLyBQbGVhc2UgY29udGFjdCA8YSBocmVmPVwibWFpbHRvOmluZmlAY29uam9vbi5jb21cIj5pbmZvQGNvbmpvb24uY29tPC9hPiBmb3IgZnVydGhlciBpbmZvcm1hdGlvbi5cbiAqXG4gKi9cbmNsYXNzIEVtYWlsQWRkcmVzc1RyYW5zZm9ybWVyIHtcblxuXG4gICAgLyoqXG4gICAgICogSW52b2tlcyB0cmFuc2Zvcm1pbmcgdGhlIHBhc3NlZCBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKi9cbiAgICB0cmFuc2Zvcm0gKHRleHQpIHtcblxuICAgICAgICBjb25zdCBlbWFpbFJlZ2V4ID0gL1thLXpBLVowLTkrLl8lLV17MSwyNTZ9QFthLXpBLVowLTldW2EtekEtWjAtOS1dezAsNjR9KFxcLlthLXpBLVowLTldW2EtekEtWjAtOS1dezAsMjV9KSsvZ2k7XG5cbiAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZShlbWFpbFJlZ2V4LCBtYXRjaGVzID0+IChcIjxhIGhyZWY9XFxcIm1haWx0bzpcIiArIG1hdGNoZXMgKyBcIlxcXCI+XCIgKyBtYXRjaGVzICsgXCI8L2E+XCIpKTtcblxuICAgICAgICByZXR1cm4gdGV4dDtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuLyoqXG4gKiBUcmFuc2Zvcm1lciBmb3IgdHJhbnNmb3JtaW5nIHBsYWluLXRleHQgY29udGFpbmluZyBIeXBlcmxpbmtzXG4gKiBpbnRvIHRleHQgdGhhdCB3cmFwcyB0aG9zZSBIeXBlcmxpbmtzIGluIFwiPGE+XCItdGFncy5cbiAqXG4gKiBAZXhhbXBsZVxuICogIGxldCB0ZXh0ID0gXCJUaGlzIGlzIGFuIHVybCBodHRwczovL3d3dy5jb25qb29uLm9yZyBhbmQgaXQgaXMgbm90IGNsaWNrYWJsZVwiO1xuICpcbiAqICBsZXQgdHJhbnNmb3JtZXIgPSBuZXcgSHlwZXJsaW5rVHJhbnNmb3JtZXI7XG4gKlxuICogIHRyYW5zZm9ybWVyLnRyYW5zZm9ybSh0ZXh0KTtcbiAqXG4gKiAgLy8gcmV0dXJuczpcbiAqICAvLyBUaGlzIGlzIGFuIHVybCA8YSBocmVmPVwiaHR0cHM6Ly93d3cuY29uam9vbi5vcmdcIj5odHRwczovL3d3dy5jb25qb29uLm9yZzwvYT4gYW5kIGl0IGlzIG5vdCBjbGlja2FibGVcbiAqXG4gKi9cbmNsYXNzIEh5cGVybGlua1RyYW5zZm9ybWVyIHtcblxuICAgIC8qKlxuICAgICAqIEludm9rZXMgdHJhbnNmb3JtaW5nIHRoZSBwYXNzZWQgc3RyaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgdHJhbnNmb3JtICh0ZXh0KSB7XG5cbiAgICAgICAgY29uc3QgdXJsUmVnZXggPSAvKFxcYihodHRwcz8pOlxcL1xcL1stQS1aMC05KyZAIy8lPz1+X3whOiwuO10qWy1BLVowLTkrJkAjLyU9fl98XSkvaWc7XG5cbiAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSh1cmxSZWdleCwgbWF0Y2hlcyA9PiAoXCI8YSBocmVmPVxcXCJcIiArIG1hdGNoZXMgKyBcIlxcXCI+XCIgKyBtYXRjaGVzICsgXCI8L2E+XCIpKTtcblxuICAgICAgICByZXR1cm4gdGV4dDtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuLyoqXG4gKiBUcmFuc2Zvcm1lciBmb3IgdHJhbnNmb3JtaW5nIHBsYWluIHRleHQgY29udGFpbmluZyBsaW5lIGJyZWFrcyAoXFxyLCBcXHJcXG4sIFxcbilcbiAqIGludG8gdGV4dCB0aGF0IHJlcGxhY2VzIHRoZSBsaW5lIGJyZWFrcyB3aXRoIFwiPGJyIC8+XCItdGFncy5cbiAqXG4gKiBAZXhhbXBsZVxuICogIGxldCB0ZXh0ID0gXCJQbGVhc2VcXG4gZG9uJ3RcXG5cXG4gd3JhcFxcbm1lXCI7XG4gKlxuICogIGxldCB0cmFuc2Zvcm1lciA9IG5ldyBMaW5lQnJlYWtUcmFuc2Zvcm1lcjtcbiAqXG4gKiAgdHJhbnNmb3JtZXIudHJhbnNmb3JtKHRleHQpO1xuICpcbiAqICAvLyByZXR1cm5zOlxuICogIC8vIFBsZWFzZTxiciAvPiBkb24ndDxiciAvPjxiciAvPiB3cmFwPGJyIC8+bWVcbiAqXG4gKi9cbmNsYXNzIExpbmVCcmVha1RyYW5zZm9ybWVyIHtcblxuXG4gICAgLyoqXG4gICAgICogSW52b2tlcyB0cmFuc2Zvcm1pbmcgdGhlIHBhc3NlZCBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKi9cbiAgICB0cmFuc2Zvcm0gKHRleHQpIHtcblxuICAgICAgICBjb25zdCByZWdleCA9IC8oXFxyXFxufFxcbnxcXHIpL2dtO1xuXG4gICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UocmVnZXgsIG1hdGNoZXMgPT4gKFwiPGJyIC8+XCIpKTtcblxuICAgICAgICByZXR1cm4gdGV4dDtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxudmFyIF9sOGpzJDUgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gICAgX19wcm90b19fOiBudWxsLFxuICAgIEJsb2NrcXVvdGVUcmFuc2Zvcm1lcjogQmxvY2txdW90ZVRyYW5zZm9ybWVyLFxuICAgIEVtYWlsQWRkcmVzc1RyYW5zZm9ybWVyOiBFbWFpbEFkZHJlc3NUcmFuc2Zvcm1lcixcbiAgICBIeXBlcmxpbmtUcmFuc2Zvcm1lcjogSHlwZXJsaW5rVHJhbnNmb3JtZXIsXG4gICAgTGluZUJyZWFrVHJhbnNmb3JtZXI6IExpbmVCcmVha1RyYW5zZm9ybWVyXG59KTtcblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbnZhciBfbDhqcyQ0ID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICAgIF9fcHJvdG9fXzogbnVsbCxcbiAgICBodG1sOiBfbDhqcyQ1XG59KTtcblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbnZhciBfbDhqcyQzID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICAgIF9fcHJvdG9fXzogbnVsbCxcbiAgICB0cmFuc2Zvcm1lcjogX2w4anMkNFxufSk7XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBjbGFzc2VzIGltcGxlbWVudGluZyB0ZW1wbGF0ZSBjb21waWxlciBmdW5jdGlvbmFsaXR5XG4gKi9cbmNsYXNzIENvbXBpbGVyIHtcblxuICAgIC8qKlxuICAgICAqIENvbXBpbGVzIHRoZSBzcGVjaWZpZWQgdHh0IGFuZCByZXR1cm5zIGFuIGluc3RhbmNlIG9mIENvbXBpbGVkVHBsLlxuICAgICAqIEltcGxlbWVudGluZyBjbGFzc2VzIHNob3VsZCB0YWtlIGNhcmUgb2YgcHJvcGVybHkgcGFyc2luZyB0aGUgdHh0IGZvciB0aGUgYWxsb3dlZCBrZXlzIGFuZFxuICAgICAqIHZvaWQgYW55IG90aGVyIGtleXMgZGV0ZWN0ZWQgaW4gdGhlIHRlbXBsYXRlLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR4dFxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGtleXMgQW4gYXJyYXkgb2Yga2V5cyByZXByZXNlbnRpbmcgYWxsb3dlZCB0ZW1wbGF0ZSB2YXJpYWJsZXMsIG9wdGlvbmFsLlxuICAgICAqXG4gICAgICogQHJldHVybiB7Q29tcGlsZWRUcGx9XG4gICAgICpcbiAgICAgKiBAdGhyb3dzIGlmIGFueSBlcnJvciBkdXJpbmcgY29tcGlsaW5nIG9jY3Vyc1xuICAgICAqL1xuICAgIGNvbXBpbGUgKHR4dCwga2V5cykge31cblxuXG59XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciBDb21waWxlZCBUZW1wbGF0ZXMuXG4gKlxuICovXG5jbGFzcyBDb21waWxlZFRwbCB7XG5cbiAgICAvKipcbiAgICAgKiBSZXBsYWNlcyBrZXlzIGZyb20gZGF0YSBmb3VuZCBpbiB0aGlzIGNvbXBpbGVkIHRlbXBsYXRlIHdpdGggdGhlaXIgYXBwcm9wcmlhdGUgdmFsdWVzXG4gICAgICogYW5kIHJldHVybnMgdGhlIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGlzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKlxuICAgICAqIEB0aHJvd3MgaWYgYW55IGVycm9yIGR1cmluZyB0aGUgcmVuZGVyaW5nIHByb2Nlc3Mgb2NjdXJzXG4gICAgICovXG4gICAgcmVuZGVyIChkYXRhKSB7fVxuXG59XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG5cbi8qKlxuICogQ29tcGlsZWQgVGVtcGxhdGUgcmVwcmVzZW50YXRpb24gZm9yIGphdmFTY3JpcHQtU3RyaW5ncy5cbiAqXG4gKi9cbmNsYXNzIFRwbCBleHRlbmRzIENvbXBpbGVkVHBsIHtcblxuICAgIC8qKlxuICAgICAqIEB2YXIgZm5cbiAgICAgKiBAdHlwZSBGdW5jdGlvblxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3Rvci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBpbnRlcm5hbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgY29tcGlsZWQgdGVtcGxhdGUgd3JhcHBlZCBpbiBhIGZ1bmN0aW9uLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGtleXMgYWxsb3dlZCBrZXlzIGFzIHBhc3NlZCBmcm9tIHRoZSBjb21waWxlclxuICAgICAqXG4gICAgICogQHRocm93cyBpZiBmbiBpcyBub3QgYSBmdW5jdGlvblxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yIChmbikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBpZiAoIWlzRnVuY3Rpb24oZm4pKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJcXFwiZm5cXFwiIG11c3QgYmUgb2YgdHlwZSBcXFwiZnVuY3Rpb25cXFwiXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5mbiA9IGZuO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQGluaGVyaXRkb2NcbiAgICAgKi9cbiAgICByZW5kZXIgKGRhdGEpIHtcbiAgICAgICAgY29uc3QgbWUgPSB0aGlzO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gbWUuZm4uY2FsbCh7fSwgZGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgcmVuZGVyaW5nIFwiZGF0YVwiIGZhaWxlZCB3aXRoIG1lc3NhZ2UgJHtlLm1lc3NhZ2V9YCk7XG4gICAgICAgIH1cblxuICAgIH1cblxuXG59XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuLyoqXG4gKiBDb21waWxlciBpbXBsZW1lbnRhdGlvbiBmb3IgSmF2YVNjcmlwdCB0ZW1wbGF0ZSBzdHJpbmdzLlxuICpcbiAqL1xuY2xhc3MgU3RyaW5nQ29tcGlsZXIgZXh0ZW5kcyBDb21waWxlciB7XG5cbiAgICAvKipcbiAgICAgKiBJbnRlcm5hbCBjb21waWxlciByZXByZXNlbnRhdGlvbi5cbiAgICAgKiBAdmFyIGNwbFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBAaW5oZXJpdGRvY1xuICAgICAqL1xuICAgIGNvbXBpbGUgKHR4dCwga2V5cykge1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAgbWUgPSB0aGlzLFxuICAgICAgICAgICAgdHBsS2V5cyA9IG1lLmdldEtleXModHh0KSxcbiAgICAgICAgICAgIGFyZ3MgPSBtZS5idWlsZEFyZ3VtZW50TGlzdCh0cGxLZXlzKSxcbiAgICAgICAgICAgIGludmFsaWRLZXlzID0gbWUuZ2V0QmxhY2tsaXN0ZWRLZXlzKGFyZ3MsIGtleXMgfHwgW10pO1xuXG4gICAgICAgIGlmIChpbnZhbGlkS2V5cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICBgQ2Fubm90IGNvbXBpbGUgdGVtcGxhdGU6IENvbnRhaW5zIGludmFsaWQga2V5czogJHtpbnZhbGlkS2V5cy5qb2luKFwiLCBcIil9YFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICBmbiA9IG1lLmdldEZ1bmN0aW9uQ29uZmlnKGFyZ3MsIHR4dCksXG4gICAgICAgICAgICBjcGwgPSBtZS5nZXROYXRpdmVGdW5jdGlvbihmbi5hcmdzLCBmbi5mbik7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBUcGwoY3BsKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEdldHMgYSBsaXN0IG9mIGtleXMgYW5kIHJldHVybnMgYW4gYXJyYXkgb2YgYXJndW1lbnRzIHJlcHJlc2VudGluZyBwb3NzaWJsZSBjYW5kaWRhdGVzXG4gICAgICogdG8gcGFzcyB0byB0aGUgdGVtcGxhdGUgcmVuZGVyIGZ1bmN0aW9uLiBNYWtlcyBzdXJlIGVudHJpZXMgYXJlXG4gICAgICogdW5pcXVlIGFuZCB0aGF0IG9iamVjdCBjaGFpbnMgYXJlIHJlc29sdmVkIHRvIHRoZSByb290IG9iamVjdC5cbiAgICAgKlxuICAgICAqICBAZXhhbXBsZVxuICAgICAqICB0aGlzLmJ1aWxkQXJndW1lbnRMaXN0KFtcImZvb1wiLCBcImZvby5iYXJcIiwgXCJjb25maWdcIiwgXCJjb25maWdbXFxcInRlc3RcXFwiXV0pOyAvLyBcImZvbywgY29uZmlnXCJcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge0FycmF5fSBrZXlMaXN0XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgYnVpbGRBcmd1bWVudExpc3QgKGtleUxpc3QpIHtcbiAgICAgICAgbGV0IGxpc3QgPSBrZXlMaXN0Lm1hcChrZXkgPT4ga2V5LnNwbGl0KC9cXC58XFxbLylbMF0pO1xuXG4gICAgICAgIHJldHVybiBbLi4ubmV3IFNldChsaXN0KV07XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBFeHRyYWN0cyBhbGwgdGhlIHBsYWNlaG9sZGVycyB3aXRoIHRoZWlyIG5hbWVzIG91dCBvZiB0aGUgdHh0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR4dFxuICAgICAqL1xuICAgIGdldEtleXMgKHR4dCkge1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAgcmVnZXggPSAvXFwkXFx7KFtefV0rKVxcfS9nbSxcbiAgICAgICAgICAgIGtleXMgPSBbXTtcblxuICAgICAgICBsZXQgbTtcblxuICAgICAgICB3aGlsZSAoKG0gPSByZWdleC5leGVjKHR4dCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGlzIG5lY2Vzc2FyeSB0byBhdm9pZCBpbmZpbml0ZSBsb29wcyB3aXRoIHplcm8td2lkdGggbWF0Y2hlc1xuICAgICAgICAgICAgaWYgKG0uaW5kZXggPT09IHJlZ2V4Lmxhc3RJbmRleCkge1xuICAgICAgICAgICAgICAgIHJlZ2V4Lmxhc3RJbmRleCsrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUaGUgcmVzdWx0IGNhbiBiZSBhY2Nlc3NlZCB0aHJvdWdoIHRoZSBgbWAtdmFyaWFibGUuXG4gICAgICAgICAgICBtLmZvckVhY2goKG1hdGNoLCBncm91cEluZGV4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwSW5kZXggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAga2V5cy5wdXNoKG1hdGNoKTsgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGtleXM7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBDb21wYXJlcyB0aGUgd2hpdGVsaXN0IG9mIGtleXMgd2l0aCB0aGUgc3VibWl0dGVkIGtleXMuXG4gICAgICogUmV0dXJucyBhbGwgdmFsdWVzIHRoYXQgZG8gbm90IGFwcGVhciBpbiB0aGUgd2hpdGVsaXN0LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiB0aGlzLmdldEJsYWNrbGlzdGVkS2V5cyhcbiAgICAgKiAgICAgIFtcImZvb1wiLCBcImJhclwiLCBcIndpbmRvd1wiLCBcInRoaXNcIl0sXG4gICAgICogICAgICBbXCJ0ZXN0XCIsIFwiZm9vXCIsIFwid2luZG93XCJdXG4gICAgICogICk7IC8vIFtcInRoaXNcIiwgXCJiYXJcIl1cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHNvdXJjZVxuICAgICAqIEBwYXJhbSB7QXJyYXl9IHdoaXRlbGlzdCBpZiBsZWZ0IGVtcHR5LCBhbGwga2V5cyBhcmUgYWxsb3dlZFxuICAgICAqXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldEJsYWNrbGlzdGVkS2V5cyAoc291cmNlLCB3aGl0ZWxpc3QpIHtcbiAgICAgICAgaWYgKCF3aGl0ZWxpc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNvdXJjZS5maWx0ZXIoZW50cnkgPT4gd2hpdGVsaXN0LmluZGV4T2YoZW50cnkpID09PSAtMSk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGludGVybmFsIGNvbmZpZ3VyYXRpb24gb2JqZWN0IHRoYXQgZ2V0cyBwYXNzZWQgdG8gbmV3IEZ1bmN0aW9uXG4gICAgICogdG8gYnVpbGQgdGhlIGNvbXBpbGVkIGZ1bmN0aW9uIGZvciBjcmVhdGluZyBhbiBlc2l4LlRwbCBvdXQgb2YuXG4gICAgICogQVBJIG9ubHkuIFRoaXMgbWV0aG9kIHNob3VsZCBiZSBjYWxsZWQgd2huZXZlciBwYXJzaW5nIGFuZCBwcmVwYXJpbmcgdGhlIHRlbXBsYXRlXG4gICAgICogdGV4dCBjb21wbGV0ZWQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJndW1lbnRMaXN0XG4gICAgICogQHBhcmFtIHR4dFxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBnZXRGdW5jdGlvbkNvbmZpZyAoYXJndW1lbnRMaXN0LCB0eHQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGFyZ3MgOiBgeyR7YXJndW1lbnRMaXN0LmpvaW4oXCIsIFwiKX19YCxcbiAgICAgICAgICAgIGZuIDogYHJldHVybiBcXGAke3R4dH1cXGBgXG4gICAgICAgIH07XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldE5hdGl2ZUZ1bmN0aW9uIChhcmdzLCBib2R5KSB7XG4gICAgICAgIHJldHVybiBuZXcgRnVuY3Rpb24oYXJncywgYm9keSk7XG4gICAgfVxuICAgIFxufVxuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGVtcGxhdGUgaW1wbGVtZW50YXRpb25zLlxuICpcbiAqL1xuY2xhc3MgVGVtcGxhdGUge1xuXG4gICAgLyoqXG4gICAgICogUmVuZGVycyB0aGlzIHRlbXBsYXRlcyB0eHQgd2l0aCB0aGUgc3BlY2lmaWVkIGRhdGEuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfSBUaGUgY29tcGlsZWQsIHNhbml0aXplZCBhbmQgcGFyc2VkIHRlbXBsYXRlIHdpdGggdGhlIHBsYWNlaG9sZGVyc1xuICAgICAqIHJlcGxhY2VkIHdpdGggdGhlIGRhdGEgZm91bmQgaW4gdGhlIHN1Ym1pdHRlZCBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAdGhyb3dzIGlmIGFueSBlcnJvciBkdXJpbmcgdGhlIHJlbmRlcmlnIHByb2Nlc3Mgb2NjdXJzLlxuICAgICAqL1xuICAgIHJlbmRlciAoZGF0YSkge31cblxuXG59XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4vKipcbiAqIFRlbXBsYXRlIENsYXNzIHByb3ZpZGluZyBzdXBwb3J0IGZvciBKYXZhU2NyaXB0IHRlbXBsYXRlIHN0cmluZ3MuXG4gKlxuICovXG5jbGFzcyBTdHJpbmdUZW1wbGF0ZSBleHRlbmRzIFRlbXBsYXRlIHtcblxuXG4gICAgLyoqXG4gICAgICogQHZhciB0cGxcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBNYXBzIHByZS1jb21waWxlZCB0ZW1wbGF0ZXMgd2l0aCB0aGUga2V5cyBvZiB0aGUgZGF0YSBvYmplY3QgcGFzc2VkIHRvIHRoZW0gZm9yXG4gICAgICogYnVpbGRpbmcgYSBjb21waWxlciBjYWNoZS5cbiAgICAgKiBAdmFyIGNvbXBpbGVkVHBsc1xuICAgICAqIEB0eXBlIHtBcnJheS48VHBsPn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuXG5cbiAgICAvKipcbiAgICAgKiBAdmFyIGNvbXBpbGVyXG4gICAgICogQHR5cGUge1N0cmluZ0NvbXBpbGVyfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG5cblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRwbCBUaGUgdGVtcGxhdGUgc3RyaW5nIHRoaXMgdGVtcGxhdGUgcmVwcmVzZW50cy5cbiAgICAgKlxuICAgICAqIEB0aHJvd3Mge2Nvb24uY29yZS5leGNlcHRpb24uSWxsZWdhbEFyZ3VtZW50RXhjZXB0aW9ufSBpZiBjb21waWxlciBpcyBub1xuICAgICAqIGluc3RhbmNlIG9mIHtjb29uLmNvcmUudGVtcGxhdGUuQ29tcGlsZXJ9XG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKHRwbCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICBjb25zdCBtZSA9IHRoaXM7XG5cbiAgICAgICAgbWUuY29tcGlsZXIgPSBuZXcgU3RyaW5nQ29tcGlsZXIoKTtcblxuICAgICAgICBtZS50cGwgPSB0cGw7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBSZW5kZXJzIHRoaXMgdGVtcGxhdGVzIHR4dCB3aXRoIHRoZSBzcGVjaWZpZWQgZGF0YS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAgICpcbiAgICAgKiBAdGhyb3dzIGV4Y2VwdGlvbnMgZnJvbSA8Q29tcGlsZXI+LmNvbXBpbGUoKSBhbmQgPENvbXBpbGVkVHBsPi5yZW5kZXIoKVxuICAgICAqL1xuICAgIHJlbmRlciAoZGF0YSkge1xuICAgICAgICBjb25zdCBtZSA9IHRoaXM7XG5cbiAgICAgICAgbGV0IGtleXMgICA9IE9iamVjdC5rZXlzKGRhdGEpLFxuICAgICAgICAgICAgY3BsS2V5ID0ga2V5cy5qb2luKFwiLlwiKTtcblxuICAgICAgICBtZS5jb21waWxlZFRwbHMgPSBtZS5jb21waWxlZFRwbHMgfHwge307XG5cbiAgICAgICAgaWYgKCFtZS5jb21waWxlZFRwbHNbY3BsS2V5XSkge1xuICAgICAgICAgICAgbWUuY29tcGlsZWRUcGxzW2NwbEtleV0gPSBtZS5jb21waWxlci5jb21waWxlKG1lLnRwbCwga2V5cyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWUuY29tcGlsZWRUcGxzW2NwbEtleV0ucmVuZGVyKGRhdGEpO1xuICAgIH1cblxuXG59XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG52YXIgX2w4anMkMiA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgICBfX3Byb3RvX186IG51bGwsXG4gICAgU3RyaW5nQ29tcGlsZXI6IFN0cmluZ0NvbXBpbGVyLFxuICAgIFN0cmluZ1RlbXBsYXRlOiBTdHJpbmdUZW1wbGF0ZSxcbiAgICBUcGw6IFRwbFxufSk7XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG52YXIgX2w4anMkMSA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgICBfX3Byb3RvX186IG51bGwsXG4gICAgZXNpeDogX2w4anMkMixcbiAgICBDb21waWxlZFRwbDogQ29tcGlsZWRUcGwsXG4gICAgQ29tcGlsZXI6IENvbXBpbGVyLFxuICAgIFRlbXBsYXRlOiBUZW1wbGF0ZVxufSk7XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4vKipcbiAqIFJlc291cmNlUmVxdWVzdG9yLWltcGxlbWVudGF0aW9uIHVzaW5nIFhtbEh0dHBSZXF1ZXN0IGFwaS5cbiAqXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgIC8vIGV4aXN0aW5nIGpzb24tZmlsZSBhdCBcIi4vYXBwLWNuX21haWwuY29uZi5qc29uXCJcbiAqICAgIGNvbnN0IGZpbGVMb2FkZXIgPSBuZXcgWG1sSHR0cFJlc291cmNlUmVxdWVzdG9yKCk7XG4gKiAgICBjb25zdCByZXMgPSBhd2FpdCBmaWxlTG9hZGVyLnJlcXVlc3QoXCIuL2FwcC1jbl9tYWlsLmNvbmYuanNvblwiKTtcbiAqICAgIGNvbnNvbGUubG9nKHJlcyk7IC8vIHBsYWluIHRleHQgY29udGVudHMgb2YgdGhlIGZpbGUgb24gc3VjY2Vzc1xuICpcbiAqL1xuY2xhc3MgRmlsZUxvYWRlciB7XG5cblxuICAgIC8qKlxuICAgICAqIFNlbmRzIGEgSEVBRCByZXF1ZXN0IHRvIHRoZSBzcGVjaWZpZWQgcmVzb3VyY2UgbG9jYXRpb24uXG4gICAgICpcbiAgICAgKlxuICAgICAqIEBwYXJhbSB1cmxcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1Byb21pc2U8dm9pZD59IGZhbHNlIGlmIGFueSBleGNlcHRpb24gb2NjdXJlcyB3aGlsZSB0cnlpbmcgdG8gYWNjZXNzIHRoZSByZXNvdXJjZSxcbiAgICAgKiBpbmRpY2F0aW5nIHRoYXQgdGhlIHJlc291cmNlIG1pZ2h0IG5vdCBleGlzdC5cbiAgICAgKlxuICAgICAqIEB0aHJvd3MgaWYgdXJsIHdhcyBub3QgYSBzdHJpbmdcbiAgICAgKi9cbiAgICBhc3luYyBwaW5nICh1cmwpIHtcblxuICAgICAgICBsZXQgcmVxdWVzdDtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmVxdWVzdCA9IGF3YWl0IHRoaXMucmVxdWVzdCh1cmwsIFwiSEVBRFwiKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlcXVlc3Quc3RhdHVzID09PSAyMDA7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBJbml0aWF0ZXMgbG9hZGluZyB0aGUgZmlsZSBzcGVjaWZpZWQgd2l0aCB0aGUgZ2l2ZW4gdXJsIGFuZCByZXR1cm5zIGFcbiAgICAgKiBQcm9taXNlIG9yIGEgbWl4ZWQgdmFsdWUgcmVwcmVzZW50aW5nIHRoZSBmaWxlIGNvbnRlbnRzIGlmIHVzZWQgd2l0aCBhc3luYy9hd2FpdC5cbiAgICAgKiBJbXBsZW1lbnRpbmcgQVBJcyBzaG91bGQgYmUgYXdhcmUgb2YgcGluZyB0byBzZW5kIGEgSEVBRC1yZXF1ZXN0IHRvIHRoZSByZXNvdXJjZVxuICAgICAqIGJlZm9yZSBhbiBhdHRlbXB0IHRvIGxvYWQgaXQgaXMgbWFkZS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogLy8gdGhlbmFibGVcbiAgICAgKiBsb2FkZXIubG9hZChcImFwcC1jbl9tYWlsLmNvbmYuanNvblwiKS50aGVuKFxuICAgICAqICAgICAgKGNvbmYpID0+IHtjb25zb2xlLmxvZyhjb25mKTt9LCAvLyBjb25zb2xlLmxvZ3MgdGhlIHBsYWluIHRleHQgZnJvbSB0aGUgbG9hZGVkIGZpbGVcbiAgICAgKiAgICAgIChleGMpID0+IHtjb25zb2xlLmxvZyhleGMpO30gLy8gY29uc29sZSBsb2dzIHRoZSBleGNlcHRpb24sIGlmIGFueSBvY2N1cmVkLFxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGljaCBpcyBhIGNvb24uY29yZS5kYXRhLnJlcXVlc3QuSHR0cFJlcXVlc3RFeGNlcHRpb25cbiAgICAgKiApO1xuICAgICAqIC8vIG9yXG4gICAgICogbGV0IHR4dDtcbiAgICAgKiB0cnkge1xuICAgICAqICAgIHR4dCA9IGF3YWl0IGxvYWRlci5sb2FkKFwiYXBwLWNuX21haWwuY29uZi5qc29uXCIpO1xuICAgICAqIH0gY2F0Y2ggKGUpIHtcbiAgICAgKiAgICAvLyBleGNlcHRpb24gaGFuZGxpbmcgZm9yICBjb29uLmNvcmUuZGF0YS5yZXF1ZXN0Lkh0dHBSZXF1ZXN0RXhjZXB0aW9uXG4gICAgICogfVxuICAgICAqIGNvbnNvbGUubG9nKHR4dCk7IC8vIGZpbGUgY29udGVudHNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIGxvY2F0aW9uIHRvIHJlYWQgdGhlIGZpbGUgZnJvbVxuICAgICAqXG4gICAgICogQHJldHVybiB7UHJvbWlzZTwqPn1cbiAgICAgKlxuICAgICAqIEB0aHJvd3MgaWYgYW55IGV4Y2VwdGlvbiBvY2N1cmVkLCBvciBpZiB1cmwgd2FzIG5vdCBhIHN0cmluZ1xuICAgICAqL1xuICAgIGFzeW5jIGxvYWQgKHVybCkge1xuICAgICAgICBsZXQgcmVxdWVzdCA9IGF3YWl0IHRoaXMucmVxdWVzdCh1cmwsIFwiR0VUXCIpO1xuICAgICAgICByZXR1cm4gcmVxdWVzdC5yZXNwb25zZVRleHQ7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB1cmxcbiAgICAgKiBAcGFyYW0gbWV0aG9kXG4gICAgICovXG4gICAgYXN5bmMgcmVxdWVzdCAodXJsLCBtZXRob2QpIHtcblxuICAgICAgICBpZiAoW1wiR0VUXCIsIFwiSEVBRFwiXS5pbmRleE9mKG1ldGhvZCkgPT09IC0xKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFwibWV0aG9kXCIgKCR7bWV0aG9kfSkgaXMgbm90IHN1cHBvcnRlZGApO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc1N0cmluZyh1cmwpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJcXFwidXJsXFxcIiBtdXN0IGJlIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgcmVzb3VyY2UgbG9jYXRpb25cIik7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgcmV0ID0gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgcmVxdWVzdC5vcGVuKG1ldGhvZCwgdXJsKTtcblxuICAgICAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSAocHJvZ3Jlc3NFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGh0dHBSZXF1ZXN0ID0gcHJvZ3Jlc3NFdmVudC50YXJnZXQ7XG4gICAgICAgICAgICAgICAgaWYgKGh0dHBSZXF1ZXN0LnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoaHR0cFJlcXVlc3QpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgICAgICBodHRwUmVxdWVzdC5zdGF0dXMgKyBcIiBcIiArIGh0dHBSZXF1ZXN0LnN0YXR1c1RleHRcbiAgICAgICAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gKHByb2dyZXNzRXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBodHRwUmVxdWVzdCA9IHByb2dyZXNzRXZlbnQudGFyZ2V0O1xuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgICAgIGBBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VyZWQgd2hpbGUgdHJ5aW5nIHRvIGxvYWQgZnJvbSBcIiR7aHR0cFJlcXVlc3QucmVzcG9uc2VVUkx9XCJgXG4gICAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXF1ZXN0LnNlbmQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJldDtcbiAgICB9XG5cblxufVxuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxudmFyIF9sOGpzID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICAgIF9fcHJvdG9fXzogbnVsbCxcbiAgICBGaWxlTG9hZGVyOiBGaWxlTG9hZGVyXG59KTtcblxuZXhwb3J0IHsgYXNzaWduLCBjaGFpbiwgY2huLCBjcmVhdGVSYW5nZSwgZmYsIGZpbmRGaXJzdCwgZmxpcCwgZ3JvdXBJbmRpY2VzLCBpcywgaXNBcnJheSwgaXNGdW5jdGlvbiwgaXNOb3QsIGlzTnVtYmVyLCBpc09iamVjdCwgaXNQbGFpbk9iamVjdCwgaXNSZWdFeHAsIGlzU3RyaW5nLCBpc2EsIGlzZiwgaXNuLCBpc28sIGlzcG8sIGlzcngsIGlzcywgbGNrLCBsaXF1aWZ5LCBsaXN0TmVpZ2hib3VycywgbG9jaywgbmNobiwgcHVyZ2UsIHJlcGxhY2UsIF9sOGpzIGFzIHJlcXVlc3QsIHJwbCwgX2w4anMkMSBhcyB0ZW1wbGF0ZSwgX2w4anMkMyBhcyB0ZXh0LCB1bmNoYWluLCB1bmlmeSwgdmlzaXQsIHZzdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bDgucGFja2FnZXMuZXNtLmpzLm1hcFxuIiwiLyoqXG4gKiBjb29uLmpzXG4gKiBzaWVzdGEtbGliLWhlbHBlclxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9jb29uLWpzL3NpZXN0YS1saWItaGVscGVyXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuaW1wb3J0ICogYXMgbDggZnJvbSBcIkBsOGpzL2w4XCI7XG5cblxuLyoqXG4gKiBVc2VzIHRoZSBzcGVjaWZpZWQgdGVzdENvbmZpZyBmb3IgdGVoIHByZUxvYWRlci1zZWN0aW9uIGFuZCBhcHBsaWVzIHRoZSByZWxhdGVkIHBhdGhzIGZvdW5kIGF0XG4gKiBwYXRoQ29uZmlnVXJsIChjb25maWctZmlsZSB1cmwoKSkgdG8gaXQsIHRoZW4gcGFzc2VzIGl0IHRvIGdldFBhdGhzKCkgYW5kIHJldHVybnMgdGhlIHZhbHVlLlxuICogY29udGVudCBmb3VuZCBhdCBwYXRoQ29uZmlnVXJsIHNob3VsZCBiZSBpbiBhIGZvcm1hdCBAY29vbi1qcy9leHRqcy1saW5rIHByb2R1Y2VzLlxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogIGpzb24gYXQgXCJwYXRoQ29uZmlnVXJsLmpzb25cIjpcbiAqXG4gKiAge1xuICogICAgICAgY3NzOiBbe1xuICogICAgICAgICAgICAgICBtb2Rlcm46IFtcbiAqICAgICAgICAgICAgICAgICAgIFwiZm9vLmNzc1wiXG4gKiAgICAgICAgICAgICAgIF0sXG4gKiAgICAgICAgICAgICAgIGNsYXNzaWM6IFtcbiAqICAgICAgICAgICAgICAgICAgIFwiYmFyLmNzc1wiXG4gKiAgICAgICAgICAgICAgIF1cbiAqXG4gKiAgICAgICB9XSxcbiAqICAgICAgIGpzOiB7XG4gKiAgICAgICAgICAgICAgIG1vZGVybjogXCJtb2Rlcm4uanNcIixcbiAqICAgICAgICAgICAgICAgY2xhc3NpYzogXCJjbGFzc2ljLmpzXCJcbiAqXG4gKiAgICAgIH1cbiAqICAgfVxuICpcbiAqXG4gKiAgY29uc3QgY29uZmlnID0ge1xuICogICAgICBsb2FkZXJQYXRoOiB7XG4gKiAgICAgICBcIkV4dC5QYWNrYWdlXCI6IFwiL25vZGVfbW9kdWxlcy9AY29vbi1qcy9leHRqcy1wYWNrYWdlLWxvYWRlci9wYWNrYWdlcy9wYWNrYWdlLWxvYWRlci9zcmMvc3JjL1BhY2thZ2UuanNcIixcbiAqICAgICAgIFwiY29vbi5jb3JlXCI6IFwiLi4vc3JjL1wiLFxuICogICB9LFxuICogICBwcmVsb2Fkczoge1xuICogICAgICAgY3NzOiBbe1xuICogICAgICAgICAgICAgICBtb2Rlcm46IFtcbiAqICAgICAgICAgICAgICAgICAgIFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1tb2Rlcm4tcnVudGltZS9tYXRlcmlhbC9tYXRlcmlhbC1hbGxfMS5jc3NcIixcbiAqICAgICAgICAgICAgICAgICAgIFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1tb2Rlcm4tcnVudGltZS9tYXRlcmlhbC9tYXRlcmlhbC1hbGxfMi5jc3NcIlxuICogICAgICAgICAgICAgICBdLFxuICogICAgICAgICAgICAgICBjbGFzc2ljOiBbXG4gKiAgICAgICAgICAgICAgICAgICBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtY2xhc3NpYy1ydW50aW1lL21hdGVyaWFsL21hdGVyaWFsLWFsbF8xLmNzc1wiLFxuICogICAgICAgICAgICAgICAgICAgXCIvbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LWNsYXNzaWMtcnVudGltZS9tYXRlcmlhbC9tYXRlcmlhbC1hbGxfMi5jc3NcIixcbiAqICAgICAgICAgICAgICAgICAgIFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1jbGFzc2ljLXJ1bnRpbWUvbWF0ZXJpYWwvbWF0ZXJpYWwtYWxsXzMuY3NzXCJcbiAqICAgICAgICAgICAgICAgXVxuICogICAgICAgfV0sXG4gKiAgICAgICBqczogW1xuICogICAgICAgICAgIFwiL25vZGVfbW9kdWxlcy9AbDhqcy9sOC9kaXN0L2w4LnJ1bnRpbWUuanNcIiwge1xuICogICAgICAgICAgICAgICBtb2Rlcm46IFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1tb2Rlcm4tcnVudGltZS9tb2Rlcm4uZW5naW5lLmVudGVycHJpc2UuanNcIixcbiAqICAgICAgICAgICAgICAgY2xhc3NpYzogXCIvbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LW1vZGVybi1ydW50aW1lL2NsYXNzaWMuZW5naW5lLmVudGVycHJpc2UuanNcIlxuICogICAgICAgICAgIH1cbiAqICAgICAgIF1cbiAqICAgfX07XG4gKlxuICogIGNvbmZpZ3VyZVdpdGhFeHRKc0xpbmtQYXRocyhjb25maWcsIFwicGF0aENvbmZpZ1VybC5qc29uXCIsIHRydWUpOyAvLyByZXR1cm5zIHtcbiAqICAgLy8gICBwcmVsb2FkIDogW1xuICogICAvLyAgICAgICBcImZvby5jc3NcIixcbiAqICAgLy8gICAgICAgXCIvbm9kZV9tb2R1bGVzL0BsOGpzL2w4L2Rpc3QvbDgucnVudGltZS5qc1wiLFxuICogICAvLyAgICAgICBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtbW9kZXJuLXJ1bnRpbWUvbW9kZXJuLmVuZ2luZS5lbnRlcnByaXNlLmpzXCJcbiAqICAgLy8gICAgICAgXCJtb2Rlcm4uanNcIlxuICogICAvLyAgIF0sXG4gKiAgIC8vICAgbG9hZGVyUGF0aCA6IHtcbiAqICAgLy8gICAgICAgXCJFeHQuUGFja2FnZVwiOiBcIi9ub2RlX21vZHVsZXMvQGNvb24tanMvZXh0anMtcGFja2FnZS1sb2FkZXIvcGFja2FnZXMvcGFja2FnZS1sb2FkZXIvc3JjL3NyYy9QYWNrYWdlLmpzXCIsXG4gKiAgIC8vICAgICAgIFwiY29vbi5jb3JlXCI6IFwiLi4vc3JjL1wiXG4gKiAgIC8vICAgfVxuICogIC8vIH07XG4gKlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB0ZXN0Q29uZmlnXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aENvbmZpZ1VybFxuICogQHBhcmFtIHtCb29sZWFufSBpc01vZGVyblxuICogQHJldHVybnMge1Byb21pc2U8e2xvYWRlclBhdGg6IHt9LCBwcmVsb2FkOiAqW119Pn1cbiAqL1xuZXhwb3J0IGNvbnN0IGNvbmZpZ3VyZVdpdGhFeHRKc0xpbmtQYXRocyA9IGFzeW5jIGZ1bmN0aW9uICh0ZXN0Q29uZmlnLCBwYXRoQ29uZmlnVXJsLCBpc01vZGVybikge1xuXG4gICAgY29uc3RcbiAgICAgICAgbG9hZGVyID0gbmV3IGw4LnJlcXVlc3QuRmlsZUxvYWRlcigpO1xuXG4gICAgaWYgKGF3YWl0IGxvYWRlci5waW5nKHBhdGhDb25maWdVcmwpKSB7XG5cbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIGV4dGpzTGlua0NvbmZpZyA9IEpTT04ucGFyc2UoYXdhaXQgbG9hZGVyLmxvYWQocGF0aENvbmZpZ1VybCkpLFxuICAgICAgICAgICAgbWVyZ2VkQ3NzID0ge30sIG1lcmdlZEpzID0ge30sXG4gICAgICAgICAgICBjb2xsZWN0ID0gKHNlY3Rpb24sIHRvb2xraXQpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzID0gW107XG4gICAgICAgICAgICAgICAgc2VjdGlvbi5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGw4LmlzU3RyaW5nKGVudHJ5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2goZW50cnkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGw4LmlzcG8oZW50cnkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMgPSByZXMuY29uY2F0KGVudHJ5W3Rvb2xraXRdID8/IFtdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIFtcImNsYXNzaWNcIiwgXCJtb2Rlcm5cIl0uZm9yRWFjaCh0b29sa2l0ID0+IHtcblxuICAgICAgICAgICAgbGV0IGZmID0gbDguZmYuYmluZChudWxsLCB0b29sa2l0KSxcbiAgICAgICAgICAgICAgICBjc3MgPSBjb2xsZWN0KFtdLmNvbmNhdChsOC5uY2huKFwicHJlbG9hZC5jc3NcIiwgdGVzdENvbmZpZykpLCB0b29sa2l0KSxcbiAgICAgICAgICAgICAgICBqcyA9IGNvbGxlY3QoW10uY29uY2F0KGw4Lm5jaG4oXCJwcmVsb2FkLmpzXCIsIHRlc3RDb25maWcpKSwgdG9vbGtpdCksXG4gICAgICAgICAgICAgICAgZXh0Q3NzID0gbDgubmNobihcImNzc1wiLCBleHRqc0xpbmtDb25maWcsIGZmKSxcbiAgICAgICAgICAgICAgICBleHRKcyA9ICBsOC5uY2huKFwianNcIiwgZXh0anNMaW5rQ29uZmlnLCBmZik7XG5cblxuXG4gICAgICAgICAgICBsOC5jaG4odG9vbGtpdCwgbWVyZ2VkQ3NzLCBbXS5jb25jYXQoY3NzLCBbXS5jb25jYXQoZXh0Q3NzKSkpO1xuICAgICAgICAgICAgbDguY2huKHRvb2xraXQsIG1lcmdlZEpzLCBbXS5jb25jYXQoanMsIFtdLmNvbmNhdChleHRKcykpKTtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICBsOC5jaG4oXCJwcmVsb2FkLmNzc1wiLCB0ZXN0Q29uZmlnLCBtZXJnZWRDc3MsIHRydWUpO1xuICAgICAgICBsOC5jaG4oXCJwcmVsb2FkLmpzXCIsIHRlc3RDb25maWcsIG1lcmdlZEpzLCB0cnVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2V0UGF0aHModGVzdENvbmZpZywgaXNNb2Rlcm4pO1xuXG59O1xuXG5cbi8qKlxuICogQ29uc3VtZXMgYSBjb25maWd1cmF0aW9uIG9iamVjdCBhbmQgbG9va3MgdXAganMvY3NzLXJlbGF0ZWQgcGF0aCBpbmZvcm1hdGlvbixcbiAqIHRoZW4gcmV0dXJucyBpdCBwcmUtY29uZmlndXJlZCB0byBiZSB1c2VkIHdpdGggU2llc3RhcyBTaWVzdGEuSGFybmVzcy5Ccm93c2VyLkV4dEpTKCkjY29uZmlnLlxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogIGNvbnN0IGNvbmZpZyA9IHtcbiAqICAgICAgbG9hZGVyUGF0aDoge1xuICogICAgICAgXCJFeHQuUGFja2FnZVwiOiBcIi9ub2RlX21vZHVsZXMvQGNvb24tanMvZXh0anMtcGFja2FnZS1sb2FkZXIvcGFja2FnZXMvcGFja2FnZS1sb2FkZXIvc3JjL3NyYy9QYWNrYWdlLmpzXCIsXG4gKiAgICAgICBcImNvb24uY29yZVwiOiBcIi4uL3NyYy9cIixcbiAqICAgfSxcbiAqICAgcHJlbG9hZHM6IHtcbiAqICAgICAgIGNzczogW3tcbiAqICAgICAgICAgICAgICAgbW9kZXJuOiBbXG4gKiAgICAgICAgICAgICAgICAgICBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtbW9kZXJuLXJ1bnRpbWUvbWF0ZXJpYWwvbWF0ZXJpYWwtYWxsXzEuY3NzXCIsXG4gKiAgICAgICAgICAgICAgICAgICBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtbW9kZXJuLXJ1bnRpbWUvbWF0ZXJpYWwvbWF0ZXJpYWwtYWxsXzIuY3NzXCJcbiAqICAgICAgICAgICAgICAgXSxcbiAqICAgICAgICAgICAgICAgY2xhc3NpYzogW1xuICogICAgICAgICAgICAgICAgICAgXCIvbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LWNsYXNzaWMtcnVudGltZS9tYXRlcmlhbC9tYXRlcmlhbC1hbGxfMS5jc3NcIixcbiAqICAgICAgICAgICAgICAgICAgIFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1jbGFzc2ljLXJ1bnRpbWUvbWF0ZXJpYWwvbWF0ZXJpYWwtYWxsXzIuY3NzXCIsXG4gKiAgICAgICAgICAgICAgICAgICBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtY2xhc3NpYy1ydW50aW1lL21hdGVyaWFsL21hdGVyaWFsLWFsbF8zLmNzc1wiXG4gKiAgICAgICAgICAgICAgIF1cbiAqICAgICAgIH1dLFxuICogICAgICAganM6IFtcbiAqICAgICAgICAgICBcIi9ub2RlX21vZHVsZXMvQGw4anMvbDgvZGlzdC9sOC5ydW50aW1lLmpzXCIsIHtcbiAqICAgICAgICAgICAgICAgbW9kZXJuOiBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtbW9kZXJuLXJ1bnRpbWUvbW9kZXJuLmVuZ2luZS5lbnRlcnByaXNlLmpzXCIsXG4gKiAgICAgICAgICAgICAgIGNsYXNzaWM6IFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1tb2Rlcm4tcnVudGltZS9jbGFzc2ljLmVuZ2luZS5lbnRlcnByaXNlLmpzXCJcbiAqICAgICAgICAgIH1cbiAqICAgICAgIF1cbiAqICAgfX07XG4gKlxuICogIGdldFBhdGhzKGNvbmZpZywgdHJ1ZSk7IC8vIHJldHVybnMge1xuICogICAvLyAgIHByZWxvYWQgOiBbXG4gKiAgIC8vICAgICAgIFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1tb2Rlcm4tcnVudGltZS9tYXRlcmlhbC9tYXRlcmlhbC1hbGxfMS5jc3NcIixcbiAqICAgLy8gICAgICAgXCIvbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LW1vZGVybi1ydW50aW1lL21hdGVyaWFsL21hdGVyaWFsLWFsbF8yLmNzc1wiLFxuICogICAvLyAgICAgICBcIi9ub2RlX21vZHVsZXMvQGw4anMvbDgvZGlzdC9sOC5ydW50aW1lLmpzXCIsXG4gKiAgIC8vICAgICAgIFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1tb2Rlcm4tcnVudGltZS9tb2Rlcm4uZW5naW5lLmVudGVycHJpc2UuanNcIlxuICogICAvLyAgIF0sXG4gKiAgIC8vICAgbG9hZGVyUGF0aCA6IHtcbiAqICAgLy8gICAgICAgXCJFeHQuUGFja2FnZVwiOiBcIi9ub2RlX21vZHVsZXMvQGNvb24tanMvZXh0anMtcGFja2FnZS1sb2FkZXIvcGFja2FnZXMvcGFja2FnZS1sb2FkZXIvc3JjL3NyYy9QYWNrYWdlLmpzXCIsXG4gKiAgIC8vICAgICAgIFwiY29vbi5jb3JlXCI6IFwiLi4vc3JjL1wiXG4gKiAgIC8vICAgfVxuICogIC8vIH07XG4gKlxuICpcbiAqXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRQYXRocyA9IChjb25maWcsIGlzTW9kZXJuKSA9PiB7XG5cbiAgICBjb25zdFxuICAgICAgICByZXN1bHQgPSB7cHJlbG9hZDogW10sIGxvYWRlclBhdGg6IHt9fSxcbiAgICAgICAgaXNPYmplY3QgPSBsOC5pc09iamVjdCxcbiAgICAgICAgaXNBcnJheSA9IGw4LmlzQXJyYXksXG4gICAgICAgIGlzU3RyaW5nID0gbDguaXNTdHJpbmcsXG4gICAgICAgIHRvb2xraXQgPSBpc01vZGVybiA/IFwibW9kZXJuXCIgOiBpc01vZGVybiA9PT0gZmFsc2UgPyBcImNsYXNzaWNcIiA6IG51bGwsXG4gICAgICAgIHBhcnNlU2VjdGlvbiA9IChzZWN0aW9uKSA9PiB7XG5cbiAgICAgICAgICAgIHNlY3Rpb24gPSBbXS5jb25jYXQoc2VjdGlvbik7XG5cbiAgICAgICAgICAgIHNlY3Rpb24uZm9yRWFjaCgoZW50cnkpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmIChpc1N0cmluZyhlbnRyeSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnByZWxvYWQucHVzaChlbnRyeSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc09iamVjdChlbnRyeSkgJiYgdG9vbGtpdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNBcnJheShlbnRyeVt0b29sa2l0XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wcmVsb2FkID0gcmVzdWx0LnByZWxvYWQuY29uY2F0KGVudHJ5W3Rvb2xraXRdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc1N0cmluZyhlbnRyeVt0b29sa2l0XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wcmVsb2FkLnB1c2goZW50cnlbdG9vbGtpdF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgbDguYXNzaWduKFxuICAgICAgICByZXN1bHQubG9hZGVyUGF0aCxcbiAgICAgICAgW2NvbmZpZy5sb2FkZXJQYXRoIHx8IHt9LCBcImNsYXNzaWNcIiwgXCJtb2Rlcm5cIl0sXG4gICAgICAgIGNvbmZpZy5sb2FkZXJQYXRoICYmIGNvbmZpZy5sb2FkZXJQYXRoW3Rvb2xraXRdID8gY29uZmlnLmxvYWRlclBhdGhbdG9vbGtpdF0gOiB7fVxuICAgICk7XG5cbiAgICBjb25zdCB7anMsIGNzc30gPSBjb25maWcucHJlbG9hZCB8fCB7fTtcblxuICAgIHBhcnNlU2VjdGlvbihjc3MpO1xuICAgIHBhcnNlU2VjdGlvbihqcyk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuXG59OyIsIi8qKlxuICogY29vbi5qc1xuICogc2llc3RhLWxpYi1oZWxwZXJcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vY29vbi1qcy9zaWVzdGEtbGliLWhlbHBlclxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbmltcG9ydCB7Y29uZmlndXJlV2l0aEV4dEpzTGlua1BhdGhzfSBmcm9tIFwiLi9pbmRleC5qc1wiO1xuXG5pZiAoIWNvb25qcy5zaWVzdGFUZXN0Q29uZmlnT2JqIHx8ICFjb29uanMuc2llc3RhR3JvdXBzQ29uZmlnT2JqIHx8ICEgY29vbmpzLmV4dGpzTGlua0NvbmZpZ1VybCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvbmZpZyBtaXNzaW5nXCIpO1xufVxuXG5jb25zdFxuICAgIHRlc3RDb25maWcgPSBjb29uanMuc2llc3RhVGVzdENvbmZpZ09iaixcbiAgICBncm91cHMgPSBjb29uanMuc2llc3RhR3JvdXBzQ29uZmlnT2JqLFxuICAgIGV4dGpzTGlua0NvbmZpZ1VybCA9IGNvb25qcy5leHRqc0xpbmtDb25maWdVcmw7XG5cbmxldCB0b29sa2l0R3JvdXBzLFxuICAgIHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoZG9jdW1lbnQubG9jYXRpb24uc2VhcmNoLnN1YnN0cmluZygxKSksXG4gICAgdGltZW91dCA9ICB1cmxQYXJhbXMuZ2V0KFwidGltZW91dFwiKSA/IHBhcnNlSW50KHVybFBhcmFtcy5nZXQoXCJ0aW1lb3V0XCIpKSA6IHRlc3RDb25maWcudGltZW91dCxcbiAgICB0b29sa2l0ID0gdXJsUGFyYW1zLmdldChcInRvb2xraXRcIikgPz8gXCJjbGFzc2ljXCI7XG5cbmNvbnN0XG4gICAgYnJvd3NlciA9IG5ldyBTaWVzdGEuSGFybmVzcy5Ccm93c2VyLkV4dEpTKCksXG4gICAgcGF0aHMgPSBhd2FpdCBjb25maWd1cmVXaXRoRXh0SnNMaW5rUGF0aHModGVzdENvbmZpZywgZXh0anNMaW5rQ29uZmlnVXJsLCB0b29sa2l0ID09PSBcIm1vZGVyblwiKTtcbmRlYnVnZ2VyO1xudG9vbGtpdEdyb3VwcyA9IGdyb3Vwcy5maWx0ZXIoZW50cnkgPT4gW1widW5pdmVyc2FsXCIsIHRvb2xraXRdLmluZGV4T2YoZW50cnkuZ3JvdXApICE9PSAtMSk7XG4vLyB3ZSBuZWVkIHRvIGNoZWNrIGlmIHRoZSBsb2FkZXIgc3BlY2lmaWVzIGRpZmZlcmVudCBjbGFzc2VzIGZvciBtb2Rlcm4vY2xhc3NpYyBoZXJlLCBhcyB0aGUgdGVzdHNcbi8vIG1pZ2h0IGJlIGRlY2xhcmVkIGFzIFwidW5pdmVyc2FsXCIsIGJ1dCB0aGUgdGVzdCBjYXNlcyBsb2FkIGRpZmZlcmVudCBmaWxlcyBmb3IgdGhlIHRvb2xraXRzXG50b29sa2l0ID0gdG9vbGtpdEdyb3Vwcy5sZW5ndGggPyB0b29sa2l0R3JvdXBzWzBdLmdyb3VwIDogXCJ1bml2ZXJzYWxcIjtcbmlmICh0b29sa2l0ID09PSBcInVuaXZlcnNhbFwiICYmICh0ZXN0Q29uZmlnLmxvYWRlclBhdGguY2xyYXNzaWMgfHwgdGVzdENvbmZpZy5sb2FkZXJQYXRoLm1vcmRlcm4pKSB7XG4gICAgdG9vbGtpdCA9ICB1cmxQYXJhbXMuZ2V0KFwidG9vbGtpdFwiKSB8fCAodGVzdENvbmZpZy5sb2FkZXJQYXRoLmNsYXNzaWMgPyBcImNsYXNzaWNcIiA6IFwibW9kZXJuXCIpO1xufVxuXG5cbmJyb3dzZXIuY29uZmlndXJlKE9iamVjdC5hc3NpZ24oe1xuICAgIHRpdGxlOiBgJHt0ZXN0Q29uZmlnLm5hbWV9IFske3Rvb2xraXR9XWAsXG4gICAgaXNFY21hTW9kdWxlOiB0cnVlLFxuICAgIGRpc2FibGVDYWNoaW5nOiB0cnVlLFxuICAgIGNvbmZpZyA6IHtcbiAgICAgICAgVElNRU9VVCA6IHRpbWVvdXRcbiAgICB9XG59LCBwYXRocykpO1xuXG5icm93c2VyLnN0YXJ0KHRvb2xraXRHcm91cHMubGVuZ3RoID8gdG9vbGtpdEdyb3VwcyA6IGdyb3Vwcyk7XG5cbi8vIGNsYXNzaWMgfCBtb2Rlcm4gfCB0aW1lb3V0IG9wdGlvbnNcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY25fdGltZW91dFwiKS52YWx1ZSA9IHRpbWVvdXQ7XG5pZiAoW1wiY2xhc3NpY1wiLCBcIm1vZGVyblwiXS5pbmRleE9mKHRvb2xraXQpICE9PSAtMSkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBjbl8ke3Rvb2xraXR9YCkuY2hlY2tlZCA9IHRydWU7XG59IGVsc2Uge1xuICAgIFtcImNsYXNzaWNcIiwgXCJtb2Rlcm5cIl0uZm9yRWFjaCh0b29sa2l0ID0+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGBjbl8ke3Rvb2xraXR9YCkuZGlzYWJsZWQgPSB0cnVlKTtcbn1cbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY25fY29uZmlnQnRuXCIpLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgbGV0IHRpbWVvdXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNuX3RpbWVvdXRcIikudmFsdWUsXG4gICAgICAgIHRvb2xraXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNuX2NsYXNzaWNcIikuY2hlY2tlZFxuICAgICAgICAgICAgPyBcImNsYXNzaWNcIlxuICAgICAgICAgICAgOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNuX21vZGVyblwiKS5jaGVja2VkXG4gICAgICAgICAgICAgICAgPyBcIm1vZGVyblwiXG4gICAgICAgICAgICAgICAgOiBcIlwiO1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gYC4vaW5kZXguZXh0anMtYnJvd3Nlci5odG1sP3Rvb2xraXQ9JHt0b29sa2l0fSZ0aW1lb3V0PSR7dGltZW91dH1gO1xufTsiXSwibmFtZXMiOlsibDgucmVxdWVzdCIsImw4LmlzU3RyaW5nIiwibDguaXNwbyIsImZmIiwibDguZmYiLCJsOC5uY2huIiwibDguY2huIiwiaXNPYmplY3QiLCJsOC5pc09iamVjdCIsImlzQXJyYXkiLCJsOC5pc0FycmF5IiwiaXNTdHJpbmciLCJsOC5hc3NpZ24iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLENBQUM7QUFDdEQsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLENBQUM7QUFDdEQsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFJLE9BQU8sTUFBTSxLQUFL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
