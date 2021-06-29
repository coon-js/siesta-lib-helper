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
 * Overrides any value found on the end of the chain of the object if override is set to true and the value
 * exists.
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
    configuredToolkitGroups,
    hasToolkitRelatedConfig = false,
    urlParams = new URLSearchParams(document.location.search.substring(1)),
    timeout =  urlParams.get("timeout") ? parseInt(urlParams.get("timeout")) : testConfig.timeout,
    forcedToolkit = urlParams.get("toolkit"),
    toolkit = urlParams.get("toolkit") ?? "classic";

const
    browser = new Siesta.Harness.Browser.ExtJS(),
    paths = await configureWithExtJsLinkPaths(testConfig, extjsLinkConfigUrl, toolkit === "modern");

configuredToolkitGroups = groups.filter(entry => ["classic", "modern"].indexOf(entry.group) !== -1);
hasToolkitRelatedConfig = configuredToolkitGroups.length > 0,
    toolkitGroups = groups.filter(entry => ["universal", toolkit].indexOf(entry.group) !== -1);
// we need to check if the loader specifies different classes for modern/classic here, as the tests
// might be declared as "universal", but the test cases load different files for the toolkits
toolkit = toolkitGroups.length ? toolkitGroups[0].group : "universal";
if (toolkit === "universal" && (testConfig.loaderPath.classic || testConfig.loaderPath.modern)) {
    toolkit =  urlParams.get("toolkit") || (testConfig.loaderPath.classic ? "classic" : "modern");
    forcedToolkit = toolkit;
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
} else if (!hasToolkitRelatedConfig) {
    ["classic", "modern"].forEach(toolkit => document.getElementById(`cn_${toolkit}`).disabled = true);
} else if (hasToolkitRelatedConfig && ["classic", "modern"].indexOf(forcedToolkit) !== -1) {
    document.getElementById(`cn_${forcedToolkit}`).checked = true;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9pbGVyUGxhdGUuZXNtLmpzIiwic291cmNlcyI6WyIuLi9ub2RlX21vZHVsZXMvQGw4anMvbDgvZGlzdC9sOC5wYWNrYWdlcy5lc20uanMiLCIuLi9zcmMvaW5kZXguanMiLCIuLi9zcmMvQm9pbGVyUGxhdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbi8qKlxuICpcbiAqIEBwYXJhbSB0YXJnZXRcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmNvbnN0IGlzU3RyaW5nID0gdGFyZ2V0ID0+IHR5cGVvZiB0YXJnZXQgPT09IFwic3RyaW5nXCI7XG5jb25zdCBpc3MgPSBpc1N0cmluZztcblxuLyoqXG4gKiBcbiAqIEBwYXJhbSB0YXJnZXRcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmNvbnN0IGlzT2JqZWN0ID0gdGFyZ2V0ID0+IHR5cGVvZiB0YXJnZXQgPT09IFwib2JqZWN0XCI7XG5jb25zdCBpc28gPSBpc09iamVjdDtcblxuXG4vKipcbiAqXG4gKiBAcGFyYW0gdGFyZ2V0XG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5jb25zdCBpc1BsYWluT2JqZWN0ID0gdGFyZ2V0ID0+IHR5cGVvZiB0YXJnZXQgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0YXJnZXQpID09PSBcIltvYmplY3QgT2JqZWN0XVwiICYmXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQuY29uc3RydWN0b3IgPT09IE9iamVjdDtcbmNvbnN0IGlzcG8gPSBpc1BsYWluT2JqZWN0O1xuXG5cbi8qKlxuICogXG4gKiBAcGFyYW0gdGFyZ2V0XG4gKiBAcmV0dXJuIHtib29sZWFufVxuICovXG5jb25zdCBpc0Z1bmN0aW9uID0gdGFyZ2V0ID0+IHR5cGVvZiB0YXJnZXQgPT09IFwiZnVuY3Rpb25cIjtcbmNvbnN0IGlzZiA9IGlzRnVuY3Rpb247XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB0YXJnZXRcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmNvbnN0IGlzTnVtYmVyID0gdGFyZ2V0ID0+IHR5cGVvZiB0YXJnZXQgPT09IFwibnVtYmVyXCI7XG5jb25zdCBpc24gPSBpc051bWJlcjtcblxuLyoqXG4gKlxuICogQHBhcmFtIHRhcmdldFxuICogQHJldHVybiB7YW55fVxuICovXG5jb25zdCBpc0FycmF5ID0gdGFyZ2V0ID0+ICBBcnJheS5pc0FycmF5ID8gQXJyYXkuaXNBcnJheSh0YXJnZXQpIDogT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRhcmdldCkgPT09IFwiW29iamVjdCBBcnJheV1cIjtcbmNvbnN0IGlzYSA9IGlzQXJyYXk7XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB0YXJnZXRcbiAqIEByZXR1cm4ge2FueX1cbiAqL1xuY29uc3QgaXNSZWdFeHAgPSB0YXJnZXQgPT4gdGFyZ2V0IGluc3RhbmNlb2YgUmVnRXhwO1xuY29uc3QgaXNyeCA9IGlzUmVnRXhwO1xuXG4vKipcbiAqIFxuICogQHBhcmFtIHRhcmdldFxuICogQHJldHVybiB7e2E6IChmdW5jdGlvbigqKTogYm9vbGVhbiksIG9mOiAoZnVuY3Rpb24oKik6IGJvb2xlYW4pfX1cbiAqL1xuY29uc3QgaXMgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgcmV0dXJuICB7XG4gICAgICAgIGE6IHR5cGUgPT4gdHlwZW9mIHRhcmdldCA9PT0gdHlwZSxcbiAgICAgICAgb2Y6IGNscyA9PiBpc0Z1bmN0aW9uKGNscykgPyB0YXJnZXQgaW5zdGFuY2VvZiBjbHMgOiBmYWxzZVxuICAgIH07XG59O1xuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuLyoqXG4gKiBQcm94eSBmb3Igb2JqZWN0cyB0byBjcmVhdGUgZmx1ZW50IGludGVyZmFjZXMgb3V0IG9mIGFzeW5jIG1ldGhvZHMuXG4gKlxuICogQGV4YW1wbGVcbiAqICAgY29uc3Qgc291cmNlID0ge1xuICogICAgIGZvbyA6IGFzeW5jIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sXG4gKiAgICAgYmFyIDogYXN5bmMgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSxcbiAqICAgICBzbmFmdSA6IGFzeW5jIGZ1bmN0aW9uICgpIHsgcmV0dXJuIFwic25hZnVcIjsgfVxuICogICB9O1xuICpcbiAqICAgY29uc29sZS5sb2coXG4gKiAgICAgICAvLyBpbnN0ZWFkIG9mXG4gKiAgICAgICBhd2FpdCBzb3VyY2UuZm9vKClcbiAqICAgICAgICAgICAgIC50aGVuKHZhbHVlID0+IHNvdXJjZS5iYXIoKSlcbiAqICAgICAgICAgICAgIC50aGVuKHZhbHVlID0+IHNvdXJjZS5zbmFmdSgpKVxuICogICApOyAvLyBcInNuYWZ1XG4gKiAgIC8vIC4uLnlvdSBjYW4gd3JpdGUgaXQuLi5cbiAqICAgY29uc29sZS5sb2coXG4gKiAgICAgIC8vIC4uLiBsaWtlIHRoaXM6XG4gKiAgICAgIGF3YWl0IGxpcXVpZnkoc291cmNlKS5mb28oKVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAuYmFyKClcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgLnNuYWZ1KClcbiAqICAgKTsgLy8gc25hZnVcbiAqXG4gKiBQcmVyZXF1aXNpdGVzOlxuICogPT09PT09PT09PT09PT1cbiAqIC0geW91ciBhc3luYyBtZXRob2RzIGhhdmUgdG8gcmV0dXJuIFwidGhpc1wiLCBpLmUuIHRoZSBzb3VyY2Ugb2JqZWN0IG9mXG4gKiAgIHRoZSBhc3luYyBtZXRob2QsIHNpbmNlIHRoZSBvbkZ1bGxmaWxsZWQgbWV0aG9kcyBuZWVkIHRvIGZvcndhcmRcbiAqICAgdGhpcyBleGFjdCBzYW1lIG9iamVjdC5cbiAqXG4gKiAgIEBleGFtcGxlXG4gKiAgIGNvbnN0IHNvdXJjZSA9IHtcbiAqICAgICBmb28gOiBhc3luYyBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LFxuICogICAgIGJhciA6IGFzeW5jIGZ1bmN0aW9uICgpIHsgcmV0dXJuIFwic29tZXJhbmRvbXN0cmluZ1wiOyB9LFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBeXl5eXl5eXl5eXl5eXl5eXl5cbiAqICAgICBzbmFmdSA6IGFzeW5jIGZ1bmN0aW9uICgpIHsgcmV0dXJuIFwic25hZnVcIjsgfVxuICogICB9O1xuICogIGF3YWl0IGxpcXVpZnkoc291cmNlKS5mb28oKS5iYXIoKS5zbmFmdSgpIC8vIHdpbGwgdGhyb3cgYW4gZXJyb3Igc2luY2UgXCJzbmFmdVwiXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2Fubm90IGJlIGxvb2tlZCB1cCBhbnltb3JlXG4gKlxuICpcbiAqIFRoZW9yeTpcbiAqID09PT09PT1cbiAqICAgLSBsaXF1aWZ5KHNvdXJjZSkuZm9vKCkuYmFyKClcbiAqICAxLiBsaXF1aWZ5KHNvdXJjZSlcbiAqICAgICAgVGhpcyBjYWxsIHdpbGwgY3JlYXRlIGEgUHJveHkgdGhhdCB0cmFwcyBmdXJ0aGVyIGNhbGxzIC8gbG9va3VwcyBvbiB0aGlzIGV4YWN0IHNhbWVcbiAqICAgICAgb2JqZWN0LlxuICpcbiAqICAyLiBsaXF1aWZ5KHNvdXJjZSkuZm9vXG4gKiAgICAgSXMgdHJhcHBlZCBieSB0aGUgaGFuZGxlcidzIGdldCBtZXRob2QuIFJldHVybnMgYSBwcm94aWVzLCBib3VuZCghKSBmdW5jdGlvbjpcbiAqICAgICB0YXJnZXQ6IHNvdXJjZVxuICogICAgIHByb3BlcnR5OiBmb29cbiAqICAgICA9PiByZXR1cm5zOiBsaXF1aWZ5KHRhcmdldFtwcm9wZXJ0eV0uYmluZCh0YXJnZXQpKVxuICpcbiAqICAzLiBsaXF1aWZ5KHNvdXJjZSkuZm9vKClcbiAqICAgICBBIHByZXZpb3VzIGNhbGwgdG8gXCJsaXF1aWZ5KHNvdXJjZSkuZm9vXCIgcmV0dXJuZWQgYSBib3VuZCBmdW5jdGlvbiB0aGF0IHdhcyBhZ2FpbiBwcm94aWVkXG4gKiAgICAgaW4gc3RlcCAyLiBBdCB0aGlzIHBvaW50LCB0aGUgbWV0aG9kIGNhbGwgb3JpZ2luYXRpbmcgZnJvbSBcImZvbygpXCIgaXMgbm93IHRyYXBwZWQgaW4gdGhlXG4gKiAgICAgUHJveHkncyBcImFwcGx5KClcIiBoYW5kbGVyLlxuICogICAgIFRoZSByZXR1cm5lZCBQcm9taXNlIGlzIHByb3hpZWQgYWdhaW4uXG4gKiAgICAgPT4gcmV0dXJuczogbGlxdWlmeSh0YXJnZXQuYXBwbHkodGhpc0FyZywgYXJndW1lbnRzTGlzdClcbiAqXG4gKiAgNC4gbGlxdWlmeShzb3VyY2UpLmZvbygpLmJhclxuICogICAgIFN0ZXAgMy4gcmV0dXJuZWQgYSBwcm9taXNlLCBzbyBcImJhclwiIGFzIGEgcHJvcGVydHkgaXMgbm93IGluaXRpYWxseSBsb29rZWQgdXAgb24gdGhlIFByb21pc2UuXG4gKiAgICAgVGhlIHByb2JsZW0gaXMsIG9mIGNvdXJzZSwgdGhhdCB0aGUgUHJvbWlzZSBkb2VzIG5vdCBoYXZlIGEgcHJvcGVydHkgY2FsbGVkIFwiYmFyXCIuIFdlIG5vd1xuICogICAgIGhhdmUgdG8gdGFrZSBjYXJlIG9mIHBpcGluZyB0aGUgc291cmNlIG9iamVjdCB0aHJvdWdoIHNvIHRoZSBmb2xsb3dpbmcgbWV0aG9kIGNhbGwgY2FuXG4gKiAgICAgcHJvcGVybHkgcmVzb2x2ZSB0byBcInNvdXJjZS5iYXIoKVwiLlxuICogICAgIFdlIGRvIHRoaXMgYnkgaW1wbGVtZW50aW5nIHRoZSBmdWxsZmlsbGVkLW1ldGhvZC4gVGhlIGdldC1oYW5kbGVyIHdpbGwgY2hlY2tcbiAqICAgICBpZiB0aGUgdGFyZ2V0IG93bnMgYSBcInRoZW5cIi1tZXRob2QgYW5kIHJldHVybiB0aGUgZm9sbG93aW5nOlxuICogICAgIGxpcXVpZnkodGFyZ2V0LnRoZW4odmFsdWUgPT4gdmFsdWVbcHJvcGVydHldLmJpbmQodmFsdWUpKSk7XG4gKiAgICAgXl4gMSogXl4gICAgIF5eIDIqIF5eICAgIF5eXl5eXl5eXiAzKiBeXl5eXl5eXl5eXG4gKiAgICAgMSogdGhpcyBpcyB0aGUgUHJvbWlzZSB0aGF0IHdhcyBwcm94aWVkIGluIHN0ZXAgM1xuICogICAgIDIqIHZhbHVlIGlzIHRoZSByZXR1cm4tdmFsdWUgb2YgdGhlIG9yaWdpbmFsIGFzeW5jIG1ldGhvZCBpbXBsZW1lbnRhdGlvblxuICogICAgICAgIG9mIHNvdXJjZS5mb28oKVxuICogICAgIDMqIFwicHJvcGVydHlcIiBpcyBrbm93biB0byB0aGUgaW1wbGVtZW50YXRpb24gb2YgdGhlIFwiZnVsbGZpbGxlZFwiLW1ldGhvZCB3aGVuIGl0XG4gKiAgICAgICAgIGdldHMgY2FsbGVkIChzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9HdWlkZS9GdW5jdGlvbnMpLlxuICogICAgICAgIFRoZSByZXR1cm4gdmFsdWUgb2YgdGhpcyBmdWxsZmlsbGVkLW1ldGhvZCBpcyB0aGUgbWV0aG9kIFwiYmFyXCIsIGJvdW5kIHRvIFwic291cmNlXCIsIGl0J3Mgb3JpZ2luLlxuICpcbiAqICAgNS4gbGlxdWlmeShzb3VyY2UpLmZvbygpLmJhcigpXG4gKiAgICAgIGJhcigpIGlzIG5vdyBjYWxsZWQuIFRoZSBhcHBseS1oYW5kbGVyIG5vdyBleHBlY3RzIGEgY2FsbGFibGUgbWV0aG9kLiBTaW5jZSB3ZSBoYXZlIHJldHVybmVkIGEgUHJvbWlzZVxuICogICAgICBpbiBzdGVwIDQsIGFuZCBhIFByb21pc2UgaXMgbm90IGEgY2FsbGFibGUgbWV0aG9kLCB0aGUgaW50ZXJuYWxzIG9mIGxpcXVpZnkoKSBzaG93IHRoZWlyIGFkdmFudGFnZTpcbiAqICAgICAgV2UgYXJlIG5vdCBkaXJlY3RseSB3cmFwcGluZyB0aGUgYXJndW1lbnQgcGFzc2VkIHRvIGxpcXVpZnkgd2l0aCB0aGUgUHJveHksIGJ1dCByYXRoZXIgY3JlYXRlIGEgY2FsbGFibGVcbiAqICAgICAgbWV0aG9kIHRoYXQgaXMgdGhlbiBjYWxsZWQuIFdlIFwidGFnXCIgdGhpcyBtZXRob2Qgd2l0aCBhIF9fbGlxdWlkX18gcHJvcGVydHkgdGhhdCBoZWxwcyB0aGUgaGFuZGxlclxuICogICAgICB0byBpZGVudGlmeSBhIHByb3hpZWQsIGNhbGxhYmxlIG1ldGhvZC4gVGhlIGludGVybmFsIGltcGxlbWVudGF0aW9uIGxvb2tzIGxpa2UgdGhpczpcbiAqICAgICAgICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKVxuICogICAgICAgICAgbGlxdWlmeShwcm9taXNlKTtcbiAqICAgICAgICAgIGZ1bmN0aW9uIGxpcXVpZnkodGFyZ2V0KSB7XG4gKiAgICAgICAgICAgICAgbGV0IGNiID0gZnVuY3Rpb24gKCkge1xuICogICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICogICAgICAgICAgICAgIH07XG4gKiAgICAgICAgICAgICAgY2IuX19saXF1aWRfXyA9IHRydWU7XG4gKiAgICAgICAgICB9XG4gKiAgICAgICAgICByZXR1cm4gbmV3IFByb3h5KGNiLCBoYW5kbGVyKTtcbiAqICAgICAgV2hhdCBoYXBwZW5zIG5vdyB0aGF0IHRoaXMgZXhhY3QgY2FsbGFibGUgaXMgcHJvY2Vzc2VkIGJ5IHRoZSBhcHBseS1oYW5kbGVyOlxuICogICAgICAgPT4gYmFyKCkgLS0gY2FsbHMgLS0+IGNiKCkgLS0gcmV0dXJucyAtLT4gcHJvbWlzZVxuICogICAgICAuLiBhbmQgdGhlIGFwcGx5IGhhbmRsZXIgY2hlY2tzIGlmIHRoZSB2YWx1ZSBpcyBhIHByb21pc2UgYW5kIG1ha2VzIHN1cmUgdGhlIGZ1bGxmaWxsZWQtbWV0aG9kXG4gKiAgICAgIGlzIGltcGxlbWVudGVkLCBhbmQgcmV0dXJucyB0aGUgcmVzdWx0aW5nIFByb21pc2UgLSBhZ2FpbiAtIHByb3hpZWQuXG4gKiAgICAgIGxpcXVpZnkocHJvbWlzZS50aGVuKHZhbHVlID0+IFJlZmxlY3QuYXBwbHkodmFsdWUsIHRoaXNBcmcsIGFyZ3VtZW50c0xpc3QpKSk7XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgXl4gMSogXl4gIF5eXl5eXl5eXl5eXl5eXl5eXl5eXiAyKiBeXl5eXl5eXl5eXl5eXl5eXl5eXl5eXG4gKiAgICAgIDEqIFRoaXMgaXMgdGhlIGJvdW5kIG1ldGhvZCB0aGF0IHdhcyByZXR1cm5lZCBpbiB0aGUgZnVsbGZpbGxlZC1tZXRob2QgaW1wbGVtZW50ZWQgaW4gc3RlcCA0LlxuICogICAgICAyKiBUaGlzIGlzIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhlIGZ1bGxmaWxsZWQtbWV0aG9kcywgd2hpY2gsIGluIHRoaXMgY2FzZSwgaXMgdGhlIGNhbGwgdG9cbiAqICAgICAgICAgc291cmNlLmJhcigpXG4gKiAgICAgIEl0IGlzIGltcG9ydGFudCB0byB1c2UgXCJhcmd1bWVudHNMaXN0XCIgaGVyZSBzaW5jZSB0aGlzIHdpbGwgaG9sZCByZWZlcmVuY2VzIHRvIHRoZSByZXNvbHZlL3JlamVjdC1tZXRob2RzXG4gKiAgICAgIGZvciB0aGUgbGFzdCBjYWxsIGluIHRoZSBjaGFpbi5cbiAqICAgIDYuIHRoZW4oKVxuICogICAgICAgVGhlIGxhc3QgY2FsbCBpbiB0aGUgY2hhaW4gaXMgYSBpbXBsaWNpdCBjYWxsIHRvIFwidGhlbigpXCIgdHJpZ2dlcmVkIGJ5IHRoZSBQcm9taXNlLWluc3RhbmNlIHRoYXQgd2FzXG4gKiAgICAgICBwcm94aWVkIGluIHN0ZXAgNS4gU2luY2Ugbm8gbW9yZSBjdXN0b20gcHJvcGVydGllcyBoYXZlIHRvIGJlIGxvb2tlZCB1cCBzaW5jZSB0aGUgY2hhaW4gZW5kcyBhdCB0aGlzIHBvaW50LFxuICogICAgICAgdGhlIFByb21pc2UgZm9yd2FyZHMgaXRzIHByb2Nlc3NpbmcgdG8gIHRoZSBmdWxmaWxsbWVudCBieSBjYWxsaW5nIHRoZW4oKS4gVGhlIFwidGhlblwiIGlzIGEgcHJvcGVydHkgb24gYVxuICogICAgICAgcHJveGllZCBQcm9taXNlLCBzbyB0aGUgaGFuZGxlciBjYW4gdHJhcCBpdCBhbmQgc2ltcGx5IGJpbmRzIHRoZSBtZXRob2QgdG8gdGhlIHByb21pc2UuIFRoZSByZXN1bHRpbmcgdmFsdWVcbiAqICAgICAgIG91dCBvZiBcImFzeW5jIGJhcigpXCIgaXMgcmV0dXJuZWQsIHRoZSBjaGFpbiBlbmRzIGhlcmUuXG4gKlxuICovXG5cblxuLyoqXG4gKiBUaGUgaGFuZGxlciB1c2VkIGJ5IHRoZSBsaXF1aWZ5LVByb3h5LlxuICpcbiAqIEB0eXBlIHt7YXBwbHkoKiwgKiwgKiksIGdldCgqLCAqLCAqKX19XG4gKi9cbmNvbnN0IGhhbmRsZXIgPSB7XG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBoYW5kbGVyLmFwcGx5KCkgbWV0aG9kIGlzIGEgdHJhcCBmb3IgYSBmdW5jdGlvbiBjYWxsLlxuICAgICAqIHRoaXMgaXMgYm91bmQgdG8gdGhlIGhhbmRsZXIuXG4gICAgICogV2lsbCBjaGVjayBpZiB0aGUgdGFyZ2V0IGlzIGEgUHJvbWlzZSBhbmQgUHJveHkgdGhlIHJldHVybi12YWx1ZSBvZiBhIGNhbGwgdG8gaXQncyBcInRoZW5cIi1tZXRob2QsXG4gICAgICogYnkgbWFraW5nIHN1cmUgdGhhdCB0aGUgcmVzb2x2ZXIgaXMgcHJvcGVybHkgY2FsbGVkLlxuICAgICAqIE90aGVyd2lzZSwgdGhpcyBoYW5kbGVyIGFzc3VtZXMgdGhhdCB0YXJnZXQgaXMgYWxyZWFkeSBhIGJvdW5kLW1ldGhvZC4gSW4gYW55IGNhc2UgaXQgaXMgbWFkZSBzdXJlXG4gICAgICogdGhhdCB0aGUgYXJndW1lbnRzIGFyZSBwcm9wZXJseSBwYXNzZWQgdG8gdGhlIG1ldGhvZHMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gezwqPn0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0aGlzQXJnIFRoZSB0aGlzIGFyZ3VtZW50IGZvciB0aGUgY2FsbC5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBhcmd1bWVudHNMaXN0IFRoZSBsaXN0IG9mIGFyZ3VtZW50cyBmb3IgdGhlIGNhbGwuXG4gICAgICovXG4gICAgYXBwbHkgKHRhcmdldCwgdGhpc0FyZywgYXJndW1lbnRzTGlzdCkge1xuXG4gICAgICAgIHRhcmdldCA9IHRhcmdldC5fX2xpcXVpZF9fID8gdGFyZ2V0KCkgOiB0YXJnZXQ7XG5cbiAgICAgICAgaWYgKGlzRnVuY3Rpb24odGFyZ2V0LnRoZW4pKSB7XG4gICAgICAgICAgICByZXR1cm4gbGlxdWlmeSh0YXJnZXQudGhlbigodmFsdWUpID0+ICBSZWZsZWN0LmFwcGx5KHZhbHVlLCB0aGlzQXJnLCBhcmd1bWVudHNMaXN0KSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhpcyBzaG91bGQgYWxyZWFkeSBiZSBhIGJvdW5kIGZ1bmN0aW9uXG4gICAgICAgIC8vIGlmIHRoZSB0YXJnZXQgaXMgYSBib3VuZCB0aGVuIG1ldGhvZCwgdGhlIGFyZ3VtZW50c0xpc3Qgd2lsbCBob2xkXG4gICAgICAgIC8vIHRoZSByZXNvbHZlKCkvcmVqZWN0KCkgbWV0aG9kLlxuICAgICAgICByZXR1cm4gbGlxdWlmeSh0YXJnZXQuYXBwbHkodGhpc0FyZywgYXJndW1lbnRzTGlzdCkpO1xuICAgIH0sXG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBoYW5kbGVyLmdldCgpIG1ldGhvZCBpcyBhIHRyYXAgZm9yIGdldHRpbmcgYSBwcm9wZXJ0eSB2YWx1ZS5cbiAgICAgKiBcInRoaXNcIiBpcyBib3VuZCB0byB0aGUgaGFuZGxlci5cbiAgICAgKiBSZWNlaXZlcyB0aGUgcHJvcGVydHkgb2YgdGhlIHByb3hpZXMgdGFyZ2V0LlxuICAgICAqIFdpbGwgcHJveHkgdGhlIHJldHVybmVkIFByb21pc2Ugb2YgdGhlIHRhcmdldCdzIFwidGhlbigpXCItbWV0aG9kIGlmIGEgUHJvbWlzZSBpc1xuICAgICAqIHJlcHJlc2VudGVkIGJ5IHRhcmdldC5cbiAgICAgKiBPdGhlcndpc2UsIGEgUHJveHkgZm9yIHRoZSBmdW5jdGlvbiBpcyBjcmVhdGVkLCB3aGljaCBpcyBib3VuZCghKSB0byB0aGUgdGFyZ2V0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHs8Kj59IHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHkgVGhlIG5hbWUgb3IgU3ltYm9sIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gICAgICogQHBhcmFtIHtQcm94eX0gcmVjZWl2ZXIgRWl0aGVyIHRoZSBwcm94eSBvciBhbiBvYmplY3QgdGhhdCBpbmhlcml0cyBmcm9tIHRoZSBwcm94eS5cbiAgICAgKi9cbiAgICBnZXQgKHRhcmdldCwgcHJvcGVydHksIHJlY2VpdmVyKSB7XG5cbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0Ll9fbGlxdWlkX18gPyB0YXJnZXQoKSA6IHRhcmdldDtcblxuICAgICAgICBpZiAocHJvcGVydHkgIT09IFwidGhlblwiICYmIGlzRnVuY3Rpb24odGFyZ2V0LnRoZW4pKSB7XG4gICAgICAgICAgICByZXR1cm4gbGlxdWlmeSh0YXJnZXQudGhlbih2YWx1ZSA9PiB2YWx1ZVtwcm9wZXJ0eV0uYmluZCh2YWx1ZSkpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXNGdW5jdGlvbih0YXJnZXRbcHJvcGVydHldKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRhcmdldFtwcm9wZXJ0eV07XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbGlxdWlmeSh0YXJnZXRbcHJvcGVydHldLmJpbmQodGFyZ2V0KSk7XG4gICAgfVxuXG59O1xuXG5cbi8qKlxuICogQ3JlYXRlcyBhIFByb3h5IGZvciB0aGUgc3BlY2lmaWVkIHRhcmdldCwgaWYgdGhlIHRhcmdldCBpcyBhbiBvYmplY3Qgb3IgYSBmdW5jdGlvbixcbiAqIGFuZCByZXR1cm5zIGl0LiBPdGhlcndpc2UsIHRoZSB0YXJnZXQgd2lsbCBiZSByZXR1cm5lZC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufE9iamVjdH0gdGFyZ2V0XG4gKiBAcmV0dXJuIHsqfVxuICpcbiAqIEBzZWUgaGFuZGxlclxuICovXG5jb25zdCBsaXF1aWZ5ID0gZnVuY3Rpb24gKHRhcmdldCkge1xuXG4gICAgaWYgKGlzT2JqZWN0KHRhcmdldCkpIHtcbiAgICAgICAgY29uc3Qgd3JhcHBlZCA9ICgpID0+IHRhcmdldDtcbiAgICAgICAgd3JhcHBlZC5fX2xpcXVpZF9fID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm94eSh3cmFwcGVkLCBoYW5kbGVyKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaXNGdW5jdGlvbih0YXJnZXQpID8gbmV3IFByb3h5KHRhcmdldCwgaGFuZGxlcikgOiB0YXJnZXQ7XG59O1xuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuLyoqXG4gKiBFeHBlY3RzIGEgbnVtZXJpYyBhcnJheSBhbmQgcmV0dXJucyBhbiBhcnJheSB3aGVyZSB0aGUgZW50cmllcyBhcmUgc3Vic2VxdWVudFxuICogbmVpZ2hib3VycyBvZiB0YXJnZXQsIHNvcnRlZCBmcm9tIGxvd2VzdCB0byBoaWdoZXN0LCB1bmlxdWUgdmFsdWVzLlxuICogVGhlIG1ldGhvZCB3aWxsIHRyeSB0byBwYXJzZSB0aGUgdmFsdWVzIHRvIG51bWVyaWMgaW50ZWdlciB2YWx1ZXNcbiAqXG4gKiAgICAgIEBleGFtcGxlXG4gKiAgICAgIHZhciBsaXN0ICAgPSBbJzQnLCA1LCAnMScsICczJywgNiwgJzgnXTtcbiAqICAgICAgdmFyIHRhcmdldCA9IDU7XG4gKlxuICogICAgICBsaXN0TmVpZ2hib3VycyhsaXN0LCB0YXJnZXQpOyAvLyBbMywgNCwgNSwgNl1cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IG9mIHZhbHVlcyB0byByZXR1cm4gdGhlIG5laWdoYm91cnMgZnJvbVxuICogQHBhcmFtIHtOdW1iZXJ9IHRhcmdldCBUaGUgaW5pdGlhbCB2YWx1ZSB0byBsb29rIHVwIGl0cyBuZWlnaGJvdXJzIGZvclxuICpcbiAqIEByZXR1cm4ge0FycmF5fSBUaGUgb3JkZXJlZCwgdW5pcXVlIGxpc3Qgb2YgbmVpZ2hib3VycyBmb3IgdGFyZ2V0XG4gKi9cbmNvbnN0IGxpc3ROZWlnaGJvdXJzID0gZnVuY3Rpb24gKGxpc3QsIHRhcmdldCkge1xuXG4gICAgdmFyIHBhZ2VzID0gW10sXG4gICAgICAgIHJhbmdlID0gW10sXG4gICAgICAgIHBpbmQsIGksIGxlbjtcblxuICAgIC8vIHBhcnNlLCBmaWx0ZXIsIHNvcnRcbiAgICBwYWdlcyA9IGxpc3QubWFwKGZ1bmN0aW9uICh2KXtyZXR1cm4gcGFyc2VJbnQodiwgMTApO30pO1xuICAgIHBhZ2VzID0gcGFnZXMuZmlsdGVyKGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgsIHNlbGYpIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuaW5kZXhPZih2YWx1ZSwgMCkgPT09IGluZGV4O1xuICAgIH0pO1xuICAgIHBhZ2VzLnNvcnQoZnVuY3Rpb24gKGEsIGIpe3JldHVybiBhLWI7fSk7XG5cblxuICAgIHBpbmQgPSBwYWdlcy5pbmRleE9mKHBhcnNlSW50KHRhcmdldCwgMTApKTtcblxuICAgIC8vIGZpbGwgbGVmdFxuICAgIGZvciAoaSA9IHBpbmQgLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBpZiAocGFnZXNbaV0gPT09IHBhZ2VzW2kgKyAxXSAtIDEpIHtcbiAgICAgICAgICAgIHJhbmdlLnVuc2hpZnQocGFnZXNbaV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBmaWxsIGNlbnRlclxuICAgIHJhbmdlLnB1c2gocGFnZXNbcGluZF0pO1xuXG4gICAgLy8gZmlsbCByaWdodFxuICAgIGZvciAoaSA9IHBpbmQgKyAxLCBsZW4gPSBwYWdlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAocGFnZXNbaV0gPT09IHBhZ2VzW2kgLSAxXSArIDEpIHtcbiAgICAgICAgICAgIHJhbmdlLnB1c2gocGFnZXNbaV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJhbmdlO1xuXG59O1xuXG5cbi8qKlxuICogRXhwZWN0cyBhIG51bWVyaWMgYXJyYXkgYW5kIHJldHVybnMgYW4gYXJyYXkgd2hlcmUgdGhlIGVudHJpZXMgYXJlIGl0c2VsZlxuICogYXJyYXlzIHJlcHJlc2VudGluZyBwb3NzaWJsZSBncm91cHMgb2Ygc3Vic2VxdWVudCBpbmRpY2VzLCBvcmRlcmVkIGZyb21cbiAqIGxvd2VzdCB0byBoaWdoZXN0LiBEdXBsaWNhdGUgaXRlbXMgd2lsbCBiZSByZW1vdmVkLlxuICpcbiAqICAgICAgdmFyIGxpc3QgICA9IFsnNCcsIDUsICcxJywgJzMnLCA2LCAnOCddO1xuICogICAgICBncm91cEluZGljZXMobGlzdCk7IC8vIFtbMV0sIFszLCA0LCA1XSwgWzZdXVxuICpcbiAqICAgICAgdmFyIGxpc3QgICA9IFsnMScsIDIsICczJ107XG4gKiAgICAgIGdyb3VwSW5kaWNlcyhsaXN0KTsgLy8gW1sxLCAyLCAzXV1cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBsaXN0IFRoZSBsaXN0IG9mIHZhbHVlcyB0byByZXR1cm4gdGhlIGdyb3VwZWQgaW5kaWNlcyBmcm9tXG4gKlxuICogQHJldHVybiB7QXJyYXl9IFRoZSBvcmRlcmVkLCBncm91cGVkIGxpc3Qgb2YgaW5kaWNlc1xuICpcbiAqIEB0aHJvd3MgaWYgbGlzdCBpcyBub3QgYW4gYXJyYXlcbiAqL1xuY29uc3QgZ3JvdXBJbmRpY2VzID0gZnVuY3Rpb24gKGxpc3QpIHtcblxuICAgIHZhciBncm91cHMgPSBbXSxcbiAgICAgICAgcGFnZXM7XG5cbiAgICBpZiAoIWlzQXJyYXkobGlzdCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ2xpc3QnIG11c3QgYmUgYW4gYXJyYXlcIik7XG4gICAgfVxuXG4gICAgLy8gcGFyc2UsIGZpbHRlciwgc29ydFxuICAgIHBhZ2VzID0gbGlzdC5tYXAoZnVuY3Rpb24gKHYpe3JldHVybiBwYXJzZUludCh2LCAxMCk7fSk7XG4gICAgcGFnZXMgPSBwYWdlcy5maWx0ZXIoZnVuY3Rpb24gKHZhbHVlLCBpbmRleCwgc2VsZikge1xuICAgICAgICByZXR1cm4gc2VsZi5pbmRleE9mKHZhbHVlKSA9PT0gaW5kZXg7XG4gICAgfSk7XG4gICAgcGFnZXMuc29ydChmdW5jdGlvbiAoYSwgYil7cmV0dXJuIGEtYjt9KTtcblxuICAgIHBhZ2VzLnJlZHVjZShmdW5jdGlvbiAocHJldmlvdXNWYWx1ZSwgY3VycmVudFZhbHVlLCBpbmRleCwgYXJyYXkpe1xuICAgICAgICBpZiAoY3VycmVudFZhbHVlID4gcHJldmlvdXNWYWx1ZSArIDEpIHtcbiAgICAgICAgICAgIGdyb3Vwcy5wdXNoKFtdKTtcbiAgICAgICAgfVxuICAgICAgICBncm91cHNbZ3JvdXBzLmxlbmd0aCAtIDFdLnB1c2goY3VycmVudFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRWYWx1ZTtcbiAgICB9LCAtMSk7XG5cbiAgICByZXR1cm4gZ3JvdXBzO1xufTtcblxuXG4vKipcbiAqIENyZWF0ZXMgdGhlIHJhbmdlIGZvciB0aGUgc3BlY2lmaWVkIHN0YXJ0IGFuZCBlbmQuXG4gKlxuICogQGV4YW1wbGVcbiAqICAgICAgY3JlYXRlUmFuZ2UoMywgNCkgLy8gWzMsIDQsIDVdXG4gKlxuICogICAgICBjcmVhdGVSYW5nZSg1LCA1KSAvLyBbNV1cbiAqXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IHN0YXJ0XG4gKiBAcGFyYW0ge051bWJlcn0gZW5kXG4gKlxuICogQHJldHVybiB7QXJyYXl9XG4gKlxuICogQHRocm93cyBpZiBzdGFydCBpcyBub3QgYSBudW1iZXIgb3IgbGVzcyB0aGFuIDEsIG9yIGlmIGVuZCBpcyBub3QgYSBudW1iZXJcbiAqIG9yIGlmIGVuZCBpcyBsZXNzIHRoYW4gc3RhcnRcbiAqL1xuY29uc3QgY3JlYXRlUmFuZ2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuXG4gICAgdmFyIHJldDtcblxuICAgIGlmICghaXNuKHN0YXJ0KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCInc3RhcnQnIG11c3QgYmUgYSBudW1iZXJcIik7XG4gICAgfVxuXG4gICAgaWYgKCFpc24oZW5kKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCInZW5kJyBtdXN0IGJlIGEgbnVtYmVyXCIpO1xuICAgIH1cblxuICAgIHN0YXJ0ID0gcGFyc2VJbnQoc3RhcnQsIDEwKTtcbiAgICBlbmQgICA9IHBhcnNlSW50KGVuZCwgMTApO1xuXG4gICAgaWYgKGVuZCA8IHN0YXJ0KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgXCJlbmRcIiAoJHtlbmR9KSBtdXN0IGJlIGEgbnVtYmVyIGVxdWFsIHRvIG9yIGdyZWF0ZXIgdGhhbiBcInN0YXJ0XCIgKCR7c3RhcnR9KWApO1xuICAgIH1cblxuXG4gICAgcmV0ID0gKG5ldyBBcnJheSgoZW5kIC0gc3RhcnQpICsgMSkpLmZpbGwodW5kZWZpbmVkKTtcblxuICAgIHJldHVybiByZXQubWFwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHN0YXJ0Kys7XG4gICAgfSk7XG5cbn07XG5cbi8qKlxuICogU2VhcmNoZXMgZm9yIHRoZSBmaXJzdCBlbnRyeSBpbiBzb3VyY2UuIExvb2tzIHVwIHRoZSBrZXkgaW4gc291cmNlIGlmIGl0IGlzIGFuIG9iamVjdCBhbmQgcmV0dXJucyB0aGUgZmlyc3RcbiAqIG1hdGNoIGZvdW5kLCBvdGhlcndpc2UgaXRlcmF0ZXMgdGhyb3VnaCB0aGUgYXJyYXkgYW5kIHJldHVybnMgdGhlIGZpcnN0IG1hdGNoLlxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogIGw4LmZpbmRGaXJzdChcImJhclwiLCB7Zm9vIDoge30sIGJhciA6IHtzbmFmdSA6IFwiXCJ9fTsgLy8gcmV0dXJucyB0aGUgYmFyLW9iamVjdFxuICogIGw4LmZpbmRGaXJzdChcImJhclwiLCBbe2ZvbyA6IHt9fSwge2JhciA6IHtzbmFmdSA6IFwiXCJ9fV07IC8vIHJldHVybnMgdGhlIGJhci1vYmplY3RcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30ga2V5XG4gKiBAcGFyYW0geyhBcnJheXxjT2JqZWN0KX0gc291cmNlXG4gKlxuICogQHJldHVybiB7Pyp9XG4gKi9cbmNvbnN0IGZpbmRGaXJzdCA9IChrZXksIHNvdXJjZSkgPT4ge1xuXG4gICAgbGV0IG1hdGNoID0gbnVsbCxcbiAgICAgICAgaXNvJDEgPSBpc28oc291cmNlKTtcblxuICAgIChpc2Eoc291cmNlKSA/IHNvdXJjZSA6IGlzbyQxID8gT2JqZWN0LmVudHJpZXMoc291cmNlKSA6IFtdKS5zb21lKGl0ZW0gPT4ge1xuXG4gICAgICAgIGlmIChpc28kMSAmJiBpdGVtWzBdID09PSBrZXkpIHtcbiAgICAgICAgICAgIG1hdGNoID0gaXRlbVsxXTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGlzbyhpdGVtKSAmJiBpdGVtW2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgbWF0Y2ggPSBpdGVtW2tleV07XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG1hdGNoO1xufTtcbmNvbnN0IGZmID0gZmluZEZpcnN0O1xuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuLyoqXG4gKiBSZXBsYWNlcyBhbGwgdG9rZW5zIHNwZWNpZmllZCBpbiBzZWFyY2ggd2l0aCB0aGUgdG9rZW5zIHNwZWNpZmllZCBpbiByZXBsYWNlIGluIHRoZVxuICogdGFyZ2V0IHN0cmluZy5cbiAqIFdpbGwgcmVwbGFjZSBmcm9tIGxlZnQgdG8gcmlnaHQgaWYgbW9yZSB0aGFuIG9uZSBzZWFyY2ggdG9rZW4gaXMgc3BlY2lmaWVkLlxuICogSWYgdG9rZW4gaXMgYW4gYXJyYXkgYW5kIHJlcGxhY2UgaXMgYSBzdHJpbmcsIGFsbCB0b2tlbnMgd2lsbCBiZSByZXBsYWNlZCB3aXRoIHRoaXMgc3RyaW5nLlxuICogSWYgdG9rZW5zIGFuZCByZXBsYWNlIGFyZSBib3RoIGFycmF5cywgYW5kIHJlcGxhY2UgaGFzIGxlc3MgZW50cmllcywgaXRlbXMgaW4gdG9rZW5zIG1hdGNoaW5nIGEgbm9uIGV4aXN0ZW50XG4gKiBpbmRleCBpbiByZXBsYWNlIHdpbGwgYmUgcmVwbGFjZWQgd2l0aCBhbiBlbXB0eSB2YWx1ZS5cbiAqXG4gKiAgICAgIEBleGFtcGxlXG4gKiAgICAgIGxldCBzdHIgPSBsOC5yZXBsYWNlKFtcImZvb1wiLCBcImJhclwiXSwgW1wib29mXCIsIFwicmFiXCJdLCBcInRoaXMgZm9vIGlzIGJhclwiKTtcbiAqICAgICAgLy8gdGhpcyBvb2YgaXMgcmFiXG4gKlxuICogICAgICAgbGV0IHN0ciA9IGw4LnJlcGxhY2UoW1wiQVwiLCBcIkJcIl0sIFtcIkJcIiwgXCJEXCJdLCBcIkFcIik7XG4gKiAgICAgIC8vIERcbiAqXG4gKiAgICAgIGxldCBzdHIgPSBsOC5yZXBsYWNlKFtcIkFcIiwgXCJDXCJdLCBcIkJcIiwgXCJBQ1wiKTtcbiAqICAgICAgLy8gQkJcbiAqXG4gKiAgICAgIGxldCBzdHIgPSBsOC5yZXBsYWNlKFtcIkFcIiwgXCJDXCJdLCBbXCJCXCJdLCBcIkFDXCIpO1xuICogICAgICAvLyBCXG4gKlxuICogICAgICBsZXQgc3RyID0gbDgucmVwbGFjZShcIkFcIiwgXCJCXCIsIFwiQVwiKTtcbiAqICAgICAgLy8gQlxuICpcbiAqXG4gKiBAcGFyYW0geyhTdHJpbmd8QXJyYXk8U3RyaW5nPil9IHRva2Vuc1xuICogQHBhcmFtIHsoU3RyaW5nfEFycmF5PFN0cmluZz4pfSByZXBsYWNlXG4gKiBAcGFyYW0ge1N0cmluZ30gdGFyZ2V0XG4gKlxuICogQHJldHVybiB7U3RyaW5nfVxuICpcbiAqIEB0aHJvd3Mge0Vycm9yfSBpZiBzdHIgd2FzIG5vdCBhIHN0cmluZ1xuICpcbiAqIEBzZWUgZXNjYXBlUmVnRXhwXG4gKi9cbmNvbnN0IHJlcGxhY2UgPSBmdW5jdGlvbiAodG9rZW5zLCByZXBsYWNlLCB0YXJnZXQpIHtcblxuICAgIGlmICghaXNzKHRhcmdldCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXFxcInN0clxcXCIgbXVzdCBiZSBhIHN0cmluZ1wiKTtcbiAgICB9XG5cbiAgICB0b2tlbnMgID0gW10uY29uY2F0KHRva2Vucyk7XG4gICAgcmVwbGFjZSA9ICFpc3MocmVwbGFjZSkgPyBbXS5jb25jYXQocmVwbGFjZSkgOiBuZXcgQXJyYXkodG9rZW5zLmxlbmd0aCkuZmlsbChyZXBsYWNlKTtcblxuICAgIHRva2Vucy5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgICB0YXJnZXQgPSB0YXJnZXQucmVwbGFjZShuZXcgUmVnRXhwKGVzY2FwZVJlZ0V4cChpdGVtKSwgXCJnXCIpLCByZXBsYWNlW2luZGV4XSA/PyBcIlwiKTtcbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIHRhcmdldDtcbn07XG5jb25zdCBycGwgPSByZXBsYWNlO1xuXG5cbi8qKlxuICogVW5pZmllcyB0aGUgc3RyaW5nIGJ5IHJlbW92aW5nIHN1YnNlcXVlbnQgZW50cmllcyBvZiBkdXBsaWNhdGVzIG9mIHRva2VuLlxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogICAgIGw4LnVuaWZ5KFwiZm9vLy9iYXIvLy9cIiwgXCIvXCIpOyAvLyBcImZvby9iYXIvXCJcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdG9rZW5cbiAqIEBwYXJhbSB7U3RyaW5nfSB0YXJnZXRcbiAqXG4gKiB0aHJvd3Mge0Vycm9yfSBpZiB0YXJnZXQgb3IgdG9rZW4gYXJlIG5vdCBzdHJpbmdzXG4gKi9cbmNvbnN0IHVuaWZ5ID0gZnVuY3Rpb24gKHRhcmdldCwgdG9rZW4pIHtcblxuICAgIGlmICghaXNzKHRhcmdldCkgfHwgIWlzcyh0b2tlbikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXFxcInN0clxcXCIgbXVzdCBiZSBhIHN0cmluZ1wiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0LnNwbGl0KHRva2VuKS5maWx0ZXIoXG4gICAgICAgICh4LCBpbmRleCwgc291cmNlKSA9PiBpbmRleCA9PT0gMCB8fCBpbmRleCA9PT0gc291cmNlLmxlbmd0aCAtIDEgfHwgeCAhPT0gXCJcIlxuICAgICkuam9pbih0b2tlbik7XG5cbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHNwZWNpZmllZCBzdHJpbmcgaXMgbm90IGFueSBvZiB0aGUgcGFzc2VkIGFyZ3VtZW50cy4gTWF0Y2hlcyBhcmUgc3RyaWN0LlxuICpcbiAqIEBleGFtcGxlXG4gKiAgbDguaXNOb3QoXCJzdHJpbmdcIiwgXCJzdHJpbmdcIik7IC8vIGZhbHNlXG4gKiAgbDguaXNOb3QoXCJzdHJpbmdcIiwgXCJTdHJpbmdcIik7IC8vIHRydWVcbiAqICBsOC5pc05vdChcInN0cmluZ1wiLCBcImZvb1wiLCBcImJhclwiKTsgLy8gdHJ1ZVxuICogIGw4LmlzTm90KFwic3RyaW5nXCIsIFwiZm9vXCIsIFwiYmFyXCIsIFwic3RyaW5nXCIpOyAvLyBmYWxzZVxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0YXJnZXRcbiAqIEBwYXJhbSB7Li4uU3RyaW5nfSBleGNsdWRlc1xuICpcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbmNvbnN0IGlzTm90ID0gZnVuY3Rpb24gKHRhcmdldCkge1xuXG4gICAgY29uc3RcbiAgICAgICAgZXhwciA9IFwiKD8hKFwiICsgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKS5qb2luKFwifFwiKSArIFwiKSleXCIsXG4gICAgICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cChleHByLCBcImdcIik7XG5cbiAgICByZXR1cm4gdGFyZ2V0Lm1hdGNoKHJlZ2V4KSAhPT0gbnVsbDtcbn07XG5cblxuLyoqXG4gKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvR3VpZGUvUmVndWxhcl9FeHByZXNzaW9ucyNlc2NhcGluZ1xuICovXG5mdW5jdGlvbiBlc2NhcGVSZWdFeHAgKHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZSgvWy4qKz9eJHt9KCl8W1xcXVxcXFxdL2csIFwiXFxcXCQmXCIpO1xufVxuXG52YXIgc3RyaW5nID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICAgIF9fcHJvdG9fXzogbnVsbCxcbiAgICByZXBsYWNlOiByZXBsYWNlLFxuICAgIHJwbDogcnBsLFxuICAgIHVuaWZ5OiB1bmlmeSxcbiAgICBpc05vdDogaXNOb3Rcbn0pO1xuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuLyoqXG4gKiBDcmVhdGVzIGEgbm9uZS1jb25maWd1cmFibGUsIG5vbmUtd3JpdGVhYmxlIChsaXN0IG9mKSBwcm9wZXJ0KHl8aWVzKSBvbiB0aGUgdGFyZ2V0IG9iamVjdC5cbiAqXG4gKiBAZXhhbXBsZVxuICogICAgICBsZXQgdGFyZ2V0ID0gbGNrKHt9LCBcImZvb1wiKTsgLy8gdGFyZ2V0ID0ge2ZvbyA6IHVuZGVmaW5lZH07XG4gKiAgICAgIGxldCB0YXJnZXQgPSBsY2soe30sIFwiZm9vXCIsIDEpOyAvLyB0YXJnZXQgPSB7Zm9vIDogMX07XG4gKiAgICAgIGxldCB0YXJnZXQgPSBsY2soe30sIFtcImZvb1wiLCBcImJhclwiXSwge1wiZm9vXCIgOiAxLCBcImJhclwiIDogMn0pOyAvLyB0YXJnZXQgPSB7Zm9vIDogMSwgYmFyIDogMn07XG4gKiAgICAgIGxldCB0YXJnZXQgPSBsY2soe30sIFwiZm9vXCIsIFwiYmFyXCIsIHtcImZvb1wiIDogMSwgXCJiYXJcIiA6IDJ9KTsgLy8gdGFyZ2V0ID0ge2ZvbyA6IDEsIGJhciA6IDJ9O1xuICpcbiAqIEBwYXJhbSB7IU9iamVjdH0gdGFyZ2V0XG4gKiBAcGFyYW0geyEoU3RyaW5nfEFycmF5fSBwcm9wIEVpdGhlciB0aGUgcHJvcGVydHkgbmFtZSBvciBhbiBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lc1xuICogdGhhdCBzaG91bGQgYmUgY3JlYXRlZCBvbiBcInRhcmdldFwiIHdpdGggdGhlaXIgY29ycmVzcG9uZGluZyB2YWx1ZXMgZm91bmQgaW4gXCJ2YWx1ZVwiXG4gKlxuICogQHBhcmFtIHsqPX0gdmFsdWVcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRhcmdldFxuICpcbiAqIEB0aHJvd3Mge0Vycm9yfSBpZiB0YXJnZXQgaXMgbm90IGV4dGVuc2libGUsIGlmIFwicHJvcFwiIGlzIG5vdCBhIHZhbGlkIHN0cmluZyBvciBpZiBhIGxpc3Qgb2YgcHJvcGVydGllc1xuICogaXMgc3VwcGxpZWQsIGJ1dCBubyB2YWx1ZS1vYmplY3QuXG4gKi9cbmNvbnN0IGxvY2sgPSBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wLCB2YWx1ZSkge1xuXG4gICAgaWYgKCFpc09iamVjdCh0YXJnZXQpIHx8IE9iamVjdC5pc0Zyb3plbih0YXJnZXQpIHx8IE9iamVjdC5pc1NlYWxlZCh0YXJnZXQpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlxcXCJ0YXJnZXRcXFwiIG11c3QgYmUgYW4gZXh0ZW5zaWJsZSBvYmplY3QuXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgICB2YWx1ZSA9IGFyZ3VtZW50c1tsZW4gLSAxXTtcblxuICAgIGlmIChsZW4gPCAyKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlxcXCJwcm9wZXJ0eVxcXCIgbXVzdCBiZSBhIHZhbGlkIHByb3BlcnR5IG5hbWUuXCIpO1xuICAgIH1cblxuICAgIGlmIChsZW4gPiAzICYmICFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXFxcInZhbHVlXFxcIiBtdXN0IGJlIGFuIG9iamVjdC5cIik7XG4gICAgfVxuXG4gICAgaWYgKGxlbiA9PT0gMyAmJiBpc0FycmF5KHByb3ApICYmICFpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXFxcInZhbHVlXFxcIiBtdXN0IGJlIGFuIG9iamVjdC5cIik7XG4gICAgfVxuXG4gICAgbGV0IGlzQXJyID0gaXNBcnJheShwcm9wKSxcbiAgICAgICAgcHJvcHMgPSBpc0FyciA/IHByb3AgOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkoYXJndW1lbnRzLCBbMSwgbGVuIC0gMV0pO1xuXG4gICAgcHJvcHMuZm9yRWFjaCggcHJvcCA9PiB7XG4gICAgICAgIGlmICghaXNTdHJpbmcocHJvcCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlxcXCJwcm9wZXJ0eVxcXCIgbXVzdCBiZSBhIHZhbGlkIHByb3BlcnR5IG5hbWUuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcCwge1xuICAgICAgICAgICAgd3JpdGFibGUgOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZSA6IGZhbHNlLFxuICAgICAgICAgICAgdmFsdWUgOiBsZW4gPiAzIHx8IGlzQXJyID8gdmFsdWVbcHJvcF0gOiB2YWx1ZVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIHRhcmdldDtcbn07XG5jb25zdCBsY2sgPSBsb2NrO1xuXG4vKipcbiAqIFRoaXMgY2FsbGJhY2sgaXMgZGlzcGxheWVkIGFzIHBhcnQgb2YgdGhlIFJlcXVlc3RlciBjbGFzcy5cbiAqIEBjYWxsYmFjayB2aXNpdH52aXNpdG9yXG4gKiBAcGFyYW0geyp9IGxlYWZcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gKi9cblxuLyoqXG4gKiBUcmF2ZXJzZXMgYW4gb2JqZWN0IGFuZCBjYWxscyB0aGUgcGFzc2VkIGZ1bmN0aW9uIG9uIGVhY2ggcHJvcGVydHkuXG4gKlxuICogQGV4YW1wbGVcbiAqICAgICAgbGV0IHRyZWUgPSB7XG4gKiAgICAgICAgICBub2RlIDoge1xuICogICAgICAgICAgICAgIG5vZGVfYSA6IHtcbiAqICAgICAgICAgICAgICAgICAgbm9kZSA6IFwiZm9vXCJcbiAqICAgICAgICAgICAgICB9XG4gKiAgICAgICAgICB9LFxuICogICAgICAgICAgbm9kZV9jIDogXCJiYXJcIlxuICogICAgICB9O1xuICpcbiAqIGw4LnZpc2l0KHRyZWUsIChsZWFmLCBwYXRoKSA9PiBwYXRoOyAvLyBjaGFuZ2VzIHRoZSB0cmVlIHRvXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldCBUaGUgdGFyZ2V0IFwidHJlZVwiIHRoYXQgc2hvdWxkIGJlIHZpc2l0ZWQuXG4gKiBAcGFyYW0ge3Zpc2l0fnZpc2l0b3J9IHZpc2l0b3IgLSBUaGUgY2FsbGJhY2sgdGhhdCBoYW5kbGVzIHRoZSByZXNwb25zZS4gVGhlIHBhc3NlZCBhcmd1bWVudHMgdG8gdGhpcyBmdW5jdGlvbnNcbiAqIGFyZSB0aGUgdmFsdWUgb2YgdGhlIG5vZGUgYW5kIHRoZSBwYXRoIChzdHJpbmcpIHRvIHRoaXMgbm9kZS5cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRhcmdldCBUaGUgdmlzaXRlZCB0YXJnZXQuXG4gKlxuICovXG5jb25zdCB2aXNpdCA9IGZ1bmN0aW9uICh0YXJnZXQsIHZpc2l0b3IpIHtcblxuICAgIGNvbnN0IHRyYXZlcnNlID0gKHRhcmdldCwgcGFyZW50S2V5KSA9PiB7XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHRhcmdldCkubWFwKChba2V5LCBwcm9wZXJ0eV0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBhdGggPSBwYXJlbnRLZXkuY29uY2F0KGtleSk7XG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IGlzbyhwcm9wZXJ0eSkgPyB0cmF2ZXJzZShwcm9wZXJ0eSwgcGF0aCkgOiB2aXNpdG9yKHByb3BlcnR5LCBwYXRoLmpvaW4oXCIuXCIpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfTtcblxuICAgIHRyYXZlcnNlKHRhcmdldCwgW10pO1xuICAgIHJldHVybiB0YXJnZXQ7XG59O1xuY29uc3QgdnN0ID0gdmlzaXQ7XG5cblxuLyoqXG4gKiBVdGlsaXRpZXNcbiAqL1xuXG5cbi8qKlxuICogQ3JlYXRlcyBhbiBvYmplY3QgY2hhaW4gb24gdGhlIHRhcmdldCBvYmplY3QgYW5kIGluaXRpYWxpemVzIGl0IHdpdGhcbiAqIHRoZSBkZWZhdWx0VmFsdWUsIGlmIHNwZWNpZmllZC5cbiAqIFJldHVybnMgdGhlIHRhcmdldCBvYmplY3QuXG4gKiBUaGUgdGhpcmQgYXJndW1lbnQgY2FuIGJlIGEgZnVuY3Rpb24gdGhhdCBnZXRzIGNhbGxlZCB3aXRoIHRoZSBjaGFpbidzIG5hbWUgY3JlYXRlZCBhcyBpdHMgYXJndW1lbnQuXG4gKiBPdmVycmlkZXMgYW55IHZhbHVlIGZvdW5kIG9uIHRoZSBlbmQgb2YgdGhlIGNoYWluIG9mIHRoZSBvYmplY3QgaWYgb3ZlcnJpZGUgaXMgc2V0IHRvIHRydWUgYW5kIHRoZSB2YWx1ZVxuICogZXhpc3RzLlxuICpcbiAqIEBleGFtcGxlXG4gKiAgICBsZXQgb2JqID0ge307XG4gKiAgICBsOC5jaGFpbihcImEuYi5jLmRcIiwgb2JqLCBcImZvb1wiKTtcbiAqXG4gKiAgICAvLyBvYmpcbiAqICAgIC8vIHsgYSA6IHsgYiA6IHtjIDogeyBkIDogXCJmb29cIn19fX1cbiAqXG4gKiBUaGlzIG1ldGhvZCBsZXRzIHlvdSBwYXNzIGEgbGlzdCBvZiBwcm9wZXJ0aWVzIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0aGF0IHdpbGwgYmUgY2hhaW5lZC5cbiAqIFRoZSB0aGlyZCBhcmd1bWVudCBjYW4gYmUgYSBmdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIHdpdGggZWFjaCBwcm9wZXJ0eSB1cG9uIGNoYWluaW5nLlxuICogVGhlIHJldHVybiB2YWx1ZSBvZiB0aGlzIGZ1bmN0aW9uIGlzIHVzZWQgYXMgdGhlIHZhbHVlIGZvciB0aGUgY2hhaW5lZCBwcm9wZXJ0eS5cbiAqIE90aGVyd2lzZSwgdGhlIHRoaXJkIGFyZ3VtZW50IHdpbGwgYmUgdXNlZCBhcyB0aGUgdmFsdWUuXG4gKlxuICogQGV4YW1wbGVcbiAqIGxldCBvYmogPSB7fTtcbiAqICAgIGw4LmNoYWluKFtcImEuYlwiLCBcImUuZlwiXSwgb2JqLCAoY2hhaW4pID0+IGNvbnNvbGUubG9nKGNoYWluLnRvVXBwZXJDYXNlKCkpKTtcbiAqXG4gKiAgICAvLyBvYmpcbiAqICAgIC8vIHsgYSA6IHsgYiA6IFwiQlwifSwge2UgOiB7ZiA6IFwiRlwifX19XG4gKlxuICpcbiAqIEBwYXJhbSB7IShTdHJpbmd8QXJyYXkpfSBjaGFpbnNcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRcbiAqIEBwYXJhbSB7PygqfGZ1bmN0aW9uKX0gZGVmYXVsdFZhbHVlXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvdmVycmlkZT1mYWxzZV1cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRhcmdldFxuICovXG5jb25zdCBjaGFpbiA9IGZ1bmN0aW9uIChjaGFpbnMsIHRhcmdldCA9IHt9LCBkZWZhdWx0VmFsdWUgPSB1bmRlZmluZWQsIG92ZXJyaWRlID0gZmFsc2UpIHtcblxuICAgIGNoYWlucyA9IFtdLmNvbmNhdChjaGFpbnMpO1xuXG4gICAgY2hhaW5zLmZvckVhY2goKHN0cikgPT4ge1xuICAgICAgICAvKipcbiAgICAgICAgICogQHRvZG8gTyhuKSA/XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAga2V5cyA9IHN0ci5zcGxpdChcIi5cIiksXG4gICAgICAgICAgICBjciA9IChvYmosIGtleXMpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBrZXk7XG5cbiAgICAgICAgICAgICAgICBrZXkgPSBrZXlzLnNoaWZ0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIW9ialtrZXldIHx8IChvdmVycmlkZSA9PT0gdHJ1ZSAmJiAha2V5cy5sZW5ndGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIG9ialtrZXldID0ga2V5cy5sZW5ndGggPyB7fSA6IChpc0Z1bmN0aW9uKGRlZmF1bHRWYWx1ZSkgPyBkZWZhdWx0VmFsdWUoc3RyKSA6IGRlZmF1bHRWYWx1ZSkgO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChrZXlzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjcihvYmpba2V5XSwga2V5cyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgY3IodGFyZ2V0LCBrZXlzKTtcbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIHRhcmdldDtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIGNoYWluKClcbiAqIEB0eXBlIHtmdW5jdGlvbighKFN0cmluZ3xBcnJheSksIE9iamVjdD0sID8oKnxGdW5jdGlvbik9KTogT2JqZWN0fVxuICovXG5jb25zdCBjaG4gPSBjaGFpbjtcblxuLyoqXG4gKiBFeHBlY3RzIGFuIE9iamVjdCBhbmQgZmxpcHMga2V5L3ZhbHVlL3BhaXJzLlxuICpcbiAqICAgICAgQGV4YW1wbGVcbiAqICAgICAgdmFyIGZvbyA9IHsgMSA6IFwiZm9vXCIsIDIgOiBcImJhclwiLCAzIDogXCJzbmFmdVwifTtcbiAqXG4gKiAgICAgIGw4LmZsaXAoZm9vKTsgLy8ge1wiYmFyXCIgOiAxLCBcImJhclwiOiAyLCBcInNuYWZ1XCIgOiAzfVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gYSBuZXcgb2JqZWN0IHdoZXJlIHRoZSBrZXkvdmFsdWUgcGFpcnMgYXJlIGZsaXBwZWRcbiAqL1xuY29uc3QgZmxpcCA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCAuLi5PYmplY3QuZW50cmllcyhpbnB1dCkubWFwKChbaywgdl0pID0+ICAoe1t2XSA6IGt9KSkpO1xufTtcblxuXG4vKipcbiAqIEV4cGVjdHMgYW4gT2JqZWN0IGFuZCByZW1vdmVzIGFsbCB0aGUgZW50cmllcyB3aGljaCBzdHJpY3QgZXF1YWwgdG8gbWF0Y2guXG4gKlxuICogICAgICBAZXhhbXBsZVxuICogICAgICB2YXIgZm9vID0geyAxIDogXCJcIiwgMiA6IFwiYmFyXCIsIDMgOiBcIlwifTtcbiAqXG4gKiAgICAgIGw4LnB1cmdlKGZvbywgXCJcIik7IC8vIHsyIDogXCJiYXJcIn1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAqIEBwYXJhbSB7TWl4ZWR9IG1hdGNoLCBkZWZhdWx0cyB0byB1bmRlZmluZWRcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IGEgbmV3IGZpbHRlcmVkIG9iamVjdFxuICovXG5jb25zdCBwdXJnZSA9IGZ1bmN0aW9uIChpbnB1dCwgbWF0Y2g9IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMoaW5wdXQpLmZpbHRlcigoWywgdl0pID0+IHYgIT09IG1hdGNoKSk7XG59O1xuXG5cbi8qKlxuICogU3BsaXRzIHRoZSBzcGVjaWZpZWQgc3RyaW5nIGJ5IGxvb2tpbmcgZm9yIFwiLlwiIGFzIHNlcGFyYXRvcnMgYW5kIHJldHVybnNcbiAqIHVuZGVmaW5lZCBpZiB0aGUgZXZhbHVhdGVkIHByb3BlcnR5IGlzIG5vdCBhdmFpbGFibGUsIG90aGVyd2lzZSB0aGUgdmFsdWVcbiAqIG9mIHRoZSBwcm9wZXJ0eS5cbiAqXG4gKiAgICAgIEBleGFtcGxlXG4gKiAgICAgIHZhciBmb28gPSB7IDEgOiB7IDIgOiB7IDMgOiB7IDQgOiAnYmFyJ319fX07XG4gKlxuICogICAgICBsOC51bmNoYWluKCcxLjIuMy40JywgZm9vKTsgLy8gJ2JhcidcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gY2hhaW4gVGhlIG9iamVjdCBjaGFpbiB0byByZXNvbHZlXG4gKiBAcGFyYW0ge09iamVjdH0gc2NvcGUgVGhlIHNjb3BlIHdoZXJlIHRoZSBjaGFpbiBzaG91bGQgYmUgbG9va2VkIHVwXG4gKiBAcGFyYW0geygqfEZ1bmN0aW9uKX0gZGVmYXVsdFZhbHVlIGEgZGVmYXVsdFZhbHVlIHRvIHJldHVybiBpbiBjYXNlIHRoZSBjaGFpbiBpcyBub3QgZXhpc3RpbmcuXG4gKiBpZiB0aGlzIGFyZ3VtZW50IGlzIGEgZnVuY3Rpb24sIHRoZSBmdW5jdGlvbiBnZXRzIGNhbGxlZC4gSWYgdGhlIGNoYWluIGV4aXN0ZWQsIGl0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlXG4gKiB2YWx1ZSBvZiB0aGUgY2hhaW4sIGFuZCB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoaXMgZnVuY3Rpb24gaXMgcmV0dXJuZWQuXG4gKiBAZXhhbXBsZVxuICogY29uc3QgY2IgPSB2YWx1ZSA9PiB2YWx1ZS50b1VwcGVyQ2FzZSgpLFxuICogICAgICBmb28gPSB7IDEgOiB7IDIgOiB7IDMgOiB7IDQgOiAnYmFyJ319fX07XG4gKlxuICogIGw4LnVuY2hhaW4oJzEuMi4zLjQnLCBmb28sIGNiKTsgLy8gJ0JBUidcbiAqXG4gKiBAcmV0dXJuIHsqfSB1bmRlZmluZWQgaWYgZWl0aGVyIHNjb3BlIHdhcyBub3QgZm91bmQgb3IgdGhlIGNoYWluIGNvdWxkXG4gKiBub3QgYmUgcmVzb2x2ZWQsIG90aGVyd2lzZSB0aGUgdmFsdWUgZm91bmQgaW4gW3Njb3BlXVtjaGFpbl1cbiAqL1xuY29uc3QgdW5jaGFpbiA9IGZ1bmN0aW9uIChjaGFpbiwgc2NvcGUsIGRlZmF1bHRWYWx1ZSA9IHVuZGVmaW5lZCkge1xuXG4gICAgdmFyIHBhcnRzID0gY2hhaW4uc3BsaXQoXCIuXCIpLFxuICAgICAgICBvYmogICA9IHNjb3BlO1xuXG4gICAgd2hpbGUgKG9iaiAhPT0gdW5kZWZpbmVkICYmIHBhcnRzLmxlbmd0aCkge1xuICAgICAgICBvYmogPSBvYmpbcGFydHMuc2hpZnQoKV07XG4gICAgfVxuXG4gICAgaWYgKGlzRnVuY3Rpb24oZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlKG9iaik7XG4gICAgfVxuXG4gICAgaWYgKG9iaiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHVuY2hhaW4oKVxuICogQHR5cGUge2Z1bmN0aW9uKCEoU3RyaW5nfEFycmF5KSwgT2JqZWN0PSwgPygqfEZ1bmN0aW9uKT0pOiBPYmplY3R9XG4gKi9cbmNvbnN0IG5jaG4gPSB1bmNoYWluO1xuXG4vKipcbiAqIExldHMgeW91IHNwZWNpZnkgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gbWFrZSBzdXJlIG9ubHkgdGhvc2VcbiAqIGtleXMgYXJlIGFzc2lnbmVkIGZyb20gc291cmNlIHRvIHRhcmdldCB0aGF0IG1hdGNoIHRoZSBleHByZXNzaW9uLlxuICpcbiAqIEBleGFtcGxlXG4gKiAgICAgbDguYXNzaWduKHt9LCB7XCJmb29cIjogXCJiYXJcIn0sIFt7XCJzbmFmdVwiIDogXCJmb29iYXJcIiwgXCJrZXlcIjogXCJ2YWx1ZVwifSwgLyg/IShzbmFmdSkpXi9nXSk7XG4gKiAgICAgLy8gcmVzdWx0cyBpbiB7XCJmb29cIjogXCJiYXJcIiwgXCJrZXlcIjogXCJ2YWx1ZVwifVxuICpcbiAqICAgICAgbDguYXNzaWduKHt9LCB7XCJmb29cIjogXCJiYXJcIn0sIFt7XCJzbmFmdVwiIDogXCJmb29iYXJcIiwgXCJrZXlcIjogXCJ2YWx1ZVwiLCBcInNvbWVcIjogXCJvYmpcIn0sIFwic25hZnVcIiwgXCJrZXlcIl0pO1xuICogICAgIC8vIHJlc3VsdHMgaW4ge1wiZm9vXCI6IFwiYmFyXCIsIFwic29tZVwiOiBcIm9ialwifVxuICpcbiAqXG4gKiBAcGFyYW0geyFPYmplY3R9IHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCB0byBhc3NpZ24gdHRvXG4gKiBAcGFyYW0gey4uLihPYmplY3R8W09iamVjdCwgKFJlZ0V4cHwuLi5TdHJpbmddKX0gVGhlIG9iamVjdHMgdG8gdXNlIGZvciBhc3NpZ25pbmcuIElmIGFuIGFycmF5IGlzIHN1Ym1pdHRlZCwgdGhlIGZpcnN0XG4gKiBpbmRleCBpcyB0aGUgb2JqZWN0IHNvdXJjZSB0byBhc3NpZ24gZnJvbSwgYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgaXN0IHRoZSByZWd1bGFyIGV4cHJlc3Npb24gdGhhdCBtdXN0IG1hdGNoXG4gKiB0aGUgb2JqZWN0IGtleXMgdG8gdXNlIGZvciBhc3NpZ25tZW50LiBJZiB0aGVyZSBpcyBubyBSZWdFeHAgYXMgYSBzZWNvbmQgYXJndW1lbnQgYnV0IGluc3RlYWQgYSBzdHJpbmcsIHRoaXMgc3RyaW5nIHdpbGxcbiAqIGJlIHVzZWQgZm9yIGNvbXBhcmlzb24uIENhbiBhbHNvIGJlIGFuIGFyYml0cmFyeSBudW1iZXIgb2Ygc3RyaW5ncy4gQWxsIHRoZSBrZXlzIG5vdCBzdHJpY3QgZXF1YWxpbmcgdG8gdGhlIHN1Ym1pdHRlZFxuICogYXJndW1lbnRzIHdpbGwgdGhlbiBiZSBhc3NpZ25lZCB0aGVpciB2YWx1ZXMgdG8gdGFyZ2V0LlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gdGFyZ2V0XG4gKi9cbmNvbnN0IGFzc2lnbiA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcblxuICAgIGxldCBzb3VyY2VzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIHNvdXJjZXMgPSBzb3VyY2VzLm1hcCggc291cmNlID0+IHtcblxuICAgICAgICBpZiAoaXNQbGFpbk9iamVjdChzb3VyY2UpKSB7XG4gICAgICAgICAgICByZXR1cm4gc291cmNlO1xuICAgICAgICB9XG5cblxuICAgICAgICBpZiAoaXNBcnJheShzb3VyY2UpKSB7XG4gICAgICAgICAgICBjb25zdCBbb2JqLCAuLi5hcmdzXSA9IHNvdXJjZSxcbiAgICAgICAgICAgICAgICByZWdleHAgPSBhcmdzWzBdO1xuXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKG9iaikuZmlsdGVyKGVudHJ5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGtleSA9IGVudHJ5WzBdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNyeChyZWdleHApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5Lm1hdGNoKHJlZ2V4cCkgIT09IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNOb3QuYXBwbHkoc3RyaW5nLCBba2V5XS5jb25jYXQoYXJncykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHRhcmdldCwgLi4uc291cmNlcyk7XG59O1xuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuLyoqXG4gKiBUcmFuc2Zvcm1lciBmb3IgdHJhbnNmb3JtaW5nIHF1b3RlZCBwbGFpbi10ZXh0IChxdW90ZSBtYXJrczogXCI+XCIpXG4gKiB0byBhIHRleHQgY29udGFpbmluZyBibG9ja3F1b3Rlcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogIGxldCB0ZXh0ID0gW1xuICogICAgICBcIj4gVGhpcyBpc1wiLFxuICogICAgICBcIj4gc29tZSBxdW90ZWRcIixcbiAqICAgICAgXCI+PiBUZXh0IHRoYXQgZG9lcyAxXCIsXG4gKiAgICAgIFwiPj4gVGV4dCB0aGF0IGRvZXMgMlwiLFxuICogICAgICBcIj5obSBnb29kXCIsXG4gKiAgICAgIFwic3RmZiB0aGF0XCIsXG4gKiAgICAgIFwidXN1YWxseSBsaWtlc1wiLFxuICogICAgICBcIj4+IHRvIGJlIHBhcnNlZFwiLFxuICogICAgICBcIj4+WU8hXCIsXG4gKiAgXS5qb2luKFwiXFxuXCIpO1xuICpcbiAqICBsZXQgdHJhbnNmb3JtZXIgPSBuZXcgQmxvY2txdW90ZVRyYW5zZm9ybWVyXG4gKlxuICogIHRyYW5zZm9ybWVyLnRyYW5zZm9ybSh0ZXh0KTtcbiAqXG4gKiAgLy8gcmV0dXJuczpcbiAqICAvLyA8YmxvY2txdW90ZT5cbiAqICAvLyAgIFRoaXMgaXNcbiAqICAvLyAgIHNvbWUgcXVvdGVkXG4gKiAgLy8gICA8YmxvY2txdW90ZT5cbiAqICAvLyAgICAgIFRleHQgdGhhdCBkb2VzIDFcbiAqICAvLyAgICAgIFRleHQgdGhhdCBkb2VzIDJcbiAqICAvLyAgIDwvYmxvY2txdW90ZT5cbiAqICAvLyAgIGhtIGdvb2RcbiAqICAvLyA8L2Jsb2NrcXVvdGU+XG4gKiAgLy8gc3RmZiB0aGF0XG4gKiAgLy8gdXN1YWxseSBsaWtlc1xuICogIC8vIDxibG9ja3F1b3RlPlxuICogIC8vICA8YmxvY2txdW90ZT5cbiAqICAvLyAgIHRvIGJlIHBhcnNlZFxuICogIC8vICAgWU8hXG4gKiAgLy8gIDwvYmxvY2txdW90ZT5cbiAqICAvLyA8L2Jsb2NrcXVvdGU+XG4gKlxuICovXG5jbGFzcyBCbG9ja3F1b3RlVHJhbnNmb3JtZXIge1xuXG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VzIHRyYW5zZm9ybWluZyB0aGUgcGFzc2VkIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRyYW5zZm9ybSAodmFsdWUpIHtcblxuICAgICAgICBjb25zdCBtZSA9IHRoaXM7XG5cbiAgICAgICAgbGV0IGdyb3VwcyA9IG1lLmdyb3VwKHZhbHVlKSxcbiAgICAgICAgICAgIHRleHRzID0gW107XG5cbiAgICAgICAgZ3JvdXBzLmZvckVhY2goZ3JvdXAgPT4ge1xuICAgICAgICAgICAgdGV4dHMucHVzaChtZS5xdW90ZShncm91cCkpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGV4dHMuam9pbihcIlwiKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogVGFrZXMgY2FyZSBvZiBncm91cGluZyB0aGUgdGV4dCBpbnRvIGJsb2NrcyBvZlxuICAgICAqIHF1b3RlZCAvIHVucXVvdGVkIHBhcnRzLiBUYWtlcyBjYXJlIG9mIHNhbml0aXppbmcgdGhlIHF1b3RlIG1hcmtzLCB0b28uXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICAgIGxldCB0ZXh0ID0gW1xuICAgICAqICAgICAgXCIgPiBUaGlzIGlzXCIsXG4gICAgICogICAgICBcIj4gc29tZSBxdW90ZWRcIixcbiAgICAgKiAgICAgIFwiICA+ID4gVGV4dCB0aGF0IGRvZXMgMVwiLFxuICAgICAqICAgICAgXCI+ICAgID4gVGV4dCB0aGF0IGRvZXMgMlwiLFxuICAgICAqICAgICAgXCI+aG0gZ29vZFwiLFxuICAgICAqICAgICAgXCJzdHVmZiB0aGF0XCIsXG4gICAgICogICAgICBcInVzdWFsbHkgbGlrZXNcIixcbiAgICAgKiAgICAgIFwiPj4gdG8gYmUgcGFyc2VkXCIsXG4gICAgICogICAgICBcIj4+WU8hXCIsXG4gICAgICogICAgXS5qb2luKFwiXFxuXCIpO1xuICAgICAqXG4gICAgICogIHRyYW5zZm9ybWVyLmdyb3VwKHRleHQpO1xuICAgICAqICAvLyBbXG4gICAgICogIC8vICAgW1wiPiBUaGlzIGlzXCIsIFwiPiBzb21lIHF1b3RlZFwiLCBcIj4+IFRleHQgdGhhdCBkb2VzIDFcIiwgXCI+PiBUZXh0IHRoYXQgZG9lcyAyXCIsIFwiPmhtIGdvb2RcIl0sXG4gICAgICogIC8vICAgW1wic3R1ZmYgdGhhdFwiLCBcInVzdWFsbHkgbGlrZXNcIl0sXG4gICAgICogIC8vICAgW1wiPj4gdG8gYmUgcGFyc2VkXCIsIFwiPj5ZTyFcIl1cbiAgICAgKiAgLy8gXVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRleHRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZ3JvdXAgKHRleHQpIHtcblxuICAgICAgICBjb25zdCBtZSA9IHRoaXM7XG5cbiAgICAgICAgbGV0IGxpbmVzID0gdGV4dC5zcGxpdChcIlxcblwiKSxcbiAgICAgICAgICAgIHRvUXVvdGUgPSBbXSxcbiAgICAgICAgICAgIGdyb3VwcyA9IC0xLFxuICAgICAgICAgICAgcHJldiA9IG51bGw7XG5cbiAgICAgICAgbGluZXMuZm9yRWFjaChsaW5lID0+IHtcblxuICAgICAgICAgICAgbGluZSA9IG1lLnNhbml0aXplTGluZShsaW5lKTtcblxuICAgICAgICAgICAgaWYgKHByZXYgIT09IGxpbmUuaW5kZXhPZihcIj5cIikpIHtcbiAgICAgICAgICAgICAgICBncm91cHMrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcHJldiA9IGxpbmUuaW5kZXhPZihcIj5cIik7XG5cbiAgICAgICAgICAgIGlmICghdG9RdW90ZVtncm91cHNdKSB7XG4gICAgICAgICAgICAgICAgdG9RdW90ZVtncm91cHNdID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b1F1b3RlW2dyb3Vwc10ucHVzaChsaW5lKTtcblxuICAgICAgICB9KTtcblxuXG4gICAgICAgIHJldHVybiB0b1F1b3RlO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogVGFrZXMgY2FyZSBvZiBwcm9wZXIgcXVvdGluZyB0aGUgcGFzc2VkIGdyb3VwLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gZ3JvdXBcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHF1b3RlIChncm91cCkge1xuXG4gICAgICAgIGlmIChncm91cFswXS5pbmRleE9mKFwiPlwiKSAhPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGdyb3VwLmpvaW4oXCJcXG5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3AgPSBxdW90ZWQgPT4ge1xuICAgICAgICAgICAgaWYgKHF1b3RlZFtxdW90ZWQubGVuZ3RoIC0gMV0gPT09IFwiXFxuXCIpIHtcbiAgICAgICAgICAgICAgICBxdW90ZWQucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IGN1cnJlbnRJbnRlbmQgPSAwLFxuICAgICAgICAgICAgaW50ZW5kYXRpb24sXG4gICAgICAgICAgICBxdW90ZWQgPSBbXSxcbiAgICAgICAgICAgIG1hdGNoO1xuXG4gICAgICAgIGdyb3VwLmZvckVhY2gobGluZSA9PiB7XG5cbiAgICAgICAgICAgIG1hdGNoID0gKGxpbmUgKyBcIlwiKS50cmltKCkubWF0Y2goL14oKD4pKykgKj8oLio/JCkvbXMpO1xuXG4gICAgICAgICAgICBpbnRlbmRhdGlvbiA9IG1hdGNoWzFdLmxlbmd0aDtcblxuICAgICAgICAgICAgd2hpbGUgKGludGVuZGF0aW9uID4gY3VycmVudEludGVuZCkge1xuICAgICAgICAgICAgICAgIHBvcChxdW90ZWQpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRJbnRlbmQrKztcbiAgICAgICAgICAgICAgICBxdW90ZWQucHVzaChcIjxibG9ja3F1b3RlPlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2hpbGUgKGN1cnJlbnRJbnRlbmQgPiBpbnRlbmRhdGlvbikge1xuICAgICAgICAgICAgICAgIHBvcChxdW90ZWQpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRJbnRlbmQtLTtcbiAgICAgICAgICAgICAgICBxdW90ZWQucHVzaChcIjwvYmxvY2txdW90ZT5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHF1b3RlZC5wdXNoKG1hdGNoWzNdKTtcbiAgICAgICAgICAgIHF1b3RlZC5wdXNoKFwiXFxuXCIpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHdoaWxlIChjdXJyZW50SW50ZW5kID4gMCkge1xuICAgICAgICAgICAgcG9wKHF1b3RlZCk7XG4gICAgICAgICAgICBjdXJyZW50SW50ZW5kLS07XG4gICAgICAgICAgICBxdW90ZWQucHVzaChcIjwvYmxvY2txdW90ZT5cIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcXVvdGVkLmpvaW4oXCJcIik7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFNhbml0aXplcyBhIHNpbmdsZSBsaW5lIGJ5IGdyb3VwaW5nIHF1b3RlIG1hcmtzIHByb3Blcmx5LlxuICAgICAqXG4gICAgICogKiBAZXhhbXBsZVxuICAgICAqICAgIGxldCBsaW5lID0gXCIgID4gPiAgICBUZXh0IHRoYXQgZG9lcyAxXCJcIjtcbiAgICAgKlxuICAgICAqICBsaW5lID0gdHJhbnNmb3JtZXIuc2FuaXRpemVMaW5lKGxpbmUpO1xuICAgICAqICAvLyBcIj4+IFRleHQgdGhhdCBkb2VzIDFcIlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGxpbmVcbiAgICAgKlxuICAgICAqIEByZXVybiB7U3RyaW5nfVxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBzYW5pdGl6ZUxpbmUgKGxpbmUpIHtcblxuICAgICAgICBsZXQgcmVnZXggPSAvXiggKikoPispKCA+KikqKD8hJCkvbTtcblxuICAgICAgICByZXR1cm4gbGluZS5yZXBsYWNlKFxuICAgICAgICAgICAgcmVnZXgsXG4gICAgICAgICAgICAoYXJncykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBhcmdzLnJlcGxhY2UoLyhcXHMpKig/ISQpL2csIFwiXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4vKipcbiAqIFRyYW5zZm9ybWVyIGZvciB0cmFuc2Zvcm1pbmcgcGxhaW4gdGV4dCBjb250YWluaW5nIEVtYWlsLUFkZHJlc3Nlc1xuICogaW50byB0ZXh0IHRoYXQgd3JhcHMgdGhvc2UgRW1haWwtQWRkcmVzZXMgaW4gXCI8YT5cIi10YWdzIGFsb25nIHdpdGggdGhlIGhyZWYtYXR0cmlidXRlJ3NcbiAqIHZhbHVlIChpLmUuIHRoZSBFbWFpbC1BZGRyZXNzIGl0c2VsZikgcHJlZml4ZWQgd2l0aCBcIm1haWx0bzpcIlxuICpcbiAqIEBleGFtcGxlXG4gKiAgbGV0IHRleHQgPSBcIlBsZWFzZSBjb250YWN0IGluZm9AY29uam9vbi5jb20gZm9yIGZ1cnRoZXIgaW5mb3JtYXRpb24uXCI7XG4gKlxuICogIGxldCB0cmFuc2Zvcm1lciA9IG5ldyBFbWFpbEFkZHJlc3NUcmFuc2Zvcm1lcjtcbiAqXG4gKiAgdHJhbnNmb3JtZXIudHJhbnNmb3JtKHRleHQpO1xuICpcbiAqICAvLyByZXR1cm5zOlxuICogIC8vIFBsZWFzZSBjb250YWN0IDxhIGhyZWY9XCJtYWlsdG86aW5maUBjb25qb29uLmNvbVwiPmluZm9AY29uam9vbi5jb208L2E+IGZvciBmdXJ0aGVyIGluZm9ybWF0aW9uLlxuICpcbiAqL1xuY2xhc3MgRW1haWxBZGRyZXNzVHJhbnNmb3JtZXIge1xuXG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VzIHRyYW5zZm9ybWluZyB0aGUgcGFzc2VkIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRyYW5zZm9ybSAodGV4dCkge1xuXG4gICAgICAgIGNvbnN0IGVtYWlsUmVnZXggPSAvW2EtekEtWjAtOSsuXyUtXXsxLDI1Nn1AW2EtekEtWjAtOV1bYS16QS1aMC05LV17MCw2NH0oXFwuW2EtekEtWjAtOV1bYS16QS1aMC05LV17MCwyNX0pKy9naTtcblxuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKGVtYWlsUmVnZXgsIG1hdGNoZXMgPT4gKFwiPGEgaHJlZj1cXFwibWFpbHRvOlwiICsgbWF0Y2hlcyArIFwiXFxcIj5cIiArIG1hdGNoZXMgKyBcIjwvYT5cIikpO1xuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4vKipcbiAqIFRyYW5zZm9ybWVyIGZvciB0cmFuc2Zvcm1pbmcgcGxhaW4tdGV4dCBjb250YWluaW5nIEh5cGVybGlua3NcbiAqIGludG8gdGV4dCB0aGF0IHdyYXBzIHRob3NlIEh5cGVybGlua3MgaW4gXCI8YT5cIi10YWdzLlxuICpcbiAqIEBleGFtcGxlXG4gKiAgbGV0IHRleHQgPSBcIlRoaXMgaXMgYW4gdXJsIGh0dHBzOi8vd3d3LmNvbmpvb24ub3JnIGFuZCBpdCBpcyBub3QgY2xpY2thYmxlXCI7XG4gKlxuICogIGxldCB0cmFuc2Zvcm1lciA9IG5ldyBIeXBlcmxpbmtUcmFuc2Zvcm1lcjtcbiAqXG4gKiAgdHJhbnNmb3JtZXIudHJhbnNmb3JtKHRleHQpO1xuICpcbiAqICAvLyByZXR1cm5zOlxuICogIC8vIFRoaXMgaXMgYW4gdXJsIDxhIGhyZWY9XCJodHRwczovL3d3dy5jb25qb29uLm9yZ1wiPmh0dHBzOi8vd3d3LmNvbmpvb24ub3JnPC9hPiBhbmQgaXQgaXMgbm90IGNsaWNrYWJsZVxuICpcbiAqL1xuY2xhc3MgSHlwZXJsaW5rVHJhbnNmb3JtZXIge1xuXG4gICAgLyoqXG4gICAgICogSW52b2tlcyB0cmFuc2Zvcm1pbmcgdGhlIHBhc3NlZCBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKi9cbiAgICB0cmFuc2Zvcm0gKHRleHQpIHtcblxuICAgICAgICBjb25zdCB1cmxSZWdleCA9IC8oXFxiKGh0dHBzPyk6XFwvXFwvWy1BLVowLTkrJkAjLyU/PX5ffCE6LC47XSpbLUEtWjAtOSsmQCMvJT1+X3xdKS9pZztcblxuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKHVybFJlZ2V4LCBtYXRjaGVzID0+IChcIjxhIGhyZWY9XFxcIlwiICsgbWF0Y2hlcyArIFwiXFxcIj5cIiArIG1hdGNoZXMgKyBcIjwvYT5cIikpO1xuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4vKipcbiAqIFRyYW5zZm9ybWVyIGZvciB0cmFuc2Zvcm1pbmcgcGxhaW4gdGV4dCBjb250YWluaW5nIGxpbmUgYnJlYWtzIChcXHIsIFxcclxcbiwgXFxuKVxuICogaW50byB0ZXh0IHRoYXQgcmVwbGFjZXMgdGhlIGxpbmUgYnJlYWtzIHdpdGggXCI8YnIgLz5cIi10YWdzLlxuICpcbiAqIEBleGFtcGxlXG4gKiAgbGV0IHRleHQgPSBcIlBsZWFzZVxcbiBkb24ndFxcblxcbiB3cmFwXFxubWVcIjtcbiAqXG4gKiAgbGV0IHRyYW5zZm9ybWVyID0gbmV3IExpbmVCcmVha1RyYW5zZm9ybWVyO1xuICpcbiAqICB0cmFuc2Zvcm1lci50cmFuc2Zvcm0odGV4dCk7XG4gKlxuICogIC8vIHJldHVybnM6XG4gKiAgLy8gUGxlYXNlPGJyIC8+IGRvbid0PGJyIC8+PGJyIC8+IHdyYXA8YnIgLz5tZVxuICpcbiAqL1xuY2xhc3MgTGluZUJyZWFrVHJhbnNmb3JtZXIge1xuXG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VzIHRyYW5zZm9ybWluZyB0aGUgcGFzc2VkIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRyYW5zZm9ybSAodGV4dCkge1xuXG4gICAgICAgIGNvbnN0IHJlZ2V4ID0gLyhcXHJcXG58XFxufFxccikvZ207XG5cbiAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZShyZWdleCwgbWF0Y2hlcyA9PiAoXCI8YnIgLz5cIikpO1xuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG52YXIgX2w4anMkNSA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgICBfX3Byb3RvX186IG51bGwsXG4gICAgQmxvY2txdW90ZVRyYW5zZm9ybWVyOiBCbG9ja3F1b3RlVHJhbnNmb3JtZXIsXG4gICAgRW1haWxBZGRyZXNzVHJhbnNmb3JtZXI6IEVtYWlsQWRkcmVzc1RyYW5zZm9ybWVyLFxuICAgIEh5cGVybGlua1RyYW5zZm9ybWVyOiBIeXBlcmxpbmtUcmFuc2Zvcm1lcixcbiAgICBMaW5lQnJlYWtUcmFuc2Zvcm1lcjogTGluZUJyZWFrVHJhbnNmb3JtZXJcbn0pO1xuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxudmFyIF9sOGpzJDQgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gICAgX19wcm90b19fOiBudWxsLFxuICAgIGh0bWw6IF9sOGpzJDVcbn0pO1xuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxudmFyIF9sOGpzJDMgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gICAgX19wcm90b19fOiBudWxsLFxuICAgIHRyYW5zZm9ybWVyOiBfbDhqcyQ0XG59KTtcblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIGNsYXNzZXMgaW1wbGVtZW50aW5nIHRlbXBsYXRlIGNvbXBpbGVyIGZ1bmN0aW9uYWxpdHlcbiAqL1xuY2xhc3MgQ29tcGlsZXIge1xuXG4gICAgLyoqXG4gICAgICogQ29tcGlsZXMgdGhlIHNwZWNpZmllZCB0eHQgYW5kIHJldHVybnMgYW4gaW5zdGFuY2Ugb2YgQ29tcGlsZWRUcGwuXG4gICAgICogSW1wbGVtZW50aW5nIGNsYXNzZXMgc2hvdWxkIHRha2UgY2FyZSBvZiBwcm9wZXJseSBwYXJzaW5nIHRoZSB0eHQgZm9yIHRoZSBhbGxvd2VkIGtleXMgYW5kXG4gICAgICogdm9pZCBhbnkgb3RoZXIga2V5cyBkZXRlY3RlZCBpbiB0aGUgdGVtcGxhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHh0XG4gICAgICogQHBhcmFtIHtBcnJheX0ga2V5cyBBbiBhcnJheSBvZiBrZXlzIHJlcHJlc2VudGluZyBhbGxvd2VkIHRlbXBsYXRlIHZhcmlhYmxlcywgb3B0aW9uYWwuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtDb21waWxlZFRwbH1cbiAgICAgKlxuICAgICAqIEB0aHJvd3MgaWYgYW55IGVycm9yIGR1cmluZyBjb21waWxpbmcgb2NjdXJzXG4gICAgICovXG4gICAgY29tcGlsZSAodHh0LCBrZXlzKSB7fVxuXG5cbn1cblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIENvbXBpbGVkIFRlbXBsYXRlcy5cbiAqXG4gKi9cbmNsYXNzIENvbXBpbGVkVHBsIHtcblxuICAgIC8qKlxuICAgICAqIFJlcGxhY2VzIGtleXMgZnJvbSBkYXRhIGZvdW5kIGluIHRoaXMgY29tcGlsZWQgdGVtcGxhdGUgd2l0aCB0aGVpciBhcHByb3ByaWF0ZSB2YWx1ZXNcbiAgICAgKiBhbmQgcmV0dXJucyB0aGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqXG4gICAgICogQHRocm93cyBpZiBhbnkgZXJyb3IgZHVyaW5nIHRoZSByZW5kZXJpbmcgcHJvY2VzcyBvY2N1cnNcbiAgICAgKi9cbiAgICByZW5kZXIgKGRhdGEpIHt9XG5cbn1cblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cblxuLyoqXG4gKiBDb21waWxlZCBUZW1wbGF0ZSByZXByZXNlbnRhdGlvbiBmb3IgamF2YVNjcmlwdC1TdHJpbmdzLlxuICpcbiAqL1xuY2xhc3MgVHBsIGV4dGVuZHMgQ29tcGlsZWRUcGwge1xuXG4gICAgLyoqXG4gICAgICogQHZhciBmblxuICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGludGVybmFsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBjb21waWxlZCB0ZW1wbGF0ZSB3cmFwcGVkIGluIGEgZnVuY3Rpb24uXG4gICAgICogQHBhcmFtIHtBcnJheX0ga2V5cyBhbGxvd2VkIGtleXMgYXMgcGFzc2VkIGZyb20gdGhlIGNvbXBpbGVyXG4gICAgICpcbiAgICAgKiBAdGhyb3dzIGlmIGZuIGlzIG5vdCBhIGZ1bmN0aW9uXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKGZuKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGlmICghaXNGdW5jdGlvbihmbikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlxcXCJmblxcXCIgbXVzdCBiZSBvZiB0eXBlIFxcXCJmdW5jdGlvblxcXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZuID0gZm47XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAaW5oZXJpdGRvY1xuICAgICAqL1xuICAgIHJlbmRlciAoZGF0YSkge1xuICAgICAgICBjb25zdCBtZSA9IHRoaXM7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBtZS5mbi5jYWxsKHt9LCBkYXRhKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGByZW5kZXJpbmcgXCJkYXRhXCIgZmFpbGVkIHdpdGggbWVzc2FnZSAke2UubWVzc2FnZX1gKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbn1cblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG4vKipcbiAqIENvbXBpbGVyIGltcGxlbWVudGF0aW9uIGZvciBKYXZhU2NyaXB0IHRlbXBsYXRlIHN0cmluZ3MuXG4gKlxuICovXG5jbGFzcyBTdHJpbmdDb21waWxlciBleHRlbmRzIENvbXBpbGVyIHtcblxuICAgIC8qKlxuICAgICAqIEludGVybmFsIGNvbXBpbGVyIHJlcHJlc2VudGF0aW9uLlxuICAgICAqIEB2YXIgY3BsXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBpbmhlcml0ZG9jXG4gICAgICovXG4gICAgY29tcGlsZSAodHh0LCBrZXlzKSB7XG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICBtZSA9IHRoaXMsXG4gICAgICAgICAgICB0cGxLZXlzID0gbWUuZ2V0S2V5cyh0eHQpLFxuICAgICAgICAgICAgYXJncyA9IG1lLmJ1aWxkQXJndW1lbnRMaXN0KHRwbEtleXMpLFxuICAgICAgICAgICAgaW52YWxpZEtleXMgPSBtZS5nZXRCbGFja2xpc3RlZEtleXMoYXJncywga2V5cyB8fCBbXSk7XG5cbiAgICAgICAgaWYgKGludmFsaWRLZXlzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgIGBDYW5ub3QgY29tcGlsZSB0ZW1wbGF0ZTogQ29udGFpbnMgaW52YWxpZCBrZXlzOiAke2ludmFsaWRLZXlzLmpvaW4oXCIsIFwiKX1gXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIGZuID0gbWUuZ2V0RnVuY3Rpb25Db25maWcoYXJncywgdHh0KSxcbiAgICAgICAgICAgIGNwbCA9IG1lLmdldE5hdGl2ZUZ1bmN0aW9uKGZuLmFyZ3MsIGZuLmZuKTtcblxuICAgICAgICByZXR1cm4gbmV3IFRwbChjcGwpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIGxpc3Qgb2Yga2V5cyBhbmQgcmV0dXJucyBhbiBhcnJheSBvZiBhcmd1bWVudHMgcmVwcmVzZW50aW5nIHBvc3NpYmxlIGNhbmRpZGF0ZXNcbiAgICAgKiB0byBwYXNzIHRvIHRoZSB0ZW1wbGF0ZSByZW5kZXIgZnVuY3Rpb24uIE1ha2VzIHN1cmUgZW50cmllcyBhcmVcbiAgICAgKiB1bmlxdWUgYW5kIHRoYXQgb2JqZWN0IGNoYWlucyBhcmUgcmVzb2x2ZWQgdG8gdGhlIHJvb3Qgb2JqZWN0LlxuICAgICAqXG4gICAgICogIEBleGFtcGxlXG4gICAgICogIHRoaXMuYnVpbGRBcmd1bWVudExpc3QoW1wiZm9vXCIsIFwiZm9vLmJhclwiLCBcImNvbmZpZ1wiLCBcImNvbmZpZ1tcXFwidGVzdFxcXCJdXSk7IC8vIFwiZm9vLCBjb25maWdcIlxuICAgICAqXG4gICAgICogQHBhcmFtICB7QXJyYXl9IGtleUxpc3RcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBidWlsZEFyZ3VtZW50TGlzdCAoa2V5TGlzdCkge1xuICAgICAgICBsZXQgbGlzdCA9IGtleUxpc3QubWFwKGtleSA9PiBrZXkuc3BsaXQoL1xcLnxcXFsvKVswXSk7XG5cbiAgICAgICAgcmV0dXJuIFsuLi5uZXcgU2V0KGxpc3QpXTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEV4dHJhY3RzIGFsbCB0aGUgcGxhY2Vob2xkZXJzIHdpdGggdGhlaXIgbmFtZXMgb3V0IG9mIHRoZSB0eHQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHh0XG4gICAgICovXG4gICAgZ2V0S2V5cyAodHh0KSB7XG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICByZWdleCA9IC9cXCRcXHsoW159XSspXFx9L2dtLFxuICAgICAgICAgICAga2V5cyA9IFtdO1xuXG4gICAgICAgIGxldCBtO1xuXG4gICAgICAgIHdoaWxlICgobSA9IHJlZ2V4LmV4ZWModHh0KSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgbmVjZXNzYXJ5IHRvIGF2b2lkIGluZmluaXRlIGxvb3BzIHdpdGggemVyby13aWR0aCBtYXRjaGVzXG4gICAgICAgICAgICBpZiAobS5pbmRleCA9PT0gcmVnZXgubGFzdEluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmVnZXgubGFzdEluZGV4Kys7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRoZSByZXN1bHQgY2FuIGJlIGFjY2Vzc2VkIHRocm91Z2ggdGhlIGBtYC12YXJpYWJsZS5cbiAgICAgICAgICAgIG0uZm9yRWFjaCgobWF0Y2gsIGdyb3VwSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXBJbmRleCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBrZXlzLnB1c2gobWF0Y2gpOyAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ga2V5cztcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIENvbXBhcmVzIHRoZSB3aGl0ZWxpc3Qgb2Yga2V5cyB3aXRoIHRoZSBzdWJtaXR0ZWQga2V5cy5cbiAgICAgKiBSZXR1cm5zIGFsbCB2YWx1ZXMgdGhhdCBkbyBub3QgYXBwZWFyIGluIHRoZSB3aGl0ZWxpc3QuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHRoaXMuZ2V0QmxhY2tsaXN0ZWRLZXlzKFxuICAgICAqICAgICAgW1wiZm9vXCIsIFwiYmFyXCIsIFwid2luZG93XCIsIFwidGhpc1wiXSxcbiAgICAgKiAgICAgIFtcInRlc3RcIiwgXCJmb29cIiwgXCJ3aW5kb3dcIl1cbiAgICAgKiAgKTsgLy8gW1widGhpc1wiLCBcImJhclwiXVxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gc291cmNlXG4gICAgICogQHBhcmFtIHtBcnJheX0gd2hpdGVsaXN0IGlmIGxlZnQgZW1wdHksIGFsbCBrZXlzIGFyZSBhbGxvd2VkXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZ2V0QmxhY2tsaXN0ZWRLZXlzIChzb3VyY2UsIHdoaXRlbGlzdCkge1xuICAgICAgICBpZiAoIXdoaXRlbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc291cmNlLmZpbHRlcihlbnRyeSA9PiB3aGl0ZWxpc3QuaW5kZXhPZihlbnRyeSkgPT09IC0xKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gaW50ZXJuYWwgY29uZmlndXJhdGlvbiBvYmplY3QgdGhhdCBnZXRzIHBhc3NlZCB0byBuZXcgRnVuY3Rpb25cbiAgICAgKiB0byBidWlsZCB0aGUgY29tcGlsZWQgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGFuIGVzaXguVHBsIG91dCBvZi5cbiAgICAgKiBBUEkgb25seS4gVGhpcyBtZXRob2Qgc2hvdWxkIGJlIGNhbGxlZCB3aG5ldmVyIHBhcnNpbmcgYW5kIHByZXBhcmluZyB0aGUgdGVtcGxhdGVcbiAgICAgKiB0ZXh0IGNvbXBsZXRlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcmd1bWVudExpc3RcbiAgICAgKiBAcGFyYW0gdHh0XG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldEZ1bmN0aW9uQ29uZmlnIChhcmd1bWVudExpc3QsIHR4dCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYXJncyA6IGB7JHthcmd1bWVudExpc3Quam9pbihcIiwgXCIpfX1gLFxuICAgICAgICAgICAgZm4gOiBgcmV0dXJuIFxcYCR7dHh0fVxcYGBcbiAgICAgICAgfTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZ2V0TmF0aXZlRnVuY3Rpb24gKGFyZ3MsIGJvZHkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGdW5jdGlvbihhcmdzLCBib2R5KTtcbiAgICB9XG4gICAgXG59XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0ZW1wbGF0ZSBpbXBsZW1lbnRhdGlvbnMuXG4gKlxuICovXG5jbGFzcyBUZW1wbGF0ZSB7XG5cbiAgICAvKipcbiAgICAgKiBSZW5kZXJzIHRoaXMgdGVtcGxhdGVzIHR4dCB3aXRoIHRoZSBzcGVjaWZpZWQgZGF0YS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBjb21waWxlZCwgc2FuaXRpemVkIGFuZCBwYXJzZWQgdGVtcGxhdGUgd2l0aCB0aGUgcGxhY2Vob2xkZXJzXG4gICAgICogcmVwbGFjZWQgd2l0aCB0aGUgZGF0YSBmb3VuZCBpbiB0aGUgc3VibWl0dGVkIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEB0aHJvd3MgaWYgYW55IGVycm9yIGR1cmluZyB0aGUgcmVuZGVyaWcgcHJvY2VzcyBvY2N1cnMuXG4gICAgICovXG4gICAgcmVuZGVyIChkYXRhKSB7fVxuXG5cbn1cblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbi8qKlxuICogVGVtcGxhdGUgQ2xhc3MgcHJvdmlkaW5nIHN1cHBvcnQgZm9yIEphdmFTY3JpcHQgdGVtcGxhdGUgc3RyaW5ncy5cbiAqXG4gKi9cbmNsYXNzIFN0cmluZ1RlbXBsYXRlIGV4dGVuZHMgVGVtcGxhdGUge1xuXG5cbiAgICAvKipcbiAgICAgKiBAdmFyIHRwbFxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIE1hcHMgcHJlLWNvbXBpbGVkIHRlbXBsYXRlcyB3aXRoIHRoZSBrZXlzIG9mIHRoZSBkYXRhIG9iamVjdCBwYXNzZWQgdG8gdGhlbSBmb3JcbiAgICAgKiBidWlsZGluZyBhIGNvbXBpbGVyIGNhY2hlLlxuICAgICAqIEB2YXIgY29tcGlsZWRUcGxzXG4gICAgICogQHR5cGUge0FycmF5LjxUcGw+fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG5cblxuICAgIC8qKlxuICAgICAqIEB2YXIgY29tcGlsZXJcbiAgICAgKiBAdHlwZSB7U3RyaW5nQ29tcGlsZXJ9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cblxuXG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0b3IuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHBsIFRoZSB0ZW1wbGF0ZSBzdHJpbmcgdGhpcyB0ZW1wbGF0ZSByZXByZXNlbnRzLlxuICAgICAqXG4gICAgICogQHRocm93cyB7Y29vbi5jb3JlLmV4Y2VwdGlvbi5JbGxlZ2FsQXJndW1lbnRFeGNlcHRpb259IGlmIGNvbXBpbGVyIGlzIG5vXG4gICAgICogaW5zdGFuY2Ugb2Yge2Nvb24uY29yZS50ZW1wbGF0ZS5Db21waWxlcn1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAodHBsKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGNvbnN0IG1lID0gdGhpcztcblxuICAgICAgICBtZS5jb21waWxlciA9IG5ldyBTdHJpbmdDb21waWxlcigpO1xuXG4gICAgICAgIG1lLnRwbCA9IHRwbDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFJlbmRlcnMgdGhpcyB0ZW1wbGF0ZXMgdHh0IHdpdGggdGhlIHNwZWNpZmllZCBkYXRhLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICAgKlxuICAgICAqIEB0aHJvd3MgZXhjZXB0aW9ucyBmcm9tIDxDb21waWxlcj4uY29tcGlsZSgpIGFuZCA8Q29tcGlsZWRUcGw+LnJlbmRlcigpXG4gICAgICovXG4gICAgcmVuZGVyIChkYXRhKSB7XG4gICAgICAgIGNvbnN0IG1lID0gdGhpcztcblxuICAgICAgICBsZXQga2V5cyAgID0gT2JqZWN0LmtleXMoZGF0YSksXG4gICAgICAgICAgICBjcGxLZXkgPSBrZXlzLmpvaW4oXCIuXCIpO1xuXG4gICAgICAgIG1lLmNvbXBpbGVkVHBscyA9IG1lLmNvbXBpbGVkVHBscyB8fCB7fTtcblxuICAgICAgICBpZiAoIW1lLmNvbXBpbGVkVHBsc1tjcGxLZXldKSB7XG4gICAgICAgICAgICBtZS5jb21waWxlZFRwbHNbY3BsS2V5XSA9IG1lLmNvbXBpbGVyLmNvbXBpbGUobWUudHBsLCBrZXlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtZS5jb21waWxlZFRwbHNbY3BsS2V5XS5yZW5kZXIoZGF0YSk7XG4gICAgfVxuXG5cbn1cblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbnZhciBfbDhqcyQyID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICAgIF9fcHJvdG9fXzogbnVsbCxcbiAgICBTdHJpbmdDb21waWxlcjogU3RyaW5nQ29tcGlsZXIsXG4gICAgU3RyaW5nVGVtcGxhdGU6IFN0cmluZ1RlbXBsYXRlLFxuICAgIFRwbDogVHBsXG59KTtcblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbnZhciBfbDhqcyQxID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICAgIF9fcHJvdG9fXzogbnVsbCxcbiAgICBlc2l4OiBfbDhqcyQyLFxuICAgIENvbXBpbGVkVHBsOiBDb21waWxlZFRwbCxcbiAgICBDb21waWxlcjogQ29tcGlsZXIsXG4gICAgVGVtcGxhdGU6IFRlbXBsYXRlXG59KTtcblxuLyoqXHJcbiAqIGw4LmpzXHJcbiAqIGw4XHJcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxyXG4gKlxyXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxyXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxyXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXHJcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXHJcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXHJcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXHJcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG4gKlxyXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxyXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuICpcclxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcclxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXHJcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cclxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXHJcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxyXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXHJcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIFJlc291cmNlUmVxdWVzdG9yLWltcGxlbWVudGF0aW9uIHVzaW5nIFhtbEh0dHBSZXF1ZXN0IGFwaS5cclxuICpcclxuICogQGV4YW1wbGVcclxuICpcclxuICogICAgLy8gZXhpc3RpbmcganNvbi1maWxlIGF0IFwiLi9hcHAtY25fbWFpbC5jb25mLmpzb25cIlxyXG4gKiAgICBjb25zdCBmaWxlTG9hZGVyID0gbmV3IFhtbEh0dHBSZXNvdXJjZVJlcXVlc3RvcigpO1xyXG4gKiAgICBjb25zdCByZXMgPSBhd2FpdCBmaWxlTG9hZGVyLnJlcXVlc3QoXCIuL2FwcC1jbl9tYWlsLmNvbmYuanNvblwiKTtcclxuICogICAgY29uc29sZS5sb2cocmVzKTsgLy8gcGxhaW4gdGV4dCBjb250ZW50cyBvZiB0aGUgZmlsZSBvbiBzdWNjZXNzXHJcbiAqXHJcbiAqL1xyXG5jbGFzcyBGaWxlTG9hZGVyIHtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZW5kcyBhIEhFQUQgcmVxdWVzdCB0byB0aGUgc3BlY2lmaWVkIHJlc291cmNlIGxvY2F0aW9uLlxyXG4gICAgICpcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdXJsXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7UHJvbWlzZTx2b2lkPn0gZmFsc2UgaWYgYW55IGV4Y2VwdGlvbiBvY2N1cmVzIHdoaWxlIHRyeWluZyB0byBhY2Nlc3MgdGhlIHJlc291cmNlLFxyXG4gICAgICogaW5kaWNhdGluZyB0aGF0IHRoZSByZXNvdXJjZSBtaWdodCBub3QgZXhpc3QuXHJcbiAgICAgKlxyXG4gICAgICogQHRocm93cyBpZiB1cmwgd2FzIG5vdCBhIHN0cmluZ1xyXG4gICAgICovXHJcbiAgICBhc3luYyBwaW5nICh1cmwpIHtcclxuXHJcbiAgICAgICAgbGV0IHJlcXVlc3Q7XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIHJlcXVlc3QgPSBhd2FpdCB0aGlzLnJlcXVlc3QodXJsLCBcIkhFQURcIik7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVxdWVzdC5zdGF0dXMgPT09IDIwMDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWF0ZXMgbG9hZGluZyB0aGUgZmlsZSBzcGVjaWZpZWQgd2l0aCB0aGUgZ2l2ZW4gdXJsIGFuZCByZXR1cm5zIGFcclxuICAgICAqIFByb21pc2Ugb3IgYSBtaXhlZCB2YWx1ZSByZXByZXNlbnRpbmcgdGhlIGZpbGUgY29udGVudHMgaWYgdXNlZCB3aXRoIGFzeW5jL2F3YWl0LlxyXG4gICAgICogSW1wbGVtZW50aW5nIEFQSXMgc2hvdWxkIGJlIGF3YXJlIG9mIHBpbmcgdG8gc2VuZCBhIEhFQUQtcmVxdWVzdCB0byB0aGUgcmVzb3VyY2VcclxuICAgICAqIGJlZm9yZSBhbiBhdHRlbXB0IHRvIGxvYWQgaXQgaXMgbWFkZS5cclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogLy8gdGhlbmFibGVcclxuICAgICAqIGxvYWRlci5sb2FkKFwiYXBwLWNuX21haWwuY29uZi5qc29uXCIpLnRoZW4oXHJcbiAgICAgKiAgICAgIChjb25mKSA9PiB7Y29uc29sZS5sb2coY29uZik7fSwgLy8gY29uc29sZS5sb2dzIHRoZSBwbGFpbiB0ZXh0IGZyb20gdGhlIGxvYWRlZCBmaWxlXHJcbiAgICAgKiAgICAgIChleGMpID0+IHtjb25zb2xlLmxvZyhleGMpO30gLy8gY29uc29sZSBsb2dzIHRoZSBleGNlcHRpb24sIGlmIGFueSBvY2N1cmVkLFxyXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdoaWNoIGlzIGEgY29vbi5jb3JlLmRhdGEucmVxdWVzdC5IdHRwUmVxdWVzdEV4Y2VwdGlvblxyXG4gICAgICogKTtcclxuICAgICAqIC8vIG9yXHJcbiAgICAgKiBsZXQgdHh0O1xyXG4gICAgICogdHJ5IHtcclxuICAgICAqICAgIHR4dCA9IGF3YWl0IGxvYWRlci5sb2FkKFwiYXBwLWNuX21haWwuY29uZi5qc29uXCIpO1xyXG4gICAgICogfSBjYXRjaCAoZSkge1xyXG4gICAgICogICAgLy8gZXhjZXB0aW9uIGhhbmRsaW5nIGZvciAgY29vbi5jb3JlLmRhdGEucmVxdWVzdC5IdHRwUmVxdWVzdEV4Y2VwdGlvblxyXG4gICAgICogfVxyXG4gICAgICogY29uc29sZS5sb2codHh0KTsgLy8gZmlsZSBjb250ZW50c1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB1cmwgVGhlIGxvY2F0aW9uIHRvIHJlYWQgdGhlIGZpbGUgZnJvbVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4ge1Byb21pc2U8Kj59XHJcbiAgICAgKlxyXG4gICAgICogQHRocm93cyBpZiBhbnkgZXhjZXB0aW9uIG9jY3VyZWQsIG9yIGlmIHVybCB3YXMgbm90IGEgc3RyaW5nXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGxvYWQgKHVybCkge1xyXG4gICAgICAgIGxldCByZXF1ZXN0ID0gYXdhaXQgdGhpcy5yZXF1ZXN0KHVybCwgXCJHRVRcIik7XHJcbiAgICAgICAgcmV0dXJuIHJlcXVlc3QucmVzcG9uc2VUZXh0O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0gdXJsXHJcbiAgICAgKiBAcGFyYW0gbWV0aG9kXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHJlcXVlc3QgKHVybCwgbWV0aG9kKSB7XHJcblxyXG4gICAgICAgIGlmIChbXCJHRVRcIiwgXCJIRUFEXCJdLmluZGV4T2YobWV0aG9kKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBcIm1ldGhvZFwiICgke21ldGhvZH0pIGlzIG5vdCBzdXBwb3J0ZWRgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghaXNTdHJpbmcodXJsKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJcXFwidXJsXFxcIiBtdXN0IGJlIGEgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgcmVzb3VyY2UgbG9jYXRpb25cIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgcmV0ID0gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHJlcXVlc3Qub3BlbihtZXRob2QsIHVybCk7XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IChwcm9ncmVzc0V2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBodHRwUmVxdWVzdCA9IHByb2dyZXNzRXZlbnQudGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgaWYgKGh0dHBSZXF1ZXN0LnN0YXR1cyA9PT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShodHRwUmVxdWVzdCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0dHBSZXF1ZXN0LnN0YXR1cyArIFwiIFwiICsgaHR0cFJlcXVlc3Quc3RhdHVzVGV4dFxyXG4gICAgICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gKHByb2dyZXNzRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGh0dHBSZXF1ZXN0ID0gcHJvZ3Jlc3NFdmVudC50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICByZWplY3QobmV3IEVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgIGBBbiB1bmV4cGVjdGVkIGVycm9yIG9jY3VyZWQgd2hpbGUgdHJ5aW5nIHRvIGxvYWQgZnJvbSBcIiR7aHR0cFJlcXVlc3QucmVzcG9uc2VVUkx9XCJgXHJcbiAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3Quc2VuZCgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuXHJcbn1cblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbnZhciBfbDhqcyA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgICBfX3Byb3RvX186IG51bGwsXG4gICAgRmlsZUxvYWRlcjogRmlsZUxvYWRlclxufSk7XG5cbmV4cG9ydCB7IGFzc2lnbiwgY2hhaW4sIGNobiwgY3JlYXRlUmFuZ2UsIGZmLCBmaW5kRmlyc3QsIGZsaXAsIGdyb3VwSW5kaWNlcywgaXMsIGlzQXJyYXksIGlzRnVuY3Rpb24sIGlzTm90LCBpc051bWJlciwgaXNPYmplY3QsIGlzUGxhaW5PYmplY3QsIGlzUmVnRXhwLCBpc1N0cmluZywgaXNhLCBpc2YsIGlzbiwgaXNvLCBpc3BvLCBpc3J4LCBpc3MsIGxjaywgbGlxdWlmeSwgbGlzdE5laWdoYm91cnMsIGxvY2ssIG5jaG4sIHB1cmdlLCByZXBsYWNlLCBfbDhqcyBhcyByZXF1ZXN0LCBycGwsIF9sOGpzJDEgYXMgdGVtcGxhdGUsIF9sOGpzJDMgYXMgdGV4dCwgdW5jaGFpbiwgdW5pZnksIHZpc2l0LCB2c3QgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWw4LnBhY2thZ2VzLmVzbS5qcy5tYXBcbiIsIi8qKlxuICogY29vbi5qc1xuICogc2llc3RhLWxpYi1oZWxwZXJcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vY29vbi1qcy9zaWVzdGEtbGliLWhlbHBlclxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbmltcG9ydCAqIGFzIGw4IGZyb20gXCJAbDhqcy9sOFwiO1xuXG5cbi8qKlxuICogVXNlcyB0aGUgc3BlY2lmaWVkIHRlc3RDb25maWcgZm9yIHRlaCBwcmVMb2FkZXItc2VjdGlvbiBhbmQgYXBwbGllcyB0aGUgcmVsYXRlZCBwYXRocyBmb3VuZCBhdFxuICogcGF0aENvbmZpZ1VybCAoY29uZmlnLWZpbGUgdXJsKCkpIHRvIGl0LCB0aGVuIHBhc3NlcyBpdCB0byBnZXRQYXRocygpIGFuZCByZXR1cm5zIHRoZSB2YWx1ZS5cbiAqIGNvbnRlbnQgZm91bmQgYXQgcGF0aENvbmZpZ1VybCBzaG91bGQgYmUgaW4gYSBmb3JtYXQgQGNvb24tanMvZXh0anMtbGluayBwcm9kdWNlcy5cbiAqXG4gKiBAZXhhbXBsZVxuICpcbiAqICBqc29uIGF0IFwicGF0aENvbmZpZ1VybC5qc29uXCI6XG4gKlxuICogIHtcbiAqICAgICAgIGNzczogW3tcbiAqICAgICAgICAgICAgICAgbW9kZXJuOiBbXG4gKiAgICAgICAgICAgICAgICAgICBcImZvby5jc3NcIlxuICogICAgICAgICAgICAgICBdLFxuICogICAgICAgICAgICAgICBjbGFzc2ljOiBbXG4gKiAgICAgICAgICAgICAgICAgICBcImJhci5jc3NcIlxuICogICAgICAgICAgICAgICBdXG4gKlxuICogICAgICAgfV0sXG4gKiAgICAgICBqczoge1xuICogICAgICAgICAgICAgICBtb2Rlcm46IFwibW9kZXJuLmpzXCIsXG4gKiAgICAgICAgICAgICAgIGNsYXNzaWM6IFwiY2xhc3NpYy5qc1wiXG4gKlxuICogICAgICB9XG4gKiAgIH1cbiAqXG4gKlxuICogIGNvbnN0IGNvbmZpZyA9IHtcbiAqICAgICAgbG9hZGVyUGF0aDoge1xuICogICAgICAgXCJFeHQuUGFja2FnZVwiOiBcIi9ub2RlX21vZHVsZXMvQGNvb24tanMvZXh0anMtcGFja2FnZS1sb2FkZXIvcGFja2FnZXMvcGFja2FnZS1sb2FkZXIvc3JjL3NyYy9QYWNrYWdlLmpzXCIsXG4gKiAgICAgICBcImNvb24uY29yZVwiOiBcIi4uL3NyYy9cIixcbiAqICAgfSxcbiAqICAgcHJlbG9hZHM6IHtcbiAqICAgICAgIGNzczogW3tcbiAqICAgICAgICAgICAgICAgbW9kZXJuOiBbXG4gKiAgICAgICAgICAgICAgICAgICBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtbW9kZXJuLXJ1bnRpbWUvbWF0ZXJpYWwvbWF0ZXJpYWwtYWxsXzEuY3NzXCIsXG4gKiAgICAgICAgICAgICAgICAgICBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtbW9kZXJuLXJ1bnRpbWUvbWF0ZXJpYWwvbWF0ZXJpYWwtYWxsXzIuY3NzXCJcbiAqICAgICAgICAgICAgICAgXSxcbiAqICAgICAgICAgICAgICAgY2xhc3NpYzogW1xuICogICAgICAgICAgICAgICAgICAgXCIvbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LWNsYXNzaWMtcnVudGltZS9tYXRlcmlhbC9tYXRlcmlhbC1hbGxfMS5jc3NcIixcbiAqICAgICAgICAgICAgICAgICAgIFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1jbGFzc2ljLXJ1bnRpbWUvbWF0ZXJpYWwvbWF0ZXJpYWwtYWxsXzIuY3NzXCIsXG4gKiAgICAgICAgICAgICAgICAgICBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtY2xhc3NpYy1ydW50aW1lL21hdGVyaWFsL21hdGVyaWFsLWFsbF8zLmNzc1wiXG4gKiAgICAgICAgICAgICAgIF1cbiAqICAgICAgIH1dLFxuICogICAgICAganM6IFtcbiAqICAgICAgICAgICBcIi9ub2RlX21vZHVsZXMvQGw4anMvbDgvZGlzdC9sOC5ydW50aW1lLmpzXCIsIHtcbiAqICAgICAgICAgICAgICAgbW9kZXJuOiBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtbW9kZXJuLXJ1bnRpbWUvbW9kZXJuLmVuZ2luZS5lbnRlcnByaXNlLmpzXCIsXG4gKiAgICAgICAgICAgICAgIGNsYXNzaWM6IFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1tb2Rlcm4tcnVudGltZS9jbGFzc2ljLmVuZ2luZS5lbnRlcnByaXNlLmpzXCJcbiAqICAgICAgICAgICB9XG4gKiAgICAgICBdXG4gKiAgIH19O1xuICpcbiAqICBjb25maWd1cmVXaXRoRXh0SnNMaW5rUGF0aHMoY29uZmlnLCBcInBhdGhDb25maWdVcmwuanNvblwiLCB0cnVlKTsgLy8gcmV0dXJucyB7XG4gKiAgIC8vICAgcHJlbG9hZCA6IFtcbiAqICAgLy8gICAgICAgXCJmb28uY3NzXCIsXG4gKiAgIC8vICAgICAgIFwiL25vZGVfbW9kdWxlcy9AbDhqcy9sOC9kaXN0L2w4LnJ1bnRpbWUuanNcIixcbiAqICAgLy8gICAgICAgXCIvbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LW1vZGVybi1ydW50aW1lL21vZGVybi5lbmdpbmUuZW50ZXJwcmlzZS5qc1wiXG4gKiAgIC8vICAgICAgIFwibW9kZXJuLmpzXCJcbiAqICAgLy8gICBdLFxuICogICAvLyAgIGxvYWRlclBhdGggOiB7XG4gKiAgIC8vICAgICAgIFwiRXh0LlBhY2thZ2VcIjogXCIvbm9kZV9tb2R1bGVzL0Bjb29uLWpzL2V4dGpzLXBhY2thZ2UtbG9hZGVyL3BhY2thZ2VzL3BhY2thZ2UtbG9hZGVyL3NyYy9zcmMvUGFja2FnZS5qc1wiLFxuICogICAvLyAgICAgICBcImNvb24uY29yZVwiOiBcIi4uL3NyYy9cIlxuICogICAvLyAgIH1cbiAqICAvLyB9O1xuICpcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdGVzdENvbmZpZ1xuICogQHBhcmFtIHtTdHJpbmd9IHBhdGhDb25maWdVcmxcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gaXNNb2Rlcm5cbiAqIEByZXR1cm5zIHtQcm9taXNlPHtsb2FkZXJQYXRoOiB7fSwgcHJlbG9hZDogKltdfT59XG4gKi9cbmV4cG9ydCBjb25zdCBjb25maWd1cmVXaXRoRXh0SnNMaW5rUGF0aHMgPSBhc3luYyBmdW5jdGlvbiAodGVzdENvbmZpZywgcGF0aENvbmZpZ1VybCwgaXNNb2Rlcm4pIHtcblxuICAgIGNvbnN0XG4gICAgICAgIGxvYWRlciA9IG5ldyBsOC5yZXF1ZXN0LkZpbGVMb2FkZXIoKTtcblxuICAgIGlmIChhd2FpdCBsb2FkZXIucGluZyhwYXRoQ29uZmlnVXJsKSkge1xuXG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICBleHRqc0xpbmtDb25maWcgPSBKU09OLnBhcnNlKGF3YWl0IGxvYWRlci5sb2FkKHBhdGhDb25maWdVcmwpKSxcbiAgICAgICAgICAgIG1lcmdlZENzcyA9IHt9LCBtZXJnZWRKcyA9IHt9LFxuICAgICAgICAgICAgY29sbGVjdCA9IChzZWN0aW9uLCB0b29sa2l0KSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJlcyA9IFtdO1xuICAgICAgICAgICAgICAgIHNlY3Rpb24uZm9yRWFjaChlbnRyeSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsOC5pc1N0cmluZyhlbnRyeSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKGVudHJ5KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChsOC5pc3BvKGVudHJ5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gcmVzLmNvbmNhdChlbnRyeVt0b29sa2l0XSA/PyBbXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICBbXCJjbGFzc2ljXCIsIFwibW9kZXJuXCJdLmZvckVhY2godG9vbGtpdCA9PiB7XG5cbiAgICAgICAgICAgIGxldCBmZiA9IGw4LmZmLmJpbmQobnVsbCwgdG9vbGtpdCksXG4gICAgICAgICAgICAgICAgY3NzID0gY29sbGVjdChbXS5jb25jYXQobDgubmNobihcInByZWxvYWQuY3NzXCIsIHRlc3RDb25maWcpKSwgdG9vbGtpdCksXG4gICAgICAgICAgICAgICAganMgPSBjb2xsZWN0KFtdLmNvbmNhdChsOC5uY2huKFwicHJlbG9hZC5qc1wiLCB0ZXN0Q29uZmlnKSksIHRvb2xraXQpLFxuICAgICAgICAgICAgICAgIGV4dENzcyA9IGw4Lm5jaG4oXCJjc3NcIiwgZXh0anNMaW5rQ29uZmlnLCBmZiksXG4gICAgICAgICAgICAgICAgZXh0SnMgPSAgbDgubmNobihcImpzXCIsIGV4dGpzTGlua0NvbmZpZywgZmYpO1xuXG5cblxuICAgICAgICAgICAgbDguY2huKHRvb2xraXQsIG1lcmdlZENzcywgW10uY29uY2F0KGNzcywgW10uY29uY2F0KGV4dENzcykpKTtcbiAgICAgICAgICAgIGw4LmNobih0b29sa2l0LCBtZXJnZWRKcywgW10uY29uY2F0KGpzLCBbXS5jb25jYXQoZXh0SnMpKSk7XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgbDguY2huKFwicHJlbG9hZC5jc3NcIiwgdGVzdENvbmZpZywgbWVyZ2VkQ3NzLCB0cnVlKTtcbiAgICAgICAgbDguY2huKFwicHJlbG9hZC5qc1wiLCB0ZXN0Q29uZmlnLCBtZXJnZWRKcywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdldFBhdGhzKHRlc3RDb25maWcsIGlzTW9kZXJuKTtcblxufTtcblxuXG4vKipcbiAqIENvbnN1bWVzIGEgY29uZmlndXJhdGlvbiBvYmplY3QgYW5kIGxvb2tzIHVwIGpzL2Nzcy1yZWxhdGVkIHBhdGggaW5mb3JtYXRpb24sXG4gKiB0aGVuIHJldHVybnMgaXQgcHJlLWNvbmZpZ3VyZWQgdG8gYmUgdXNlZCB3aXRoIFNpZXN0YXMgU2llc3RhLkhhcm5lc3MuQnJvd3Nlci5FeHRKUygpI2NvbmZpZy5cbiAqXG4gKiBAZXhhbXBsZVxuICpcbiAqICBjb25zdCBjb25maWcgPSB7XG4gKiAgICAgIGxvYWRlclBhdGg6IHtcbiAqICAgICAgIFwiRXh0LlBhY2thZ2VcIjogXCIvbm9kZV9tb2R1bGVzL0Bjb29uLWpzL2V4dGpzLXBhY2thZ2UtbG9hZGVyL3BhY2thZ2VzL3BhY2thZ2UtbG9hZGVyL3NyYy9zcmMvUGFja2FnZS5qc1wiLFxuICogICAgICAgXCJjb29uLmNvcmVcIjogXCIuLi9zcmMvXCIsXG4gKiAgIH0sXG4gKiAgIHByZWxvYWRzOiB7XG4gKiAgICAgICBjc3M6IFt7XG4gKiAgICAgICAgICAgICAgIG1vZGVybjogW1xuICogICAgICAgICAgICAgICAgICAgXCIvbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LW1vZGVybi1ydW50aW1lL21hdGVyaWFsL21hdGVyaWFsLWFsbF8xLmNzc1wiLFxuICogICAgICAgICAgICAgICAgICAgXCIvbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LW1vZGVybi1ydW50aW1lL21hdGVyaWFsL21hdGVyaWFsLWFsbF8yLmNzc1wiXG4gKiAgICAgICAgICAgICAgIF0sXG4gKiAgICAgICAgICAgICAgIGNsYXNzaWM6IFtcbiAqICAgICAgICAgICAgICAgICAgIFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1jbGFzc2ljLXJ1bnRpbWUvbWF0ZXJpYWwvbWF0ZXJpYWwtYWxsXzEuY3NzXCIsXG4gKiAgICAgICAgICAgICAgICAgICBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtY2xhc3NpYy1ydW50aW1lL21hdGVyaWFsL21hdGVyaWFsLWFsbF8yLmNzc1wiLFxuICogICAgICAgICAgICAgICAgICAgXCIvbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LWNsYXNzaWMtcnVudGltZS9tYXRlcmlhbC9tYXRlcmlhbC1hbGxfMy5jc3NcIlxuICogICAgICAgICAgICAgICBdXG4gKiAgICAgICB9XSxcbiAqICAgICAgIGpzOiBbXG4gKiAgICAgICAgICAgXCIvbm9kZV9tb2R1bGVzL0BsOGpzL2w4L2Rpc3QvbDgucnVudGltZS5qc1wiLCB7XG4gKiAgICAgICAgICAgICAgIG1vZGVybjogXCIvbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LW1vZGVybi1ydW50aW1lL21vZGVybi5lbmdpbmUuZW50ZXJwcmlzZS5qc1wiLFxuICogICAgICAgICAgICAgICBjbGFzc2ljOiBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtbW9kZXJuLXJ1bnRpbWUvY2xhc3NpYy5lbmdpbmUuZW50ZXJwcmlzZS5qc1wiXG4gKiAgICAgICAgICB9XG4gKiAgICAgICBdXG4gKiAgIH19O1xuICpcbiAqICBnZXRQYXRocyhjb25maWcsIHRydWUpOyAvLyByZXR1cm5zIHtcbiAqICAgLy8gICBwcmVsb2FkIDogW1xuICogICAvLyAgICAgICBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtbW9kZXJuLXJ1bnRpbWUvbWF0ZXJpYWwvbWF0ZXJpYWwtYWxsXzEuY3NzXCIsXG4gKiAgIC8vICAgICAgIFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1tb2Rlcm4tcnVudGltZS9tYXRlcmlhbC9tYXRlcmlhbC1hbGxfMi5jc3NcIixcbiAqICAgLy8gICAgICAgXCIvbm9kZV9tb2R1bGVzL0BsOGpzL2w4L2Rpc3QvbDgucnVudGltZS5qc1wiLFxuICogICAvLyAgICAgICBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtbW9kZXJuLXJ1bnRpbWUvbW9kZXJuLmVuZ2luZS5lbnRlcnByaXNlLmpzXCJcbiAqICAgLy8gICBdLFxuICogICAvLyAgIGxvYWRlclBhdGggOiB7XG4gKiAgIC8vICAgICAgIFwiRXh0LlBhY2thZ2VcIjogXCIvbm9kZV9tb2R1bGVzL0Bjb29uLWpzL2V4dGpzLXBhY2thZ2UtbG9hZGVyL3BhY2thZ2VzL3BhY2thZ2UtbG9hZGVyL3NyYy9zcmMvUGFja2FnZS5qc1wiLFxuICogICAvLyAgICAgICBcImNvb24uY29yZVwiOiBcIi4uL3NyYy9cIlxuICogICAvLyAgIH1cbiAqICAvLyB9O1xuICpcbiAqXG4gKlxuICovXG5leHBvcnQgY29uc3QgZ2V0UGF0aHMgPSAoY29uZmlnLCBpc01vZGVybikgPT4ge1xuXG4gICAgY29uc3RcbiAgICAgICAgcmVzdWx0ID0ge3ByZWxvYWQ6IFtdLCBsb2FkZXJQYXRoOiB7fX0sXG4gICAgICAgIGlzT2JqZWN0ID0gbDguaXNPYmplY3QsXG4gICAgICAgIGlzQXJyYXkgPSBsOC5pc0FycmF5LFxuICAgICAgICBpc1N0cmluZyA9IGw4LmlzU3RyaW5nLFxuICAgICAgICB0b29sa2l0ID0gaXNNb2Rlcm4gPyBcIm1vZGVyblwiIDogaXNNb2Rlcm4gPT09IGZhbHNlID8gXCJjbGFzc2ljXCIgOiBudWxsLFxuICAgICAgICBwYXJzZVNlY3Rpb24gPSAoc2VjdGlvbikgPT4ge1xuXG4gICAgICAgICAgICBzZWN0aW9uID0gW10uY29uY2F0KHNlY3Rpb24pO1xuXG4gICAgICAgICAgICBzZWN0aW9uLmZvckVhY2goKGVudHJ5KSA9PiB7XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNTdHJpbmcoZW50cnkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wcmVsb2FkLnB1c2goZW50cnkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3QoZW50cnkpICYmIHRvb2xraXQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzQXJyYXkoZW50cnlbdG9vbGtpdF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHJlbG9hZCA9IHJlc3VsdC5wcmVsb2FkLmNvbmNhdChlbnRyeVt0b29sa2l0XSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNTdHJpbmcoZW50cnlbdG9vbGtpdF0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQucHJlbG9hZC5wdXNoKGVudHJ5W3Rvb2xraXRdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfTtcblxuICAgIGw4LmFzc2lnbihcbiAgICAgICAgcmVzdWx0LmxvYWRlclBhdGgsXG4gICAgICAgIFtjb25maWcubG9hZGVyUGF0aCB8fCB7fSwgXCJjbGFzc2ljXCIsIFwibW9kZXJuXCJdLFxuICAgICAgICBjb25maWcubG9hZGVyUGF0aCAmJiBjb25maWcubG9hZGVyUGF0aFt0b29sa2l0XSA/IGNvbmZpZy5sb2FkZXJQYXRoW3Rvb2xraXRdIDoge31cbiAgICApO1xuXG4gICAgY29uc3Qge2pzLCBjc3N9ID0gY29uZmlnLnByZWxvYWQgfHwge307XG5cbiAgICBwYXJzZVNlY3Rpb24oY3NzKTtcbiAgICBwYXJzZVNlY3Rpb24oanMpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcblxufTsiLCIvKipcbiAqIGNvb24uanNcbiAqIHNpZXN0YS1saWItaGVscGVyXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2Nvb24tanMvc2llc3RhLWxpYi1oZWxwZXJcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG5pbXBvcnQge2NvbmZpZ3VyZVdpdGhFeHRKc0xpbmtQYXRoc30gZnJvbSBcIi4vaW5kZXguanNcIjtcblxuaWYgKCFjb29uanMuc2llc3RhVGVzdENvbmZpZ09iaiB8fCAhY29vbmpzLnNpZXN0YUdyb3Vwc0NvbmZpZ09iaiB8fCAhIGNvb25qcy5leHRqc0xpbmtDb25maWdVcmwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb25maWcgbWlzc2luZ1wiKTtcbn1cblxuY29uc3RcbiAgICB0ZXN0Q29uZmlnID0gY29vbmpzLnNpZXN0YVRlc3RDb25maWdPYmosXG4gICAgZ3JvdXBzID0gY29vbmpzLnNpZXN0YUdyb3Vwc0NvbmZpZ09iaixcbiAgICBleHRqc0xpbmtDb25maWdVcmwgPSBjb29uanMuZXh0anNMaW5rQ29uZmlnVXJsO1xuXG5sZXQgdG9vbGtpdEdyb3VwcyxcbiAgICBjb25maWd1cmVkVG9vbGtpdEdyb3VwcyxcbiAgICBoYXNUb29sa2l0UmVsYXRlZENvbmZpZyA9IGZhbHNlLFxuICAgIHVybFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoZG9jdW1lbnQubG9jYXRpb24uc2VhcmNoLnN1YnN0cmluZygxKSksXG4gICAgdGltZW91dCA9ICB1cmxQYXJhbXMuZ2V0KFwidGltZW91dFwiKSA/IHBhcnNlSW50KHVybFBhcmFtcy5nZXQoXCJ0aW1lb3V0XCIpKSA6IHRlc3RDb25maWcudGltZW91dCxcbiAgICBmb3JjZWRUb29sa2l0ID0gdXJsUGFyYW1zLmdldChcInRvb2xraXRcIiksXG4gICAgdG9vbGtpdCA9IHVybFBhcmFtcy5nZXQoXCJ0b29sa2l0XCIpID8/IFwiY2xhc3NpY1wiO1xuXG5jb25zdFxuICAgIGJyb3dzZXIgPSBuZXcgU2llc3RhLkhhcm5lc3MuQnJvd3Nlci5FeHRKUygpLFxuICAgIHBhdGhzID0gYXdhaXQgY29uZmlndXJlV2l0aEV4dEpzTGlua1BhdGhzKHRlc3RDb25maWcsIGV4dGpzTGlua0NvbmZpZ1VybCwgdG9vbGtpdCA9PT0gXCJtb2Rlcm5cIik7XG5cbmNvbmZpZ3VyZWRUb29sa2l0R3JvdXBzID0gZ3JvdXBzLmZpbHRlcihlbnRyeSA9PiBbXCJjbGFzc2ljXCIsIFwibW9kZXJuXCJdLmluZGV4T2YoZW50cnkuZ3JvdXApICE9PSAtMSk7XG5oYXNUb29sa2l0UmVsYXRlZENvbmZpZyA9IGNvbmZpZ3VyZWRUb29sa2l0R3JvdXBzLmxlbmd0aCA+IDAsXG4gICAgdG9vbGtpdEdyb3VwcyA9IGdyb3Vwcy5maWx0ZXIoZW50cnkgPT4gW1widW5pdmVyc2FsXCIsIHRvb2xraXRdLmluZGV4T2YoZW50cnkuZ3JvdXApICE9PSAtMSk7XG4vLyB3ZSBuZWVkIHRvIGNoZWNrIGlmIHRoZSBsb2FkZXIgc3BlY2lmaWVzIGRpZmZlcmVudCBjbGFzc2VzIGZvciBtb2Rlcm4vY2xhc3NpYyBoZXJlLCBhcyB0aGUgdGVzdHNcbi8vIG1pZ2h0IGJlIGRlY2xhcmVkIGFzIFwidW5pdmVyc2FsXCIsIGJ1dCB0aGUgdGVzdCBjYXNlcyBsb2FkIGRpZmZlcmVudCBmaWxlcyBmb3IgdGhlIHRvb2xraXRzXG50b29sa2l0ID0gdG9vbGtpdEdyb3Vwcy5sZW5ndGggPyB0b29sa2l0R3JvdXBzWzBdLmdyb3VwIDogXCJ1bml2ZXJzYWxcIjtcbmlmICh0b29sa2l0ID09PSBcInVuaXZlcnNhbFwiICYmICh0ZXN0Q29uZmlnLmxvYWRlclBhdGguY2xhc3NpYyB8fCB0ZXN0Q29uZmlnLmxvYWRlclBhdGgubW9kZXJuKSkge1xuICAgIHRvb2xraXQgPSAgdXJsUGFyYW1zLmdldChcInRvb2xraXRcIikgfHwgKHRlc3RDb25maWcubG9hZGVyUGF0aC5jbGFzc2ljID8gXCJjbGFzc2ljXCIgOiBcIm1vZGVyblwiKTtcbiAgICBmb3JjZWRUb29sa2l0ID0gdG9vbGtpdDtcbn1cblxuXG5icm93c2VyLmNvbmZpZ3VyZShPYmplY3QuYXNzaWduKHtcbiAgICB0aXRsZTogYCR7dGVzdENvbmZpZy5uYW1lfSBbJHt0b29sa2l0fV1gLFxuICAgIGlzRWNtYU1vZHVsZTogdHJ1ZSxcbiAgICBkaXNhYmxlQ2FjaGluZzogdHJ1ZSxcbiAgICBjb25maWcgOiB7XG4gICAgICAgIFRJTUVPVVQgOiB0aW1lb3V0XG4gICAgfVxufSwgcGF0aHMpKTtcblxuYnJvd3Nlci5zdGFydCh0b29sa2l0R3JvdXBzLmxlbmd0aCA/IHRvb2xraXRHcm91cHMgOiBncm91cHMpO1xuXG4vLyBjbGFzc2ljIHwgbW9kZXJuIHwgdGltZW91dCBvcHRpb25zXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNuX3RpbWVvdXRcIikudmFsdWUgPSB0aW1lb3V0O1xuaWYgKFtcImNsYXNzaWNcIiwgXCJtb2Rlcm5cIl0uaW5kZXhPZih0b29sa2l0KSAhPT0gLTEpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgY25fJHt0b29sa2l0fWApLmNoZWNrZWQgPSB0cnVlO1xufSBlbHNlIGlmICghaGFzVG9vbGtpdFJlbGF0ZWRDb25maWcpIHtcbiAgICBbXCJjbGFzc2ljXCIsIFwibW9kZXJuXCJdLmZvckVhY2godG9vbGtpdCA9PiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgY25fJHt0b29sa2l0fWApLmRpc2FibGVkID0gdHJ1ZSk7XG59IGVsc2UgaWYgKGhhc1Rvb2xraXRSZWxhdGVkQ29uZmlnICYmIFtcImNsYXNzaWNcIiwgXCJtb2Rlcm5cIl0uaW5kZXhPZihmb3JjZWRUb29sa2l0KSAhPT0gLTEpIHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgY25fJHtmb3JjZWRUb29sa2l0fWApLmNoZWNrZWQgPSB0cnVlO1xufVxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjbl9jb25maWdCdG5cIikub25jbGljayA9ICgpID0+IHtcbiAgICBsZXQgdGltZW91dCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY25fdGltZW91dFwiKS52YWx1ZSxcbiAgICAgICAgdG9vbGtpdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY25fY2xhc3NpY1wiKS5jaGVja2VkXG4gICAgICAgICAgICA/IFwiY2xhc3NpY1wiXG4gICAgICAgICAgICA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY25fbW9kZXJuXCIpLmNoZWNrZWRcbiAgICAgICAgICAgICAgICA/IFwibW9kZXJuXCJcbiAgICAgICAgICAgICAgICA6IFwiXCI7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBgLi9pbmRleC5leHRqcy1icm93c2VyLmh0bWw/dG9vbGtpdD0ke3Rvb2xraXR9JnRpbWVvdXQ9JHt0aW1lb3V0fWA7XG59OyJdLCJuYW1lcyI6WyJsOC5yZXF1ZXN0IiwibDguaXNTdHJpbmciLCJsOC5pc3BvIiwiZmYiLCJsOC5mZiIsImw4Lm5jaG4iLCJsOC5jaG4iLCJpc09iamVjdCIsImw4LmlzT2JqZWN0IiwiaXNBcnJheSIsImw4LmlzQXJyYXkiLCJpc1N0cmluZyIsImw4LmFzc2lnbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsQ0FBQztBQUN0RCxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUM7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLE9BQU8sTUFBTSxLQUFLLFFBQVEsQ0FBQztBQUN0RCxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUM7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLGFBQWEsR0FBRyxNQUFNLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUTtBQUMxRCx1Q0FBdUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE1B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
