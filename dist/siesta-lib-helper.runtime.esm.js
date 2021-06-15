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

export { configureWithExtJsLinkPaths, getPaths };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2llc3RhLWxpYi1oZWxwZXIucnVudGltZS5lc20uanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9AbDhqcy9sOC9kaXN0L2w4LnBhY2thZ2VzLmVzbS5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuLyoqXG4gKlxuICogQHBhcmFtIHRhcmdldFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuY29uc3QgaXNTdHJpbmcgPSB0YXJnZXQgPT4gdHlwZW9mIHRhcmdldCA9PT0gXCJzdHJpbmdcIjtcbmNvbnN0IGlzcyA9IGlzU3RyaW5nO1xuXG4vKipcbiAqIFxuICogQHBhcmFtIHRhcmdldFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuY29uc3QgaXNPYmplY3QgPSB0YXJnZXQgPT4gdHlwZW9mIHRhcmdldCA9PT0gXCJvYmplY3RcIjtcbmNvbnN0IGlzbyA9IGlzT2JqZWN0O1xuXG5cbi8qKlxuICpcbiAqIEBwYXJhbSB0YXJnZXRcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmNvbnN0IGlzUGxhaW5PYmplY3QgPSB0YXJnZXQgPT4gdHlwZW9mIHRhcmdldCA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRhcmdldCkgPT09IFwiW29iamVjdCBPYmplY3RdXCIgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0O1xuY29uc3QgaXNwbyA9IGlzUGxhaW5PYmplY3Q7XG5cblxuLyoqXG4gKiBcbiAqIEBwYXJhbSB0YXJnZXRcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmNvbnN0IGlzRnVuY3Rpb24gPSB0YXJnZXQgPT4gdHlwZW9mIHRhcmdldCA9PT0gXCJmdW5jdGlvblwiO1xuY29uc3QgaXNmID0gaXNGdW5jdGlvbjtcblxuLyoqXG4gKlxuICogQHBhcmFtIHRhcmdldFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuY29uc3QgaXNOdW1iZXIgPSB0YXJnZXQgPT4gdHlwZW9mIHRhcmdldCA9PT0gXCJudW1iZXJcIjtcbmNvbnN0IGlzbiA9IGlzTnVtYmVyO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0gdGFyZ2V0XG4gKiBAcmV0dXJuIHthbnl9XG4gKi9cbmNvbnN0IGlzQXJyYXkgPSB0YXJnZXQgPT4gIEFycmF5LmlzQXJyYXkgPyBBcnJheS5pc0FycmF5KHRhcmdldCkgOiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGFyZ2V0KSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiO1xuY29uc3QgaXNhID0gaXNBcnJheTtcblxuLyoqXG4gKlxuICogQHBhcmFtIHRhcmdldFxuICogQHJldHVybiB7YW55fVxuICovXG5jb25zdCBpc1JlZ0V4cCA9IHRhcmdldCA9PiB0YXJnZXQgaW5zdGFuY2VvZiBSZWdFeHA7XG5jb25zdCBpc3J4ID0gaXNSZWdFeHA7XG5cbi8qKlxuICogXG4gKiBAcGFyYW0gdGFyZ2V0XG4gKiBAcmV0dXJuIHt7YTogKGZ1bmN0aW9uKCopOiBib29sZWFuKSwgb2Y6IChmdW5jdGlvbigqKTogYm9vbGVhbil9fVxuICovXG5jb25zdCBpcyA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICByZXR1cm4gIHtcbiAgICAgICAgYTogdHlwZSA9PiB0eXBlb2YgdGFyZ2V0ID09PSB0eXBlLFxuICAgICAgICBvZjogY2xzID0+IGlzRnVuY3Rpb24oY2xzKSA/IHRhcmdldCBpbnN0YW5jZW9mIGNscyA6IGZhbHNlXG4gICAgfTtcbn07XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4vKipcbiAqIFByb3h5IGZvciBvYmplY3RzIHRvIGNyZWF0ZSBmbHVlbnQgaW50ZXJmYWNlcyBvdXQgb2YgYXN5bmMgbWV0aG9kcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogICBjb25zdCBzb3VyY2UgPSB7XG4gKiAgICAgZm9vIDogYXN5bmMgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSxcbiAqICAgICBiYXIgOiBhc3luYyBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LFxuICogICAgIHNuYWZ1IDogYXN5bmMgZnVuY3Rpb24gKCkgeyByZXR1cm4gXCJzbmFmdVwiOyB9XG4gKiAgIH07XG4gKlxuICogICBjb25zb2xlLmxvZyhcbiAqICAgICAgIC8vIGluc3RlYWQgb2ZcbiAqICAgICAgIGF3YWl0IHNvdXJjZS5mb28oKVxuICogICAgICAgICAgICAgLnRoZW4odmFsdWUgPT4gc291cmNlLmJhcigpKVxuICogICAgICAgICAgICAgLnRoZW4odmFsdWUgPT4gc291cmNlLnNuYWZ1KCkpXG4gKiAgICk7IC8vIFwic25hZnVcbiAqICAgLy8gLi4ueW91IGNhbiB3cml0ZSBpdC4uLlxuICogICBjb25zb2xlLmxvZyhcbiAqICAgICAgLy8gLi4uIGxpa2UgdGhpczpcbiAqICAgICAgYXdhaXQgbGlxdWlmeShzb3VyY2UpLmZvbygpXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIC5iYXIoKVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAuc25hZnUoKVxuICogICApOyAvLyBzbmFmdVxuICpcbiAqIFByZXJlcXVpc2l0ZXM6XG4gKiA9PT09PT09PT09PT09PVxuICogLSB5b3VyIGFzeW5jIG1ldGhvZHMgaGF2ZSB0byByZXR1cm4gXCJ0aGlzXCIsIGkuZS4gdGhlIHNvdXJjZSBvYmplY3Qgb2ZcbiAqICAgdGhlIGFzeW5jIG1ldGhvZCwgc2luY2UgdGhlIG9uRnVsbGZpbGxlZCBtZXRob2RzIG5lZWQgdG8gZm9yd2FyZFxuICogICB0aGlzIGV4YWN0IHNhbWUgb2JqZWN0LlxuICpcbiAqICAgQGV4YW1wbGVcbiAqICAgY29uc3Qgc291cmNlID0ge1xuICogICAgIGZvbyA6IGFzeW5jIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sXG4gKiAgICAgYmFyIDogYXN5bmMgZnVuY3Rpb24gKCkgeyByZXR1cm4gXCJzb21lcmFuZG9tc3RyaW5nXCI7IH0sXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF5eXl5eXl5eXl5eXl5eXl5eXlxuICogICAgIHNuYWZ1IDogYXN5bmMgZnVuY3Rpb24gKCkgeyByZXR1cm4gXCJzbmFmdVwiOyB9XG4gKiAgIH07XG4gKiAgYXdhaXQgbGlxdWlmeShzb3VyY2UpLmZvbygpLmJhcigpLnNuYWZ1KCkgLy8gd2lsbCB0aHJvdyBhbiBlcnJvciBzaW5jZSBcInNuYWZ1XCJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYW5ub3QgYmUgbG9va2VkIHVwIGFueW1vcmVcbiAqXG4gKlxuICogVGhlb3J5OlxuICogPT09PT09PVxuICogICAtIGxpcXVpZnkoc291cmNlKS5mb28oKS5iYXIoKVxuICogIDEuIGxpcXVpZnkoc291cmNlKVxuICogICAgICBUaGlzIGNhbGwgd2lsbCBjcmVhdGUgYSBQcm94eSB0aGF0IHRyYXBzIGZ1cnRoZXIgY2FsbHMgLyBsb29rdXBzIG9uIHRoaXMgZXhhY3Qgc2FtZVxuICogICAgICBvYmplY3QuXG4gKlxuICogIDIuIGxpcXVpZnkoc291cmNlKS5mb29cbiAqICAgICBJcyB0cmFwcGVkIGJ5IHRoZSBoYW5kbGVyJ3MgZ2V0IG1ldGhvZC4gUmV0dXJucyBhIHByb3hpZXMsIGJvdW5kKCEpIGZ1bmN0aW9uOlxuICogICAgIHRhcmdldDogc291cmNlXG4gKiAgICAgcHJvcGVydHk6IGZvb1xuICogICAgID0+IHJldHVybnM6IGxpcXVpZnkodGFyZ2V0W3Byb3BlcnR5XS5iaW5kKHRhcmdldCkpXG4gKlxuICogIDMuIGxpcXVpZnkoc291cmNlKS5mb28oKVxuICogICAgIEEgcHJldmlvdXMgY2FsbCB0byBcImxpcXVpZnkoc291cmNlKS5mb29cIiByZXR1cm5lZCBhIGJvdW5kIGZ1bmN0aW9uIHRoYXQgd2FzIGFnYWluIHByb3hpZWRcbiAqICAgICBpbiBzdGVwIDIuIEF0IHRoaXMgcG9pbnQsIHRoZSBtZXRob2QgY2FsbCBvcmlnaW5hdGluZyBmcm9tIFwiZm9vKClcIiBpcyBub3cgdHJhcHBlZCBpbiB0aGVcbiAqICAgICBQcm94eSdzIFwiYXBwbHkoKVwiIGhhbmRsZXIuXG4gKiAgICAgVGhlIHJldHVybmVkIFByb21pc2UgaXMgcHJveGllZCBhZ2Fpbi5cbiAqICAgICA9PiByZXR1cm5zOiBsaXF1aWZ5KHRhcmdldC5hcHBseSh0aGlzQXJnLCBhcmd1bWVudHNMaXN0KVxuICpcbiAqICA0LiBsaXF1aWZ5KHNvdXJjZSkuZm9vKCkuYmFyXG4gKiAgICAgU3RlcCAzLiByZXR1cm5lZCBhIHByb21pc2UsIHNvIFwiYmFyXCIgYXMgYSBwcm9wZXJ0eSBpcyBub3cgaW5pdGlhbGx5IGxvb2tlZCB1cCBvbiB0aGUgUHJvbWlzZS5cbiAqICAgICBUaGUgcHJvYmxlbSBpcywgb2YgY291cnNlLCB0aGF0IHRoZSBQcm9taXNlIGRvZXMgbm90IGhhdmUgYSBwcm9wZXJ0eSBjYWxsZWQgXCJiYXJcIi4gV2Ugbm93XG4gKiAgICAgaGF2ZSB0byB0YWtlIGNhcmUgb2YgcGlwaW5nIHRoZSBzb3VyY2Ugb2JqZWN0IHRocm91Z2ggc28gdGhlIGZvbGxvd2luZyBtZXRob2QgY2FsbCBjYW5cbiAqICAgICBwcm9wZXJseSByZXNvbHZlIHRvIFwic291cmNlLmJhcigpXCIuXG4gKiAgICAgV2UgZG8gdGhpcyBieSBpbXBsZW1lbnRpbmcgdGhlIGZ1bGxmaWxsZWQtbWV0aG9kLiBUaGUgZ2V0LWhhbmRsZXIgd2lsbCBjaGVja1xuICogICAgIGlmIHRoZSB0YXJnZXQgb3ducyBhIFwidGhlblwiLW1ldGhvZCBhbmQgcmV0dXJuIHRoZSBmb2xsb3dpbmc6XG4gKiAgICAgbGlxdWlmeSh0YXJnZXQudGhlbih2YWx1ZSA9PiB2YWx1ZVtwcm9wZXJ0eV0uYmluZCh2YWx1ZSkpKTtcbiAqICAgICBeXiAxKiBeXiAgICAgXl4gMiogXl4gICAgXl5eXl5eXl5eIDMqIF5eXl5eXl5eXl5cbiAqICAgICAxKiB0aGlzIGlzIHRoZSBQcm9taXNlIHRoYXQgd2FzIHByb3hpZWQgaW4gc3RlcCAzXG4gKiAgICAgMiogdmFsdWUgaXMgdGhlIHJldHVybi12YWx1ZSBvZiB0aGUgb3JpZ2luYWwgYXN5bmMgbWV0aG9kIGltcGxlbWVudGF0aW9uXG4gKiAgICAgICAgb2Ygc291cmNlLmZvbygpXG4gKiAgICAgMyogXCJwcm9wZXJ0eVwiIGlzIGtub3duIHRvIHRoZSBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgXCJmdWxsZmlsbGVkXCItbWV0aG9kIHdoZW4gaXRcbiAqICAgICAgICAgZ2V0cyBjYWxsZWQgKHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L0d1aWRlL0Z1bmN0aW9ucykuXG4gKiAgICAgICAgVGhlIHJldHVybiB2YWx1ZSBvZiB0aGlzIGZ1bGxmaWxsZWQtbWV0aG9kIGlzIHRoZSBtZXRob2QgXCJiYXJcIiwgYm91bmQgdG8gXCJzb3VyY2VcIiwgaXQncyBvcmlnaW4uXG4gKlxuICogICA1LiBsaXF1aWZ5KHNvdXJjZSkuZm9vKCkuYmFyKClcbiAqICAgICAgYmFyKCkgaXMgbm93IGNhbGxlZC4gVGhlIGFwcGx5LWhhbmRsZXIgbm93IGV4cGVjdHMgYSBjYWxsYWJsZSBtZXRob2QuIFNpbmNlIHdlIGhhdmUgcmV0dXJuZWQgYSBQcm9taXNlXG4gKiAgICAgIGluIHN0ZXAgNCwgYW5kIGEgUHJvbWlzZSBpcyBub3QgYSBjYWxsYWJsZSBtZXRob2QsIHRoZSBpbnRlcm5hbHMgb2YgbGlxdWlmeSgpIHNob3cgdGhlaXIgYWR2YW50YWdlOlxuICogICAgICBXZSBhcmUgbm90IGRpcmVjdGx5IHdyYXBwaW5nIHRoZSBhcmd1bWVudCBwYXNzZWQgdG8gbGlxdWlmeSB3aXRoIHRoZSBQcm94eSwgYnV0IHJhdGhlciBjcmVhdGUgYSBjYWxsYWJsZVxuICogICAgICBtZXRob2QgdGhhdCBpcyB0aGVuIGNhbGxlZC4gV2UgXCJ0YWdcIiB0aGlzIG1ldGhvZCB3aXRoIGEgX19saXF1aWRfXyBwcm9wZXJ0eSB0aGF0IGhlbHBzIHRoZSBoYW5kbGVyXG4gKiAgICAgIHRvIGlkZW50aWZ5IGEgcHJveGllZCwgY2FsbGFibGUgbWV0aG9kLiBUaGUgaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gbG9va3MgbGlrZSB0aGlzOlxuICogICAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgpXG4gKiAgICAgICAgICBsaXF1aWZ5KHByb21pc2UpO1xuICogICAgICAgICAgZnVuY3Rpb24gbGlxdWlmeSh0YXJnZXQpIHtcbiAqICAgICAgICAgICAgICBsZXQgY2IgPSBmdW5jdGlvbiAoKSB7XG4gKiAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gKiAgICAgICAgICAgICAgfTtcbiAqICAgICAgICAgICAgICBjYi5fX2xpcXVpZF9fID0gdHJ1ZTtcbiAqICAgICAgICAgIH1cbiAqICAgICAgICAgIHJldHVybiBuZXcgUHJveHkoY2IsIGhhbmRsZXIpO1xuICogICAgICBXaGF0IGhhcHBlbnMgbm93IHRoYXQgdGhpcyBleGFjdCBjYWxsYWJsZSBpcyBwcm9jZXNzZWQgYnkgdGhlIGFwcGx5LWhhbmRsZXI6XG4gKiAgICAgICA9PiBiYXIoKSAtLSBjYWxscyAtLT4gY2IoKSAtLSByZXR1cm5zIC0tPiBwcm9taXNlXG4gKiAgICAgIC4uIGFuZCB0aGUgYXBwbHkgaGFuZGxlciBjaGVja3MgaWYgdGhlIHZhbHVlIGlzIGEgcHJvbWlzZSBhbmQgbWFrZXMgc3VyZSB0aGUgZnVsbGZpbGxlZC1tZXRob2RcbiAqICAgICAgaXMgaW1wbGVtZW50ZWQsIGFuZCByZXR1cm5zIHRoZSByZXN1bHRpbmcgUHJvbWlzZSAtIGFnYWluIC0gcHJveGllZC5cbiAqICAgICAgbGlxdWlmeShwcm9taXNlLnRoZW4odmFsdWUgPT4gUmVmbGVjdC5hcHBseSh2YWx1ZSwgdGhpc0FyZywgYXJndW1lbnRzTGlzdCkpKTtcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICBeXiAxKiBeXiAgXl5eXl5eXl5eXl5eXl5eXl5eXl5eIDIqIF5eXl5eXl5eXl5eXl5eXl5eXl5eXl5cbiAqICAgICAgMSogVGhpcyBpcyB0aGUgYm91bmQgbWV0aG9kIHRoYXQgd2FzIHJldHVybmVkIGluIHRoZSBmdWxsZmlsbGVkLW1ldGhvZCBpbXBsZW1lbnRlZCBpbiBzdGVwIDQuXG4gKiAgICAgIDIqIFRoaXMgaXMgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZnVsbGZpbGxlZC1tZXRob2RzLCB3aGljaCwgaW4gdGhpcyBjYXNlLCBpcyB0aGUgY2FsbCB0b1xuICogICAgICAgICBzb3VyY2UuYmFyKClcbiAqICAgICAgSXQgaXMgaW1wb3J0YW50IHRvIHVzZSBcImFyZ3VtZW50c0xpc3RcIiBoZXJlIHNpbmNlIHRoaXMgd2lsbCBob2xkIHJlZmVyZW5jZXMgdG8gdGhlIHJlc29sdmUvcmVqZWN0LW1ldGhvZHNcbiAqICAgICAgZm9yIHRoZSBsYXN0IGNhbGwgaW4gdGhlIGNoYWluLlxuICogICAgNi4gdGhlbigpXG4gKiAgICAgICBUaGUgbGFzdCBjYWxsIGluIHRoZSBjaGFpbiBpcyBhIGltcGxpY2l0IGNhbGwgdG8gXCJ0aGVuKClcIiB0cmlnZ2VyZWQgYnkgdGhlIFByb21pc2UtaW5zdGFuY2UgdGhhdCB3YXNcbiAqICAgICAgIHByb3hpZWQgaW4gc3RlcCA1LiBTaW5jZSBubyBtb3JlIGN1c3RvbSBwcm9wZXJ0aWVzIGhhdmUgdG8gYmUgbG9va2VkIHVwIHNpbmNlIHRoZSBjaGFpbiBlbmRzIGF0IHRoaXMgcG9pbnQsXG4gKiAgICAgICB0aGUgUHJvbWlzZSBmb3J3YXJkcyBpdHMgcHJvY2Vzc2luZyB0byAgdGhlIGZ1bGZpbGxtZW50IGJ5IGNhbGxpbmcgdGhlbigpLiBUaGUgXCJ0aGVuXCIgaXMgYSBwcm9wZXJ0eSBvbiBhXG4gKiAgICAgICBwcm94aWVkIFByb21pc2UsIHNvIHRoZSBoYW5kbGVyIGNhbiB0cmFwIGl0IGFuZCBzaW1wbHkgYmluZHMgdGhlIG1ldGhvZCB0byB0aGUgcHJvbWlzZS4gVGhlIHJlc3VsdGluZyB2YWx1ZVxuICogICAgICAgb3V0IG9mIFwiYXN5bmMgYmFyKClcIiBpcyByZXR1cm5lZCwgdGhlIGNoYWluIGVuZHMgaGVyZS5cbiAqXG4gKi9cblxuXG4vKipcbiAqIFRoZSBoYW5kbGVyIHVzZWQgYnkgdGhlIGxpcXVpZnktUHJveHkuXG4gKlxuICogQHR5cGUge3thcHBseSgqLCAqLCAqKSwgZ2V0KCosICosICopfX1cbiAqL1xuY29uc3QgaGFuZGxlciA9IHtcblxuXG4gICAgLyoqXG4gICAgICogVGhlIGhhbmRsZXIuYXBwbHkoKSBtZXRob2QgaXMgYSB0cmFwIGZvciBhIGZ1bmN0aW9uIGNhbGwuXG4gICAgICogdGhpcyBpcyBib3VuZCB0byB0aGUgaGFuZGxlci5cbiAgICAgKiBXaWxsIGNoZWNrIGlmIHRoZSB0YXJnZXQgaXMgYSBQcm9taXNlIGFuZCBQcm94eSB0aGUgcmV0dXJuLXZhbHVlIG9mIGEgY2FsbCB0byBpdCdzIFwidGhlblwiLW1ldGhvZCxcbiAgICAgKiBieSBtYWtpbmcgc3VyZSB0aGF0IHRoZSByZXNvbHZlciBpcyBwcm9wZXJseSBjYWxsZWQuXG4gICAgICogT3RoZXJ3aXNlLCB0aGlzIGhhbmRsZXIgYXNzdW1lcyB0aGF0IHRhcmdldCBpcyBhbHJlYWR5IGEgYm91bmQtbWV0aG9kLiBJbiBhbnkgY2FzZSBpdCBpcyBtYWRlIHN1cmVcbiAgICAgKiB0aGF0IHRoZSBhcmd1bWVudHMgYXJlIHByb3Blcmx5IHBhc3NlZCB0byB0aGUgbWV0aG9kcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7PCo+fSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3QuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmcgVGhlIHRoaXMgYXJndW1lbnQgZm9yIHRoZSBjYWxsLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFyZ3VtZW50c0xpc3QgVGhlIGxpc3Qgb2YgYXJndW1lbnRzIGZvciB0aGUgY2FsbC5cbiAgICAgKi9cbiAgICBhcHBseSAodGFyZ2V0LCB0aGlzQXJnLCBhcmd1bWVudHNMaXN0KSB7XG5cbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0Ll9fbGlxdWlkX18gPyB0YXJnZXQoKSA6IHRhcmdldDtcblxuICAgICAgICBpZiAoaXNGdW5jdGlvbih0YXJnZXQudGhlbikpIHtcbiAgICAgICAgICAgIHJldHVybiBsaXF1aWZ5KHRhcmdldC50aGVuKCh2YWx1ZSkgPT4gIFJlZmxlY3QuYXBwbHkodmFsdWUsIHRoaXNBcmcsIGFyZ3VtZW50c0xpc3QpKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0aGlzIHNob3VsZCBhbHJlYWR5IGJlIGEgYm91bmQgZnVuY3Rpb25cbiAgICAgICAgLy8gaWYgdGhlIHRhcmdldCBpcyBhIGJvdW5kIHRoZW4gbWV0aG9kLCB0aGUgYXJndW1lbnRzTGlzdCB3aWxsIGhvbGRcbiAgICAgICAgLy8gdGhlIHJlc29sdmUoKS9yZWplY3QoKSBtZXRob2QuXG4gICAgICAgIHJldHVybiBsaXF1aWZ5KHRhcmdldC5hcHBseSh0aGlzQXJnLCBhcmd1bWVudHNMaXN0KSk7XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICogVGhlIGhhbmRsZXIuZ2V0KCkgbWV0aG9kIGlzIGEgdHJhcCBmb3IgZ2V0dGluZyBhIHByb3BlcnR5IHZhbHVlLlxuICAgICAqIFwidGhpc1wiIGlzIGJvdW5kIHRvIHRoZSBoYW5kbGVyLlxuICAgICAqIFJlY2VpdmVzIHRoZSBwcm9wZXJ0eSBvZiB0aGUgcHJveGllcyB0YXJnZXQuXG4gICAgICogV2lsbCBwcm94eSB0aGUgcmV0dXJuZWQgUHJvbWlzZSBvZiB0aGUgdGFyZ2V0J3MgXCJ0aGVuKClcIi1tZXRob2QgaWYgYSBQcm9taXNlIGlzXG4gICAgICogcmVwcmVzZW50ZWQgYnkgdGFyZ2V0LlxuICAgICAqIE90aGVyd2lzZSwgYSBQcm94eSBmb3IgdGhlIGZ1bmN0aW9uIGlzIGNyZWF0ZWQsIHdoaWNoIGlzIGJvdW5kKCEpIHRvIHRoZSB0YXJnZXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gezwqPn0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eSBUaGUgbmFtZSBvciBTeW1ib2wgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAgICAgKiBAcGFyYW0ge1Byb3h5fSByZWNlaXZlciBFaXRoZXIgdGhlIHByb3h5IG9yIGFuIG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gdGhlIHByb3h5LlxuICAgICAqL1xuICAgIGdldCAodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHtcblxuICAgICAgICB0YXJnZXQgPSB0YXJnZXQuX19saXF1aWRfXyA/IHRhcmdldCgpIDogdGFyZ2V0O1xuXG4gICAgICAgIGlmIChwcm9wZXJ0eSAhPT0gXCJ0aGVuXCIgJiYgaXNGdW5jdGlvbih0YXJnZXQudGhlbikpIHtcbiAgICAgICAgICAgIHJldHVybiBsaXF1aWZ5KHRhcmdldC50aGVuKHZhbHVlID0+IHZhbHVlW3Byb3BlcnR5XS5iaW5kKHZhbHVlKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc0Z1bmN0aW9uKHRhcmdldFtwcm9wZXJ0eV0pKSB7XG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BlcnR5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaXF1aWZ5KHRhcmdldFtwcm9wZXJ0eV0uYmluZCh0YXJnZXQpKTtcbiAgICB9XG5cbn07XG5cblxuLyoqXG4gKiBDcmVhdGVzIGEgUHJveHkgZm9yIHRoZSBzcGVjaWZpZWQgdGFyZ2V0LCBpZiB0aGUgdGFyZ2V0IGlzIGFuIG9iamVjdCBvciBhIGZ1bmN0aW9uLFxuICogYW5kIHJldHVybnMgaXQuIE90aGVyd2lzZSwgdGhlIHRhcmdldCB3aWxsIGJlIHJldHVybmVkLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fSB0YXJnZXRcbiAqIEByZXR1cm4geyp9XG4gKlxuICogQHNlZSBoYW5kbGVyXG4gKi9cbmNvbnN0IGxpcXVpZnkgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG5cbiAgICBpZiAoaXNPYmplY3QodGFyZ2V0KSkge1xuICAgICAgICBjb25zdCB3cmFwcGVkID0gKCkgPT4gdGFyZ2V0O1xuICAgICAgICB3cmFwcGVkLl9fbGlxdWlkX18gPSB0cnVlO1xuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHdyYXBwZWQsIGhhbmRsZXIpO1xuICAgIH1cblxuICAgIHJldHVybiBpc0Z1bmN0aW9uKHRhcmdldCkgPyBuZXcgUHJveHkodGFyZ2V0LCBoYW5kbGVyKSA6IHRhcmdldDtcbn07XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4vKipcbiAqIEV4cGVjdHMgYSBudW1lcmljIGFycmF5IGFuZCByZXR1cm5zIGFuIGFycmF5IHdoZXJlIHRoZSBlbnRyaWVzIGFyZSBzdWJzZXF1ZW50XG4gKiBuZWlnaGJvdXJzIG9mIHRhcmdldCwgc29ydGVkIGZyb20gbG93ZXN0IHRvIGhpZ2hlc3QsIHVuaXF1ZSB2YWx1ZXMuXG4gKiBUaGUgbWV0aG9kIHdpbGwgdHJ5IHRvIHBhcnNlIHRoZSB2YWx1ZXMgdG8gbnVtZXJpYyBpbnRlZ2VyIHZhbHVlc1xuICpcbiAqICAgICAgQGV4YW1wbGVcbiAqICAgICAgdmFyIGxpc3QgICA9IFsnNCcsIDUsICcxJywgJzMnLCA2LCAnOCddO1xuICogICAgICB2YXIgdGFyZ2V0ID0gNTtcbiAqXG4gKiAgICAgIGxpc3ROZWlnaGJvdXJzKGxpc3QsIHRhcmdldCk7IC8vIFszLCA0LCA1LCA2XVxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3Qgb2YgdmFsdWVzIHRvIHJldHVybiB0aGUgbmVpZ2hib3VycyBmcm9tXG4gKiBAcGFyYW0ge051bWJlcn0gdGFyZ2V0IFRoZSBpbml0aWFsIHZhbHVlIHRvIGxvb2sgdXAgaXRzIG5laWdoYm91cnMgZm9yXG4gKlxuICogQHJldHVybiB7QXJyYXl9IFRoZSBvcmRlcmVkLCB1bmlxdWUgbGlzdCBvZiBuZWlnaGJvdXJzIGZvciB0YXJnZXRcbiAqL1xuY29uc3QgbGlzdE5laWdoYm91cnMgPSBmdW5jdGlvbiAobGlzdCwgdGFyZ2V0KSB7XG5cbiAgICB2YXIgcGFnZXMgPSBbXSxcbiAgICAgICAgcmFuZ2UgPSBbXSxcbiAgICAgICAgcGluZCwgaSwgbGVuO1xuXG4gICAgLy8gcGFyc2UsIGZpbHRlciwgc29ydFxuICAgIHBhZ2VzID0gbGlzdC5tYXAoZnVuY3Rpb24gKHYpe3JldHVybiBwYXJzZUludCh2LCAxMCk7fSk7XG4gICAgcGFnZXMgPSBwYWdlcy5maWx0ZXIoZnVuY3Rpb24gKHZhbHVlLCBpbmRleCwgc2VsZikge1xuICAgICAgICByZXR1cm4gc2VsZi5pbmRleE9mKHZhbHVlLCAwKSA9PT0gaW5kZXg7XG4gICAgfSk7XG4gICAgcGFnZXMuc29ydChmdW5jdGlvbiAoYSwgYil7cmV0dXJuIGEtYjt9KTtcblxuXG4gICAgcGluZCA9IHBhZ2VzLmluZGV4T2YocGFyc2VJbnQodGFyZ2V0LCAxMCkpO1xuXG4gICAgLy8gZmlsbCBsZWZ0XG4gICAgZm9yIChpID0gcGluZCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGlmIChwYWdlc1tpXSA9PT0gcGFnZXNbaSArIDFdIC0gMSkge1xuICAgICAgICAgICAgcmFuZ2UudW5zaGlmdChwYWdlc1tpXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGZpbGwgY2VudGVyXG4gICAgcmFuZ2UucHVzaChwYWdlc1twaW5kXSk7XG5cbiAgICAvLyBmaWxsIHJpZ2h0XG4gICAgZm9yIChpID0gcGluZCArIDEsIGxlbiA9IHBhZ2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChwYWdlc1tpXSA9PT0gcGFnZXNbaSAtIDFdICsgMSkge1xuICAgICAgICAgICAgcmFuZ2UucHVzaChwYWdlc1tpXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmFuZ2U7XG5cbn07XG5cblxuLyoqXG4gKiBFeHBlY3RzIGEgbnVtZXJpYyBhcnJheSBhbmQgcmV0dXJucyBhbiBhcnJheSB3aGVyZSB0aGUgZW50cmllcyBhcmUgaXRzZWxmXG4gKiBhcnJheXMgcmVwcmVzZW50aW5nIHBvc3NpYmxlIGdyb3VwcyBvZiBzdWJzZXF1ZW50IGluZGljZXMsIG9yZGVyZWQgZnJvbVxuICogbG93ZXN0IHRvIGhpZ2hlc3QuIER1cGxpY2F0ZSBpdGVtcyB3aWxsIGJlIHJlbW92ZWQuXG4gKlxuICogICAgICB2YXIgbGlzdCAgID0gWyc0JywgNSwgJzEnLCAnMycsIDYsICc4J107XG4gKiAgICAgIGdyb3VwSW5kaWNlcyhsaXN0KTsgLy8gW1sxXSwgWzMsIDQsIDVdLCBbNl1dXG4gKlxuICogICAgICB2YXIgbGlzdCAgID0gWycxJywgMiwgJzMnXTtcbiAqICAgICAgZ3JvdXBJbmRpY2VzKGxpc3QpOyAvLyBbWzEsIDIsIDNdXVxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3Qgb2YgdmFsdWVzIHRvIHJldHVybiB0aGUgZ3JvdXBlZCBpbmRpY2VzIGZyb21cbiAqXG4gKiBAcmV0dXJuIHtBcnJheX0gVGhlIG9yZGVyZWQsIGdyb3VwZWQgbGlzdCBvZiBpbmRpY2VzXG4gKlxuICogQHRocm93cyBpZiBsaXN0IGlzIG5vdCBhbiBhcnJheVxuICovXG5jb25zdCBncm91cEluZGljZXMgPSBmdW5jdGlvbiAobGlzdCkge1xuXG4gICAgdmFyIGdyb3VwcyA9IFtdLFxuICAgICAgICBwYWdlcztcblxuICAgIGlmICghaXNBcnJheShsaXN0KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCInbGlzdCcgbXVzdCBiZSBhbiBhcnJheVwiKTtcbiAgICB9XG5cbiAgICAvLyBwYXJzZSwgZmlsdGVyLCBzb3J0XG4gICAgcGFnZXMgPSBsaXN0Lm1hcChmdW5jdGlvbiAodil7cmV0dXJuIHBhcnNlSW50KHYsIDEwKTt9KTtcbiAgICBwYWdlcyA9IHBhZ2VzLmZpbHRlcihmdW5jdGlvbiAodmFsdWUsIGluZGV4LCBzZWxmKSB7XG4gICAgICAgIHJldHVybiBzZWxmLmluZGV4T2YodmFsdWUpID09PSBpbmRleDtcbiAgICB9KTtcbiAgICBwYWdlcy5zb3J0KGZ1bmN0aW9uIChhLCBiKXtyZXR1cm4gYS1iO30pO1xuXG4gICAgcGFnZXMucmVkdWNlKGZ1bmN0aW9uIChwcmV2aW91c1ZhbHVlLCBjdXJyZW50VmFsdWUsIGluZGV4LCBhcnJheSl7XG4gICAgICAgIGlmIChjdXJyZW50VmFsdWUgPiBwcmV2aW91c1ZhbHVlICsgMSkge1xuICAgICAgICAgICAgZ3JvdXBzLnB1c2goW10pO1xuICAgICAgICB9XG4gICAgICAgIGdyb3Vwc1tncm91cHMubGVuZ3RoIC0gMV0ucHVzaChjdXJyZW50VmFsdWUpO1xuICAgICAgICByZXR1cm4gY3VycmVudFZhbHVlO1xuICAgIH0sIC0xKTtcblxuICAgIHJldHVybiBncm91cHM7XG59O1xuXG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgcmFuZ2UgZm9yIHRoZSBzcGVjaWZpZWQgc3RhcnQgYW5kIGVuZC5cbiAqXG4gKiBAZXhhbXBsZVxuICogICAgICBjcmVhdGVSYW5nZSgzLCA0KSAvLyBbMywgNCwgNV1cbiAqXG4gKiAgICAgIGNyZWF0ZVJhbmdlKDUsIDUpIC8vIFs1XVxuICpcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gc3RhcnRcbiAqIEBwYXJhbSB7TnVtYmVyfSBlbmRcbiAqXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqXG4gKiBAdGhyb3dzIGlmIHN0YXJ0IGlzIG5vdCBhIG51bWJlciBvciBsZXNzIHRoYW4gMSwgb3IgaWYgZW5kIGlzIG5vdCBhIG51bWJlclxuICogb3IgaWYgZW5kIGlzIGxlc3MgdGhhbiBzdGFydFxuICovXG5jb25zdCBjcmVhdGVSYW5nZSA9IGZ1bmN0aW9uIChzdGFydCwgZW5kKSB7XG5cbiAgICB2YXIgcmV0O1xuXG4gICAgaWYgKCFpc24oc3RhcnQpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIidzdGFydCcgbXVzdCBiZSBhIG51bWJlclwiKTtcbiAgICB9XG5cbiAgICBpZiAoIWlzbihlbmQpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIidlbmQnIG11c3QgYmUgYSBudW1iZXJcIik7XG4gICAgfVxuXG4gICAgc3RhcnQgPSBwYXJzZUludChzdGFydCwgMTApO1xuICAgIGVuZCAgID0gcGFyc2VJbnQoZW5kLCAxMCk7XG5cbiAgICBpZiAoZW5kIDwgc3RhcnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBcImVuZFwiICgke2VuZH0pIG11c3QgYmUgYSBudW1iZXIgZXF1YWwgdG8gb3IgZ3JlYXRlciB0aGFuIFwic3RhcnRcIiAoJHtzdGFydH0pYCk7XG4gICAgfVxuXG5cbiAgICByZXQgPSAobmV3IEFycmF5KChlbmQgLSBzdGFydCkgKyAxKSkuZmlsbCh1bmRlZmluZWQpO1xuXG4gICAgcmV0dXJuIHJldC5tYXAoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gc3RhcnQrKztcbiAgICB9KTtcblxufTtcblxuLyoqXG4gKiBTZWFyY2hlcyBmb3IgdGhlIGZpcnN0IGVudHJ5IGluIHNvdXJjZS4gTG9va3MgdXAgdGhlIGtleSBpbiBzb3VyY2UgaWYgaXQgaXMgYW4gb2JqZWN0IGFuZCByZXR1cm5zIHRoZSBmaXJzdFxuICogbWF0Y2ggZm91bmQsIG90aGVyd2lzZSBpdGVyYXRlcyB0aHJvdWdoIHRoZSBhcnJheSBhbmQgcmV0dXJucyB0aGUgZmlyc3QgbWF0Y2guXG4gKlxuICogQGV4YW1wbGVcbiAqXG4gKiAgbDguZmluZEZpcnN0KFwiYmFyXCIsIHtmb28gOiB7fSwgYmFyIDoge3NuYWZ1IDogXCJcIn19OyAvLyByZXR1cm5zIHRoZSBiYXItb2JqZWN0XG4gKiAgbDguZmluZEZpcnN0KFwiYmFyXCIsIFt7Zm9vIDoge319LCB7YmFyIDoge3NuYWZ1IDogXCJcIn19XTsgLy8gcmV0dXJucyB0aGUgYmFyLW9iamVjdFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7KEFycmF5fGNPYmplY3QpfSBzb3VyY2VcbiAqXG4gKiBAcmV0dXJuIHs/Kn1cbiAqL1xuY29uc3QgZmluZEZpcnN0ID0gKGtleSwgc291cmNlKSA9PiB7XG5cbiAgICBsZXQgbWF0Y2ggPSBudWxsLFxuICAgICAgICBpc28kMSA9IGlzbyhzb3VyY2UpO1xuXG4gICAgKGlzYShzb3VyY2UpID8gc291cmNlIDogaXNvJDEgPyBPYmplY3QuZW50cmllcyhzb3VyY2UpIDogW10pLnNvbWUoaXRlbSA9PiB7XG5cbiAgICAgICAgaWYgKGlzbyQxICYmIGl0ZW1bMF0gPT09IGtleSkge1xuICAgICAgICAgICAgbWF0Y2ggPSBpdGVtWzFdO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNvKGl0ZW0pICYmIGl0ZW1ba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBtYXRjaCA9IGl0ZW1ba2V5XTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbWF0Y2g7XG59O1xuY29uc3QgZmYgPSBmaW5kRmlyc3Q7XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4vKipcbiAqIFJlcGxhY2VzIGFsbCB0b2tlbnMgc3BlY2lmaWVkIGluIHNlYXJjaCB3aXRoIHRoZSB0b2tlbnMgc3BlY2lmaWVkIGluIHJlcGxhY2UgaW4gdGhlXG4gKiB0YXJnZXQgc3RyaW5nLlxuICogV2lsbCByZXBsYWNlIGZyb20gbGVmdCB0byByaWdodCBpZiBtb3JlIHRoYW4gb25lIHNlYXJjaCB0b2tlbiBpcyBzcGVjaWZpZWQuXG4gKiBJZiB0b2tlbiBpcyBhbiBhcnJheSBhbmQgcmVwbGFjZSBpcyBhIHN0cmluZywgYWxsIHRva2VucyB3aWxsIGJlIHJlcGxhY2VkIHdpdGggdGhpcyBzdHJpbmcuXG4gKiBJZiB0b2tlbnMgYW5kIHJlcGxhY2UgYXJlIGJvdGggYXJyYXlzLCBhbmQgcmVwbGFjZSBoYXMgbGVzcyBlbnRyaWVzLCBpdGVtcyBpbiB0b2tlbnMgbWF0Y2hpbmcgYSBub24gZXhpc3RlbnRcbiAqIGluZGV4IGluIHJlcGxhY2Ugd2lsbCBiZSByZXBsYWNlZCB3aXRoIGFuIGVtcHR5IHZhbHVlLlxuICpcbiAqICAgICAgQGV4YW1wbGVcbiAqICAgICAgbGV0IHN0ciA9IGw4LnJlcGxhY2UoW1wiZm9vXCIsIFwiYmFyXCJdLCBbXCJvb2ZcIiwgXCJyYWJcIl0sIFwidGhpcyBmb28gaXMgYmFyXCIpO1xuICogICAgICAvLyB0aGlzIG9vZiBpcyByYWJcbiAqXG4gKiAgICAgICBsZXQgc3RyID0gbDgucmVwbGFjZShbXCJBXCIsIFwiQlwiXSwgW1wiQlwiLCBcIkRcIl0sIFwiQVwiKTtcbiAqICAgICAgLy8gRFxuICpcbiAqICAgICAgbGV0IHN0ciA9IGw4LnJlcGxhY2UoW1wiQVwiLCBcIkNcIl0sIFwiQlwiLCBcIkFDXCIpO1xuICogICAgICAvLyBCQlxuICpcbiAqICAgICAgbGV0IHN0ciA9IGw4LnJlcGxhY2UoW1wiQVwiLCBcIkNcIl0sIFtcIkJcIl0sIFwiQUNcIik7XG4gKiAgICAgIC8vIEJcbiAqXG4gKiAgICAgIGxldCBzdHIgPSBsOC5yZXBsYWNlKFwiQVwiLCBcIkJcIiwgXCJBXCIpO1xuICogICAgICAvLyBCXG4gKlxuICpcbiAqIEBwYXJhbSB7KFN0cmluZ3xBcnJheTxTdHJpbmc+KX0gdG9rZW5zXG4gKiBAcGFyYW0geyhTdHJpbmd8QXJyYXk8U3RyaW5nPil9IHJlcGxhY2VcbiAqIEBwYXJhbSB7U3RyaW5nfSB0YXJnZXRcbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKlxuICogQHRocm93cyB7RXJyb3J9IGlmIHN0ciB3YXMgbm90IGEgc3RyaW5nXG4gKlxuICogQHNlZSBlc2NhcGVSZWdFeHBcbiAqL1xuY29uc3QgcmVwbGFjZSA9IGZ1bmN0aW9uICh0b2tlbnMsIHJlcGxhY2UsIHRhcmdldCkge1xuXG4gICAgaWYgKCFpc3ModGFyZ2V0KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJcXFwic3RyXFxcIiBtdXN0IGJlIGEgc3RyaW5nXCIpO1xuICAgIH1cblxuICAgIHRva2VucyAgPSBbXS5jb25jYXQodG9rZW5zKTtcbiAgICByZXBsYWNlID0gIWlzcyhyZXBsYWNlKSA/IFtdLmNvbmNhdChyZXBsYWNlKSA6IG5ldyBBcnJheSh0b2tlbnMubGVuZ3RoKS5maWxsKHJlcGxhY2UpO1xuXG4gICAgdG9rZW5zLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgIHRhcmdldCA9IHRhcmdldC5yZXBsYWNlKG5ldyBSZWdFeHAoZXNjYXBlUmVnRXhwKGl0ZW0pLCBcImdcIiksIHJlcGxhY2VbaW5kZXhdID8/IFwiXCIpO1xuICAgIH0pO1xuXG5cbiAgICByZXR1cm4gdGFyZ2V0O1xufTtcbmNvbnN0IHJwbCA9IHJlcGxhY2U7XG5cblxuLyoqXG4gKiBVbmlmaWVzIHRoZSBzdHJpbmcgYnkgcmVtb3Zpbmcgc3Vic2VxdWVudCBlbnRyaWVzIG9mIGR1cGxpY2F0ZXMgb2YgdG9rZW4uXG4gKlxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgbDgudW5pZnkoXCJmb28vL2Jhci8vL1wiLCBcIi9cIik7IC8vIFwiZm9vL2Jhci9cIlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlblxuICogQHBhcmFtIHtTdHJpbmd9IHRhcmdldFxuICpcbiAqIHRocm93cyB7RXJyb3J9IGlmIHRhcmdldCBvciB0b2tlbiBhcmUgbm90IHN0cmluZ3NcbiAqL1xuY29uc3QgdW5pZnkgPSBmdW5jdGlvbiAodGFyZ2V0LCB0b2tlbikge1xuXG4gICAgaWYgKCFpc3ModGFyZ2V0KSB8fCAhaXNzKHRva2VuKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJcXFwic3RyXFxcIiBtdXN0IGJlIGEgc3RyaW5nXCIpO1xuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXQuc3BsaXQodG9rZW4pLmZpbHRlcihcbiAgICAgICAgKHgsIGluZGV4LCBzb3VyY2UpID0+IGluZGV4ID09PSAwIHx8IGluZGV4ID09PSBzb3VyY2UubGVuZ3RoIC0gMSB8fCB4ICE9PSBcIlwiXG4gICAgKS5qb2luKHRva2VuKTtcblxufTtcblxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIHN0cmluZyBpcyBub3QgYW55IG9mIHRoZSBwYXNzZWQgYXJndW1lbnRzLiBNYXRjaGVzIGFyZSBzdHJpY3QuXG4gKlxuICogQGV4YW1wbGVcbiAqICBsOC5pc05vdChcInN0cmluZ1wiLCBcInN0cmluZ1wiKTsgLy8gZmFsc2VcbiAqICBsOC5pc05vdChcInN0cmluZ1wiLCBcIlN0cmluZ1wiKTsgLy8gdHJ1ZVxuICogIGw4LmlzTm90KFwic3RyaW5nXCIsIFwiZm9vXCIsIFwiYmFyXCIpOyAvLyB0cnVlXG4gKiAgbDguaXNOb3QoXCJzdHJpbmdcIiwgXCJmb29cIiwgXCJiYXJcIiwgXCJzdHJpbmdcIik7IC8vIGZhbHNlXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRhcmdldFxuICogQHBhcmFtIHsuLi5TdHJpbmd9IGV4Y2x1ZGVzXG4gKlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuY29uc3QgaXNOb3QgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG5cbiAgICBjb25zdFxuICAgICAgICBleHByID0gXCIoPyEoXCIgKyBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLmpvaW4oXCJ8XCIpICsgXCIpKV5cIixcbiAgICAgICAgcmVnZXggPSBuZXcgUmVnRXhwKGV4cHIsIFwiZ1wiKTtcblxuICAgIHJldHVybiB0YXJnZXQubWF0Y2gocmVnZXgpICE9PSBudWxsO1xufTtcblxuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9HdWlkZS9SZWd1bGFyX0V4cHJlc3Npb25zI2VzY2FwaW5nXG4gKi9cbmZ1bmN0aW9uIGVzY2FwZVJlZ0V4cCAoc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG59XG5cbnZhciBzdHJpbmcgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gICAgX19wcm90b19fOiBudWxsLFxuICAgIHJlcGxhY2U6IHJlcGxhY2UsXG4gICAgcnBsOiBycGwsXG4gICAgdW5pZnk6IHVuaWZ5LFxuICAgIGlzTm90OiBpc05vdFxufSk7XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4vKipcbiAqIENyZWF0ZXMgYSBub25lLWNvbmZpZ3VyYWJsZSwgbm9uZS13cml0ZWFibGUgKGxpc3Qgb2YpIHByb3BlcnQoeXxpZXMpIG9uIHRoZSB0YXJnZXQgb2JqZWN0LlxuICpcbiAqIEBleGFtcGxlXG4gKiAgICAgIGxldCB0YXJnZXQgPSBsY2soe30sIFwiZm9vXCIpOyAvLyB0YXJnZXQgPSB7Zm9vIDogdW5kZWZpbmVkfTtcbiAqICAgICAgbGV0IHRhcmdldCA9IGxjayh7fSwgXCJmb29cIiwgMSk7IC8vIHRhcmdldCA9IHtmb28gOiAxfTtcbiAqICAgICAgbGV0IHRhcmdldCA9IGxjayh7fSwgW1wiZm9vXCIsIFwiYmFyXCJdLCB7XCJmb29cIiA6IDEsIFwiYmFyXCIgOiAyfSk7IC8vIHRhcmdldCA9IHtmb28gOiAxLCBiYXIgOiAyfTtcbiAqICAgICAgbGV0IHRhcmdldCA9IGxjayh7fSwgXCJmb29cIiwgXCJiYXJcIiwge1wiZm9vXCIgOiAxLCBcImJhclwiIDogMn0pOyAvLyB0YXJnZXQgPSB7Zm9vIDogMSwgYmFyIDogMn07XG4gKlxuICogQHBhcmFtIHshT2JqZWN0fSB0YXJnZXRcbiAqIEBwYXJhbSB7IShTdHJpbmd8QXJyYXl9IHByb3AgRWl0aGVyIHRoZSBwcm9wZXJ0eSBuYW1lIG9yIGFuIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzXG4gKiB0aGF0IHNob3VsZCBiZSBjcmVhdGVkIG9uIFwidGFyZ2V0XCIgd2l0aCB0aGVpciBjb3JyZXNwb25kaW5nIHZhbHVlcyBmb3VuZCBpbiBcInZhbHVlXCJcbiAqXG4gKiBAcGFyYW0geyo9fSB2YWx1ZVxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gdGFyZ2V0XG4gKlxuICogQHRocm93cyB7RXJyb3J9IGlmIHRhcmdldCBpcyBub3QgZXh0ZW5zaWJsZSwgaWYgXCJwcm9wXCIgaXMgbm90IGEgdmFsaWQgc3RyaW5nIG9yIGlmIGEgbGlzdCBvZiBwcm9wZXJ0aWVzXG4gKiBpcyBzdXBwbGllZCwgYnV0IG5vIHZhbHVlLW9iamVjdC5cbiAqL1xuY29uc3QgbG9jayA9IGZ1bmN0aW9uICh0YXJnZXQsIHByb3AsIHZhbHVlKSB7XG5cbiAgICBpZiAoIWlzT2JqZWN0KHRhcmdldCkgfHwgT2JqZWN0LmlzRnJvemVuKHRhcmdldCkgfHwgT2JqZWN0LmlzU2VhbGVkKHRhcmdldCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXFxcInRhcmdldFxcXCIgbXVzdCBiZSBhbiBleHRlbnNpYmxlIG9iamVjdC5cIik7XG4gICAgfVxuXG4gICAgY29uc3QgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcblxuICAgIHZhbHVlID0gYXJndW1lbnRzW2xlbiAtIDFdO1xuXG4gICAgaWYgKGxlbiA8IDIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXFxcInByb3BlcnR5XFxcIiBtdXN0IGJlIGEgdmFsaWQgcHJvcGVydHkgbmFtZS5cIik7XG4gICAgfVxuXG4gICAgaWYgKGxlbiA+IDMgJiYgIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJcXFwidmFsdWVcXFwiIG11c3QgYmUgYW4gb2JqZWN0LlwiKTtcbiAgICB9XG5cbiAgICBpZiAobGVuID09PSAzICYmIGlzQXJyYXkocHJvcCkgJiYgIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJcXFwidmFsdWVcXFwiIG11c3QgYmUgYW4gb2JqZWN0LlwiKTtcbiAgICB9XG5cbiAgICBsZXQgaXNBcnIgPSBpc0FycmF5KHByb3ApLFxuICAgICAgICBwcm9wcyA9IGlzQXJyID8gcHJvcCA6IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcmd1bWVudHMsIFsxLCBsZW4gLSAxXSk7XG5cbiAgICBwcm9wcy5mb3JFYWNoKCBwcm9wID0+IHtcbiAgICAgICAgaWYgKCFpc1N0cmluZyhwcm9wKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXFxcInByb3BlcnR5XFxcIiBtdXN0IGJlIGEgdmFsaWQgcHJvcGVydHkgbmFtZS5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wLCB7XG4gICAgICAgICAgICB3cml0YWJsZSA6IGZhbHNlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlIDogZmFsc2UsXG4gICAgICAgICAgICB2YWx1ZSA6IGxlbiA+IDMgfHwgaXNBcnIgPyB2YWx1ZVtwcm9wXSA6IHZhbHVlXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG5cbiAgICByZXR1cm4gdGFyZ2V0O1xufTtcbmNvbnN0IGxjayA9IGxvY2s7XG5cbi8qKlxuICogVGhpcyBjYWxsYmFjayBpcyBkaXNwbGF5ZWQgYXMgcGFydCBvZiB0aGUgUmVxdWVzdGVyIGNsYXNzLlxuICogQGNhbGxiYWNrIHZpc2l0fnZpc2l0b3JcbiAqIEBwYXJhbSB7Kn0gbGVhZlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAqL1xuXG4vKipcbiAqIFRyYXZlcnNlcyBhbiBvYmplY3QgYW5kIGNhbGxzIHRoZSBwYXNzZWQgZnVuY3Rpb24gb24gZWFjaCBwcm9wZXJ0eS5cbiAqXG4gKiBAZXhhbXBsZVxuICogICAgICBsZXQgdHJlZSA9IHtcbiAqICAgICAgICAgIG5vZGUgOiB7XG4gKiAgICAgICAgICAgICAgbm9kZV9hIDoge1xuICogICAgICAgICAgICAgICAgICBub2RlIDogXCJmb29cIlxuICogICAgICAgICAgICAgIH1cbiAqICAgICAgICAgIH0sXG4gKiAgICAgICAgICBub2RlX2MgOiBcImJhclwiXG4gKiAgICAgIH07XG4gKlxuICogbDgudmlzaXQodHJlZSwgKGxlYWYsIHBhdGgpID0+IHBhdGg7IC8vIGNoYW5nZXMgdGhlIHRyZWUgdG9cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0IFRoZSB0YXJnZXQgXCJ0cmVlXCIgdGhhdCBzaG91bGQgYmUgdmlzaXRlZC5cbiAqIEBwYXJhbSB7dmlzaXR+dmlzaXRvcn0gdmlzaXRvciAtIFRoZSBjYWxsYmFjayB0aGF0IGhhbmRsZXMgdGhlIHJlc3BvbnNlLiBUaGUgcGFzc2VkIGFyZ3VtZW50cyB0byB0aGlzIGZ1bmN0aW9uc1xuICogYXJlIHRoZSB2YWx1ZSBvZiB0aGUgbm9kZSBhbmQgdGhlIHBhdGggKHN0cmluZykgdG8gdGhpcyBub2RlLlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gdGFyZ2V0IFRoZSB2aXNpdGVkIHRhcmdldC5cbiAqXG4gKi9cbmNvbnN0IHZpc2l0ID0gZnVuY3Rpb24gKHRhcmdldCwgdmlzaXRvcikge1xuXG4gICAgY29uc3QgdHJhdmVyc2UgPSAodGFyZ2V0LCBwYXJlbnRLZXkpID0+IHtcbiAgICAgICAgT2JqZWN0LmVudHJpZXModGFyZ2V0KS5tYXAoKFtrZXksIHByb3BlcnR5XSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGF0aCA9IHBhcmVudEtleS5jb25jYXQoa2V5KTtcbiAgICAgICAgICAgIHRhcmdldFtrZXldID0gaXNvKHByb3BlcnR5KSA/IHRyYXZlcnNlKHByb3BlcnR5LCBwYXRoKSA6IHZpc2l0b3IocHJvcGVydHksIHBhdGguam9pbihcIi5cIikpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9O1xuXG4gICAgdHJhdmVyc2UodGFyZ2V0LCBbXSk7XG4gICAgcmV0dXJuIHRhcmdldDtcbn07XG5jb25zdCB2c3QgPSB2aXNpdDtcblxuXG4vKipcbiAqIFV0aWxpdGllc1xuICovXG5cblxuLyoqXG4gKiBDcmVhdGVzIGFuIG9iamVjdCBjaGFpbiBvbiB0aGUgdGFyZ2V0IG9iamVjdCBhbmQgaW5pdGlhbGl6ZXMgaXQgd2l0aFxuICogdGhlIGRlZmF1bHRWYWx1ZSwgaWYgc3BlY2lmaWVkLlxuICogUmV0dXJucyB0aGUgdGFyZ2V0IG9iamVjdC5cbiAqIFRoZSB0aGlyZCBhcmd1bWVudCBjYW4gYmUgYSBmdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIHdpdGggdGhlIGNoYWluJ3MgbmFtZSBjcmVhdGVkIGFzIGl0cyBhcmd1bWVudC5cbiAqIE92ZXJyaWRlcyBhbnkgdmFsdWUgZm91bmQgb24gdGhlIG9iamVjdCBpZiBvdmVycmlkZSBpcyBzZXQgdG8gdHJ1ZVxuICpcbiAqIEBleGFtcGxlXG4gKiAgICBsZXQgb2JqID0ge307XG4gKiAgICBsOC5jaGFpbihcImEuYi5jLmRcIiwgb2JqLCBcImZvb1wiKTtcbiAqXG4gKiAgICAvLyBvYmpcbiAqICAgIC8vIHsgYSA6IHsgYiA6IHtjIDogeyBkIDogXCJmb29cIn19fX1cbiAqXG4gKiBUaGlzIG1ldGhvZCBsZXRzIHlvdSBwYXNzIGEgbGlzdCBvZiBwcm9wZXJ0aWVzIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0aGF0IHdpbGwgYmUgY2hhaW5lZC5cbiAqIFRoZSB0aGlyZCBhcmd1bWVudCBjYW4gYmUgYSBmdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIHdpdGggZWFjaCBwcm9wZXJ0eSB1cG9uIGNoYWluaW5nLlxuICogVGhlIHJldHVybiB2YWx1ZSBvZiB0aGlzIGZ1bmN0aW9uIGlzIHVzZWQgYXMgdGhlIHZhbHVlIGZvciB0aGUgY2hhaW5lZCBwcm9wZXJ0eS5cbiAqIE90aGVyd2lzZSwgdGhlIHRoaXJkIGFyZ3VtZW50IHdpbGwgYmUgdXNlZCBhcyB0aGUgdmFsdWUuXG4gKlxuICogQGV4YW1wbGVcbiAqIGxldCBvYmogPSB7fTtcbiAqICAgIGw4LmNoYWluKFtcImEuYlwiLCBcImUuZlwiXSwgb2JqLCAoY2hhaW4pID0+IGNvbnNvbGUubG9nKGNoYWluLnRvVXBwZXJDYXNlKCkpKTtcbiAqXG4gKiAgICAvLyBvYmpcbiAqICAgIC8vIHsgYSA6IHsgYiA6IFwiQlwifSwge2UgOiB7ZiA6IFwiRlwifX19XG4gKlxuICpcbiAqIEBwYXJhbSB7IShTdHJpbmd8QXJyYXkpfSBjaGFpbnNcbiAqIEBwYXJhbSB7T2JqZWN0fSB0YXJnZXRcbiAqIEBwYXJhbSB7PygqfGZ1bmN0aW9uKX0gZGVmYXVsdFZhbHVlXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvdmVycmlkZT1mYWxzZV1cbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IHRhcmdldFxuICovXG5jb25zdCBjaGFpbiA9IGZ1bmN0aW9uIChjaGFpbnMsIHRhcmdldCA9IHt9LCBkZWZhdWx0VmFsdWUgPSB1bmRlZmluZWQsIG92ZXJyaWRlID0gZmFsc2UpIHtcblxuICAgIGNoYWlucyA9IFtdLmNvbmNhdChjaGFpbnMpO1xuXG4gICAgY2hhaW5zLmZvckVhY2goKHN0cikgPT4ge1xuICAgICAgICAvKipcbiAgICAgICAgICogQHRvZG8gTyhuKSA/XG4gICAgICAgICAqL1xuICAgICAgICBjb25zdFxuICAgICAgICAgICAga2V5cyA9IHN0ci5zcGxpdChcIi5cIiksXG4gICAgICAgICAgICBjciA9IChvYmosIGtleXMpID0+IHtcblxuICAgICAgICAgICAgICAgIGxldCBrZXk7XG5cbiAgICAgICAgICAgICAgICBrZXkgPSBrZXlzLnNoaWZ0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoIW9ialtrZXldIHx8IChvdmVycmlkZSA9PT0gdHJ1ZSAmJiAha2V5cy5sZW5ndGgpKSB7XG4gICAgICAgICAgICAgICAgICAgIG9ialtrZXldID0ga2V5cy5sZW5ndGggPyB7fSA6IChpc0Z1bmN0aW9uKGRlZmF1bHRWYWx1ZSkgPyBkZWZhdWx0VmFsdWUoc3RyKSA6IGRlZmF1bHRWYWx1ZSkgO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChrZXlzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBjcihvYmpba2V5XSwga2V5cyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgY3IodGFyZ2V0LCBrZXlzKTtcbiAgICB9KTtcblxuXG4gICAgcmV0dXJuIHRhcmdldDtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIGNoYWluKClcbiAqIEB0eXBlIHtmdW5jdGlvbighKFN0cmluZ3xBcnJheSksIE9iamVjdD0sID8oKnxGdW5jdGlvbik9KTogT2JqZWN0fVxuICovXG5jb25zdCBjaG4gPSBjaGFpbjtcblxuLyoqXG4gKiBFeHBlY3RzIGFuIE9iamVjdCBhbmQgZmxpcHMga2V5L3ZhbHVlL3BhaXJzLlxuICpcbiAqICAgICAgQGV4YW1wbGVcbiAqICAgICAgdmFyIGZvbyA9IHsgMSA6IFwiZm9vXCIsIDIgOiBcImJhclwiLCAzIDogXCJzbmFmdVwifTtcbiAqXG4gKiAgICAgIGw4LmZsaXAoZm9vKTsgLy8ge1wiYmFyXCIgOiAxLCBcImJhclwiOiAyLCBcInNuYWZ1XCIgOiAzfVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gYSBuZXcgb2JqZWN0IHdoZXJlIHRoZSBrZXkvdmFsdWUgcGFpcnMgYXJlIGZsaXBwZWRcbiAqL1xuY29uc3QgZmxpcCA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCAuLi5PYmplY3QuZW50cmllcyhpbnB1dCkubWFwKChbaywgdl0pID0+ICAoe1t2XSA6IGt9KSkpO1xufTtcblxuXG4vKipcbiAqIEV4cGVjdHMgYW4gT2JqZWN0IGFuZCByZW1vdmVzIGFsbCB0aGUgZW50cmllcyB3aGljaCBzdHJpY3QgZXF1YWwgdG8gbWF0Y2guXG4gKlxuICogICAgICBAZXhhbXBsZVxuICogICAgICB2YXIgZm9vID0geyAxIDogXCJcIiwgMiA6IFwiYmFyXCIsIDMgOiBcIlwifTtcbiAqXG4gKiAgICAgIGw4LnB1cmdlKGZvbywgXCJcIik7IC8vIHsyIDogXCJiYXJcIn1cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gaW5wdXRcbiAqIEBwYXJhbSB7TWl4ZWR9IG1hdGNoLCBkZWZhdWx0cyB0byB1bmRlZmluZWRcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9IGEgbmV3IGZpbHRlcmVkIG9iamVjdFxuICovXG5jb25zdCBwdXJnZSA9IGZ1bmN0aW9uIChpbnB1dCwgbWF0Y2g9IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoT2JqZWN0LmVudHJpZXMoaW5wdXQpLmZpbHRlcigoWywgdl0pID0+IHYgIT09IG1hdGNoKSk7XG59O1xuXG5cbi8qKlxuICogU3BsaXRzIHRoZSBzcGVjaWZpZWQgc3RyaW5nIGJ5IGxvb2tpbmcgZm9yIFwiLlwiIGFzIHNlcGFyYXRvcnMgYW5kIHJldHVybnNcbiAqIHVuZGVmaW5lZCBpZiB0aGUgZXZhbHVhdGVkIHByb3BlcnR5IGlzIG5vdCBhdmFpbGFibGUsIG90aGVyd2lzZSB0aGUgdmFsdWVcbiAqIG9mIHRoZSBwcm9wZXJ0eS5cbiAqXG4gKiAgICAgIEBleGFtcGxlXG4gKiAgICAgIHZhciBmb28gPSB7IDEgOiB7IDIgOiB7IDMgOiB7IDQgOiAnYmFyJ319fX07XG4gKlxuICogICAgICBsOC51bmNoYWluKCcxLjIuMy40JywgZm9vKTsgLy8gJ2JhcidcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gY2hhaW4gVGhlIG9iamVjdCBjaGFpbiB0byByZXNvbHZlXG4gKiBAcGFyYW0ge09iamVjdH0gc2NvcGUgVGhlIHNjb3BlIHdoZXJlIHRoZSBjaGFpbiBzaG91bGQgYmUgbG9va2VkIHVwXG4gKiBAcGFyYW0geygqfEZ1bmN0aW9uKX0gZGVmYXVsdFZhbHVlIGEgZGVmYXVsdFZhbHVlIHRvIHJldHVybiBpbiBjYXNlIHRoZSBjaGFpbiBpcyBub3QgZXhpc3RpbmcuXG4gKiBpZiB0aGlzIGFyZ3VtZW50IGlzIGEgZnVuY3Rpb24sIHRoZSBmdW5jdGlvbiBnZXRzIGNhbGxlZC4gSWYgdGhlIGNoYWluIGV4aXN0ZWQsIGl0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlXG4gKiB2YWx1ZSBvZiB0aGUgY2hhaW4sIGFuZCB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoaXMgZnVuY3Rpb24gaXMgcmV0dXJuZWQuXG4gKiBAZXhhbXBsZVxuICogY29uc3QgY2IgPSB2YWx1ZSA9PiB2YWx1ZS50b1VwcGVyQ2FzZSgpLFxuICogICAgICBmb28gPSB7IDEgOiB7IDIgOiB7IDMgOiB7IDQgOiAnYmFyJ319fX07XG4gKlxuICogIGw4LnVuY2hhaW4oJzEuMi4zLjQnLCBmb28sIGNiKTsgLy8gJ0JBUidcbiAqXG4gKiBAcmV0dXJuIHsqfSB1bmRlZmluZWQgaWYgZWl0aGVyIHNjb3BlIHdhcyBub3QgZm91bmQgb3IgdGhlIGNoYWluIGNvdWxkXG4gKiBub3QgYmUgcmVzb2x2ZWQsIG90aGVyd2lzZSB0aGUgdmFsdWUgZm91bmQgaW4gW3Njb3BlXVtjaGFpbl1cbiAqL1xuY29uc3QgdW5jaGFpbiA9IGZ1bmN0aW9uIChjaGFpbiwgc2NvcGUsIGRlZmF1bHRWYWx1ZSA9IHVuZGVmaW5lZCkge1xuXG4gICAgdmFyIHBhcnRzID0gY2hhaW4uc3BsaXQoXCIuXCIpLFxuICAgICAgICBvYmogICA9IHNjb3BlO1xuXG4gICAgd2hpbGUgKG9iaiAhPT0gdW5kZWZpbmVkICYmIHBhcnRzLmxlbmd0aCkge1xuICAgICAgICBvYmogPSBvYmpbcGFydHMuc2hpZnQoKV07XG4gICAgfVxuXG4gICAgaWYgKGlzRnVuY3Rpb24oZGVmYXVsdFZhbHVlKSkge1xuICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlKG9iaik7XG4gICAgfVxuXG4gICAgaWYgKG9iaiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbn07XG5cbi8qKlxuICogQWxpYXMgZm9yIHVuY2hhaW4oKVxuICogQHR5cGUge2Z1bmN0aW9uKCEoU3RyaW5nfEFycmF5KSwgT2JqZWN0PSwgPygqfEZ1bmN0aW9uKT0pOiBPYmplY3R9XG4gKi9cbmNvbnN0IG5jaG4gPSB1bmNoYWluO1xuXG4vKipcbiAqIExldHMgeW91IHNwZWNpZnkgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gbWFrZSBzdXJlIG9ubHkgdGhvc2VcbiAqIGtleXMgYXJlIGFzc2lnbmVkIGZyb20gc291cmNlIHRvIHRhcmdldCB0aGF0IG1hdGNoIHRoZSBleHByZXNzaW9uLlxuICpcbiAqIEBleGFtcGxlXG4gKiAgICAgbDguYXNzaWduKHt9LCB7XCJmb29cIjogXCJiYXJcIn0sIFt7XCJzbmFmdVwiIDogXCJmb29iYXJcIiwgXCJrZXlcIjogXCJ2YWx1ZVwifSwgLyg/IShzbmFmdSkpXi9nXSk7XG4gKiAgICAgLy8gcmVzdWx0cyBpbiB7XCJmb29cIjogXCJiYXJcIiwgXCJrZXlcIjogXCJ2YWx1ZVwifVxuICpcbiAqICAgICAgbDguYXNzaWduKHt9LCB7XCJmb29cIjogXCJiYXJcIn0sIFt7XCJzbmFmdVwiIDogXCJmb29iYXJcIiwgXCJrZXlcIjogXCJ2YWx1ZVwiLCBcInNvbWVcIjogXCJvYmpcIn0sIFwic25hZnVcIiwgXCJrZXlcIl0pO1xuICogICAgIC8vIHJlc3VsdHMgaW4ge1wiZm9vXCI6IFwiYmFyXCIsIFwic29tZVwiOiBcIm9ialwifVxuICpcbiAqXG4gKiBAcGFyYW0geyFPYmplY3R9IHRhcmdldCBUaGUgdGFyZ2V0IG9iamVjdCB0byBhc3NpZ24gdHRvXG4gKiBAcGFyYW0gey4uLihPYmplY3R8W09iamVjdCwgKFJlZ0V4cHwuLi5TdHJpbmddKX0gVGhlIG9iamVjdHMgdG8gdXNlIGZvciBhc3NpZ25pbmcuIElmIGFuIGFycmF5IGlzIHN1Ym1pdHRlZCwgdGhlIGZpcnN0XG4gKiBpbmRleCBpcyB0aGUgb2JqZWN0IHNvdXJjZSB0byBhc3NpZ24gZnJvbSwgYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgaXN0IHRoZSByZWd1bGFyIGV4cHJlc3Npb24gdGhhdCBtdXN0IG1hdGNoXG4gKiB0aGUgb2JqZWN0IGtleXMgdG8gdXNlIGZvciBhc3NpZ25tZW50LiBJZiB0aGVyZSBpcyBubyBSZWdFeHAgYXMgYSBzZWNvbmQgYXJndW1lbnQgYnV0IGluc3RlYWQgYSBzdHJpbmcsIHRoaXMgc3RyaW5nIHdpbGxcbiAqIGJlIHVzZWQgZm9yIGNvbXBhcmlzb24uIENhbiBhbHNvIGJlIGFuIGFyYml0cmFyeSBudW1iZXIgb2Ygc3RyaW5ncy4gQWxsIHRoZSBrZXlzIG5vdCBzdHJpY3QgZXF1YWxpbmcgdG8gdGhlIHN1Ym1pdHRlZFxuICogYXJndW1lbnRzIHdpbGwgdGhlbiBiZSBhc3NpZ25lZCB0aGVpciB2YWx1ZXMgdG8gdGFyZ2V0LlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gdGFyZ2V0XG4gKi9cbmNvbnN0IGFzc2lnbiA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcblxuICAgIGxldCBzb3VyY2VzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcblxuICAgIHNvdXJjZXMgPSBzb3VyY2VzLm1hcCggc291cmNlID0+IHtcblxuICAgICAgICBpZiAoaXNQbGFpbk9iamVjdChzb3VyY2UpKSB7XG4gICAgICAgICAgICByZXR1cm4gc291cmNlO1xuICAgICAgICB9XG5cblxuICAgICAgICBpZiAoaXNBcnJheShzb3VyY2UpKSB7XG4gICAgICAgICAgICBjb25zdCBbb2JqLCAuLi5hcmdzXSA9IHNvdXJjZSxcbiAgICAgICAgICAgICAgICByZWdleHAgPSBhcmdzWzBdO1xuXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKFxuICAgICAgICAgICAgICAgIE9iamVjdC5lbnRyaWVzKG9iaikuZmlsdGVyKGVudHJ5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGtleSA9IGVudHJ5WzBdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNyeChyZWdleHApKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4ga2V5Lm1hdGNoKHJlZ2V4cCkgIT09IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNOb3QuYXBwbHkoc3RyaW5nLCBba2V5XS5jb25jYXQoYXJncykpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHRhcmdldCwgLi4uc291cmNlcyk7XG59O1xuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuLyoqXG4gKiBUcmFuc2Zvcm1lciBmb3IgdHJhbnNmb3JtaW5nIHF1b3RlZCBwbGFpbi10ZXh0IChxdW90ZSBtYXJrczogXCI+XCIpXG4gKiB0byBhIHRleHQgY29udGFpbmluZyBibG9ja3F1b3Rlcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogIGxldCB0ZXh0ID0gW1xuICogICAgICBcIj4gVGhpcyBpc1wiLFxuICogICAgICBcIj4gc29tZSBxdW90ZWRcIixcbiAqICAgICAgXCI+PiBUZXh0IHRoYXQgZG9lcyAxXCIsXG4gKiAgICAgIFwiPj4gVGV4dCB0aGF0IGRvZXMgMlwiLFxuICogICAgICBcIj5obSBnb29kXCIsXG4gKiAgICAgIFwic3RmZiB0aGF0XCIsXG4gKiAgICAgIFwidXN1YWxseSBsaWtlc1wiLFxuICogICAgICBcIj4+IHRvIGJlIHBhcnNlZFwiLFxuICogICAgICBcIj4+WU8hXCIsXG4gKiAgXS5qb2luKFwiXFxuXCIpO1xuICpcbiAqICBsZXQgdHJhbnNmb3JtZXIgPSBuZXcgQmxvY2txdW90ZVRyYW5zZm9ybWVyXG4gKlxuICogIHRyYW5zZm9ybWVyLnRyYW5zZm9ybSh0ZXh0KTtcbiAqXG4gKiAgLy8gcmV0dXJuczpcbiAqICAvLyA8YmxvY2txdW90ZT5cbiAqICAvLyAgIFRoaXMgaXNcbiAqICAvLyAgIHNvbWUgcXVvdGVkXG4gKiAgLy8gICA8YmxvY2txdW90ZT5cbiAqICAvLyAgICAgIFRleHQgdGhhdCBkb2VzIDFcbiAqICAvLyAgICAgIFRleHQgdGhhdCBkb2VzIDJcbiAqICAvLyAgIDwvYmxvY2txdW90ZT5cbiAqICAvLyAgIGhtIGdvb2RcbiAqICAvLyA8L2Jsb2NrcXVvdGU+XG4gKiAgLy8gc3RmZiB0aGF0XG4gKiAgLy8gdXN1YWxseSBsaWtlc1xuICogIC8vIDxibG9ja3F1b3RlPlxuICogIC8vICA8YmxvY2txdW90ZT5cbiAqICAvLyAgIHRvIGJlIHBhcnNlZFxuICogIC8vICAgWU8hXG4gKiAgLy8gIDwvYmxvY2txdW90ZT5cbiAqICAvLyA8L2Jsb2NrcXVvdGU+XG4gKlxuICovXG5jbGFzcyBCbG9ja3F1b3RlVHJhbnNmb3JtZXIge1xuXG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VzIHRyYW5zZm9ybWluZyB0aGUgcGFzc2VkIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRyYW5zZm9ybSAodmFsdWUpIHtcblxuICAgICAgICBjb25zdCBtZSA9IHRoaXM7XG5cbiAgICAgICAgbGV0IGdyb3VwcyA9IG1lLmdyb3VwKHZhbHVlKSxcbiAgICAgICAgICAgIHRleHRzID0gW107XG5cbiAgICAgICAgZ3JvdXBzLmZvckVhY2goZ3JvdXAgPT4ge1xuICAgICAgICAgICAgdGV4dHMucHVzaChtZS5xdW90ZShncm91cCkpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGV4dHMuam9pbihcIlwiKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogVGFrZXMgY2FyZSBvZiBncm91cGluZyB0aGUgdGV4dCBpbnRvIGJsb2NrcyBvZlxuICAgICAqIHF1b3RlZCAvIHVucXVvdGVkIHBhcnRzLiBUYWtlcyBjYXJlIG9mIHNhbml0aXppbmcgdGhlIHF1b3RlIG1hcmtzLCB0b28uXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqICAgIGxldCB0ZXh0ID0gW1xuICAgICAqICAgICAgXCIgPiBUaGlzIGlzXCIsXG4gICAgICogICAgICBcIj4gc29tZSBxdW90ZWRcIixcbiAgICAgKiAgICAgIFwiICA+ID4gVGV4dCB0aGF0IGRvZXMgMVwiLFxuICAgICAqICAgICAgXCI+ICAgID4gVGV4dCB0aGF0IGRvZXMgMlwiLFxuICAgICAqICAgICAgXCI+aG0gZ29vZFwiLFxuICAgICAqICAgICAgXCJzdHVmZiB0aGF0XCIsXG4gICAgICogICAgICBcInVzdWFsbHkgbGlrZXNcIixcbiAgICAgKiAgICAgIFwiPj4gdG8gYmUgcGFyc2VkXCIsXG4gICAgICogICAgICBcIj4+WU8hXCIsXG4gICAgICogICAgXS5qb2luKFwiXFxuXCIpO1xuICAgICAqXG4gICAgICogIHRyYW5zZm9ybWVyLmdyb3VwKHRleHQpO1xuICAgICAqICAvLyBbXG4gICAgICogIC8vICAgW1wiPiBUaGlzIGlzXCIsIFwiPiBzb21lIHF1b3RlZFwiLCBcIj4+IFRleHQgdGhhdCBkb2VzIDFcIiwgXCI+PiBUZXh0IHRoYXQgZG9lcyAyXCIsIFwiPmhtIGdvb2RcIl0sXG4gICAgICogIC8vICAgW1wic3R1ZmYgdGhhdFwiLCBcInVzdWFsbHkgbGlrZXNcIl0sXG4gICAgICogIC8vICAgW1wiPj4gdG8gYmUgcGFyc2VkXCIsIFwiPj5ZTyFcIl1cbiAgICAgKiAgLy8gXVxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHRleHRcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZ3JvdXAgKHRleHQpIHtcblxuICAgICAgICBjb25zdCBtZSA9IHRoaXM7XG5cbiAgICAgICAgbGV0IGxpbmVzID0gdGV4dC5zcGxpdChcIlxcblwiKSxcbiAgICAgICAgICAgIHRvUXVvdGUgPSBbXSxcbiAgICAgICAgICAgIGdyb3VwcyA9IC0xLFxuICAgICAgICAgICAgcHJldiA9IG51bGw7XG5cbiAgICAgICAgbGluZXMuZm9yRWFjaChsaW5lID0+IHtcblxuICAgICAgICAgICAgbGluZSA9IG1lLnNhbml0aXplTGluZShsaW5lKTtcblxuICAgICAgICAgICAgaWYgKHByZXYgIT09IGxpbmUuaW5kZXhPZihcIj5cIikpIHtcbiAgICAgICAgICAgICAgICBncm91cHMrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcHJldiA9IGxpbmUuaW5kZXhPZihcIj5cIik7XG5cbiAgICAgICAgICAgIGlmICghdG9RdW90ZVtncm91cHNdKSB7XG4gICAgICAgICAgICAgICAgdG9RdW90ZVtncm91cHNdID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b1F1b3RlW2dyb3Vwc10ucHVzaChsaW5lKTtcblxuICAgICAgICB9KTtcblxuXG4gICAgICAgIHJldHVybiB0b1F1b3RlO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogVGFrZXMgY2FyZSBvZiBwcm9wZXIgcXVvdGluZyB0aGUgcGFzc2VkIGdyb3VwLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gZ3JvdXBcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHF1b3RlIChncm91cCkge1xuXG4gICAgICAgIGlmIChncm91cFswXS5pbmRleE9mKFwiPlwiKSAhPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGdyb3VwLmpvaW4oXCJcXG5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3AgPSBxdW90ZWQgPT4ge1xuICAgICAgICAgICAgaWYgKHF1b3RlZFtxdW90ZWQubGVuZ3RoIC0gMV0gPT09IFwiXFxuXCIpIHtcbiAgICAgICAgICAgICAgICBxdW90ZWQucG9wKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IGN1cnJlbnRJbnRlbmQgPSAwLFxuICAgICAgICAgICAgaW50ZW5kYXRpb24sXG4gICAgICAgICAgICBxdW90ZWQgPSBbXSxcbiAgICAgICAgICAgIG1hdGNoO1xuXG4gICAgICAgIGdyb3VwLmZvckVhY2gobGluZSA9PiB7XG5cbiAgICAgICAgICAgIG1hdGNoID0gKGxpbmUgKyBcIlwiKS50cmltKCkubWF0Y2goL14oKD4pKykgKj8oLio/JCkvbXMpO1xuXG4gICAgICAgICAgICBpbnRlbmRhdGlvbiA9IG1hdGNoWzFdLmxlbmd0aDtcblxuICAgICAgICAgICAgd2hpbGUgKGludGVuZGF0aW9uID4gY3VycmVudEludGVuZCkge1xuICAgICAgICAgICAgICAgIHBvcChxdW90ZWQpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRJbnRlbmQrKztcbiAgICAgICAgICAgICAgICBxdW90ZWQucHVzaChcIjxibG9ja3F1b3RlPlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgd2hpbGUgKGN1cnJlbnRJbnRlbmQgPiBpbnRlbmRhdGlvbikge1xuICAgICAgICAgICAgICAgIHBvcChxdW90ZWQpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRJbnRlbmQtLTtcbiAgICAgICAgICAgICAgICBxdW90ZWQucHVzaChcIjwvYmxvY2txdW90ZT5cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHF1b3RlZC5wdXNoKG1hdGNoWzNdKTtcbiAgICAgICAgICAgIHF1b3RlZC5wdXNoKFwiXFxuXCIpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHdoaWxlIChjdXJyZW50SW50ZW5kID4gMCkge1xuICAgICAgICAgICAgcG9wKHF1b3RlZCk7XG4gICAgICAgICAgICBjdXJyZW50SW50ZW5kLS07XG4gICAgICAgICAgICBxdW90ZWQucHVzaChcIjwvYmxvY2txdW90ZT5cIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcXVvdGVkLmpvaW4oXCJcIik7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFNhbml0aXplcyBhIHNpbmdsZSBsaW5lIGJ5IGdyb3VwaW5nIHF1b3RlIG1hcmtzIHByb3Blcmx5LlxuICAgICAqXG4gICAgICogKiBAZXhhbXBsZVxuICAgICAqICAgIGxldCBsaW5lID0gXCIgID4gPiAgICBUZXh0IHRoYXQgZG9lcyAxXCJcIjtcbiAgICAgKlxuICAgICAqICBsaW5lID0gdHJhbnNmb3JtZXIuc2FuaXRpemVMaW5lKGxpbmUpO1xuICAgICAqICAvLyBcIj4+IFRleHQgdGhhdCBkb2VzIDFcIlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGxpbmVcbiAgICAgKlxuICAgICAqIEByZXVybiB7U3RyaW5nfVxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBzYW5pdGl6ZUxpbmUgKGxpbmUpIHtcblxuICAgICAgICBsZXQgcmVnZXggPSAvXiggKikoPispKCA+KikqKD8hJCkvbTtcblxuICAgICAgICByZXR1cm4gbGluZS5yZXBsYWNlKFxuICAgICAgICAgICAgcmVnZXgsXG4gICAgICAgICAgICAoYXJncykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBhcmdzLnJlcGxhY2UoLyhcXHMpKig/ISQpL2csIFwiXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG59XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4vKipcbiAqIFRyYW5zZm9ybWVyIGZvciB0cmFuc2Zvcm1pbmcgcGxhaW4gdGV4dCBjb250YWluaW5nIEVtYWlsLUFkZHJlc3Nlc1xuICogaW50byB0ZXh0IHRoYXQgd3JhcHMgdGhvc2UgRW1haWwtQWRkcmVzZXMgaW4gXCI8YT5cIi10YWdzIGFsb25nIHdpdGggdGhlIGhyZWYtYXR0cmlidXRlJ3NcbiAqIHZhbHVlIChpLmUuIHRoZSBFbWFpbC1BZGRyZXNzIGl0c2VsZikgcHJlZml4ZWQgd2l0aCBcIm1haWx0bzpcIlxuICpcbiAqIEBleGFtcGxlXG4gKiAgbGV0IHRleHQgPSBcIlBsZWFzZSBjb250YWN0IGluZm9AY29uam9vbi5jb20gZm9yIGZ1cnRoZXIgaW5mb3JtYXRpb24uXCI7XG4gKlxuICogIGxldCB0cmFuc2Zvcm1lciA9IG5ldyBFbWFpbEFkZHJlc3NUcmFuc2Zvcm1lcjtcbiAqXG4gKiAgdHJhbnNmb3JtZXIudHJhbnNmb3JtKHRleHQpO1xuICpcbiAqICAvLyByZXR1cm5zOlxuICogIC8vIFBsZWFzZSBjb250YWN0IDxhIGhyZWY9XCJtYWlsdG86aW5maUBjb25qb29uLmNvbVwiPmluZm9AY29uam9vbi5jb208L2E+IGZvciBmdXJ0aGVyIGluZm9ybWF0aW9uLlxuICpcbiAqL1xuY2xhc3MgRW1haWxBZGRyZXNzVHJhbnNmb3JtZXIge1xuXG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VzIHRyYW5zZm9ybWluZyB0aGUgcGFzc2VkIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRyYW5zZm9ybSAodGV4dCkge1xuXG4gICAgICAgIGNvbnN0IGVtYWlsUmVnZXggPSAvW2EtekEtWjAtOSsuXyUtXXsxLDI1Nn1AW2EtekEtWjAtOV1bYS16QS1aMC05LV17MCw2NH0oXFwuW2EtekEtWjAtOV1bYS16QS1aMC05LV17MCwyNX0pKy9naTtcblxuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKGVtYWlsUmVnZXgsIG1hdGNoZXMgPT4gKFwiPGEgaHJlZj1cXFwibWFpbHRvOlwiICsgbWF0Y2hlcyArIFwiXFxcIj5cIiArIG1hdGNoZXMgKyBcIjwvYT5cIikpO1xuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4vKipcbiAqIFRyYW5zZm9ybWVyIGZvciB0cmFuc2Zvcm1pbmcgcGxhaW4tdGV4dCBjb250YWluaW5nIEh5cGVybGlua3NcbiAqIGludG8gdGV4dCB0aGF0IHdyYXBzIHRob3NlIEh5cGVybGlua3MgaW4gXCI8YT5cIi10YWdzLlxuICpcbiAqIEBleGFtcGxlXG4gKiAgbGV0IHRleHQgPSBcIlRoaXMgaXMgYW4gdXJsIGh0dHBzOi8vd3d3LmNvbmpvb24ub3JnIGFuZCBpdCBpcyBub3QgY2xpY2thYmxlXCI7XG4gKlxuICogIGxldCB0cmFuc2Zvcm1lciA9IG5ldyBIeXBlcmxpbmtUcmFuc2Zvcm1lcjtcbiAqXG4gKiAgdHJhbnNmb3JtZXIudHJhbnNmb3JtKHRleHQpO1xuICpcbiAqICAvLyByZXR1cm5zOlxuICogIC8vIFRoaXMgaXMgYW4gdXJsIDxhIGhyZWY9XCJodHRwczovL3d3dy5jb25qb29uLm9yZ1wiPmh0dHBzOi8vd3d3LmNvbmpvb24ub3JnPC9hPiBhbmQgaXQgaXMgbm90IGNsaWNrYWJsZVxuICpcbiAqL1xuY2xhc3MgSHlwZXJsaW5rVHJhbnNmb3JtZXIge1xuXG4gICAgLyoqXG4gICAgICogSW52b2tlcyB0cmFuc2Zvcm1pbmcgdGhlIHBhc3NlZCBzdHJpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWVcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICAgKi9cbiAgICB0cmFuc2Zvcm0gKHRleHQpIHtcblxuICAgICAgICBjb25zdCB1cmxSZWdleCA9IC8oXFxiKGh0dHBzPyk6XFwvXFwvWy1BLVowLTkrJkAjLyU/PX5ffCE6LC47XSpbLUEtWjAtOSsmQCMvJT1+X3xdKS9pZztcblxuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKHVybFJlZ2V4LCBtYXRjaGVzID0+IChcIjxhIGhyZWY9XFxcIlwiICsgbWF0Y2hlcyArIFwiXFxcIj5cIiArIG1hdGNoZXMgKyBcIjwvYT5cIikpO1xuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4vKipcbiAqIFRyYW5zZm9ybWVyIGZvciB0cmFuc2Zvcm1pbmcgcGxhaW4gdGV4dCBjb250YWluaW5nIGxpbmUgYnJlYWtzIChcXHIsIFxcclxcbiwgXFxuKVxuICogaW50byB0ZXh0IHRoYXQgcmVwbGFjZXMgdGhlIGxpbmUgYnJlYWtzIHdpdGggXCI8YnIgLz5cIi10YWdzLlxuICpcbiAqIEBleGFtcGxlXG4gKiAgbGV0IHRleHQgPSBcIlBsZWFzZVxcbiBkb24ndFxcblxcbiB3cmFwXFxubWVcIjtcbiAqXG4gKiAgbGV0IHRyYW5zZm9ybWVyID0gbmV3IExpbmVCcmVha1RyYW5zZm9ybWVyO1xuICpcbiAqICB0cmFuc2Zvcm1lci50cmFuc2Zvcm0odGV4dCk7XG4gKlxuICogIC8vIHJldHVybnM6XG4gKiAgLy8gUGxlYXNlPGJyIC8+IGRvbid0PGJyIC8+PGJyIC8+IHdyYXA8YnIgLz5tZVxuICpcbiAqL1xuY2xhc3MgTGluZUJyZWFrVHJhbnNmb3JtZXIge1xuXG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VzIHRyYW5zZm9ybWluZyB0aGUgcGFzc2VkIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRyYW5zZm9ybSAodGV4dCkge1xuXG4gICAgICAgIGNvbnN0IHJlZ2V4ID0gLyhcXHJcXG58XFxufFxccikvZ207XG5cbiAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZShyZWdleCwgbWF0Y2hlcyA9PiAoXCI8YnIgLz5cIikpO1xuXG4gICAgICAgIHJldHVybiB0ZXh0O1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG52YXIgX2w4anMkNSA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgICBfX3Byb3RvX186IG51bGwsXG4gICAgQmxvY2txdW90ZVRyYW5zZm9ybWVyOiBCbG9ja3F1b3RlVHJhbnNmb3JtZXIsXG4gICAgRW1haWxBZGRyZXNzVHJhbnNmb3JtZXI6IEVtYWlsQWRkcmVzc1RyYW5zZm9ybWVyLFxuICAgIEh5cGVybGlua1RyYW5zZm9ybWVyOiBIeXBlcmxpbmtUcmFuc2Zvcm1lcixcbiAgICBMaW5lQnJlYWtUcmFuc2Zvcm1lcjogTGluZUJyZWFrVHJhbnNmb3JtZXJcbn0pO1xuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxudmFyIF9sOGpzJDQgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gICAgX19wcm90b19fOiBudWxsLFxuICAgIGh0bWw6IF9sOGpzJDVcbn0pO1xuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxudmFyIF9sOGpzJDMgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gICAgX19wcm90b19fOiBudWxsLFxuICAgIHRyYW5zZm9ybWVyOiBfbDhqcyQ0XG59KTtcblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIGNsYXNzZXMgaW1wbGVtZW50aW5nIHRlbXBsYXRlIGNvbXBpbGVyIGZ1bmN0aW9uYWxpdHlcbiAqL1xuY2xhc3MgQ29tcGlsZXIge1xuXG4gICAgLyoqXG4gICAgICogQ29tcGlsZXMgdGhlIHNwZWNpZmllZCB0eHQgYW5kIHJldHVybnMgYW4gaW5zdGFuY2Ugb2YgQ29tcGlsZWRUcGwuXG4gICAgICogSW1wbGVtZW50aW5nIGNsYXNzZXMgc2hvdWxkIHRha2UgY2FyZSBvZiBwcm9wZXJseSBwYXJzaW5nIHRoZSB0eHQgZm9yIHRoZSBhbGxvd2VkIGtleXMgYW5kXG4gICAgICogdm9pZCBhbnkgb3RoZXIga2V5cyBkZXRlY3RlZCBpbiB0aGUgdGVtcGxhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHh0XG4gICAgICogQHBhcmFtIHtBcnJheX0ga2V5cyBBbiBhcnJheSBvZiBrZXlzIHJlcHJlc2VudGluZyBhbGxvd2VkIHRlbXBsYXRlIHZhcmlhYmxlcywgb3B0aW9uYWwuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtDb21waWxlZFRwbH1cbiAgICAgKlxuICAgICAqIEB0aHJvd3MgaWYgYW55IGVycm9yIGR1cmluZyBjb21waWxpbmcgb2NjdXJzXG4gICAgICovXG4gICAgY29tcGlsZSAodHh0LCBrZXlzKSB7fVxuXG5cbn1cblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIENvbXBpbGVkIFRlbXBsYXRlcy5cbiAqXG4gKi9cbmNsYXNzIENvbXBpbGVkVHBsIHtcblxuICAgIC8qKlxuICAgICAqIFJlcGxhY2VzIGtleXMgZnJvbSBkYXRhIGZvdW5kIGluIHRoaXMgY29tcGlsZWQgdGVtcGxhdGUgd2l0aCB0aGVpciBhcHByb3ByaWF0ZSB2YWx1ZXNcbiAgICAgKiBhbmQgcmV0dXJucyB0aGUgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoaXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqXG4gICAgICogQHRocm93cyBpZiBhbnkgZXJyb3IgZHVyaW5nIHRoZSByZW5kZXJpbmcgcHJvY2VzcyBvY2N1cnNcbiAgICAgKi9cbiAgICByZW5kZXIgKGRhdGEpIHt9XG5cbn1cblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cblxuLyoqXG4gKiBDb21waWxlZCBUZW1wbGF0ZSByZXByZXNlbnRhdGlvbiBmb3IgamF2YVNjcmlwdC1TdHJpbmdzLlxuICpcbiAqL1xuY2xhc3MgVHBsIGV4dGVuZHMgQ29tcGlsZWRUcGwge1xuXG4gICAgLyoqXG4gICAgICogQHZhciBmblxuICAgICAqIEB0eXBlIEZ1bmN0aW9uXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGludGVybmFsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBjb21waWxlZCB0ZW1wbGF0ZSB3cmFwcGVkIGluIGEgZnVuY3Rpb24uXG4gICAgICogQHBhcmFtIHtBcnJheX0ga2V5cyBhbGxvd2VkIGtleXMgYXMgcGFzc2VkIGZyb20gdGhlIGNvbXBpbGVyXG4gICAgICpcbiAgICAgKiBAdGhyb3dzIGlmIGZuIGlzIG5vdCBhIGZ1bmN0aW9uXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKGZuKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGlmICghaXNGdW5jdGlvbihmbikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlxcXCJmblxcXCIgbXVzdCBiZSBvZiB0eXBlIFxcXCJmdW5jdGlvblxcXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmZuID0gZm47XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAaW5oZXJpdGRvY1xuICAgICAqL1xuICAgIHJlbmRlciAoZGF0YSkge1xuICAgICAgICBjb25zdCBtZSA9IHRoaXM7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBtZS5mbi5jYWxsKHt9LCBkYXRhKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGByZW5kZXJpbmcgXCJkYXRhXCIgZmFpbGVkIHdpdGggbWVzc2FnZSAke2UubWVzc2FnZX1gKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbn1cblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG4vKipcbiAqIENvbXBpbGVyIGltcGxlbWVudGF0aW9uIGZvciBKYXZhU2NyaXB0IHRlbXBsYXRlIHN0cmluZ3MuXG4gKlxuICovXG5jbGFzcyBTdHJpbmdDb21waWxlciBleHRlbmRzIENvbXBpbGVyIHtcblxuICAgIC8qKlxuICAgICAqIEludGVybmFsIGNvbXBpbGVyIHJlcHJlc2VudGF0aW9uLlxuICAgICAqIEB2YXIgY3BsXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEBpbmhlcml0ZG9jXG4gICAgICovXG4gICAgY29tcGlsZSAodHh0LCBrZXlzKSB7XG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICBtZSA9IHRoaXMsXG4gICAgICAgICAgICB0cGxLZXlzID0gbWUuZ2V0S2V5cyh0eHQpLFxuICAgICAgICAgICAgYXJncyA9IG1lLmJ1aWxkQXJndW1lbnRMaXN0KHRwbEtleXMpLFxuICAgICAgICAgICAgaW52YWxpZEtleXMgPSBtZS5nZXRCbGFja2xpc3RlZEtleXMoYXJncywga2V5cyB8fCBbXSk7XG5cbiAgICAgICAgaWYgKGludmFsaWRLZXlzLmxlbmd0aCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgIGBDYW5ub3QgY29tcGlsZSB0ZW1wbGF0ZTogQ29udGFpbnMgaW52YWxpZCBrZXlzOiAke2ludmFsaWRLZXlzLmpvaW4oXCIsIFwiKX1gXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIGZuID0gbWUuZ2V0RnVuY3Rpb25Db25maWcoYXJncywgdHh0KSxcbiAgICAgICAgICAgIGNwbCA9IG1lLmdldE5hdGl2ZUZ1bmN0aW9uKGZuLmFyZ3MsIGZuLmZuKTtcblxuICAgICAgICByZXR1cm4gbmV3IFRwbChjcGwpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogR2V0cyBhIGxpc3Qgb2Yga2V5cyBhbmQgcmV0dXJucyBhbiBhcnJheSBvZiBhcmd1bWVudHMgcmVwcmVzZW50aW5nIHBvc3NpYmxlIGNhbmRpZGF0ZXNcbiAgICAgKiB0byBwYXNzIHRvIHRoZSB0ZW1wbGF0ZSByZW5kZXIgZnVuY3Rpb24uIE1ha2VzIHN1cmUgZW50cmllcyBhcmVcbiAgICAgKiB1bmlxdWUgYW5kIHRoYXQgb2JqZWN0IGNoYWlucyBhcmUgcmVzb2x2ZWQgdG8gdGhlIHJvb3Qgb2JqZWN0LlxuICAgICAqXG4gICAgICogIEBleGFtcGxlXG4gICAgICogIHRoaXMuYnVpbGRBcmd1bWVudExpc3QoW1wiZm9vXCIsIFwiZm9vLmJhclwiLCBcImNvbmZpZ1wiLCBcImNvbmZpZ1tcXFwidGVzdFxcXCJdXSk7IC8vIFwiZm9vLCBjb25maWdcIlxuICAgICAqXG4gICAgICogQHBhcmFtICB7QXJyYXl9IGtleUxpc3RcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBidWlsZEFyZ3VtZW50TGlzdCAoa2V5TGlzdCkge1xuICAgICAgICBsZXQgbGlzdCA9IGtleUxpc3QubWFwKGtleSA9PiBrZXkuc3BsaXQoL1xcLnxcXFsvKVswXSk7XG5cbiAgICAgICAgcmV0dXJuIFsuLi5uZXcgU2V0KGxpc3QpXTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEV4dHJhY3RzIGFsbCB0aGUgcGxhY2Vob2xkZXJzIHdpdGggdGhlaXIgbmFtZXMgb3V0IG9mIHRoZSB0eHQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHh0XG4gICAgICovXG4gICAgZ2V0S2V5cyAodHh0KSB7XG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICByZWdleCA9IC9cXCRcXHsoW159XSspXFx9L2dtLFxuICAgICAgICAgICAga2V5cyA9IFtdO1xuXG4gICAgICAgIGxldCBtO1xuXG4gICAgICAgIHdoaWxlICgobSA9IHJlZ2V4LmV4ZWModHh0KSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgbmVjZXNzYXJ5IHRvIGF2b2lkIGluZmluaXRlIGxvb3BzIHdpdGggemVyby13aWR0aCBtYXRjaGVzXG4gICAgICAgICAgICBpZiAobS5pbmRleCA9PT0gcmVnZXgubGFzdEluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmVnZXgubGFzdEluZGV4Kys7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRoZSByZXN1bHQgY2FuIGJlIGFjY2Vzc2VkIHRocm91Z2ggdGhlIGBtYC12YXJpYWJsZS5cbiAgICAgICAgICAgIG0uZm9yRWFjaCgobWF0Y2gsIGdyb3VwSW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXBJbmRleCA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBrZXlzLnB1c2gobWF0Y2gpOyAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ga2V5cztcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIENvbXBhcmVzIHRoZSB3aGl0ZWxpc3Qgb2Yga2V5cyB3aXRoIHRoZSBzdWJtaXR0ZWQga2V5cy5cbiAgICAgKiBSZXR1cm5zIGFsbCB2YWx1ZXMgdGhhdCBkbyBub3QgYXBwZWFyIGluIHRoZSB3aGl0ZWxpc3QuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHRoaXMuZ2V0QmxhY2tsaXN0ZWRLZXlzKFxuICAgICAqICAgICAgW1wiZm9vXCIsIFwiYmFyXCIsIFwid2luZG93XCIsIFwidGhpc1wiXSxcbiAgICAgKiAgICAgIFtcInRlc3RcIiwgXCJmb29cIiwgXCJ3aW5kb3dcIl1cbiAgICAgKiAgKTsgLy8gW1widGhpc1wiLCBcImJhclwiXVxuICAgICAqXG4gICAgICogQHBhcmFtIHtBcnJheX0gc291cmNlXG4gICAgICogQHBhcmFtIHtBcnJheX0gd2hpdGVsaXN0IGlmIGxlZnQgZW1wdHksIGFsbCBrZXlzIGFyZSBhbGxvd2VkXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtBcnJheX1cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZ2V0QmxhY2tsaXN0ZWRLZXlzIChzb3VyY2UsIHdoaXRlbGlzdCkge1xuICAgICAgICBpZiAoIXdoaXRlbGlzdC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc291cmNlLmZpbHRlcihlbnRyeSA9PiB3aGl0ZWxpc3QuaW5kZXhPZihlbnRyeSkgPT09IC0xKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYW4gaW50ZXJuYWwgY29uZmlndXJhdGlvbiBvYmplY3QgdGhhdCBnZXRzIHBhc3NlZCB0byBuZXcgRnVuY3Rpb25cbiAgICAgKiB0byBidWlsZCB0aGUgY29tcGlsZWQgZnVuY3Rpb24gZm9yIGNyZWF0aW5nIGFuIGVzaXguVHBsIG91dCBvZi5cbiAgICAgKiBBUEkgb25seS4gVGhpcyBtZXRob2Qgc2hvdWxkIGJlIGNhbGxlZCB3aG5ldmVyIHBhcnNpbmcgYW5kIHByZXBhcmluZyB0aGUgdGVtcGxhdGVcbiAgICAgKiB0ZXh0IGNvbXBsZXRlZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcmd1bWVudExpc3RcbiAgICAgKiBAcGFyYW0gdHh0XG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGdldEZ1bmN0aW9uQ29uZmlnIChhcmd1bWVudExpc3QsIHR4dCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgYXJncyA6IGB7JHthcmd1bWVudExpc3Quam9pbihcIiwgXCIpfX1gLFxuICAgICAgICAgICAgZm4gOiBgcmV0dXJuIFxcYCR7dHh0fVxcYGBcbiAgICAgICAgfTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZ2V0TmF0aXZlRnVuY3Rpb24gKGFyZ3MsIGJvZHkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBGdW5jdGlvbihhcmdzLCBib2R5KTtcbiAgICB9XG4gICAgXG59XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0ZW1wbGF0ZSBpbXBsZW1lbnRhdGlvbnMuXG4gKlxuICovXG5jbGFzcyBUZW1wbGF0ZSB7XG5cbiAgICAvKipcbiAgICAgKiBSZW5kZXJzIHRoaXMgdGVtcGxhdGVzIHR4dCB3aXRoIHRoZSBzcGVjaWZpZWQgZGF0YS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBjb21waWxlZCwgc2FuaXRpemVkIGFuZCBwYXJzZWQgdGVtcGxhdGUgd2l0aCB0aGUgcGxhY2Vob2xkZXJzXG4gICAgICogcmVwbGFjZWQgd2l0aCB0aGUgZGF0YSBmb3VuZCBpbiB0aGUgc3VibWl0dGVkIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEB0aHJvd3MgaWYgYW55IGVycm9yIGR1cmluZyB0aGUgcmVuZGVyaWcgcHJvY2VzcyBvY2N1cnMuXG4gICAgICovXG4gICAgcmVuZGVyIChkYXRhKSB7fVxuXG5cbn1cblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbi8qKlxuICogVGVtcGxhdGUgQ2xhc3MgcHJvdmlkaW5nIHN1cHBvcnQgZm9yIEphdmFTY3JpcHQgdGVtcGxhdGUgc3RyaW5ncy5cbiAqXG4gKi9cbmNsYXNzIFN0cmluZ1RlbXBsYXRlIGV4dGVuZHMgVGVtcGxhdGUge1xuXG5cbiAgICAvKipcbiAgICAgKiBAdmFyIHRwbFxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIE1hcHMgcHJlLWNvbXBpbGVkIHRlbXBsYXRlcyB3aXRoIHRoZSBrZXlzIG9mIHRoZSBkYXRhIG9iamVjdCBwYXNzZWQgdG8gdGhlbSBmb3JcbiAgICAgKiBidWlsZGluZyBhIGNvbXBpbGVyIGNhY2hlLlxuICAgICAqIEB2YXIgY29tcGlsZWRUcGxzXG4gICAgICogQHR5cGUge0FycmF5LjxUcGw+fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG5cblxuICAgIC8qKlxuICAgICAqIEB2YXIgY29tcGlsZXJcbiAgICAgKiBAdHlwZSB7U3RyaW5nQ29tcGlsZXJ9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cblxuXG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0b3IuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdHBsIFRoZSB0ZW1wbGF0ZSBzdHJpbmcgdGhpcyB0ZW1wbGF0ZSByZXByZXNlbnRzLlxuICAgICAqXG4gICAgICogQHRocm93cyB7Y29vbi5jb3JlLmV4Y2VwdGlvbi5JbGxlZ2FsQXJndW1lbnRFeGNlcHRpb259IGlmIGNvbXBpbGVyIGlzIG5vXG4gICAgICogaW5zdGFuY2Ugb2Yge2Nvb24uY29yZS50ZW1wbGF0ZS5Db21waWxlcn1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAodHBsKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGNvbnN0IG1lID0gdGhpcztcblxuICAgICAgICBtZS5jb21waWxlciA9IG5ldyBTdHJpbmdDb21waWxlcigpO1xuXG4gICAgICAgIG1lLnRwbCA9IHRwbDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFJlbmRlcnMgdGhpcyB0ZW1wbGF0ZXMgdHh0IHdpdGggdGhlIHNwZWNpZmllZCBkYXRhLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICAgKlxuICAgICAqIEB0aHJvd3MgZXhjZXB0aW9ucyBmcm9tIDxDb21waWxlcj4uY29tcGlsZSgpIGFuZCA8Q29tcGlsZWRUcGw+LnJlbmRlcigpXG4gICAgICovXG4gICAgcmVuZGVyIChkYXRhKSB7XG4gICAgICAgIGNvbnN0IG1lID0gdGhpcztcblxuICAgICAgICBsZXQga2V5cyAgID0gT2JqZWN0LmtleXMoZGF0YSksXG4gICAgICAgICAgICBjcGxLZXkgPSBrZXlzLmpvaW4oXCIuXCIpO1xuXG4gICAgICAgIG1lLmNvbXBpbGVkVHBscyA9IG1lLmNvbXBpbGVkVHBscyB8fCB7fTtcblxuICAgICAgICBpZiAoIW1lLmNvbXBpbGVkVHBsc1tjcGxLZXldKSB7XG4gICAgICAgICAgICBtZS5jb21waWxlZFRwbHNbY3BsS2V5XSA9IG1lLmNvbXBpbGVyLmNvbXBpbGUobWUudHBsLCBrZXlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtZS5jb21waWxlZFRwbHNbY3BsS2V5XS5yZW5kZXIoZGF0YSk7XG4gICAgfVxuXG5cbn1cblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbnZhciBfbDhqcyQyID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICAgIF9fcHJvdG9fXzogbnVsbCxcbiAgICBTdHJpbmdDb21waWxlcjogU3RyaW5nQ29tcGlsZXIsXG4gICAgU3RyaW5nVGVtcGxhdGU6IFN0cmluZ1RlbXBsYXRlLFxuICAgIFRwbDogVHBsXG59KTtcblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbnZhciBfbDhqcyQxID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICAgIF9fcHJvdG9fXzogbnVsbCxcbiAgICBlc2l4OiBfbDhqcyQyLFxuICAgIENvbXBpbGVkVHBsOiBDb21waWxlZFRwbCxcbiAgICBDb21waWxlcjogQ29tcGlsZXIsXG4gICAgVGVtcGxhdGU6IFRlbXBsYXRlXG59KTtcblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbi8qKlxuICogUmVzb3VyY2VSZXF1ZXN0b3ItaW1wbGVtZW50YXRpb24gdXNpbmcgWG1sSHR0cFJlcXVlc3QgYXBpLlxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogICAgLy8gZXhpc3RpbmcganNvbi1maWxlIGF0IFwiLi9hcHAtY25fbWFpbC5jb25mLmpzb25cIlxuICogICAgY29uc3QgZmlsZUxvYWRlciA9IG5ldyBYbWxIdHRwUmVzb3VyY2VSZXF1ZXN0b3IoKTtcbiAqICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZpbGVMb2FkZXIucmVxdWVzdChcIi4vYXBwLWNuX21haWwuY29uZi5qc29uXCIpO1xuICogICAgY29uc29sZS5sb2cocmVzKTsgLy8gcGxhaW4gdGV4dCBjb250ZW50cyBvZiB0aGUgZmlsZSBvbiBzdWNjZXNzXG4gKlxuICovXG5jbGFzcyBGaWxlTG9hZGVyIHtcblxuXG4gICAgLyoqXG4gICAgICogU2VuZHMgYSBIRUFEIHJlcXVlc3QgdG8gdGhlIHNwZWNpZmllZCByZXNvdXJjZSBsb2NhdGlvbi5cbiAgICAgKlxuICAgICAqXG4gICAgICogQHBhcmFtIHVybFxuICAgICAqXG4gICAgICogQHJldHVybiB7UHJvbWlzZTx2b2lkPn0gZmFsc2UgaWYgYW55IGV4Y2VwdGlvbiBvY2N1cmVzIHdoaWxlIHRyeWluZyB0byBhY2Nlc3MgdGhlIHJlc291cmNlLFxuICAgICAqIGluZGljYXRpbmcgdGhhdCB0aGUgcmVzb3VyY2UgbWlnaHQgbm90IGV4aXN0LlxuICAgICAqXG4gICAgICogQHRocm93cyBpZiB1cmwgd2FzIG5vdCBhIHN0cmluZ1xuICAgICAqL1xuICAgIGFzeW5jIHBpbmcgKHVybCkge1xuXG4gICAgICAgIGxldCByZXF1ZXN0O1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXF1ZXN0ID0gYXdhaXQgdGhpcy5yZXF1ZXN0KHVybCwgXCJIRUFEXCIpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVxdWVzdC5zdGF0dXMgPT09IDIwMDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEluaXRpYXRlcyBsb2FkaW5nIHRoZSBmaWxlIHNwZWNpZmllZCB3aXRoIHRoZSBnaXZlbiB1cmwgYW5kIHJldHVybnMgYVxuICAgICAqIFByb21pc2Ugb3IgYSBtaXhlZCB2YWx1ZSByZXByZXNlbnRpbmcgdGhlIGZpbGUgY29udGVudHMgaWYgdXNlZCB3aXRoIGFzeW5jL2F3YWl0LlxuICAgICAqIEltcGxlbWVudGluZyBBUElzIHNob3VsZCBiZSBhd2FyZSBvZiBwaW5nIHRvIHNlbmQgYSBIRUFELXJlcXVlc3QgdG8gdGhlIHJlc291cmNlXG4gICAgICogYmVmb3JlIGFuIGF0dGVtcHQgdG8gbG9hZCBpdCBpcyBtYWRlLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiAvLyB0aGVuYWJsZVxuICAgICAqIGxvYWRlci5sb2FkKFwiYXBwLWNuX21haWwuY29uZi5qc29uXCIpLnRoZW4oXG4gICAgICogICAgICAoY29uZikgPT4ge2NvbnNvbGUubG9nKGNvbmYpO30sIC8vIGNvbnNvbGUubG9ncyB0aGUgcGxhaW4gdGV4dCBmcm9tIHRoZSBsb2FkZWQgZmlsZVxuICAgICAqICAgICAgKGV4YykgPT4ge2NvbnNvbGUubG9nKGV4Yyk7fSAvLyBjb25zb2xlIGxvZ3MgdGhlIGV4Y2VwdGlvbiwgaWYgYW55IG9jY3VyZWQsXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdoaWNoIGlzIGEgY29vbi5jb3JlLmRhdGEucmVxdWVzdC5IdHRwUmVxdWVzdEV4Y2VwdGlvblxuICAgICAqICk7XG4gICAgICogLy8gb3JcbiAgICAgKiBsZXQgdHh0O1xuICAgICAqIHRyeSB7XG4gICAgICogICAgdHh0ID0gYXdhaXQgbG9hZGVyLmxvYWQoXCJhcHAtY25fbWFpbC5jb25mLmpzb25cIik7XG4gICAgICogfSBjYXRjaCAoZSkge1xuICAgICAqICAgIC8vIGV4Y2VwdGlvbiBoYW5kbGluZyBmb3IgIGNvb24uY29yZS5kYXRhLnJlcXVlc3QuSHR0cFJlcXVlc3RFeGNlcHRpb25cbiAgICAgKiB9XG4gICAgICogY29uc29sZS5sb2codHh0KTsgLy8gZmlsZSBjb250ZW50c1xuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgbG9jYXRpb24gdG8gcmVhZCB0aGUgZmlsZSBmcm9tXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlPCo+fVxuICAgICAqXG4gICAgICogQHRocm93cyBpZiBhbnkgZXhjZXB0aW9uIG9jY3VyZWQsIG9yIGlmIHVybCB3YXMgbm90IGEgc3RyaW5nXG4gICAgICovXG4gICAgYXN5bmMgbG9hZCAodXJsKSB7XG4gICAgICAgIGxldCByZXF1ZXN0ID0gYXdhaXQgdGhpcy5yZXF1ZXN0KHVybCwgXCJHRVRcIik7XG4gICAgICAgIHJldHVybiByZXF1ZXN0LnJlc3BvbnNlVGV4dDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHVybFxuICAgICAqIEBwYXJhbSBtZXRob2RcbiAgICAgKi9cbiAgICBhc3luYyByZXF1ZXN0ICh1cmwsIG1ldGhvZCkge1xuXG4gICAgICAgIGlmIChbXCJHRVRcIiwgXCJIRUFEXCJdLmluZGV4T2YobWV0aG9kKSA9PT0gLTEpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgXCJtZXRob2RcIiAoJHttZXRob2R9KSBpcyBub3Qgc3VwcG9ydGVkYCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWlzU3RyaW5nKHVybCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlxcXCJ1cmxcXFwiIG11c3QgYmUgYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSByZXNvdXJjZSBsb2NhdGlvblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCByZXQgPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgICByZXF1ZXN0Lm9wZW4obWV0aG9kLCB1cmwpO1xuXG4gICAgICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IChwcm9ncmVzc0V2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgaHR0cFJlcXVlc3QgPSBwcm9ncmVzc0V2ZW50LnRhcmdldDtcbiAgICAgICAgICAgICAgICBpZiAoaHR0cFJlcXVlc3Quc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShodHRwUmVxdWVzdCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0dHBSZXF1ZXN0LnN0YXR1cyArIFwiIFwiICsgaHR0cFJlcXVlc3Quc3RhdHVzVGV4dFxuICAgICAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSAocHJvZ3Jlc3NFdmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGh0dHBSZXF1ZXN0ID0gcHJvZ3Jlc3NFdmVudC50YXJnZXQ7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgICAgYEFuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJlZCB3aGlsZSB0cnlpbmcgdG8gbG9hZCBmcm9tIFwiJHtodHRwUmVxdWVzdC5yZXNwb25zZVVSTH1cImBcbiAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJlcXVlc3Quc2VuZCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuXG59XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG52YXIgX2w4anMgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gICAgX19wcm90b19fOiBudWxsLFxuICAgIEZpbGVMb2FkZXI6IEZpbGVMb2FkZXJcbn0pO1xuXG5leHBvcnQgeyBhc3NpZ24sIGNoYWluLCBjaG4sIGNyZWF0ZVJhbmdlLCBmZiwgZmluZEZpcnN0LCBmbGlwLCBncm91cEluZGljZXMsIGlzLCBpc0FycmF5LCBpc0Z1bmN0aW9uLCBpc05vdCwgaXNOdW1iZXIsIGlzT2JqZWN0LCBpc1BsYWluT2JqZWN0LCBpc1JlZ0V4cCwgaXNTdHJpbmcsIGlzYSwgaXNmLCBpc24sIGlzbywgaXNwbywgaXNyeCwgaXNzLCBsY2ssIGxpcXVpZnksIGxpc3ROZWlnaGJvdXJzLCBsb2NrLCBuY2huLCBwdXJnZSwgcmVwbGFjZSwgX2w4anMgYXMgcmVxdWVzdCwgcnBsLCBfbDhqcyQxIGFzIHRlbXBsYXRlLCBfbDhqcyQzIGFzIHRleHQsIHVuY2hhaW4sIHVuaWZ5LCB2aXNpdCwgdnN0IH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1sOC5wYWNrYWdlcy5lc20uanMubWFwXG4iLCIvKipcbiAqIGNvb24uanNcbiAqIHNpZXN0YS1saWItaGVscGVyXG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2Nvb24tanMvc2llc3RhLWxpYi1oZWxwZXJcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG5pbXBvcnQgKiBhcyBsOCBmcm9tIFwiQGw4anMvbDhcIjtcblxuXG4vKipcbiAqIFVzZXMgdGhlIHNwZWNpZmllZCB0ZXN0Q29uZmlnIGZvciB0ZWggcHJlTG9hZGVyLXNlY3Rpb24gYW5kIGFwcGxpZXMgdGhlIHJlbGF0ZWQgcGF0aHMgZm91bmQgYXRcbiAqIHBhdGhDb25maWdVcmwgKGNvbmZpZy1maWxlIHVybCgpKSB0byBpdCwgdGhlbiBwYXNzZXMgaXQgdG8gZ2V0UGF0aHMoKSBhbmQgcmV0dXJucyB0aGUgdmFsdWUuXG4gKiBjb250ZW50IGZvdW5kIGF0IHBhdGhDb25maWdVcmwgc2hvdWxkIGJlIGluIGEgZm9ybWF0IEBjb29uLWpzL2V4dGpzLWxpbmsgcHJvZHVjZXMuXG4gKlxuICogQGV4YW1wbGVcbiAqXG4gKiAganNvbiBhdCBcInBhdGhDb25maWdVcmwuanNvblwiOlxuICpcbiAqICB7XG4gKiAgICAgICBjc3M6IFt7XG4gKiAgICAgICAgICAgICAgIG1vZGVybjogW1xuICogICAgICAgICAgICAgICAgICAgXCJmb28uY3NzXCJcbiAqICAgICAgICAgICAgICAgXSxcbiAqICAgICAgICAgICAgICAgY2xhc3NpYzogW1xuICogICAgICAgICAgICAgICAgICAgXCJiYXIuY3NzXCJcbiAqICAgICAgICAgICAgICAgXVxuICpcbiAqICAgICAgIH1dLFxuICogICAgICAganM6IHtcbiAqICAgICAgICAgICAgICAgbW9kZXJuOiBcIm1vZGVybi5qc1wiLFxuICogICAgICAgICAgICAgICBjbGFzc2ljOiBcImNsYXNzaWMuanNcIlxuICpcbiAqICAgICAgfVxuICogICB9XG4gKlxuICpcbiAqICBjb25zdCBjb25maWcgPSB7XG4gKiAgICAgIGxvYWRlclBhdGg6IHtcbiAqICAgICAgIFwiRXh0LlBhY2thZ2VcIjogXCIvbm9kZV9tb2R1bGVzL0Bjb29uLWpzL2V4dGpzLXBhY2thZ2UtbG9hZGVyL3BhY2thZ2VzL3BhY2thZ2UtbG9hZGVyL3NyYy9zcmMvUGFja2FnZS5qc1wiLFxuICogICAgICAgXCJjb29uLmNvcmVcIjogXCIuLi9zcmMvXCIsXG4gKiAgIH0sXG4gKiAgIHByZWxvYWRzOiB7XG4gKiAgICAgICBjc3M6IFt7XG4gKiAgICAgICAgICAgICAgIG1vZGVybjogW1xuICogICAgICAgICAgICAgICAgICAgXCIvbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LW1vZGVybi1ydW50aW1lL21hdGVyaWFsL21hdGVyaWFsLWFsbF8xLmNzc1wiLFxuICogICAgICAgICAgICAgICAgICAgXCIvbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LW1vZGVybi1ydW50aW1lL21hdGVyaWFsL21hdGVyaWFsLWFsbF8yLmNzc1wiXG4gKiAgICAgICAgICAgICAgIF0sXG4gKiAgICAgICAgICAgICAgIGNsYXNzaWM6IFtcbiAqICAgICAgICAgICAgICAgICAgIFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1jbGFzc2ljLXJ1bnRpbWUvbWF0ZXJpYWwvbWF0ZXJpYWwtYWxsXzEuY3NzXCIsXG4gKiAgICAgICAgICAgICAgICAgICBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtY2xhc3NpYy1ydW50aW1lL21hdGVyaWFsL21hdGVyaWFsLWFsbF8yLmNzc1wiLFxuICogICAgICAgICAgICAgICAgICAgXCIvbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LWNsYXNzaWMtcnVudGltZS9tYXRlcmlhbC9tYXRlcmlhbC1hbGxfMy5jc3NcIlxuICogICAgICAgICAgICAgICBdXG4gKiAgICAgICB9XSxcbiAqICAgICAgIGpzOiBbXG4gKiAgICAgICAgICAgXCIvbm9kZV9tb2R1bGVzL0BsOGpzL2w4L2Rpc3QvbDgucnVudGltZS5qc1wiLCB7XG4gKiAgICAgICAgICAgICAgIG1vZGVybjogXCIvbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LW1vZGVybi1ydW50aW1lL21vZGVybi5lbmdpbmUuZW50ZXJwcmlzZS5qc1wiLFxuICogICAgICAgICAgICAgICBjbGFzc2ljOiBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtbW9kZXJuLXJ1bnRpbWUvY2xhc3NpYy5lbmdpbmUuZW50ZXJwcmlzZS5qc1wiXG4gKiAgICAgICAgICAgfVxuICogICAgICAgXVxuICogICB9fTtcbiAqXG4gKiAgY29uZmlndXJlV2l0aEV4dEpzTGlua1BhdGhzKGNvbmZpZywgXCJwYXRoQ29uZmlnVXJsLmpzb25cIiwgdHJ1ZSk7IC8vIHJldHVybnMge1xuICogICAvLyAgIHByZWxvYWQgOiBbXG4gKiAgIC8vICAgICAgIFwiZm9vLmNzc1wiLFxuICogICAvLyAgICAgICBcIi9ub2RlX21vZHVsZXMvQGw4anMvbDgvZGlzdC9sOC5ydW50aW1lLmpzXCIsXG4gKiAgIC8vICAgICAgIFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1tb2Rlcm4tcnVudGltZS9tb2Rlcm4uZW5naW5lLmVudGVycHJpc2UuanNcIlxuICogICAvLyAgICAgICBcIm1vZGVybi5qc1wiXG4gKiAgIC8vICAgXSxcbiAqICAgLy8gICBsb2FkZXJQYXRoIDoge1xuICogICAvLyAgICAgICBcIkV4dC5QYWNrYWdlXCI6IFwiL25vZGVfbW9kdWxlcy9AY29vbi1qcy9leHRqcy1wYWNrYWdlLWxvYWRlci9wYWNrYWdlcy9wYWNrYWdlLWxvYWRlci9zcmMvc3JjL1BhY2thZ2UuanNcIixcbiAqICAgLy8gICAgICAgXCJjb29uLmNvcmVcIjogXCIuLi9zcmMvXCJcbiAqICAgLy8gICB9XG4gKiAgLy8gfTtcbiAqXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHRlc3RDb25maWdcbiAqIEBwYXJhbSB7U3RyaW5nfSBwYXRoQ29uZmlnVXJsXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGlzTW9kZXJuXG4gKiBAcmV0dXJucyB7UHJvbWlzZTx7bG9hZGVyUGF0aDoge30sIHByZWxvYWQ6ICpbXX0+fVxuICovXG5leHBvcnQgY29uc3QgY29uZmlndXJlV2l0aEV4dEpzTGlua1BhdGhzID0gYXN5bmMgZnVuY3Rpb24gKHRlc3RDb25maWcsIHBhdGhDb25maWdVcmwsIGlzTW9kZXJuKSB7XG5cbiAgICBjb25zdFxuICAgICAgICBsb2FkZXIgPSBuZXcgbDgucmVxdWVzdC5GaWxlTG9hZGVyKCk7XG5cbiAgICBpZiAoYXdhaXQgbG9hZGVyLnBpbmcocGF0aENvbmZpZ1VybCkpIHtcblxuICAgICAgICBjb25zdFxuICAgICAgICAgICAgZXh0anNMaW5rQ29uZmlnID0gSlNPTi5wYXJzZShhd2FpdCBsb2FkZXIubG9hZChwYXRoQ29uZmlnVXJsKSksXG4gICAgICAgICAgICBtZXJnZWRDc3MgPSB7fSwgbWVyZ2VkSnMgPSB7fSxcbiAgICAgICAgICAgIGNvbGxlY3QgPSAoc2VjdGlvbiwgdG9vbGtpdCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCByZXMgPSBbXTtcbiAgICAgICAgICAgICAgICBzZWN0aW9uLmZvckVhY2goZW50cnkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAobDguaXNTdHJpbmcoZW50cnkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMucHVzaChlbnRyeSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobDguaXNwbyhlbnRyeSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcyA9IHJlcy5jb25jYXQoZW50cnlbdG9vbGtpdF0gPz8gW10pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcztcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgW1wiY2xhc3NpY1wiLCBcIm1vZGVyblwiXS5mb3JFYWNoKHRvb2xraXQgPT4ge1xuXG4gICAgICAgICAgICBsZXQgZmYgPSBsOC5mZi5iaW5kKG51bGwsIHRvb2xraXQpLFxuICAgICAgICAgICAgICAgIGNzcyA9IGNvbGxlY3QoW10uY29uY2F0KGw4Lm5jaG4oXCJwcmVsb2FkLmNzc1wiLCB0ZXN0Q29uZmlnKSksIHRvb2xraXQpLFxuICAgICAgICAgICAgICAgIGpzID0gY29sbGVjdChbXS5jb25jYXQobDgubmNobihcInByZWxvYWQuanNcIiwgdGVzdENvbmZpZykpLCB0b29sa2l0KSxcbiAgICAgICAgICAgICAgICBleHRDc3MgPSBsOC5uY2huKFwiY3NzXCIsIGV4dGpzTGlua0NvbmZpZywgZmYpLFxuICAgICAgICAgICAgICAgIGV4dEpzID0gIGw4Lm5jaG4oXCJqc1wiLCBleHRqc0xpbmtDb25maWcsIGZmKTtcblxuXG5cbiAgICAgICAgICAgIGw4LmNobih0b29sa2l0LCBtZXJnZWRDc3MsIFtdLmNvbmNhdChjc3MsIFtdLmNvbmNhdChleHRDc3MpKSk7XG4gICAgICAgICAgICBsOC5jaG4odG9vbGtpdCwgbWVyZ2VkSnMsIFtdLmNvbmNhdChqcywgW10uY29uY2F0KGV4dEpzKSkpO1xuICAgICAgICB9KTtcblxuXG4gICAgICAgIGw4LmNobihcInByZWxvYWQuY3NzXCIsIHRlc3RDb25maWcsIG1lcmdlZENzcywgdHJ1ZSk7XG4gICAgICAgIGw4LmNobihcInByZWxvYWQuanNcIiwgdGVzdENvbmZpZywgbWVyZ2VkSnMsIHRydWUpO1xuICAgIH1cblxuICAgIHJldHVybiBnZXRQYXRocyh0ZXN0Q29uZmlnLCBpc01vZGVybik7XG5cbn07XG5cblxuLyoqXG4gKiBDb25zdW1lcyBhIGNvbmZpZ3VyYXRpb24gb2JqZWN0IGFuZCBsb29rcyB1cCBqcy9jc3MtcmVsYXRlZCBwYXRoIGluZm9ybWF0aW9uLFxuICogdGhlbiByZXR1cm5zIGl0IHByZS1jb25maWd1cmVkIHRvIGJlIHVzZWQgd2l0aCBTaWVzdGFzIFNpZXN0YS5IYXJuZXNzLkJyb3dzZXIuRXh0SlMoKSNjb25maWcuXG4gKlxuICogQGV4YW1wbGVcbiAqXG4gKiAgY29uc3QgY29uZmlnID0ge1xuICogICAgICBsb2FkZXJQYXRoOiB7XG4gKiAgICAgICBcIkV4dC5QYWNrYWdlXCI6IFwiL25vZGVfbW9kdWxlcy9AY29vbi1qcy9leHRqcy1wYWNrYWdlLWxvYWRlci9wYWNrYWdlcy9wYWNrYWdlLWxvYWRlci9zcmMvc3JjL1BhY2thZ2UuanNcIixcbiAqICAgICAgIFwiY29vbi5jb3JlXCI6IFwiLi4vc3JjL1wiLFxuICogICB9LFxuICogICBwcmVsb2Fkczoge1xuICogICAgICAgY3NzOiBbe1xuICogICAgICAgICAgICAgICBtb2Rlcm46IFtcbiAqICAgICAgICAgICAgICAgICAgIFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1tb2Rlcm4tcnVudGltZS9tYXRlcmlhbC9tYXRlcmlhbC1hbGxfMS5jc3NcIixcbiAqICAgICAgICAgICAgICAgICAgIFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1tb2Rlcm4tcnVudGltZS9tYXRlcmlhbC9tYXRlcmlhbC1hbGxfMi5jc3NcIlxuICogICAgICAgICAgICAgICBdLFxuICogICAgICAgICAgICAgICBjbGFzc2ljOiBbXG4gKiAgICAgICAgICAgICAgICAgICBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtY2xhc3NpYy1ydW50aW1lL21hdGVyaWFsL21hdGVyaWFsLWFsbF8xLmNzc1wiLFxuICogICAgICAgICAgICAgICAgICAgXCIvbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LWNsYXNzaWMtcnVudGltZS9tYXRlcmlhbC9tYXRlcmlhbC1hbGxfMi5jc3NcIixcbiAqICAgICAgICAgICAgICAgICAgIFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1jbGFzc2ljLXJ1bnRpbWUvbWF0ZXJpYWwvbWF0ZXJpYWwtYWxsXzMuY3NzXCJcbiAqICAgICAgICAgICAgICAgXVxuICogICAgICAgfV0sXG4gKiAgICAgICBqczogW1xuICogICAgICAgICAgIFwiL25vZGVfbW9kdWxlcy9AbDhqcy9sOC9kaXN0L2w4LnJ1bnRpbWUuanNcIiwge1xuICogICAgICAgICAgICAgICBtb2Rlcm46IFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1tb2Rlcm4tcnVudGltZS9tb2Rlcm4uZW5naW5lLmVudGVycHJpc2UuanNcIixcbiAqICAgICAgICAgICAgICAgY2xhc3NpYzogXCIvbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LW1vZGVybi1ydW50aW1lL2NsYXNzaWMuZW5naW5lLmVudGVycHJpc2UuanNcIlxuICogICAgICAgICAgfVxuICogICAgICAgXVxuICogICB9fTtcbiAqXG4gKiAgZ2V0UGF0aHMoY29uZmlnLCB0cnVlKTsgLy8gcmV0dXJucyB7XG4gKiAgIC8vICAgcHJlbG9hZCA6IFtcbiAqICAgLy8gICAgICAgXCIvbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LW1vZGVybi1ydW50aW1lL21hdGVyaWFsL21hdGVyaWFsLWFsbF8xLmNzc1wiLFxuICogICAvLyAgICAgICBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtbW9kZXJuLXJ1bnRpbWUvbWF0ZXJpYWwvbWF0ZXJpYWwtYWxsXzIuY3NzXCIsXG4gKiAgIC8vICAgICAgIFwiL25vZGVfbW9kdWxlcy9AbDhqcy9sOC9kaXN0L2w4LnJ1bnRpbWUuanNcIixcbiAqICAgLy8gICAgICAgXCIvbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LW1vZGVybi1ydW50aW1lL21vZGVybi5lbmdpbmUuZW50ZXJwcmlzZS5qc1wiXG4gKiAgIC8vICAgXSxcbiAqICAgLy8gICBsb2FkZXJQYXRoIDoge1xuICogICAvLyAgICAgICBcIkV4dC5QYWNrYWdlXCI6IFwiL25vZGVfbW9kdWxlcy9AY29vbi1qcy9leHRqcy1wYWNrYWdlLWxvYWRlci9wYWNrYWdlcy9wYWNrYWdlLWxvYWRlci9zcmMvc3JjL1BhY2thZ2UuanNcIixcbiAqICAgLy8gICAgICAgXCJjb29uLmNvcmVcIjogXCIuLi9zcmMvXCJcbiAqICAgLy8gICB9XG4gKiAgLy8gfTtcbiAqXG4gKlxuICpcbiAqL1xuZXhwb3J0IGNvbnN0IGdldFBhdGhzID0gKGNvbmZpZywgaXNNb2Rlcm4pID0+IHtcblxuICAgIGNvbnN0XG4gICAgICAgIHJlc3VsdCA9IHtwcmVsb2FkOiBbXSwgbG9hZGVyUGF0aDoge319LFxuICAgICAgICBpc09iamVjdCA9IGw4LmlzT2JqZWN0LFxuICAgICAgICBpc0FycmF5ID0gbDguaXNBcnJheSxcbiAgICAgICAgaXNTdHJpbmcgPSBsOC5pc1N0cmluZyxcbiAgICAgICAgdG9vbGtpdCA9IGlzTW9kZXJuID8gXCJtb2Rlcm5cIiA6IGlzTW9kZXJuID09PSBmYWxzZSA/IFwiY2xhc3NpY1wiIDogbnVsbCxcbiAgICAgICAgcGFyc2VTZWN0aW9uID0gKHNlY3Rpb24pID0+IHtcblxuICAgICAgICAgICAgc2VjdGlvbiA9IFtdLmNvbmNhdChzZWN0aW9uKTtcblxuICAgICAgICAgICAgc2VjdGlvbi5mb3JFYWNoKChlbnRyeSkgPT4ge1xuXG4gICAgICAgICAgICAgICAgaWYgKGlzU3RyaW5nKGVudHJ5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHJlbG9hZC5wdXNoKGVudHJ5KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KGVudHJ5KSAmJiB0b29sa2l0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0FycmF5KGVudHJ5W3Rvb2xraXRdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnByZWxvYWQgPSByZXN1bHQucHJlbG9hZC5jb25jYXQoZW50cnlbdG9vbGtpdF0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKGVudHJ5W3Rvb2xraXRdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnByZWxvYWQucHVzaChlbnRyeVt0b29sa2l0XSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH07XG5cbiAgICBsOC5hc3NpZ24oXG4gICAgICAgIHJlc3VsdC5sb2FkZXJQYXRoLFxuICAgICAgICBbY29uZmlnLmxvYWRlclBhdGggfHwge30sIFwiY2xhc3NpY1wiLCBcIm1vZGVyblwiXSxcbiAgICAgICAgY29uZmlnLmxvYWRlclBhdGggJiYgY29uZmlnLmxvYWRlclBhdGhbdG9vbGtpdF0gPyBjb25maWcubG9hZGVyUGF0aFt0b29sa2l0XSA6IHt9XG4gICAgKTtcblxuICAgIGNvbnN0IHtqcywgY3NzfSA9IGNvbmZpZy5wcmVsb2FkIHx8IHt9O1xuXG4gICAgcGFyc2VTZWN0aW9uKGNzcyk7XG4gICAgcGFyc2VTZWN0aW9uKGpzKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG5cbn07Il0sIm5hbWVzIjpbImw4LnJlcXVlc3QiLCJsOC5pc1N0cmluZyIsImw4LmlzcG8iLCJmZiIsImw4LmZmIiwibDgubmNobiIsImw4LmNobiIsImlzT2JqZWN0IiwibDguaXNPYmplY3QiLCJpc0FycmF5IiwibDguaXNBcnJheSIsImlzU3RyaW5nIiwibDguYXNzaWduIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxDQUFDO0FBQ3RELE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQztBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNLFFBQVEsR0FBRyxNQUFNLElBQUksT0FBTyxNQUFNLEtBQUssUUFBUSxDQUFDO0FBQ3RELE1BQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQztBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU0sYUFBYSxHQUFHLE1BQU0sSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRO0FBQzFELHVDQUF1QyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFD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
