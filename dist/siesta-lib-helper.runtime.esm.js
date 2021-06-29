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

export { configureWithExtJsLinkPaths, getPaths };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2llc3RhLWxpYi1oZWxwZXIucnVudGltZS5lc20uanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9AbDhqcy9sOC9kaXN0L2w4LnBhY2thZ2VzLmVzbS5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuLyoqXG4gKlxuICogQHBhcmFtIHRhcmdldFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuY29uc3QgaXNTdHJpbmcgPSB0YXJnZXQgPT4gdHlwZW9mIHRhcmdldCA9PT0gXCJzdHJpbmdcIjtcbmNvbnN0IGlzcyA9IGlzU3RyaW5nO1xuXG4vKipcbiAqIFxuICogQHBhcmFtIHRhcmdldFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuY29uc3QgaXNPYmplY3QgPSB0YXJnZXQgPT4gdHlwZW9mIHRhcmdldCA9PT0gXCJvYmplY3RcIjtcbmNvbnN0IGlzbyA9IGlzT2JqZWN0O1xuXG5cbi8qKlxuICpcbiAqIEBwYXJhbSB0YXJnZXRcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmNvbnN0IGlzUGxhaW5PYmplY3QgPSB0YXJnZXQgPT4gdHlwZW9mIHRhcmdldCA9PT0gXCJvYmplY3RcIiAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRhcmdldCkgPT09IFwiW29iamVjdCBPYmplY3RdXCIgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0O1xuY29uc3QgaXNwbyA9IGlzUGxhaW5PYmplY3Q7XG5cblxuLyoqXG4gKiBcbiAqIEBwYXJhbSB0YXJnZXRcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmNvbnN0IGlzRnVuY3Rpb24gPSB0YXJnZXQgPT4gdHlwZW9mIHRhcmdldCA9PT0gXCJmdW5jdGlvblwiO1xuY29uc3QgaXNmID0gaXNGdW5jdGlvbjtcblxuLyoqXG4gKlxuICogQHBhcmFtIHRhcmdldFxuICogQHJldHVybiB7Ym9vbGVhbn1cbiAqL1xuY29uc3QgaXNOdW1iZXIgPSB0YXJnZXQgPT4gdHlwZW9mIHRhcmdldCA9PT0gXCJudW1iZXJcIjtcbmNvbnN0IGlzbiA9IGlzTnVtYmVyO1xuXG4vKipcbiAqXG4gKiBAcGFyYW0gdGFyZ2V0XG4gKiBAcmV0dXJuIHthbnl9XG4gKi9cbmNvbnN0IGlzQXJyYXkgPSB0YXJnZXQgPT4gIEFycmF5LmlzQXJyYXkgPyBBcnJheS5pc0FycmF5KHRhcmdldCkgOiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodGFyZ2V0KSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiO1xuY29uc3QgaXNhID0gaXNBcnJheTtcblxuLyoqXG4gKlxuICogQHBhcmFtIHRhcmdldFxuICogQHJldHVybiB7YW55fVxuICovXG5jb25zdCBpc1JlZ0V4cCA9IHRhcmdldCA9PiB0YXJnZXQgaW5zdGFuY2VvZiBSZWdFeHA7XG5jb25zdCBpc3J4ID0gaXNSZWdFeHA7XG5cbi8qKlxuICogXG4gKiBAcGFyYW0gdGFyZ2V0XG4gKiBAcmV0dXJuIHt7YTogKGZ1bmN0aW9uKCopOiBib29sZWFuKSwgb2Y6IChmdW5jdGlvbigqKTogYm9vbGVhbil9fVxuICovXG5jb25zdCBpcyA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICByZXR1cm4gIHtcbiAgICAgICAgYTogdHlwZSA9PiB0eXBlb2YgdGFyZ2V0ID09PSB0eXBlLFxuICAgICAgICBvZjogY2xzID0+IGlzRnVuY3Rpb24oY2xzKSA/IHRhcmdldCBpbnN0YW5jZW9mIGNscyA6IGZhbHNlXG4gICAgfTtcbn07XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4vKipcbiAqIFByb3h5IGZvciBvYmplY3RzIHRvIGNyZWF0ZSBmbHVlbnQgaW50ZXJmYWNlcyBvdXQgb2YgYXN5bmMgbWV0aG9kcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogICBjb25zdCBzb3VyY2UgPSB7XG4gKiAgICAgZm9vIDogYXN5bmMgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSxcbiAqICAgICBiYXIgOiBhc3luYyBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9LFxuICogICAgIHNuYWZ1IDogYXN5bmMgZnVuY3Rpb24gKCkgeyByZXR1cm4gXCJzbmFmdVwiOyB9XG4gKiAgIH07XG4gKlxuICogICBjb25zb2xlLmxvZyhcbiAqICAgICAgIC8vIGluc3RlYWQgb2ZcbiAqICAgICAgIGF3YWl0IHNvdXJjZS5mb28oKVxuICogICAgICAgICAgICAgLnRoZW4odmFsdWUgPT4gc291cmNlLmJhcigpKVxuICogICAgICAgICAgICAgLnRoZW4odmFsdWUgPT4gc291cmNlLnNuYWZ1KCkpXG4gKiAgICk7IC8vIFwic25hZnVcbiAqICAgLy8gLi4ueW91IGNhbiB3cml0ZSBpdC4uLlxuICogICBjb25zb2xlLmxvZyhcbiAqICAgICAgLy8gLi4uIGxpa2UgdGhpczpcbiAqICAgICAgYXdhaXQgbGlxdWlmeShzb3VyY2UpLmZvbygpXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIC5iYXIoKVxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAuc25hZnUoKVxuICogICApOyAvLyBzbmFmdVxuICpcbiAqIFByZXJlcXVpc2l0ZXM6XG4gKiA9PT09PT09PT09PT09PVxuICogLSB5b3VyIGFzeW5jIG1ldGhvZHMgaGF2ZSB0byByZXR1cm4gXCJ0aGlzXCIsIGkuZS4gdGhlIHNvdXJjZSBvYmplY3Qgb2ZcbiAqICAgdGhlIGFzeW5jIG1ldGhvZCwgc2luY2UgdGhlIG9uRnVsbGZpbGxlZCBtZXRob2RzIG5lZWQgdG8gZm9yd2FyZFxuICogICB0aGlzIGV4YWN0IHNhbWUgb2JqZWN0LlxuICpcbiAqICAgQGV4YW1wbGVcbiAqICAgY29uc3Qgc291cmNlID0ge1xuICogICAgIGZvbyA6IGFzeW5jIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0sXG4gKiAgICAgYmFyIDogYXN5bmMgZnVuY3Rpb24gKCkgeyByZXR1cm4gXCJzb21lcmFuZG9tc3RyaW5nXCI7IH0sXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF5eXl5eXl5eXl5eXl5eXl5eXlxuICogICAgIHNuYWZ1IDogYXN5bmMgZnVuY3Rpb24gKCkgeyByZXR1cm4gXCJzbmFmdVwiOyB9XG4gKiAgIH07XG4gKiAgYXdhaXQgbGlxdWlmeShzb3VyY2UpLmZvbygpLmJhcigpLnNuYWZ1KCkgLy8gd2lsbCB0aHJvdyBhbiBlcnJvciBzaW5jZSBcInNuYWZ1XCJcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjYW5ub3QgYmUgbG9va2VkIHVwIGFueW1vcmVcbiAqXG4gKlxuICogVGhlb3J5OlxuICogPT09PT09PVxuICogICAtIGxpcXVpZnkoc291cmNlKS5mb28oKS5iYXIoKVxuICogIDEuIGxpcXVpZnkoc291cmNlKVxuICogICAgICBUaGlzIGNhbGwgd2lsbCBjcmVhdGUgYSBQcm94eSB0aGF0IHRyYXBzIGZ1cnRoZXIgY2FsbHMgLyBsb29rdXBzIG9uIHRoaXMgZXhhY3Qgc2FtZVxuICogICAgICBvYmplY3QuXG4gKlxuICogIDIuIGxpcXVpZnkoc291cmNlKS5mb29cbiAqICAgICBJcyB0cmFwcGVkIGJ5IHRoZSBoYW5kbGVyJ3MgZ2V0IG1ldGhvZC4gUmV0dXJucyBhIHByb3hpZXMsIGJvdW5kKCEpIGZ1bmN0aW9uOlxuICogICAgIHRhcmdldDogc291cmNlXG4gKiAgICAgcHJvcGVydHk6IGZvb1xuICogICAgID0+IHJldHVybnM6IGxpcXVpZnkodGFyZ2V0W3Byb3BlcnR5XS5iaW5kKHRhcmdldCkpXG4gKlxuICogIDMuIGxpcXVpZnkoc291cmNlKS5mb28oKVxuICogICAgIEEgcHJldmlvdXMgY2FsbCB0byBcImxpcXVpZnkoc291cmNlKS5mb29cIiByZXR1cm5lZCBhIGJvdW5kIGZ1bmN0aW9uIHRoYXQgd2FzIGFnYWluIHByb3hpZWRcbiAqICAgICBpbiBzdGVwIDIuIEF0IHRoaXMgcG9pbnQsIHRoZSBtZXRob2QgY2FsbCBvcmlnaW5hdGluZyBmcm9tIFwiZm9vKClcIiBpcyBub3cgdHJhcHBlZCBpbiB0aGVcbiAqICAgICBQcm94eSdzIFwiYXBwbHkoKVwiIGhhbmRsZXIuXG4gKiAgICAgVGhlIHJldHVybmVkIFByb21pc2UgaXMgcHJveGllZCBhZ2Fpbi5cbiAqICAgICA9PiByZXR1cm5zOiBsaXF1aWZ5KHRhcmdldC5hcHBseSh0aGlzQXJnLCBhcmd1bWVudHNMaXN0KVxuICpcbiAqICA0LiBsaXF1aWZ5KHNvdXJjZSkuZm9vKCkuYmFyXG4gKiAgICAgU3RlcCAzLiByZXR1cm5lZCBhIHByb21pc2UsIHNvIFwiYmFyXCIgYXMgYSBwcm9wZXJ0eSBpcyBub3cgaW5pdGlhbGx5IGxvb2tlZCB1cCBvbiB0aGUgUHJvbWlzZS5cbiAqICAgICBUaGUgcHJvYmxlbSBpcywgb2YgY291cnNlLCB0aGF0IHRoZSBQcm9taXNlIGRvZXMgbm90IGhhdmUgYSBwcm9wZXJ0eSBjYWxsZWQgXCJiYXJcIi4gV2Ugbm93XG4gKiAgICAgaGF2ZSB0byB0YWtlIGNhcmUgb2YgcGlwaW5nIHRoZSBzb3VyY2Ugb2JqZWN0IHRocm91Z2ggc28gdGhlIGZvbGxvd2luZyBtZXRob2QgY2FsbCBjYW5cbiAqICAgICBwcm9wZXJseSByZXNvbHZlIHRvIFwic291cmNlLmJhcigpXCIuXG4gKiAgICAgV2UgZG8gdGhpcyBieSBpbXBsZW1lbnRpbmcgdGhlIGZ1bGxmaWxsZWQtbWV0aG9kLiBUaGUgZ2V0LWhhbmRsZXIgd2lsbCBjaGVja1xuICogICAgIGlmIHRoZSB0YXJnZXQgb3ducyBhIFwidGhlblwiLW1ldGhvZCBhbmQgcmV0dXJuIHRoZSBmb2xsb3dpbmc6XG4gKiAgICAgbGlxdWlmeSh0YXJnZXQudGhlbih2YWx1ZSA9PiB2YWx1ZVtwcm9wZXJ0eV0uYmluZCh2YWx1ZSkpKTtcbiAqICAgICBeXiAxKiBeXiAgICAgXl4gMiogXl4gICAgXl5eXl5eXl5eIDMqIF5eXl5eXl5eXl5cbiAqICAgICAxKiB0aGlzIGlzIHRoZSBQcm9taXNlIHRoYXQgd2FzIHByb3hpZWQgaW4gc3RlcCAzXG4gKiAgICAgMiogdmFsdWUgaXMgdGhlIHJldHVybi12YWx1ZSBvZiB0aGUgb3JpZ2luYWwgYXN5bmMgbWV0aG9kIGltcGxlbWVudGF0aW9uXG4gKiAgICAgICAgb2Ygc291cmNlLmZvbygpXG4gKiAgICAgMyogXCJwcm9wZXJ0eVwiIGlzIGtub3duIHRvIHRoZSBpbXBsZW1lbnRhdGlvbiBvZiB0aGUgXCJmdWxsZmlsbGVkXCItbWV0aG9kIHdoZW4gaXRcbiAqICAgICAgICAgZ2V0cyBjYWxsZWQgKHNlZSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L0d1aWRlL0Z1bmN0aW9ucykuXG4gKiAgICAgICAgVGhlIHJldHVybiB2YWx1ZSBvZiB0aGlzIGZ1bGxmaWxsZWQtbWV0aG9kIGlzIHRoZSBtZXRob2QgXCJiYXJcIiwgYm91bmQgdG8gXCJzb3VyY2VcIiwgaXQncyBvcmlnaW4uXG4gKlxuICogICA1LiBsaXF1aWZ5KHNvdXJjZSkuZm9vKCkuYmFyKClcbiAqICAgICAgYmFyKCkgaXMgbm93IGNhbGxlZC4gVGhlIGFwcGx5LWhhbmRsZXIgbm93IGV4cGVjdHMgYSBjYWxsYWJsZSBtZXRob2QuIFNpbmNlIHdlIGhhdmUgcmV0dXJuZWQgYSBQcm9taXNlXG4gKiAgICAgIGluIHN0ZXAgNCwgYW5kIGEgUHJvbWlzZSBpcyBub3QgYSBjYWxsYWJsZSBtZXRob2QsIHRoZSBpbnRlcm5hbHMgb2YgbGlxdWlmeSgpIHNob3cgdGhlaXIgYWR2YW50YWdlOlxuICogICAgICBXZSBhcmUgbm90IGRpcmVjdGx5IHdyYXBwaW5nIHRoZSBhcmd1bWVudCBwYXNzZWQgdG8gbGlxdWlmeSB3aXRoIHRoZSBQcm94eSwgYnV0IHJhdGhlciBjcmVhdGUgYSBjYWxsYWJsZVxuICogICAgICBtZXRob2QgdGhhdCBpcyB0aGVuIGNhbGxlZC4gV2UgXCJ0YWdcIiB0aGlzIG1ldGhvZCB3aXRoIGEgX19saXF1aWRfXyBwcm9wZXJ0eSB0aGF0IGhlbHBzIHRoZSBoYW5kbGVyXG4gKiAgICAgIHRvIGlkZW50aWZ5IGEgcHJveGllZCwgY2FsbGFibGUgbWV0aG9kLiBUaGUgaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gbG9va3MgbGlrZSB0aGlzOlxuICogICAgICAgICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgpXG4gKiAgICAgICAgICBsaXF1aWZ5KHByb21pc2UpO1xuICogICAgICAgICAgZnVuY3Rpb24gbGlxdWlmeSh0YXJnZXQpIHtcbiAqICAgICAgICAgICAgICBsZXQgY2IgPSBmdW5jdGlvbiAoKSB7XG4gKiAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gKiAgICAgICAgICAgICAgfTtcbiAqICAgICAgICAgICAgICBjYi5fX2xpcXVpZF9fID0gdHJ1ZTtcbiAqICAgICAgICAgIH1cbiAqICAgICAgICAgIHJldHVybiBuZXcgUHJveHkoY2IsIGhhbmRsZXIpO1xuICogICAgICBXaGF0IGhhcHBlbnMgbm93IHRoYXQgdGhpcyBleGFjdCBjYWxsYWJsZSBpcyBwcm9jZXNzZWQgYnkgdGhlIGFwcGx5LWhhbmRsZXI6XG4gKiAgICAgICA9PiBiYXIoKSAtLSBjYWxscyAtLT4gY2IoKSAtLSByZXR1cm5zIC0tPiBwcm9taXNlXG4gKiAgICAgIC4uIGFuZCB0aGUgYXBwbHkgaGFuZGxlciBjaGVja3MgaWYgdGhlIHZhbHVlIGlzIGEgcHJvbWlzZSBhbmQgbWFrZXMgc3VyZSB0aGUgZnVsbGZpbGxlZC1tZXRob2RcbiAqICAgICAgaXMgaW1wbGVtZW50ZWQsIGFuZCByZXR1cm5zIHRoZSByZXN1bHRpbmcgUHJvbWlzZSAtIGFnYWluIC0gcHJveGllZC5cbiAqICAgICAgbGlxdWlmeShwcm9taXNlLnRoZW4odmFsdWUgPT4gUmVmbGVjdC5hcHBseSh2YWx1ZSwgdGhpc0FyZywgYXJndW1lbnRzTGlzdCkpKTtcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICBeXiAxKiBeXiAgXl5eXl5eXl5eXl5eXl5eXl5eXl5eIDIqIF5eXl5eXl5eXl5eXl5eXl5eXl5eXl5cbiAqICAgICAgMSogVGhpcyBpcyB0aGUgYm91bmQgbWV0aG9kIHRoYXQgd2FzIHJldHVybmVkIGluIHRoZSBmdWxsZmlsbGVkLW1ldGhvZCBpbXBsZW1lbnRlZCBpbiBzdGVwIDQuXG4gKiAgICAgIDIqIFRoaXMgaXMgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgZnVsbGZpbGxlZC1tZXRob2RzLCB3aGljaCwgaW4gdGhpcyBjYXNlLCBpcyB0aGUgY2FsbCB0b1xuICogICAgICAgICBzb3VyY2UuYmFyKClcbiAqICAgICAgSXQgaXMgaW1wb3J0YW50IHRvIHVzZSBcImFyZ3VtZW50c0xpc3RcIiBoZXJlIHNpbmNlIHRoaXMgd2lsbCBob2xkIHJlZmVyZW5jZXMgdG8gdGhlIHJlc29sdmUvcmVqZWN0LW1ldGhvZHNcbiAqICAgICAgZm9yIHRoZSBsYXN0IGNhbGwgaW4gdGhlIGNoYWluLlxuICogICAgNi4gdGhlbigpXG4gKiAgICAgICBUaGUgbGFzdCBjYWxsIGluIHRoZSBjaGFpbiBpcyBhIGltcGxpY2l0IGNhbGwgdG8gXCJ0aGVuKClcIiB0cmlnZ2VyZWQgYnkgdGhlIFByb21pc2UtaW5zdGFuY2UgdGhhdCB3YXNcbiAqICAgICAgIHByb3hpZWQgaW4gc3RlcCA1LiBTaW5jZSBubyBtb3JlIGN1c3RvbSBwcm9wZXJ0aWVzIGhhdmUgdG8gYmUgbG9va2VkIHVwIHNpbmNlIHRoZSBjaGFpbiBlbmRzIGF0IHRoaXMgcG9pbnQsXG4gKiAgICAgICB0aGUgUHJvbWlzZSBmb3J3YXJkcyBpdHMgcHJvY2Vzc2luZyB0byAgdGhlIGZ1bGZpbGxtZW50IGJ5IGNhbGxpbmcgdGhlbigpLiBUaGUgXCJ0aGVuXCIgaXMgYSBwcm9wZXJ0eSBvbiBhXG4gKiAgICAgICBwcm94aWVkIFByb21pc2UsIHNvIHRoZSBoYW5kbGVyIGNhbiB0cmFwIGl0IGFuZCBzaW1wbHkgYmluZHMgdGhlIG1ldGhvZCB0byB0aGUgcHJvbWlzZS4gVGhlIHJlc3VsdGluZyB2YWx1ZVxuICogICAgICAgb3V0IG9mIFwiYXN5bmMgYmFyKClcIiBpcyByZXR1cm5lZCwgdGhlIGNoYWluIGVuZHMgaGVyZS5cbiAqXG4gKi9cblxuXG4vKipcbiAqIFRoZSBoYW5kbGVyIHVzZWQgYnkgdGhlIGxpcXVpZnktUHJveHkuXG4gKlxuICogQHR5cGUge3thcHBseSgqLCAqLCAqKSwgZ2V0KCosICosICopfX1cbiAqL1xuY29uc3QgaGFuZGxlciA9IHtcblxuXG4gICAgLyoqXG4gICAgICogVGhlIGhhbmRsZXIuYXBwbHkoKSBtZXRob2QgaXMgYSB0cmFwIGZvciBhIGZ1bmN0aW9uIGNhbGwuXG4gICAgICogdGhpcyBpcyBib3VuZCB0byB0aGUgaGFuZGxlci5cbiAgICAgKiBXaWxsIGNoZWNrIGlmIHRoZSB0YXJnZXQgaXMgYSBQcm9taXNlIGFuZCBQcm94eSB0aGUgcmV0dXJuLXZhbHVlIG9mIGEgY2FsbCB0byBpdCdzIFwidGhlblwiLW1ldGhvZCxcbiAgICAgKiBieSBtYWtpbmcgc3VyZSB0aGF0IHRoZSByZXNvbHZlciBpcyBwcm9wZXJseSBjYWxsZWQuXG4gICAgICogT3RoZXJ3aXNlLCB0aGlzIGhhbmRsZXIgYXNzdW1lcyB0aGF0IHRhcmdldCBpcyBhbHJlYWR5IGEgYm91bmQtbWV0aG9kLiBJbiBhbnkgY2FzZSBpdCBpcyBtYWRlIHN1cmVcbiAgICAgKiB0aGF0IHRoZSBhcmd1bWVudHMgYXJlIHByb3Blcmx5IHBhc3NlZCB0byB0aGUgbWV0aG9kcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7PCo+fSB0YXJnZXQgVGhlIHRhcmdldCBvYmplY3QuXG4gICAgICogQHBhcmFtIHtPYmplY3R9IHRoaXNBcmcgVGhlIHRoaXMgYXJndW1lbnQgZm9yIHRoZSBjYWxsLlxuICAgICAqIEBwYXJhbSB7QXJyYXl9IGFyZ3VtZW50c0xpc3QgVGhlIGxpc3Qgb2YgYXJndW1lbnRzIGZvciB0aGUgY2FsbC5cbiAgICAgKi9cbiAgICBhcHBseSAodGFyZ2V0LCB0aGlzQXJnLCBhcmd1bWVudHNMaXN0KSB7XG5cbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0Ll9fbGlxdWlkX18gPyB0YXJnZXQoKSA6IHRhcmdldDtcblxuICAgICAgICBpZiAoaXNGdW5jdGlvbih0YXJnZXQudGhlbikpIHtcbiAgICAgICAgICAgIHJldHVybiBsaXF1aWZ5KHRhcmdldC50aGVuKCh2YWx1ZSkgPT4gIFJlZmxlY3QuYXBwbHkodmFsdWUsIHRoaXNBcmcsIGFyZ3VtZW50c0xpc3QpKSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB0aGlzIHNob3VsZCBhbHJlYWR5IGJlIGEgYm91bmQgZnVuY3Rpb25cbiAgICAgICAgLy8gaWYgdGhlIHRhcmdldCBpcyBhIGJvdW5kIHRoZW4gbWV0aG9kLCB0aGUgYXJndW1lbnRzTGlzdCB3aWxsIGhvbGRcbiAgICAgICAgLy8gdGhlIHJlc29sdmUoKS9yZWplY3QoKSBtZXRob2QuXG4gICAgICAgIHJldHVybiBsaXF1aWZ5KHRhcmdldC5hcHBseSh0aGlzQXJnLCBhcmd1bWVudHNMaXN0KSk7XG4gICAgfSxcblxuXG4gICAgLyoqXG4gICAgICogVGhlIGhhbmRsZXIuZ2V0KCkgbWV0aG9kIGlzIGEgdHJhcCBmb3IgZ2V0dGluZyBhIHByb3BlcnR5IHZhbHVlLlxuICAgICAqIFwidGhpc1wiIGlzIGJvdW5kIHRvIHRoZSBoYW5kbGVyLlxuICAgICAqIFJlY2VpdmVzIHRoZSBwcm9wZXJ0eSBvZiB0aGUgcHJveGllcyB0YXJnZXQuXG4gICAgICogV2lsbCBwcm94eSB0aGUgcmV0dXJuZWQgUHJvbWlzZSBvZiB0aGUgdGFyZ2V0J3MgXCJ0aGVuKClcIi1tZXRob2QgaWYgYSBQcm9taXNlIGlzXG4gICAgICogcmVwcmVzZW50ZWQgYnkgdGFyZ2V0LlxuICAgICAqIE90aGVyd2lzZSwgYSBQcm94eSBmb3IgdGhlIGZ1bmN0aW9uIGlzIGNyZWF0ZWQsIHdoaWNoIGlzIGJvdW5kKCEpIHRvIHRoZSB0YXJnZXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gezwqPn0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0LlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wZXJ0eSBUaGUgbmFtZSBvciBTeW1ib2wgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAgICAgKiBAcGFyYW0ge1Byb3h5fSByZWNlaXZlciBFaXRoZXIgdGhlIHByb3h5IG9yIGFuIG9iamVjdCB0aGF0IGluaGVyaXRzIGZyb20gdGhlIHByb3h5LlxuICAgICAqL1xuICAgIGdldCAodGFyZ2V0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHtcblxuICAgICAgICB0YXJnZXQgPSB0YXJnZXQuX19saXF1aWRfXyA/IHRhcmdldCgpIDogdGFyZ2V0O1xuXG4gICAgICAgIGlmIChwcm9wZXJ0eSAhPT0gXCJ0aGVuXCIgJiYgaXNGdW5jdGlvbih0YXJnZXQudGhlbikpIHtcbiAgICAgICAgICAgIHJldHVybiBsaXF1aWZ5KHRhcmdldC50aGVuKHZhbHVlID0+IHZhbHVlW3Byb3BlcnR5XS5iaW5kKHZhbHVlKSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpc0Z1bmN0aW9uKHRhcmdldFtwcm9wZXJ0eV0pKSB7XG4gICAgICAgICAgICByZXR1cm4gdGFyZ2V0W3Byb3BlcnR5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBsaXF1aWZ5KHRhcmdldFtwcm9wZXJ0eV0uYmluZCh0YXJnZXQpKTtcbiAgICB9XG5cbn07XG5cblxuLyoqXG4gKiBDcmVhdGVzIGEgUHJveHkgZm9yIHRoZSBzcGVjaWZpZWQgdGFyZ2V0LCBpZiB0aGUgdGFyZ2V0IGlzIGFuIG9iamVjdCBvciBhIGZ1bmN0aW9uLFxuICogYW5kIHJldHVybnMgaXQuIE90aGVyd2lzZSwgdGhlIHRhcmdldCB3aWxsIGJlIHJldHVybmVkLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb258T2JqZWN0fSB0YXJnZXRcbiAqIEByZXR1cm4geyp9XG4gKlxuICogQHNlZSBoYW5kbGVyXG4gKi9cbmNvbnN0IGxpcXVpZnkgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG5cbiAgICBpZiAoaXNPYmplY3QodGFyZ2V0KSkge1xuICAgICAgICBjb25zdCB3cmFwcGVkID0gKCkgPT4gdGFyZ2V0O1xuICAgICAgICB3cmFwcGVkLl9fbGlxdWlkX18gPSB0cnVlO1xuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHdyYXBwZWQsIGhhbmRsZXIpO1xuICAgIH1cblxuICAgIHJldHVybiBpc0Z1bmN0aW9uKHRhcmdldCkgPyBuZXcgUHJveHkodGFyZ2V0LCBoYW5kbGVyKSA6IHRhcmdldDtcbn07XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4vKipcbiAqIEV4cGVjdHMgYSBudW1lcmljIGFycmF5IGFuZCByZXR1cm5zIGFuIGFycmF5IHdoZXJlIHRoZSBlbnRyaWVzIGFyZSBzdWJzZXF1ZW50XG4gKiBuZWlnaGJvdXJzIG9mIHRhcmdldCwgc29ydGVkIGZyb20gbG93ZXN0IHRvIGhpZ2hlc3QsIHVuaXF1ZSB2YWx1ZXMuXG4gKiBUaGUgbWV0aG9kIHdpbGwgdHJ5IHRvIHBhcnNlIHRoZSB2YWx1ZXMgdG8gbnVtZXJpYyBpbnRlZ2VyIHZhbHVlc1xuICpcbiAqICAgICAgQGV4YW1wbGVcbiAqICAgICAgdmFyIGxpc3QgICA9IFsnNCcsIDUsICcxJywgJzMnLCA2LCAnOCddO1xuICogICAgICB2YXIgdGFyZ2V0ID0gNTtcbiAqXG4gKiAgICAgIGxpc3ROZWlnaGJvdXJzKGxpc3QsIHRhcmdldCk7IC8vIFszLCA0LCA1LCA2XVxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3Qgb2YgdmFsdWVzIHRvIHJldHVybiB0aGUgbmVpZ2hib3VycyBmcm9tXG4gKiBAcGFyYW0ge051bWJlcn0gdGFyZ2V0IFRoZSBpbml0aWFsIHZhbHVlIHRvIGxvb2sgdXAgaXRzIG5laWdoYm91cnMgZm9yXG4gKlxuICogQHJldHVybiB7QXJyYXl9IFRoZSBvcmRlcmVkLCB1bmlxdWUgbGlzdCBvZiBuZWlnaGJvdXJzIGZvciB0YXJnZXRcbiAqL1xuY29uc3QgbGlzdE5laWdoYm91cnMgPSBmdW5jdGlvbiAobGlzdCwgdGFyZ2V0KSB7XG5cbiAgICB2YXIgcGFnZXMgPSBbXSxcbiAgICAgICAgcmFuZ2UgPSBbXSxcbiAgICAgICAgcGluZCwgaSwgbGVuO1xuXG4gICAgLy8gcGFyc2UsIGZpbHRlciwgc29ydFxuICAgIHBhZ2VzID0gbGlzdC5tYXAoZnVuY3Rpb24gKHYpe3JldHVybiBwYXJzZUludCh2LCAxMCk7fSk7XG4gICAgcGFnZXMgPSBwYWdlcy5maWx0ZXIoZnVuY3Rpb24gKHZhbHVlLCBpbmRleCwgc2VsZikge1xuICAgICAgICByZXR1cm4gc2VsZi5pbmRleE9mKHZhbHVlLCAwKSA9PT0gaW5kZXg7XG4gICAgfSk7XG4gICAgcGFnZXMuc29ydChmdW5jdGlvbiAoYSwgYil7cmV0dXJuIGEtYjt9KTtcblxuXG4gICAgcGluZCA9IHBhZ2VzLmluZGV4T2YocGFyc2VJbnQodGFyZ2V0LCAxMCkpO1xuXG4gICAgLy8gZmlsbCBsZWZ0XG4gICAgZm9yIChpID0gcGluZCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGlmIChwYWdlc1tpXSA9PT0gcGFnZXNbaSArIDFdIC0gMSkge1xuICAgICAgICAgICAgcmFuZ2UudW5zaGlmdChwYWdlc1tpXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGZpbGwgY2VudGVyXG4gICAgcmFuZ2UucHVzaChwYWdlc1twaW5kXSk7XG5cbiAgICAvLyBmaWxsIHJpZ2h0XG4gICAgZm9yIChpID0gcGluZCArIDEsIGxlbiA9IHBhZ2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChwYWdlc1tpXSA9PT0gcGFnZXNbaSAtIDFdICsgMSkge1xuICAgICAgICAgICAgcmFuZ2UucHVzaChwYWdlc1tpXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmFuZ2U7XG5cbn07XG5cblxuLyoqXG4gKiBFeHBlY3RzIGEgbnVtZXJpYyBhcnJheSBhbmQgcmV0dXJucyBhbiBhcnJheSB3aGVyZSB0aGUgZW50cmllcyBhcmUgaXRzZWxmXG4gKiBhcnJheXMgcmVwcmVzZW50aW5nIHBvc3NpYmxlIGdyb3VwcyBvZiBzdWJzZXF1ZW50IGluZGljZXMsIG9yZGVyZWQgZnJvbVxuICogbG93ZXN0IHRvIGhpZ2hlc3QuIER1cGxpY2F0ZSBpdGVtcyB3aWxsIGJlIHJlbW92ZWQuXG4gKlxuICogICAgICB2YXIgbGlzdCAgID0gWyc0JywgNSwgJzEnLCAnMycsIDYsICc4J107XG4gKiAgICAgIGdyb3VwSW5kaWNlcyhsaXN0KTsgLy8gW1sxXSwgWzMsIDQsIDVdLCBbNl1dXG4gKlxuICogICAgICB2YXIgbGlzdCAgID0gWycxJywgMiwgJzMnXTtcbiAqICAgICAgZ3JvdXBJbmRpY2VzKGxpc3QpOyAvLyBbWzEsIDIsIDNdXVxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3Qgb2YgdmFsdWVzIHRvIHJldHVybiB0aGUgZ3JvdXBlZCBpbmRpY2VzIGZyb21cbiAqXG4gKiBAcmV0dXJuIHtBcnJheX0gVGhlIG9yZGVyZWQsIGdyb3VwZWQgbGlzdCBvZiBpbmRpY2VzXG4gKlxuICogQHRocm93cyBpZiBsaXN0IGlzIG5vdCBhbiBhcnJheVxuICovXG5jb25zdCBncm91cEluZGljZXMgPSBmdW5jdGlvbiAobGlzdCkge1xuXG4gICAgdmFyIGdyb3VwcyA9IFtdLFxuICAgICAgICBwYWdlcztcblxuICAgIGlmICghaXNBcnJheShsaXN0KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCInbGlzdCcgbXVzdCBiZSBhbiBhcnJheVwiKTtcbiAgICB9XG5cbiAgICAvLyBwYXJzZSwgZmlsdGVyLCBzb3J0XG4gICAgcGFnZXMgPSBsaXN0Lm1hcChmdW5jdGlvbiAodil7cmV0dXJuIHBhcnNlSW50KHYsIDEwKTt9KTtcbiAgICBwYWdlcyA9IHBhZ2VzLmZpbHRlcihmdW5jdGlvbiAodmFsdWUsIGluZGV4LCBzZWxmKSB7XG4gICAgICAgIHJldHVybiBzZWxmLmluZGV4T2YodmFsdWUpID09PSBpbmRleDtcbiAgICB9KTtcbiAgICBwYWdlcy5zb3J0KGZ1bmN0aW9uIChhLCBiKXtyZXR1cm4gYS1iO30pO1xuXG4gICAgcGFnZXMucmVkdWNlKGZ1bmN0aW9uIChwcmV2aW91c1ZhbHVlLCBjdXJyZW50VmFsdWUsIGluZGV4LCBhcnJheSl7XG4gICAgICAgIGlmIChjdXJyZW50VmFsdWUgPiBwcmV2aW91c1ZhbHVlICsgMSkge1xuICAgICAgICAgICAgZ3JvdXBzLnB1c2goW10pO1xuICAgICAgICB9XG4gICAgICAgIGdyb3Vwc1tncm91cHMubGVuZ3RoIC0gMV0ucHVzaChjdXJyZW50VmFsdWUpO1xuICAgICAgICByZXR1cm4gY3VycmVudFZhbHVlO1xuICAgIH0sIC0xKTtcblxuICAgIHJldHVybiBncm91cHM7XG59O1xuXG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgcmFuZ2UgZm9yIHRoZSBzcGVjaWZpZWQgc3RhcnQgYW5kIGVuZC5cbiAqXG4gKiBAZXhhbXBsZVxuICogICAgICBjcmVhdGVSYW5nZSgzLCA0KSAvLyBbMywgNCwgNV1cbiAqXG4gKiAgICAgIGNyZWF0ZVJhbmdlKDUsIDUpIC8vIFs1XVxuICpcbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gc3RhcnRcbiAqIEBwYXJhbSB7TnVtYmVyfSBlbmRcbiAqXG4gKiBAcmV0dXJuIHtBcnJheX1cbiAqXG4gKiBAdGhyb3dzIGlmIHN0YXJ0IGlzIG5vdCBhIG51bWJlciBvciBsZXNzIHRoYW4gMSwgb3IgaWYgZW5kIGlzIG5vdCBhIG51bWJlclxuICogb3IgaWYgZW5kIGlzIGxlc3MgdGhhbiBzdGFydFxuICovXG5jb25zdCBjcmVhdGVSYW5nZSA9IGZ1bmN0aW9uIChzdGFydCwgZW5kKSB7XG5cbiAgICB2YXIgcmV0O1xuXG4gICAgaWYgKCFpc24oc3RhcnQpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIidzdGFydCcgbXVzdCBiZSBhIG51bWJlclwiKTtcbiAgICB9XG5cbiAgICBpZiAoIWlzbihlbmQpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIidlbmQnIG11c3QgYmUgYSBudW1iZXJcIik7XG4gICAgfVxuXG4gICAgc3RhcnQgPSBwYXJzZUludChzdGFydCwgMTApO1xuICAgIGVuZCAgID0gcGFyc2VJbnQoZW5kLCAxMCk7XG5cbiAgICBpZiAoZW5kIDwgc3RhcnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBcImVuZFwiICgke2VuZH0pIG11c3QgYmUgYSBudW1iZXIgZXF1YWwgdG8gb3IgZ3JlYXRlciB0aGFuIFwic3RhcnRcIiAoJHtzdGFydH0pYCk7XG4gICAgfVxuXG5cbiAgICByZXQgPSAobmV3IEFycmF5KChlbmQgLSBzdGFydCkgKyAxKSkuZmlsbCh1bmRlZmluZWQpO1xuXG4gICAgcmV0dXJuIHJldC5tYXAoZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gc3RhcnQrKztcbiAgICB9KTtcblxufTtcblxuLyoqXG4gKiBTZWFyY2hlcyBmb3IgdGhlIGZpcnN0IGVudHJ5IGluIHNvdXJjZS4gTG9va3MgdXAgdGhlIGtleSBpbiBzb3VyY2UgaWYgaXQgaXMgYW4gb2JqZWN0IGFuZCByZXR1cm5zIHRoZSBmaXJzdFxuICogbWF0Y2ggZm91bmQsIG90aGVyd2lzZSBpdGVyYXRlcyB0aHJvdWdoIHRoZSBhcnJheSBhbmQgcmV0dXJucyB0aGUgZmlyc3QgbWF0Y2guXG4gKlxuICogQGV4YW1wbGVcbiAqXG4gKiAgbDguZmluZEZpcnN0KFwiYmFyXCIsIHtmb28gOiB7fSwgYmFyIDoge3NuYWZ1IDogXCJcIn19OyAvLyByZXR1cm5zIHRoZSBiYXItb2JqZWN0XG4gKiAgbDguZmluZEZpcnN0KFwiYmFyXCIsIFt7Zm9vIDoge319LCB7YmFyIDoge3NuYWZ1IDogXCJcIn19XTsgLy8gcmV0dXJucyB0aGUgYmFyLW9iamVjdFxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7KEFycmF5fGNPYmplY3QpfSBzb3VyY2VcbiAqXG4gKiBAcmV0dXJuIHs/Kn1cbiAqL1xuY29uc3QgZmluZEZpcnN0ID0gKGtleSwgc291cmNlKSA9PiB7XG5cbiAgICBsZXQgbWF0Y2ggPSBudWxsLFxuICAgICAgICBpc28kMSA9IGlzbyhzb3VyY2UpO1xuXG4gICAgKGlzYShzb3VyY2UpID8gc291cmNlIDogaXNvJDEgPyBPYmplY3QuZW50cmllcyhzb3VyY2UpIDogW10pLnNvbWUoaXRlbSA9PiB7XG5cbiAgICAgICAgaWYgKGlzbyQxICYmIGl0ZW1bMF0gPT09IGtleSkge1xuICAgICAgICAgICAgbWF0Y2ggPSBpdGVtWzFdO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNvKGl0ZW0pICYmIGl0ZW1ba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBtYXRjaCA9IGl0ZW1ba2V5XTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gbWF0Y2g7XG59O1xuY29uc3QgZmYgPSBmaW5kRmlyc3Q7XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4vKipcbiAqIFJlcGxhY2VzIGFsbCB0b2tlbnMgc3BlY2lmaWVkIGluIHNlYXJjaCB3aXRoIHRoZSB0b2tlbnMgc3BlY2lmaWVkIGluIHJlcGxhY2UgaW4gdGhlXG4gKiB0YXJnZXQgc3RyaW5nLlxuICogV2lsbCByZXBsYWNlIGZyb20gbGVmdCB0byByaWdodCBpZiBtb3JlIHRoYW4gb25lIHNlYXJjaCB0b2tlbiBpcyBzcGVjaWZpZWQuXG4gKiBJZiB0b2tlbiBpcyBhbiBhcnJheSBhbmQgcmVwbGFjZSBpcyBhIHN0cmluZywgYWxsIHRva2VucyB3aWxsIGJlIHJlcGxhY2VkIHdpdGggdGhpcyBzdHJpbmcuXG4gKiBJZiB0b2tlbnMgYW5kIHJlcGxhY2UgYXJlIGJvdGggYXJyYXlzLCBhbmQgcmVwbGFjZSBoYXMgbGVzcyBlbnRyaWVzLCBpdGVtcyBpbiB0b2tlbnMgbWF0Y2hpbmcgYSBub24gZXhpc3RlbnRcbiAqIGluZGV4IGluIHJlcGxhY2Ugd2lsbCBiZSByZXBsYWNlZCB3aXRoIGFuIGVtcHR5IHZhbHVlLlxuICpcbiAqICAgICAgQGV4YW1wbGVcbiAqICAgICAgbGV0IHN0ciA9IGw4LnJlcGxhY2UoW1wiZm9vXCIsIFwiYmFyXCJdLCBbXCJvb2ZcIiwgXCJyYWJcIl0sIFwidGhpcyBmb28gaXMgYmFyXCIpO1xuICogICAgICAvLyB0aGlzIG9vZiBpcyByYWJcbiAqXG4gKiAgICAgICBsZXQgc3RyID0gbDgucmVwbGFjZShbXCJBXCIsIFwiQlwiXSwgW1wiQlwiLCBcIkRcIl0sIFwiQVwiKTtcbiAqICAgICAgLy8gRFxuICpcbiAqICAgICAgbGV0IHN0ciA9IGw4LnJlcGxhY2UoW1wiQVwiLCBcIkNcIl0sIFwiQlwiLCBcIkFDXCIpO1xuICogICAgICAvLyBCQlxuICpcbiAqICAgICAgbGV0IHN0ciA9IGw4LnJlcGxhY2UoW1wiQVwiLCBcIkNcIl0sIFtcIkJcIl0sIFwiQUNcIik7XG4gKiAgICAgIC8vIEJcbiAqXG4gKiAgICAgIGxldCBzdHIgPSBsOC5yZXBsYWNlKFwiQVwiLCBcIkJcIiwgXCJBXCIpO1xuICogICAgICAvLyBCXG4gKlxuICpcbiAqIEBwYXJhbSB7KFN0cmluZ3xBcnJheTxTdHJpbmc+KX0gdG9rZW5zXG4gKiBAcGFyYW0geyhTdHJpbmd8QXJyYXk8U3RyaW5nPil9IHJlcGxhY2VcbiAqIEBwYXJhbSB7U3RyaW5nfSB0YXJnZXRcbiAqXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKlxuICogQHRocm93cyB7RXJyb3J9IGlmIHN0ciB3YXMgbm90IGEgc3RyaW5nXG4gKlxuICogQHNlZSBlc2NhcGVSZWdFeHBcbiAqL1xuY29uc3QgcmVwbGFjZSA9IGZ1bmN0aW9uICh0b2tlbnMsIHJlcGxhY2UsIHRhcmdldCkge1xuXG4gICAgaWYgKCFpc3ModGFyZ2V0KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJcXFwic3RyXFxcIiBtdXN0IGJlIGEgc3RyaW5nXCIpO1xuICAgIH1cblxuICAgIHRva2VucyAgPSBbXS5jb25jYXQodG9rZW5zKTtcbiAgICByZXBsYWNlID0gIWlzcyhyZXBsYWNlKSA/IFtdLmNvbmNhdChyZXBsYWNlKSA6IG5ldyBBcnJheSh0b2tlbnMubGVuZ3RoKS5maWxsKHJlcGxhY2UpO1xuXG4gICAgdG9rZW5zLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICAgIHRhcmdldCA9IHRhcmdldC5yZXBsYWNlKG5ldyBSZWdFeHAoZXNjYXBlUmVnRXhwKGl0ZW0pLCBcImdcIiksIHJlcGxhY2VbaW5kZXhdID8/IFwiXCIpO1xuICAgIH0pO1xuXG5cbiAgICByZXR1cm4gdGFyZ2V0O1xufTtcbmNvbnN0IHJwbCA9IHJlcGxhY2U7XG5cblxuLyoqXG4gKiBVbmlmaWVzIHRoZSBzdHJpbmcgYnkgcmVtb3Zpbmcgc3Vic2VxdWVudCBlbnRyaWVzIG9mIGR1cGxpY2F0ZXMgb2YgdG9rZW4uXG4gKlxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgbDgudW5pZnkoXCJmb28vL2Jhci8vL1wiLCBcIi9cIik7IC8vIFwiZm9vL2Jhci9cIlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0b2tlblxuICogQHBhcmFtIHtTdHJpbmd9IHRhcmdldFxuICpcbiAqIHRocm93cyB7RXJyb3J9IGlmIHRhcmdldCBvciB0b2tlbiBhcmUgbm90IHN0cmluZ3NcbiAqL1xuY29uc3QgdW5pZnkgPSBmdW5jdGlvbiAodGFyZ2V0LCB0b2tlbikge1xuXG4gICAgaWYgKCFpc3ModGFyZ2V0KSB8fCAhaXNzKHRva2VuKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJcXFwic3RyXFxcIiBtdXN0IGJlIGEgc3RyaW5nXCIpO1xuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXQuc3BsaXQodG9rZW4pLmZpbHRlcihcbiAgICAgICAgKHgsIGluZGV4LCBzb3VyY2UpID0+IGluZGV4ID09PSAwIHx8IGluZGV4ID09PSBzb3VyY2UubGVuZ3RoIC0gMSB8fCB4ICE9PSBcIlwiXG4gICAgKS5qb2luKHRva2VuKTtcblxufTtcblxuXG4vKipcbiAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIHN0cmluZyBpcyBub3QgYW55IG9mIHRoZSBwYXNzZWQgYXJndW1lbnRzLiBNYXRjaGVzIGFyZSBzdHJpY3QuXG4gKlxuICogQGV4YW1wbGVcbiAqICBsOC5pc05vdChcInN0cmluZ1wiLCBcInN0cmluZ1wiKTsgLy8gZmFsc2VcbiAqICBsOC5pc05vdChcInN0cmluZ1wiLCBcIlN0cmluZ1wiKTsgLy8gdHJ1ZVxuICogIGw4LmlzTm90KFwic3RyaW5nXCIsIFwiZm9vXCIsIFwiYmFyXCIpOyAvLyB0cnVlXG4gKiAgbDguaXNOb3QoXCJzdHJpbmdcIiwgXCJmb29cIiwgXCJiYXJcIiwgXCJzdHJpbmdcIik7IC8vIGZhbHNlXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRhcmdldFxuICogQHBhcmFtIHsuLi5TdHJpbmd9IGV4Y2x1ZGVzXG4gKlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuY29uc3QgaXNOb3QgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG5cbiAgICBjb25zdFxuICAgICAgICBleHByID0gXCIoPyEoXCIgKyBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLmpvaW4oXCJ8XCIpICsgXCIpKV5cIixcbiAgICAgICAgcmVnZXggPSBuZXcgUmVnRXhwKGV4cHIsIFwiZ1wiKTtcblxuICAgIHJldHVybiB0YXJnZXQubWF0Y2gocmVnZXgpICE9PSBudWxsO1xufTtcblxuXG4vKipcbiAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9HdWlkZS9SZWd1bGFyX0V4cHJlc3Npb25zI2VzY2FwaW5nXG4gKi9cbmZ1bmN0aW9uIGVzY2FwZVJlZ0V4cCAoc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9bLiorP14ke30oKXxbXFxdXFxcXF0vZywgXCJcXFxcJCZcIik7XG59XG5cbnZhciBzdHJpbmcgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gICAgX19wcm90b19fOiBudWxsLFxuICAgIHJlcGxhY2U6IHJlcGxhY2UsXG4gICAgcnBsOiBycGwsXG4gICAgdW5pZnk6IHVuaWZ5LFxuICAgIGlzTm90OiBpc05vdFxufSk7XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4vKipcbiAqIENyZWF0ZXMgYSBub25lLWNvbmZpZ3VyYWJsZSwgbm9uZS13cml0ZWFibGUgKGxpc3Qgb2YpIHByb3BlcnQoeXxpZXMpIG9uIHRoZSB0YXJnZXQgb2JqZWN0LlxuICpcbiAqIEBleGFtcGxlXG4gKiAgICAgIGxldCB0YXJnZXQgPSBsY2soe30sIFwiZm9vXCIpOyAvLyB0YXJnZXQgPSB7Zm9vIDogdW5kZWZpbmVkfTtcbiAqICAgICAgbGV0IHRhcmdldCA9IGxjayh7fSwgXCJmb29cIiwgMSk7IC8vIHRhcmdldCA9IHtmb28gOiAxfTtcbiAqICAgICAgbGV0IHRhcmdldCA9IGxjayh7fSwgW1wiZm9vXCIsIFwiYmFyXCJdLCB7XCJmb29cIiA6IDEsIFwiYmFyXCIgOiAyfSk7IC8vIHRhcmdldCA9IHtmb28gOiAxLCBiYXIgOiAyfTtcbiAqICAgICAgbGV0IHRhcmdldCA9IGxjayh7fSwgXCJmb29cIiwgXCJiYXJcIiwge1wiZm9vXCIgOiAxLCBcImJhclwiIDogMn0pOyAvLyB0YXJnZXQgPSB7Zm9vIDogMSwgYmFyIDogMn07XG4gKlxuICogQHBhcmFtIHshT2JqZWN0fSB0YXJnZXRcbiAqIEBwYXJhbSB7IShTdHJpbmd8QXJyYXl9IHByb3AgRWl0aGVyIHRoZSBwcm9wZXJ0eSBuYW1lIG9yIGFuIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzXG4gKiB0aGF0IHNob3VsZCBiZSBjcmVhdGVkIG9uIFwidGFyZ2V0XCIgd2l0aCB0aGVpciBjb3JyZXNwb25kaW5nIHZhbHVlcyBmb3VuZCBpbiBcInZhbHVlXCJcbiAqXG4gKiBAcGFyYW0geyo9fSB2YWx1ZVxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gdGFyZ2V0XG4gKlxuICogQHRocm93cyB7RXJyb3J9IGlmIHRhcmdldCBpcyBub3QgZXh0ZW5zaWJsZSwgaWYgXCJwcm9wXCIgaXMgbm90IGEgdmFsaWQgc3RyaW5nIG9yIGlmIGEgbGlzdCBvZiBwcm9wZXJ0aWVzXG4gKiBpcyBzdXBwbGllZCwgYnV0IG5vIHZhbHVlLW9iamVjdC5cbiAqL1xuY29uc3QgbG9jayA9IGZ1bmN0aW9uICh0YXJnZXQsIHByb3AsIHZhbHVlKSB7XG5cbiAgICBpZiAoIWlzT2JqZWN0KHRhcmdldCkgfHwgT2JqZWN0LmlzRnJvemVuKHRhcmdldCkgfHwgT2JqZWN0LmlzU2VhbGVkKHRhcmdldCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXFxcInRhcmdldFxcXCIgbXVzdCBiZSBhbiBleHRlbnNpYmxlIG9iamVjdC5cIik7XG4gICAgfVxuXG4gICAgY29uc3QgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcblxuICAgIHZhbHVlID0gYXJndW1lbnRzW2xlbiAtIDFdO1xuXG4gICAgaWYgKGxlbiA8IDIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXFxcInByb3BlcnR5XFxcIiBtdXN0IGJlIGEgdmFsaWQgcHJvcGVydHkgbmFtZS5cIik7XG4gICAgfVxuXG4gICAgaWYgKGxlbiA+IDMgJiYgIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJcXFwidmFsdWVcXFwiIG11c3QgYmUgYW4gb2JqZWN0LlwiKTtcbiAgICB9XG5cbiAgICBpZiAobGVuID09PSAzICYmIGlzQXJyYXkocHJvcCkgJiYgIWlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJcXFwidmFsdWVcXFwiIG11c3QgYmUgYW4gb2JqZWN0LlwiKTtcbiAgICB9XG5cbiAgICBsZXQgaXNBcnIgPSBpc0FycmF5KHByb3ApLFxuICAgICAgICBwcm9wcyA9IGlzQXJyID8gcHJvcCA6IEFycmF5LnByb3RvdHlwZS5zbGljZS5hcHBseShhcmd1bWVudHMsIFsxLCBsZW4gLSAxXSk7XG5cbiAgICBwcm9wcy5mb3JFYWNoKCBwcm9wID0+IHtcbiAgICAgICAgaWYgKCFpc1N0cmluZyhwcm9wKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXFxcInByb3BlcnR5XFxcIiBtdXN0IGJlIGEgdmFsaWQgcHJvcGVydHkgbmFtZS5cIik7XG4gICAgICAgIH1cblxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wLCB7XG4gICAgICAgICAgICB3cml0YWJsZSA6IGZhbHNlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlIDogZmFsc2UsXG4gICAgICAgICAgICB2YWx1ZSA6IGxlbiA+IDMgfHwgaXNBcnIgPyB2YWx1ZVtwcm9wXSA6IHZhbHVlXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG5cbiAgICByZXR1cm4gdGFyZ2V0O1xufTtcbmNvbnN0IGxjayA9IGxvY2s7XG5cbi8qKlxuICogVGhpcyBjYWxsYmFjayBpcyBkaXNwbGF5ZWQgYXMgcGFydCBvZiB0aGUgUmVxdWVzdGVyIGNsYXNzLlxuICogQGNhbGxiYWNrIHZpc2l0fnZpc2l0b3JcbiAqIEBwYXJhbSB7Kn0gbGVhZlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAqL1xuXG4vKipcbiAqIFRyYXZlcnNlcyBhbiBvYmplY3QgYW5kIGNhbGxzIHRoZSBwYXNzZWQgZnVuY3Rpb24gb24gZWFjaCBwcm9wZXJ0eS5cbiAqXG4gKiBAZXhhbXBsZVxuICogICAgICBsZXQgdHJlZSA9IHtcbiAqICAgICAgICAgIG5vZGUgOiB7XG4gKiAgICAgICAgICAgICAgbm9kZV9hIDoge1xuICogICAgICAgICAgICAgICAgICBub2RlIDogXCJmb29cIlxuICogICAgICAgICAgICAgIH1cbiAqICAgICAgICAgIH0sXG4gKiAgICAgICAgICBub2RlX2MgOiBcImJhclwiXG4gKiAgICAgIH07XG4gKlxuICogbDgudmlzaXQodHJlZSwgKGxlYWYsIHBhdGgpID0+IHBhdGg7IC8vIGNoYW5nZXMgdGhlIHRyZWUgdG9cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdGFyZ2V0IFRoZSB0YXJnZXQgXCJ0cmVlXCIgdGhhdCBzaG91bGQgYmUgdmlzaXRlZC5cbiAqIEBwYXJhbSB7dmlzaXR+dmlzaXRvcn0gdmlzaXRvciAtIFRoZSBjYWxsYmFjayB0aGF0IGhhbmRsZXMgdGhlIHJlc3BvbnNlLiBUaGUgcGFzc2VkIGFyZ3VtZW50cyB0byB0aGlzIGZ1bmN0aW9uc1xuICogYXJlIHRoZSB2YWx1ZSBvZiB0aGUgbm9kZSBhbmQgdGhlIHBhdGggKHN0cmluZykgdG8gdGhpcyBub2RlLlxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gdGFyZ2V0IFRoZSB2aXNpdGVkIHRhcmdldC5cbiAqXG4gKi9cbmNvbnN0IHZpc2l0ID0gZnVuY3Rpb24gKHRhcmdldCwgdmlzaXRvcikge1xuXG4gICAgY29uc3QgdHJhdmVyc2UgPSAodGFyZ2V0LCBwYXJlbnRLZXkpID0+IHtcbiAgICAgICAgT2JqZWN0LmVudHJpZXModGFyZ2V0KS5tYXAoKFtrZXksIHByb3BlcnR5XSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcGF0aCA9IHBhcmVudEtleS5jb25jYXQoa2V5KTtcbiAgICAgICAgICAgIHRhcmdldFtrZXldID0gaXNvKHByb3BlcnR5KSA/IHRyYXZlcnNlKHByb3BlcnR5LCBwYXRoKSA6IHZpc2l0b3IocHJvcGVydHksIHBhdGguam9pbihcIi5cIikpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9O1xuXG4gICAgdHJhdmVyc2UodGFyZ2V0LCBbXSk7XG4gICAgcmV0dXJuIHRhcmdldDtcbn07XG5jb25zdCB2c3QgPSB2aXNpdDtcblxuXG4vKipcbiAqIFV0aWxpdGllc1xuICovXG5cblxuLyoqXG4gKiBDcmVhdGVzIGFuIG9iamVjdCBjaGFpbiBvbiB0aGUgdGFyZ2V0IG9iamVjdCBhbmQgaW5pdGlhbGl6ZXMgaXQgd2l0aFxuICogdGhlIGRlZmF1bHRWYWx1ZSwgaWYgc3BlY2lmaWVkLlxuICogUmV0dXJucyB0aGUgdGFyZ2V0IG9iamVjdC5cbiAqIFRoZSB0aGlyZCBhcmd1bWVudCBjYW4gYmUgYSBmdW5jdGlvbiB0aGF0IGdldHMgY2FsbGVkIHdpdGggdGhlIGNoYWluJ3MgbmFtZSBjcmVhdGVkIGFzIGl0cyBhcmd1bWVudC5cbiAqIE92ZXJyaWRlcyBhbnkgdmFsdWUgZm91bmQgb24gdGhlIGVuZCBvZiB0aGUgY2hhaW4gb2YgdGhlIG9iamVjdCBpZiBvdmVycmlkZSBpcyBzZXQgdG8gdHJ1ZSBhbmQgdGhlIHZhbHVlXG4gKiBleGlzdHMuXG4gKlxuICogQGV4YW1wbGVcbiAqICAgIGxldCBvYmogPSB7fTtcbiAqICAgIGw4LmNoYWluKFwiYS5iLmMuZFwiLCBvYmosIFwiZm9vXCIpO1xuICpcbiAqICAgIC8vIG9ialxuICogICAgLy8geyBhIDogeyBiIDoge2MgOiB7IGQgOiBcImZvb1wifX19fVxuICpcbiAqIFRoaXMgbWV0aG9kIGxldHMgeW91IHBhc3MgYSBsaXN0IG9mIHByb3BlcnRpZXMgYXMgdGhlIGZpcnN0IGFyZ3VtZW50IHRoYXQgd2lsbCBiZSBjaGFpbmVkLlxuICogVGhlIHRoaXJkIGFyZ3VtZW50IGNhbiBiZSBhIGZ1bmN0aW9uIHRoYXQgZ2V0cyBjYWxsZWQgd2l0aCBlYWNoIHByb3BlcnR5IHVwb24gY2hhaW5pbmcuXG4gKiBUaGUgcmV0dXJuIHZhbHVlIG9mIHRoaXMgZnVuY3Rpb24gaXMgdXNlZCBhcyB0aGUgdmFsdWUgZm9yIHRoZSBjaGFpbmVkIHByb3BlcnR5LlxuICogT3RoZXJ3aXNlLCB0aGUgdGhpcmQgYXJndW1lbnQgd2lsbCBiZSB1c2VkIGFzIHRoZSB2YWx1ZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogbGV0IG9iaiA9IHt9O1xuICogICAgbDguY2hhaW4oW1wiYS5iXCIsIFwiZS5mXCJdLCBvYmosIChjaGFpbikgPT4gY29uc29sZS5sb2coY2hhaW4udG9VcHBlckNhc2UoKSkpO1xuICpcbiAqICAgIC8vIG9ialxuICogICAgLy8geyBhIDogeyBiIDogXCJCXCJ9LCB7ZSA6IHtmIDogXCJGXCJ9fX1cbiAqXG4gKlxuICogQHBhcmFtIHshKFN0cmluZ3xBcnJheSl9IGNoYWluc1xuICogQHBhcmFtIHtPYmplY3R9IHRhcmdldFxuICogQHBhcmFtIHs/KCp8ZnVuY3Rpb24pfSBkZWZhdWx0VmFsdWVcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW292ZXJyaWRlPWZhbHNlXVxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gdGFyZ2V0XG4gKi9cbmNvbnN0IGNoYWluID0gZnVuY3Rpb24gKGNoYWlucywgdGFyZ2V0ID0ge30sIGRlZmF1bHRWYWx1ZSA9IHVuZGVmaW5lZCwgb3ZlcnJpZGUgPSBmYWxzZSkge1xuXG4gICAgY2hhaW5zID0gW10uY29uY2F0KGNoYWlucyk7XG5cbiAgICBjaGFpbnMuZm9yRWFjaCgoc3RyKSA9PiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdG9kbyBPKG4pID9cbiAgICAgICAgICovXG4gICAgICAgIGNvbnN0XG4gICAgICAgICAgICBrZXlzID0gc3RyLnNwbGl0KFwiLlwiKSxcbiAgICAgICAgICAgIGNyID0gKG9iaiwga2V5cykgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IGtleTtcblxuICAgICAgICAgICAgICAgIGtleSA9IGtleXMuc2hpZnQoKTtcblxuICAgICAgICAgICAgICAgIGlmICghb2JqW2tleV0gfHwgKG92ZXJyaWRlID09PSB0cnVlICYmICFrZXlzLmxlbmd0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqW2tleV0gPSBrZXlzLmxlbmd0aCA/IHt9IDogKGlzRnVuY3Rpb24oZGVmYXVsdFZhbHVlKSA/IGRlZmF1bHRWYWx1ZShzdHIpIDogZGVmYXVsdFZhbHVlKSA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNyKG9ialtrZXldLCBrZXlzKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgICAgICAgfTtcblxuICAgICAgICBjcih0YXJnZXQsIGtleXMpO1xuICAgIH0pO1xuXG5cbiAgICByZXR1cm4gdGFyZ2V0O1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3IgY2hhaW4oKVxuICogQHR5cGUge2Z1bmN0aW9uKCEoU3RyaW5nfEFycmF5KSwgT2JqZWN0PSwgPygqfEZ1bmN0aW9uKT0pOiBPYmplY3R9XG4gKi9cbmNvbnN0IGNobiA9IGNoYWluO1xuXG4vKipcbiAqIEV4cGVjdHMgYW4gT2JqZWN0IGFuZCBmbGlwcyBrZXkvdmFsdWUvcGFpcnMuXG4gKlxuICogICAgICBAZXhhbXBsZVxuICogICAgICB2YXIgZm9vID0geyAxIDogXCJmb29cIiwgMiA6IFwiYmFyXCIsIDMgOiBcInNuYWZ1XCJ9O1xuICpcbiAqICAgICAgbDguZmxpcChmb28pOyAvLyB7XCJiYXJcIiA6IDEsIFwiYmFyXCI6IDIsIFwic25hZnVcIiA6IDN9XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGlucHV0XG4gKlxuICogQHJldHVybiB7T2JqZWN0fSBhIG5ldyBvYmplY3Qgd2hlcmUgdGhlIGtleS92YWx1ZSBwYWlycyBhcmUgZmxpcHBlZFxuICovXG5jb25zdCBmbGlwID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIC4uLk9iamVjdC5lbnRyaWVzKGlucHV0KS5tYXAoKFtrLCB2XSkgPT4gICh7W3ZdIDoga30pKSk7XG59O1xuXG5cbi8qKlxuICogRXhwZWN0cyBhbiBPYmplY3QgYW5kIHJlbW92ZXMgYWxsIHRoZSBlbnRyaWVzIHdoaWNoIHN0cmljdCBlcXVhbCB0byBtYXRjaC5cbiAqXG4gKiAgICAgIEBleGFtcGxlXG4gKiAgICAgIHZhciBmb28gPSB7IDEgOiBcIlwiLCAyIDogXCJiYXJcIiwgMyA6IFwiXCJ9O1xuICpcbiAqICAgICAgbDgucHVyZ2UoZm9vLCBcIlwiKTsgLy8gezIgOiBcImJhclwifVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBpbnB1dFxuICogQHBhcmFtIHtNaXhlZH0gbWF0Y2gsIGRlZmF1bHRzIHRvIHVuZGVmaW5lZFxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gYSBuZXcgZmlsdGVyZWQgb2JqZWN0XG4gKi9cbmNvbnN0IHB1cmdlID0gZnVuY3Rpb24gKGlucHV0LCBtYXRjaD0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhpbnB1dCkuZmlsdGVyKChbLCB2XSkgPT4gdiAhPT0gbWF0Y2gpKTtcbn07XG5cblxuLyoqXG4gKiBTcGxpdHMgdGhlIHNwZWNpZmllZCBzdHJpbmcgYnkgbG9va2luZyBmb3IgXCIuXCIgYXMgc2VwYXJhdG9ycyBhbmQgcmV0dXJuc1xuICogdW5kZWZpbmVkIGlmIHRoZSBldmFsdWF0ZWQgcHJvcGVydHkgaXMgbm90IGF2YWlsYWJsZSwgb3RoZXJ3aXNlIHRoZSB2YWx1ZVxuICogb2YgdGhlIHByb3BlcnR5LlxuICpcbiAqICAgICAgQGV4YW1wbGVcbiAqICAgICAgdmFyIGZvbyA9IHsgMSA6IHsgMiA6IHsgMyA6IHsgNCA6ICdiYXInfX19fTtcbiAqXG4gKiAgICAgIGw4LnVuY2hhaW4oJzEuMi4zLjQnLCBmb28pOyAvLyAnYmFyJ1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBjaGFpbiBUaGUgb2JqZWN0IGNoYWluIHRvIHJlc29sdmVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzY29wZSBUaGUgc2NvcGUgd2hlcmUgdGhlIGNoYWluIHNob3VsZCBiZSBsb29rZWQgdXBcbiAqIEBwYXJhbSB7KCp8RnVuY3Rpb24pfSBkZWZhdWx0VmFsdWUgYSBkZWZhdWx0VmFsdWUgdG8gcmV0dXJuIGluIGNhc2UgdGhlIGNoYWluIGlzIG5vdCBleGlzdGluZy5cbiAqIGlmIHRoaXMgYXJndW1lbnQgaXMgYSBmdW5jdGlvbiwgdGhlIGZ1bmN0aW9uIGdldHMgY2FsbGVkLiBJZiB0aGUgY2hhaW4gZXhpc3RlZCwgaXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGVcbiAqIHZhbHVlIG9mIHRoZSBjaGFpbiwgYW5kIHRoZSByZXR1cm4gdmFsdWUgb2YgdGhpcyBmdW5jdGlvbiBpcyByZXR1cm5lZC5cbiAqIEBleGFtcGxlXG4gKiBjb25zdCBjYiA9IHZhbHVlID0+IHZhbHVlLnRvVXBwZXJDYXNlKCksXG4gKiAgICAgIGZvbyA9IHsgMSA6IHsgMiA6IHsgMyA6IHsgNCA6ICdiYXInfX19fTtcbiAqXG4gKiAgbDgudW5jaGFpbignMS4yLjMuNCcsIGZvbywgY2IpOyAvLyAnQkFSJ1xuICpcbiAqIEByZXR1cm4geyp9IHVuZGVmaW5lZCBpZiBlaXRoZXIgc2NvcGUgd2FzIG5vdCBmb3VuZCBvciB0aGUgY2hhaW4gY291bGRcbiAqIG5vdCBiZSByZXNvbHZlZCwgb3RoZXJ3aXNlIHRoZSB2YWx1ZSBmb3VuZCBpbiBbc2NvcGVdW2NoYWluXVxuICovXG5jb25zdCB1bmNoYWluID0gZnVuY3Rpb24gKGNoYWluLCBzY29wZSwgZGVmYXVsdFZhbHVlID0gdW5kZWZpbmVkKSB7XG5cbiAgICB2YXIgcGFydHMgPSBjaGFpbi5zcGxpdChcIi5cIiksXG4gICAgICAgIG9iaiAgID0gc2NvcGU7XG5cbiAgICB3aGlsZSAob2JqICE9PSB1bmRlZmluZWQgJiYgcGFydHMubGVuZ3RoKSB7XG4gICAgICAgIG9iaiA9IG9ialtwYXJ0cy5zaGlmdCgpXTtcbiAgICB9XG5cbiAgICBpZiAoaXNGdW5jdGlvbihkZWZhdWx0VmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWUob2JqKTtcbiAgICB9XG5cbiAgICBpZiAob2JqID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gb2JqO1xufTtcblxuLyoqXG4gKiBBbGlhcyBmb3IgdW5jaGFpbigpXG4gKiBAdHlwZSB7ZnVuY3Rpb24oIShTdHJpbmd8QXJyYXkpLCBPYmplY3Q9LCA/KCp8RnVuY3Rpb24pPSk6IE9iamVjdH1cbiAqL1xuY29uc3QgbmNobiA9IHVuY2hhaW47XG5cbi8qKlxuICogTGV0cyB5b3Ugc3BlY2lmeSBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBtYWtlIHN1cmUgb25seSB0aG9zZVxuICoga2V5cyBhcmUgYXNzaWduZWQgZnJvbSBzb3VyY2UgdG8gdGFyZ2V0IHRoYXQgbWF0Y2ggdGhlIGV4cHJlc3Npb24uXG4gKlxuICogQGV4YW1wbGVcbiAqICAgICBsOC5hc3NpZ24oe30sIHtcImZvb1wiOiBcImJhclwifSwgW3tcInNuYWZ1XCIgOiBcImZvb2JhclwiLCBcImtleVwiOiBcInZhbHVlXCJ9LCAvKD8hKHNuYWZ1KSleL2ddKTtcbiAqICAgICAvLyByZXN1bHRzIGluIHtcImZvb1wiOiBcImJhclwiLCBcImtleVwiOiBcInZhbHVlXCJ9XG4gKlxuICogICAgICBsOC5hc3NpZ24oe30sIHtcImZvb1wiOiBcImJhclwifSwgW3tcInNuYWZ1XCIgOiBcImZvb2JhclwiLCBcImtleVwiOiBcInZhbHVlXCIsIFwic29tZVwiOiBcIm9ialwifSwgXCJzbmFmdVwiLCBcImtleVwiXSk7XG4gKiAgICAgLy8gcmVzdWx0cyBpbiB7XCJmb29cIjogXCJiYXJcIiwgXCJzb21lXCI6IFwib2JqXCJ9XG4gKlxuICpcbiAqIEBwYXJhbSB7IU9iamVjdH0gdGFyZ2V0IFRoZSB0YXJnZXQgb2JqZWN0IHRvIGFzc2lnbiB0dG9cbiAqIEBwYXJhbSB7Li4uKE9iamVjdHxbT2JqZWN0LCAoUmVnRXhwfC4uLlN0cmluZ10pfSBUaGUgb2JqZWN0cyB0byB1c2UgZm9yIGFzc2lnbmluZy4gSWYgYW4gYXJyYXkgaXMgc3VibWl0dGVkLCB0aGUgZmlyc3RcbiAqIGluZGV4IGlzIHRoZSBvYmplY3Qgc291cmNlIHRvIGFzc2lnbiBmcm9tLCBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCBpc3QgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiB0aGF0IG11c3QgbWF0Y2hcbiAqIHRoZSBvYmplY3Qga2V5cyB0byB1c2UgZm9yIGFzc2lnbm1lbnQuIElmIHRoZXJlIGlzIG5vIFJlZ0V4cCBhcyBhIHNlY29uZCBhcmd1bWVudCBidXQgaW5zdGVhZCBhIHN0cmluZywgdGhpcyBzdHJpbmcgd2lsbFxuICogYmUgdXNlZCBmb3IgY29tcGFyaXNvbi4gQ2FuIGFsc28gYmUgYW4gYXJiaXRyYXJ5IG51bWJlciBvZiBzdHJpbmdzLiBBbGwgdGhlIGtleXMgbm90IHN0cmljdCBlcXVhbGluZyB0byB0aGUgc3VibWl0dGVkXG4gKiBhcmd1bWVudHMgd2lsbCB0aGVuIGJlIGFzc2lnbmVkIHRoZWlyIHZhbHVlcyB0byB0YXJnZXQuXG4gKlxuICogQHJldHVybiB7T2JqZWN0fSB0YXJnZXRcbiAqL1xuY29uc3QgYXNzaWduID0gZnVuY3Rpb24gKHRhcmdldCkge1xuXG4gICAgbGV0IHNvdXJjZXMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuXG4gICAgc291cmNlcyA9IHNvdXJjZXMubWFwKCBzb3VyY2UgPT4ge1xuXG4gICAgICAgIGlmIChpc1BsYWluT2JqZWN0KHNvdXJjZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGlmIChpc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IFtvYmosIC4uLmFyZ3NdID0gc291cmNlLFxuICAgICAgICAgICAgICAgIHJlZ2V4cCA9IGFyZ3NbMF07XG5cbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICAgICAgICAgICAgT2JqZWN0LmVudHJpZXMob2JqKS5maWx0ZXIoZW50cnkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQga2V5ID0gZW50cnlbMF07XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc3J4KHJlZ2V4cCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXkubWF0Y2gocmVnZXhwKSAhPT0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpc05vdC5hcHBseShzdHJpbmcsIFtrZXldLmNvbmNhdChhcmdzKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24odGFyZ2V0LCAuLi5zb3VyY2VzKTtcbn07XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG4vKipcbiAqIFRyYW5zZm9ybWVyIGZvciB0cmFuc2Zvcm1pbmcgcXVvdGVkIHBsYWluLXRleHQgKHF1b3RlIG1hcmtzOiBcIj5cIilcbiAqIHRvIGEgdGV4dCBjb250YWluaW5nIGJsb2NrcXVvdGVzLlxuICpcbiAqIEBleGFtcGxlXG4gKiAgbGV0IHRleHQgPSBbXG4gKiAgICAgIFwiPiBUaGlzIGlzXCIsXG4gKiAgICAgIFwiPiBzb21lIHF1b3RlZFwiLFxuICogICAgICBcIj4+IFRleHQgdGhhdCBkb2VzIDFcIixcbiAqICAgICAgXCI+PiBUZXh0IHRoYXQgZG9lcyAyXCIsXG4gKiAgICAgIFwiPmhtIGdvb2RcIixcbiAqICAgICAgXCJzdGZmIHRoYXRcIixcbiAqICAgICAgXCJ1c3VhbGx5IGxpa2VzXCIsXG4gKiAgICAgIFwiPj4gdG8gYmUgcGFyc2VkXCIsXG4gKiAgICAgIFwiPj5ZTyFcIixcbiAqICBdLmpvaW4oXCJcXG5cIik7XG4gKlxuICogIGxldCB0cmFuc2Zvcm1lciA9IG5ldyBCbG9ja3F1b3RlVHJhbnNmb3JtZXJcbiAqXG4gKiAgdHJhbnNmb3JtZXIudHJhbnNmb3JtKHRleHQpO1xuICpcbiAqICAvLyByZXR1cm5zOlxuICogIC8vIDxibG9ja3F1b3RlPlxuICogIC8vICAgVGhpcyBpc1xuICogIC8vICAgc29tZSBxdW90ZWRcbiAqICAvLyAgIDxibG9ja3F1b3RlPlxuICogIC8vICAgICAgVGV4dCB0aGF0IGRvZXMgMVxuICogIC8vICAgICAgVGV4dCB0aGF0IGRvZXMgMlxuICogIC8vICAgPC9ibG9ja3F1b3RlPlxuICogIC8vICAgaG0gZ29vZFxuICogIC8vIDwvYmxvY2txdW90ZT5cbiAqICAvLyBzdGZmIHRoYXRcbiAqICAvLyB1c3VhbGx5IGxpa2VzXG4gKiAgLy8gPGJsb2NrcXVvdGU+XG4gKiAgLy8gIDxibG9ja3F1b3RlPlxuICogIC8vICAgdG8gYmUgcGFyc2VkXG4gKiAgLy8gICBZTyFcbiAqICAvLyAgPC9ibG9ja3F1b3RlPlxuICogIC8vIDwvYmxvY2txdW90ZT5cbiAqXG4gKi9cbmNsYXNzIEJsb2NrcXVvdGVUcmFuc2Zvcm1lciB7XG5cblxuICAgIC8qKlxuICAgICAqIEludm9rZXMgdHJhbnNmb3JtaW5nIHRoZSBwYXNzZWQgc3RyaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgdHJhbnNmb3JtICh2YWx1ZSkge1xuXG4gICAgICAgIGNvbnN0IG1lID0gdGhpcztcblxuICAgICAgICBsZXQgZ3JvdXBzID0gbWUuZ3JvdXAodmFsdWUpLFxuICAgICAgICAgICAgdGV4dHMgPSBbXTtcblxuICAgICAgICBncm91cHMuZm9yRWFjaChncm91cCA9PiB7XG4gICAgICAgICAgICB0ZXh0cy5wdXNoKG1lLnF1b3RlKGdyb3VwKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0ZXh0cy5qb2luKFwiXCIpO1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBUYWtlcyBjYXJlIG9mIGdyb3VwaW5nIHRoZSB0ZXh0IGludG8gYmxvY2tzIG9mXG4gICAgICogcXVvdGVkIC8gdW5xdW90ZWQgcGFydHMuIFRha2VzIGNhcmUgb2Ygc2FuaXRpemluZyB0aGUgcXVvdGUgbWFya3MsIHRvby5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogICAgbGV0IHRleHQgPSBbXG4gICAgICogICAgICBcIiA+IFRoaXMgaXNcIixcbiAgICAgKiAgICAgIFwiPiBzb21lIHF1b3RlZFwiLFxuICAgICAqICAgICAgXCIgID4gPiBUZXh0IHRoYXQgZG9lcyAxXCIsXG4gICAgICogICAgICBcIj4gICAgPiBUZXh0IHRoYXQgZG9lcyAyXCIsXG4gICAgICogICAgICBcIj5obSBnb29kXCIsXG4gICAgICogICAgICBcInN0dWZmIHRoYXRcIixcbiAgICAgKiAgICAgIFwidXN1YWxseSBsaWtlc1wiLFxuICAgICAqICAgICAgXCI+PiB0byBiZSBwYXJzZWRcIixcbiAgICAgKiAgICAgIFwiPj5ZTyFcIixcbiAgICAgKiAgICBdLmpvaW4oXCJcXG5cIik7XG4gICAgICpcbiAgICAgKiAgdHJhbnNmb3JtZXIuZ3JvdXAodGV4dCk7XG4gICAgICogIC8vIFtcbiAgICAgKiAgLy8gICBbXCI+IFRoaXMgaXNcIiwgXCI+IHNvbWUgcXVvdGVkXCIsIFwiPj4gVGV4dCB0aGF0IGRvZXMgMVwiLCBcIj4+IFRleHQgdGhhdCBkb2VzIDJcIiwgXCI+aG0gZ29vZFwiXSxcbiAgICAgKiAgLy8gICBbXCJzdHVmZiB0aGF0XCIsIFwidXN1YWxseSBsaWtlc1wiXSxcbiAgICAgKiAgLy8gICBbXCI+PiB0byBiZSBwYXJzZWRcIiwgXCI+PllPIVwiXVxuICAgICAqICAvLyBdXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gdGV4dFxuICAgICAqXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBncm91cCAodGV4dCkge1xuXG4gICAgICAgIGNvbnN0IG1lID0gdGhpcztcblxuICAgICAgICBsZXQgbGluZXMgPSB0ZXh0LnNwbGl0KFwiXFxuXCIpLFxuICAgICAgICAgICAgdG9RdW90ZSA9IFtdLFxuICAgICAgICAgICAgZ3JvdXBzID0gLTEsXG4gICAgICAgICAgICBwcmV2ID0gbnVsbDtcblxuICAgICAgICBsaW5lcy5mb3JFYWNoKGxpbmUgPT4ge1xuXG4gICAgICAgICAgICBsaW5lID0gbWUuc2FuaXRpemVMaW5lKGxpbmUpO1xuXG4gICAgICAgICAgICBpZiAocHJldiAhPT0gbGluZS5pbmRleE9mKFwiPlwiKSkge1xuICAgICAgICAgICAgICAgIGdyb3VwcysrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwcmV2ID0gbGluZS5pbmRleE9mKFwiPlwiKTtcblxuICAgICAgICAgICAgaWYgKCF0b1F1b3RlW2dyb3Vwc10pIHtcbiAgICAgICAgICAgICAgICB0b1F1b3RlW2dyb3Vwc10gPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRvUXVvdGVbZ3JvdXBzXS5wdXNoKGxpbmUpO1xuXG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgcmV0dXJuIHRvUXVvdGU7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBUYWtlcyBjYXJlIG9mIHByb3BlciBxdW90aW5nIHRoZSBwYXNzZWQgZ3JvdXAuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBncm91cFxuICAgICAqXG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgcXVvdGUgKGdyb3VwKSB7XG5cbiAgICAgICAgaWYgKGdyb3VwWzBdLmluZGV4T2YoXCI+XCIpICE9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZ3JvdXAuam9pbihcIlxcblwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBvcCA9IHF1b3RlZCA9PiB7XG4gICAgICAgICAgICBpZiAocXVvdGVkW3F1b3RlZC5sZW5ndGggLSAxXSA9PT0gXCJcXG5cIikge1xuICAgICAgICAgICAgICAgIHF1b3RlZC5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgY3VycmVudEludGVuZCA9IDAsXG4gICAgICAgICAgICBpbnRlbmRhdGlvbixcbiAgICAgICAgICAgIHF1b3RlZCA9IFtdLFxuICAgICAgICAgICAgbWF0Y2g7XG5cbiAgICAgICAgZ3JvdXAuZm9yRWFjaChsaW5lID0+IHtcblxuICAgICAgICAgICAgbWF0Y2ggPSAobGluZSArIFwiXCIpLnRyaW0oKS5tYXRjaCgvXigoPikrKSAqPyguKj8kKS9tcyk7XG5cbiAgICAgICAgICAgIGludGVuZGF0aW9uID0gbWF0Y2hbMV0ubGVuZ3RoO1xuXG4gICAgICAgICAgICB3aGlsZSAoaW50ZW5kYXRpb24gPiBjdXJyZW50SW50ZW5kKSB7XG4gICAgICAgICAgICAgICAgcG9wKHF1b3RlZCk7XG4gICAgICAgICAgICAgICAgY3VycmVudEludGVuZCsrO1xuICAgICAgICAgICAgICAgIHF1b3RlZC5wdXNoKFwiPGJsb2NrcXVvdGU+XCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aGlsZSAoY3VycmVudEludGVuZCA+IGludGVuZGF0aW9uKSB7XG4gICAgICAgICAgICAgICAgcG9wKHF1b3RlZCk7XG4gICAgICAgICAgICAgICAgY3VycmVudEludGVuZC0tO1xuICAgICAgICAgICAgICAgIHF1b3RlZC5wdXNoKFwiPC9ibG9ja3F1b3RlPlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcXVvdGVkLnB1c2gobWF0Y2hbM10pO1xuICAgICAgICAgICAgcXVvdGVkLnB1c2goXCJcXG5cIik7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgd2hpbGUgKGN1cnJlbnRJbnRlbmQgPiAwKSB7XG4gICAgICAgICAgICBwb3AocXVvdGVkKTtcbiAgICAgICAgICAgIGN1cnJlbnRJbnRlbmQtLTtcbiAgICAgICAgICAgIHF1b3RlZC5wdXNoKFwiPC9ibG9ja3F1b3RlPlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBxdW90ZWQuam9pbihcIlwiKTtcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogU2FuaXRpemVzIGEgc2luZ2xlIGxpbmUgYnkgZ3JvdXBpbmcgcXVvdGUgbWFya3MgcHJvcGVybHkuXG4gICAgICpcbiAgICAgKiAqIEBleGFtcGxlXG4gICAgICogICAgbGV0IGxpbmUgPSBcIiAgPiA+ICAgIFRleHQgdGhhdCBkb2VzIDFcIlwiO1xuICAgICAqXG4gICAgICogIGxpbmUgPSB0cmFuc2Zvcm1lci5zYW5pdGl6ZUxpbmUobGluZSk7XG4gICAgICogIC8vIFwiPj4gVGV4dCB0aGF0IGRvZXMgMVwiXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbGluZVxuICAgICAqXG4gICAgICogQHJldXJuIHtTdHJpbmd9XG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHNhbml0aXplTGluZSAobGluZSkge1xuXG4gICAgICAgIGxldCByZWdleCA9IC9eKCAqKSg+KykoID4qKSooPyEkKS9tO1xuXG4gICAgICAgIHJldHVybiBsaW5lLnJlcGxhY2UoXG4gICAgICAgICAgICByZWdleCxcbiAgICAgICAgICAgIChhcmdzKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFyZ3MucmVwbGFjZSgvKFxccykqKD8hJCkvZywgXCJcIik7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbn1cblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbi8qKlxuICogVHJhbnNmb3JtZXIgZm9yIHRyYW5zZm9ybWluZyBwbGFpbiB0ZXh0IGNvbnRhaW5pbmcgRW1haWwtQWRkcmVzc2VzXG4gKiBpbnRvIHRleHQgdGhhdCB3cmFwcyB0aG9zZSBFbWFpbC1BZGRyZXNlcyBpbiBcIjxhPlwiLXRhZ3MgYWxvbmcgd2l0aCB0aGUgaHJlZi1hdHRyaWJ1dGUnc1xuICogdmFsdWUgKGkuZS4gdGhlIEVtYWlsLUFkZHJlc3MgaXRzZWxmKSBwcmVmaXhlZCB3aXRoIFwibWFpbHRvOlwiXG4gKlxuICogQGV4YW1wbGVcbiAqICBsZXQgdGV4dCA9IFwiUGxlYXNlIGNvbnRhY3QgaW5mb0Bjb25qb29uLmNvbSBmb3IgZnVydGhlciBpbmZvcm1hdGlvbi5cIjtcbiAqXG4gKiAgbGV0IHRyYW5zZm9ybWVyID0gbmV3IEVtYWlsQWRkcmVzc1RyYW5zZm9ybWVyO1xuICpcbiAqICB0cmFuc2Zvcm1lci50cmFuc2Zvcm0odGV4dCk7XG4gKlxuICogIC8vIHJldHVybnM6XG4gKiAgLy8gUGxlYXNlIGNvbnRhY3QgPGEgaHJlZj1cIm1haWx0bzppbmZpQGNvbmpvb24uY29tXCI+aW5mb0Bjb25qb29uLmNvbTwvYT4gZm9yIGZ1cnRoZXIgaW5mb3JtYXRpb24uXG4gKlxuICovXG5jbGFzcyBFbWFpbEFkZHJlc3NUcmFuc2Zvcm1lciB7XG5cblxuICAgIC8qKlxuICAgICAqIEludm9rZXMgdHJhbnNmb3JtaW5nIHRoZSBwYXNzZWQgc3RyaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgdHJhbnNmb3JtICh0ZXh0KSB7XG5cbiAgICAgICAgY29uc3QgZW1haWxSZWdleCA9IC9bYS16QS1aMC05Ky5fJS1dezEsMjU2fUBbYS16QS1aMC05XVthLXpBLVowLTktXXswLDY0fShcXC5bYS16QS1aMC05XVthLXpBLVowLTktXXswLDI1fSkrL2dpO1xuXG4gICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoZW1haWxSZWdleCwgbWF0Y2hlcyA9PiAoXCI8YSBocmVmPVxcXCJtYWlsdG86XCIgKyBtYXRjaGVzICsgXCJcXFwiPlwiICsgbWF0Y2hlcyArIFwiPC9hPlwiKSk7XG5cbiAgICAgICAgcmV0dXJuIHRleHQ7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbi8qKlxuICogVHJhbnNmb3JtZXIgZm9yIHRyYW5zZm9ybWluZyBwbGFpbi10ZXh0IGNvbnRhaW5pbmcgSHlwZXJsaW5rc1xuICogaW50byB0ZXh0IHRoYXQgd3JhcHMgdGhvc2UgSHlwZXJsaW5rcyBpbiBcIjxhPlwiLXRhZ3MuXG4gKlxuICogQGV4YW1wbGVcbiAqICBsZXQgdGV4dCA9IFwiVGhpcyBpcyBhbiB1cmwgaHR0cHM6Ly93d3cuY29uam9vbi5vcmcgYW5kIGl0IGlzIG5vdCBjbGlja2FibGVcIjtcbiAqXG4gKiAgbGV0IHRyYW5zZm9ybWVyID0gbmV3IEh5cGVybGlua1RyYW5zZm9ybWVyO1xuICpcbiAqICB0cmFuc2Zvcm1lci50cmFuc2Zvcm0odGV4dCk7XG4gKlxuICogIC8vIHJldHVybnM6XG4gKiAgLy8gVGhpcyBpcyBhbiB1cmwgPGEgaHJlZj1cImh0dHBzOi8vd3d3LmNvbmpvb24ub3JnXCI+aHR0cHM6Ly93d3cuY29uam9vbi5vcmc8L2E+IGFuZCBpdCBpcyBub3QgY2xpY2thYmxlXG4gKlxuICovXG5jbGFzcyBIeXBlcmxpbmtUcmFuc2Zvcm1lciB7XG5cbiAgICAvKipcbiAgICAgKiBJbnZva2VzIHRyYW5zZm9ybWluZyB0aGUgcGFzc2VkIHN0cmluZy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZVxuICAgICAqXG4gICAgICogQHJldHVybiB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRyYW5zZm9ybSAodGV4dCkge1xuXG4gICAgICAgIGNvbnN0IHVybFJlZ2V4ID0gLyhcXGIoaHR0cHM/KTpcXC9cXC9bLUEtWjAtOSsmQCMvJT89fl98ITosLjtdKlstQS1aMC05KyZAIy8lPX5ffF0pL2lnO1xuXG4gICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UodXJsUmVnZXgsIG1hdGNoZXMgPT4gKFwiPGEgaHJlZj1cXFwiXCIgKyBtYXRjaGVzICsgXCJcXFwiPlwiICsgbWF0Y2hlcyArIFwiPC9hPlwiKSk7XG5cbiAgICAgICAgcmV0dXJuIHRleHQ7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbi8qKlxuICogVHJhbnNmb3JtZXIgZm9yIHRyYW5zZm9ybWluZyBwbGFpbiB0ZXh0IGNvbnRhaW5pbmcgbGluZSBicmVha3MgKFxcciwgXFxyXFxuLCBcXG4pXG4gKiBpbnRvIHRleHQgdGhhdCByZXBsYWNlcyB0aGUgbGluZSBicmVha3Mgd2l0aCBcIjxiciAvPlwiLXRhZ3MuXG4gKlxuICogQGV4YW1wbGVcbiAqICBsZXQgdGV4dCA9IFwiUGxlYXNlXFxuIGRvbid0XFxuXFxuIHdyYXBcXG5tZVwiO1xuICpcbiAqICBsZXQgdHJhbnNmb3JtZXIgPSBuZXcgTGluZUJyZWFrVHJhbnNmb3JtZXI7XG4gKlxuICogIHRyYW5zZm9ybWVyLnRyYW5zZm9ybSh0ZXh0KTtcbiAqXG4gKiAgLy8gcmV0dXJuczpcbiAqICAvLyBQbGVhc2U8YnIgLz4gZG9uJ3Q8YnIgLz48YnIgLz4gd3JhcDxiciAvPm1lXG4gKlxuICovXG5jbGFzcyBMaW5lQnJlYWtUcmFuc2Zvcm1lciB7XG5cblxuICAgIC8qKlxuICAgICAqIEludm9rZXMgdHJhbnNmb3JtaW5nIHRoZSBwYXNzZWQgc3RyaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICovXG4gICAgdHJhbnNmb3JtICh0ZXh0KSB7XG5cbiAgICAgICAgY29uc3QgcmVnZXggPSAvKFxcclxcbnxcXG58XFxyKS9nbTtcblxuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKHJlZ2V4LCBtYXRjaGVzID0+IChcIjxiciAvPlwiKSk7XG5cbiAgICAgICAgcmV0dXJuIHRleHQ7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cbnZhciBfbDhqcyQ1ID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICAgIF9fcHJvdG9fXzogbnVsbCxcbiAgICBCbG9ja3F1b3RlVHJhbnNmb3JtZXI6IEJsb2NrcXVvdGVUcmFuc2Zvcm1lcixcbiAgICBFbWFpbEFkZHJlc3NUcmFuc2Zvcm1lcjogRW1haWxBZGRyZXNzVHJhbnNmb3JtZXIsXG4gICAgSHlwZXJsaW5rVHJhbnNmb3JtZXI6IEh5cGVybGlua1RyYW5zZm9ybWVyLFxuICAgIExpbmVCcmVha1RyYW5zZm9ybWVyOiBMaW5lQnJlYWtUcmFuc2Zvcm1lclxufSk7XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG52YXIgX2w4anMkNCA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgICBfX3Byb3RvX186IG51bGwsXG4gICAgaHRtbDogX2w4anMkNVxufSk7XG5cbi8qKlxuICogbDguanNcbiAqIGw4XG4gKiBDb3B5cmlnaHQgKEMpIDIwMjEgVGhvcnN0ZW4gU3Vja293LUhvbWJlcmcgaHR0cHM6Ly9naXRodWIuY29tL2w4anMvbDhcbiAqXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvblxuICogb2J0YWluaW5nIGEgY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb25cbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcbiAqIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsXG4gKiBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLFxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcbiAqIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuICpcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4gKiBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxuICogRVhQUkVTUyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTXG4gKiBPRiBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbiAqIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuICogT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cbiAqL1xuXG52YXIgX2w4anMkMyA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHtcbiAgICBfX3Byb3RvX186IG51bGwsXG4gICAgdHJhbnNmb3JtZXI6IF9sOGpzJDRcbn0pO1xuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgY2xhc3NlcyBpbXBsZW1lbnRpbmcgdGVtcGxhdGUgY29tcGlsZXIgZnVuY3Rpb25hbGl0eVxuICovXG5jbGFzcyBDb21waWxlciB7XG5cbiAgICAvKipcbiAgICAgKiBDb21waWxlcyB0aGUgc3BlY2lmaWVkIHR4dCBhbmQgcmV0dXJucyBhbiBpbnN0YW5jZSBvZiBDb21waWxlZFRwbC5cbiAgICAgKiBJbXBsZW1lbnRpbmcgY2xhc3NlcyBzaG91bGQgdGFrZSBjYXJlIG9mIHByb3Blcmx5IHBhcnNpbmcgdGhlIHR4dCBmb3IgdGhlIGFsbG93ZWQga2V5cyBhbmRcbiAgICAgKiB2b2lkIGFueSBvdGhlciBrZXlzIGRldGVjdGVkIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eHRcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBrZXlzIEFuIGFycmF5IG9mIGtleXMgcmVwcmVzZW50aW5nIGFsbG93ZWQgdGVtcGxhdGUgdmFyaWFibGVzLCBvcHRpb25hbC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0NvbXBpbGVkVHBsfVxuICAgICAqXG4gICAgICogQHRocm93cyBpZiBhbnkgZXJyb3IgZHVyaW5nIGNvbXBpbGluZyBvY2N1cnNcbiAgICAgKi9cbiAgICBjb21waWxlICh0eHQsIGtleXMpIHt9XG5cblxufVxuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgQ29tcGlsZWQgVGVtcGxhdGVzLlxuICpcbiAqL1xuY2xhc3MgQ29tcGlsZWRUcGwge1xuXG4gICAgLyoqXG4gICAgICogUmVwbGFjZXMga2V5cyBmcm9tIGRhdGEgZm91bmQgaW4gdGhpcyBjb21waWxlZCB0ZW1wbGF0ZSB3aXRoIHRoZWlyIGFwcHJvcHJpYXRlIHZhbHVlc1xuICAgICAqIGFuZCByZXR1cm5zIHRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhpcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAgICpcbiAgICAgKiBAdGhyb3dzIGlmIGFueSBlcnJvciBkdXJpbmcgdGhlIHJlbmRlcmluZyBwcm9jZXNzIG9jY3Vyc1xuICAgICAqL1xuICAgIHJlbmRlciAoZGF0YSkge31cblxufVxuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuXG4vKipcbiAqIENvbXBpbGVkIFRlbXBsYXRlIHJlcHJlc2VudGF0aW9uIGZvciBqYXZhU2NyaXB0LVN0cmluZ3MuXG4gKlxuICovXG5jbGFzcyBUcGwgZXh0ZW5kcyBDb21waWxlZFRwbCB7XG5cbiAgICAvKipcbiAgICAgKiBAdmFyIGZuXG4gICAgICogQHR5cGUgRnVuY3Rpb25cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0b3IuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgaW50ZXJuYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGNvbXBpbGVkIHRlbXBsYXRlIHdyYXBwZWQgaW4gYSBmdW5jdGlvbi5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBrZXlzIGFsbG93ZWQga2V5cyBhcyBwYXNzZWQgZnJvbSB0aGUgY29tcGlsZXJcbiAgICAgKlxuICAgICAqIEB0aHJvd3MgaWYgZm4gaXMgbm90IGEgZnVuY3Rpb25cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAoZm4pIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgaWYgKCFpc0Z1bmN0aW9uKGZuKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXFxcImZuXFxcIiBtdXN0IGJlIG9mIHR5cGUgXFxcImZ1bmN0aW9uXFxcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZm4gPSBmbjtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBpbmhlcml0ZG9jXG4gICAgICovXG4gICAgcmVuZGVyIChkYXRhKSB7XG4gICAgICAgIGNvbnN0IG1lID0gdGhpcztcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIG1lLmZuLmNhbGwoe30sIGRhdGEpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHJlbmRlcmluZyBcImRhdGFcIiBmYWlsZWQgd2l0aCBtZXNzYWdlICR7ZS5tZXNzYWdlfWApO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxufVxuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cbi8qKlxuICogQ29tcGlsZXIgaW1wbGVtZW50YXRpb24gZm9yIEphdmFTY3JpcHQgdGVtcGxhdGUgc3RyaW5ncy5cbiAqXG4gKi9cbmNsYXNzIFN0cmluZ0NvbXBpbGVyIGV4dGVuZHMgQ29tcGlsZXIge1xuXG4gICAgLyoqXG4gICAgICogSW50ZXJuYWwgY29tcGlsZXIgcmVwcmVzZW50YXRpb24uXG4gICAgICogQHZhciBjcGxcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogQGluaGVyaXRkb2NcbiAgICAgKi9cbiAgICBjb21waWxlICh0eHQsIGtleXMpIHtcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIG1lID0gdGhpcyxcbiAgICAgICAgICAgIHRwbEtleXMgPSBtZS5nZXRLZXlzKHR4dCksXG4gICAgICAgICAgICBhcmdzID0gbWUuYnVpbGRBcmd1bWVudExpc3QodHBsS2V5cyksXG4gICAgICAgICAgICBpbnZhbGlkS2V5cyA9IG1lLmdldEJsYWNrbGlzdGVkS2V5cyhhcmdzLCBrZXlzIHx8IFtdKTtcblxuICAgICAgICBpZiAoaW52YWxpZEtleXMubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgYENhbm5vdCBjb21waWxlIHRlbXBsYXRlOiBDb250YWlucyBpbnZhbGlkIGtleXM6ICR7aW52YWxpZEtleXMuam9pbihcIiwgXCIpfWBcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdFxuICAgICAgICAgICAgZm4gPSBtZS5nZXRGdW5jdGlvbkNvbmZpZyhhcmdzLCB0eHQpLFxuICAgICAgICAgICAgY3BsID0gbWUuZ2V0TmF0aXZlRnVuY3Rpb24oZm4uYXJncywgZm4uZm4pO1xuXG4gICAgICAgIHJldHVybiBuZXcgVHBsKGNwbCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBHZXRzIGEgbGlzdCBvZiBrZXlzIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIGFyZ3VtZW50cyByZXByZXNlbnRpbmcgcG9zc2libGUgY2FuZGlkYXRlc1xuICAgICAqIHRvIHBhc3MgdG8gdGhlIHRlbXBsYXRlIHJlbmRlciBmdW5jdGlvbi4gTWFrZXMgc3VyZSBlbnRyaWVzIGFyZVxuICAgICAqIHVuaXF1ZSBhbmQgdGhhdCBvYmplY3QgY2hhaW5zIGFyZSByZXNvbHZlZCB0byB0aGUgcm9vdCBvYmplY3QuXG4gICAgICpcbiAgICAgKiAgQGV4YW1wbGVcbiAgICAgKiAgdGhpcy5idWlsZEFyZ3VtZW50TGlzdChbXCJmb29cIiwgXCJmb28uYmFyXCIsIFwiY29uZmlnXCIsIFwiY29uZmlnW1xcXCJ0ZXN0XFxcIl1dKTsgLy8gXCJmb28sIGNvbmZpZ1wiXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtBcnJheX0ga2V5TGlzdFxuICAgICAqXG4gICAgICogQHJldHVybiB7QXJyYXl9XG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGJ1aWxkQXJndW1lbnRMaXN0IChrZXlMaXN0KSB7XG4gICAgICAgIGxldCBsaXN0ID0ga2V5TGlzdC5tYXAoa2V5ID0+IGtleS5zcGxpdCgvXFwufFxcWy8pWzBdKTtcblxuICAgICAgICByZXR1cm4gWy4uLm5ldyBTZXQobGlzdCldO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogRXh0cmFjdHMgYWxsIHRoZSBwbGFjZWhvbGRlcnMgd2l0aCB0aGVpciBuYW1lcyBvdXQgb2YgdGhlIHR4dC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eHRcbiAgICAgKi9cbiAgICBnZXRLZXlzICh0eHQpIHtcbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIHJlZ2V4ID0gL1xcJFxceyhbXn1dKylcXH0vZ20sXG4gICAgICAgICAgICBrZXlzID0gW107XG5cbiAgICAgICAgbGV0IG07XG5cbiAgICAgICAgd2hpbGUgKChtID0gcmVnZXguZXhlYyh0eHQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyBuZWNlc3NhcnkgdG8gYXZvaWQgaW5maW5pdGUgbG9vcHMgd2l0aCB6ZXJvLXdpZHRoIG1hdGNoZXNcbiAgICAgICAgICAgIGlmIChtLmluZGV4ID09PSByZWdleC5sYXN0SW5kZXgpIHtcbiAgICAgICAgICAgICAgICByZWdleC5sYXN0SW5kZXgrKztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVGhlIHJlc3VsdCBjYW4gYmUgYWNjZXNzZWQgdGhyb3VnaCB0aGUgYG1gLXZhcmlhYmxlLlxuICAgICAgICAgICAgbS5mb3JFYWNoKChtYXRjaCwgZ3JvdXBJbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChncm91cEluZGV4ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGtleXMucHVzaChtYXRjaCk7ICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBrZXlzO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQ29tcGFyZXMgdGhlIHdoaXRlbGlzdCBvZiBrZXlzIHdpdGggdGhlIHN1Ym1pdHRlZCBrZXlzLlxuICAgICAqIFJldHVybnMgYWxsIHZhbHVlcyB0aGF0IGRvIG5vdCBhcHBlYXIgaW4gdGhlIHdoaXRlbGlzdC5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogdGhpcy5nZXRCbGFja2xpc3RlZEtleXMoXG4gICAgICogICAgICBbXCJmb29cIiwgXCJiYXJcIiwgXCJ3aW5kb3dcIiwgXCJ0aGlzXCJdLFxuICAgICAqICAgICAgW1widGVzdFwiLCBcImZvb1wiLCBcIndpbmRvd1wiXVxuICAgICAqICApOyAvLyBbXCJ0aGlzXCIsIFwiYmFyXCJdXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0FycmF5fSBzb3VyY2VcbiAgICAgKiBAcGFyYW0ge0FycmF5fSB3aGl0ZWxpc3QgaWYgbGVmdCBlbXB0eSwgYWxsIGtleXMgYXJlIGFsbG93ZWRcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0FycmF5fVxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBnZXRCbGFja2xpc3RlZEtleXMgKHNvdXJjZSwgd2hpdGVsaXN0KSB7XG4gICAgICAgIGlmICghd2hpdGVsaXN0Lmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzb3VyY2UuZmlsdGVyKGVudHJ5ID0+IHdoaXRlbGlzdC5pbmRleE9mKGVudHJ5KSA9PT0gLTEpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhbiBpbnRlcm5hbCBjb25maWd1cmF0aW9uIG9iamVjdCB0aGF0IGdldHMgcGFzc2VkIHRvIG5ldyBGdW5jdGlvblxuICAgICAqIHRvIGJ1aWxkIHRoZSBjb21waWxlZCBmdW5jdGlvbiBmb3IgY3JlYXRpbmcgYW4gZXNpeC5UcGwgb3V0IG9mLlxuICAgICAqIEFQSSBvbmx5LiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgY2FsbGVkIHdobmV2ZXIgcGFyc2luZyBhbmQgcHJlcGFyaW5nIHRoZSB0ZW1wbGF0ZVxuICAgICAqIHRleHQgY29tcGxldGVkLlxuICAgICAqXG4gICAgICogQHBhcmFtIGFyZ3VtZW50TGlzdFxuICAgICAqIEBwYXJhbSB0eHRcbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgZ2V0RnVuY3Rpb25Db25maWcgKGFyZ3VtZW50TGlzdCwgdHh0KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBhcmdzIDogYHske2FyZ3VtZW50TGlzdC5qb2luKFwiLCBcIil9fWAsXG4gICAgICAgICAgICBmbiA6IGByZXR1cm4gXFxgJHt0eHR9XFxgYFxuICAgICAgICB9O1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBnZXROYXRpdmVGdW5jdGlvbiAoYXJncywgYm9keSkge1xuICAgICAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKGFyZ3MsIGJvZHkpO1xuICAgIH1cbiAgICBcbn1cblxuLyoqXG4gKiBsOC5qc1xuICogbDhcbiAqIENvcHlyaWdodCAoQykgMjAyMSBUaG9yc3RlbiBTdWNrb3ctSG9tYmVyZyBodHRwczovL2dpdGh1Yi5jb20vbDhqcy9sOFxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXG4gKiBvYnRhaW5pbmcgYSBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvblxuICogZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLFxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcbiAqIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsXG4gKiBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLFxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKlxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICpcbiAqIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcbiAqIE9GIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC5cbiAqIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4gKiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4gKiBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuICovXG5cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRlbXBsYXRlIGltcGxlbWVudGF0aW9ucy5cbiAqXG4gKi9cbmNsYXNzIFRlbXBsYXRlIHtcblxuICAgIC8qKlxuICAgICAqIFJlbmRlcnMgdGhpcyB0ZW1wbGF0ZXMgdHh0IHdpdGggdGhlIHNwZWNpZmllZCBkYXRhLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1N0cmluZ30gVGhlIGNvbXBpbGVkLCBzYW5pdGl6ZWQgYW5kIHBhcnNlZCB0ZW1wbGF0ZSB3aXRoIHRoZSBwbGFjZWhvbGRlcnNcbiAgICAgKiByZXBsYWNlZCB3aXRoIHRoZSBkYXRhIGZvdW5kIGluIHRoZSBzdWJtaXR0ZWQgb2JqZWN0LlxuICAgICAqXG4gICAgICogQHRocm93cyBpZiBhbnkgZXJyb3IgZHVyaW5nIHRoZSByZW5kZXJpZyBwcm9jZXNzIG9jY3Vycy5cbiAgICAgKi9cbiAgICByZW5kZXIgKGRhdGEpIHt9XG5cblxufVxuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuLyoqXG4gKiBUZW1wbGF0ZSBDbGFzcyBwcm92aWRpbmcgc3VwcG9ydCBmb3IgSmF2YVNjcmlwdCB0ZW1wbGF0ZSBzdHJpbmdzLlxuICpcbiAqL1xuY2xhc3MgU3RyaW5nVGVtcGxhdGUgZXh0ZW5kcyBUZW1wbGF0ZSB7XG5cblxuICAgIC8qKlxuICAgICAqIEB2YXIgdHBsXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogTWFwcyBwcmUtY29tcGlsZWQgdGVtcGxhdGVzIHdpdGggdGhlIGtleXMgb2YgdGhlIGRhdGEgb2JqZWN0IHBhc3NlZCB0byB0aGVtIGZvclxuICAgICAqIGJ1aWxkaW5nIGEgY29tcGlsZXIgY2FjaGUuXG4gICAgICogQHZhciBjb21waWxlZFRwbHNcbiAgICAgKiBAdHlwZSB7QXJyYXkuPFRwbD59XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cblxuXG4gICAgLyoqXG4gICAgICogQHZhciBjb21waWxlclxuICAgICAqIEB0eXBlIHtTdHJpbmdDb21waWxlcn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuXG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3Rvci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0cGwgVGhlIHRlbXBsYXRlIHN0cmluZyB0aGlzIHRlbXBsYXRlIHJlcHJlc2VudHMuXG4gICAgICpcbiAgICAgKiBAdGhyb3dzIHtjb29uLmNvcmUuZXhjZXB0aW9uLklsbGVnYWxBcmd1bWVudEV4Y2VwdGlvbn0gaWYgY29tcGlsZXIgaXMgbm9cbiAgICAgKiBpbnN0YW5jZSBvZiB7Y29vbi5jb3JlLnRlbXBsYXRlLkNvbXBpbGVyfVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yICh0cGwpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgY29uc3QgbWUgPSB0aGlzO1xuXG4gICAgICAgIG1lLmNvbXBpbGVyID0gbmV3IFN0cmluZ0NvbXBpbGVyKCk7XG5cbiAgICAgICAgbWUudHBsID0gdHBsO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogUmVuZGVycyB0aGlzIHRlbXBsYXRlcyB0eHQgd2l0aCB0aGUgc3BlY2lmaWVkIGRhdGEuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YVxuICAgICAqXG4gICAgICogQHRocm93cyBleGNlcHRpb25zIGZyb20gPENvbXBpbGVyPi5jb21waWxlKCkgYW5kIDxDb21waWxlZFRwbD4ucmVuZGVyKClcbiAgICAgKi9cbiAgICByZW5kZXIgKGRhdGEpIHtcbiAgICAgICAgY29uc3QgbWUgPSB0aGlzO1xuXG4gICAgICAgIGxldCBrZXlzICAgPSBPYmplY3Qua2V5cyhkYXRhKSxcbiAgICAgICAgICAgIGNwbEtleSA9IGtleXMuam9pbihcIi5cIik7XG5cbiAgICAgICAgbWUuY29tcGlsZWRUcGxzID0gbWUuY29tcGlsZWRUcGxzIHx8IHt9O1xuXG4gICAgICAgIGlmICghbWUuY29tcGlsZWRUcGxzW2NwbEtleV0pIHtcbiAgICAgICAgICAgIG1lLmNvbXBpbGVkVHBsc1tjcGxLZXldID0gbWUuY29tcGlsZXIuY29tcGlsZShtZS50cGwsIGtleXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1lLmNvbXBpbGVkVHBsc1tjcGxLZXldLnJlbmRlcihkYXRhKTtcbiAgICB9XG5cblxufVxuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxudmFyIF9sOGpzJDIgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gICAgX19wcm90b19fOiBudWxsLFxuICAgIFN0cmluZ0NvbXBpbGVyOiBTdHJpbmdDb21waWxlcixcbiAgICBTdHJpbmdUZW1wbGF0ZTogU3RyaW5nVGVtcGxhdGUsXG4gICAgVHBsOiBUcGxcbn0pO1xuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxudmFyIF9sOGpzJDEgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gICAgX19wcm90b19fOiBudWxsLFxuICAgIGVzaXg6IF9sOGpzJDIsXG4gICAgQ29tcGlsZWRUcGw6IENvbXBpbGVkVHBsLFxuICAgIENvbXBpbGVyOiBDb21waWxlcixcbiAgICBUZW1wbGF0ZTogVGVtcGxhdGVcbn0pO1xuXG4vKipcclxuICogbDguanNcclxuICogbDhcclxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XHJcbiAqXHJcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uXHJcbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXHJcbiAqIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbixcclxuICogaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSxcclxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcclxuICogYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbyxcclxuICogc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XHJcbiAqXHJcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXHJcbiAqIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxyXG4gKlxyXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELFxyXG4gKiBFWFBSRVNTIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVNcclxuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxyXG4gKiBJTiBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcclxuICogREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXHJcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcclxuICogVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cclxuICovXHJcblxyXG4vKipcclxuICogUmVzb3VyY2VSZXF1ZXN0b3ItaW1wbGVtZW50YXRpb24gdXNpbmcgWG1sSHR0cFJlcXVlc3QgYXBpLlxyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKlxyXG4gKiAgICAvLyBleGlzdGluZyBqc29uLWZpbGUgYXQgXCIuL2FwcC1jbl9tYWlsLmNvbmYuanNvblwiXHJcbiAqICAgIGNvbnN0IGZpbGVMb2FkZXIgPSBuZXcgWG1sSHR0cFJlc291cmNlUmVxdWVzdG9yKCk7XHJcbiAqICAgIGNvbnN0IHJlcyA9IGF3YWl0IGZpbGVMb2FkZXIucmVxdWVzdChcIi4vYXBwLWNuX21haWwuY29uZi5qc29uXCIpO1xyXG4gKiAgICBjb25zb2xlLmxvZyhyZXMpOyAvLyBwbGFpbiB0ZXh0IGNvbnRlbnRzIG9mIHRoZSBmaWxlIG9uIHN1Y2Nlc3NcclxuICpcclxuICovXHJcbmNsYXNzIEZpbGVMb2FkZXIge1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNlbmRzIGEgSEVBRCByZXF1ZXN0IHRvIHRoZSBzcGVjaWZpZWQgcmVzb3VyY2UgbG9jYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB1cmxcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHtQcm9taXNlPHZvaWQ+fSBmYWxzZSBpZiBhbnkgZXhjZXB0aW9uIG9jY3VyZXMgd2hpbGUgdHJ5aW5nIHRvIGFjY2VzcyB0aGUgcmVzb3VyY2UsXHJcbiAgICAgKiBpbmRpY2F0aW5nIHRoYXQgdGhlIHJlc291cmNlIG1pZ2h0IG5vdCBleGlzdC5cclxuICAgICAqXHJcbiAgICAgKiBAdGhyb3dzIGlmIHVybCB3YXMgbm90IGEgc3RyaW5nXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHBpbmcgKHVybCkge1xyXG5cclxuICAgICAgICBsZXQgcmVxdWVzdDtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmVxdWVzdCA9IGF3YWl0IHRoaXMucmVxdWVzdCh1cmwsIFwiSEVBRFwiKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiByZXF1ZXN0LnN0YXR1cyA9PT0gMjAwO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXRpYXRlcyBsb2FkaW5nIHRoZSBmaWxlIHNwZWNpZmllZCB3aXRoIHRoZSBnaXZlbiB1cmwgYW5kIHJldHVybnMgYVxyXG4gICAgICogUHJvbWlzZSBvciBhIG1peGVkIHZhbHVlIHJlcHJlc2VudGluZyB0aGUgZmlsZSBjb250ZW50cyBpZiB1c2VkIHdpdGggYXN5bmMvYXdhaXQuXHJcbiAgICAgKiBJbXBsZW1lbnRpbmcgQVBJcyBzaG91bGQgYmUgYXdhcmUgb2YgcGluZyB0byBzZW5kIGEgSEVBRC1yZXF1ZXN0IHRvIHRoZSByZXNvdXJjZVxyXG4gICAgICogYmVmb3JlIGFuIGF0dGVtcHQgdG8gbG9hZCBpdCBpcyBtYWRlLlxyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiAvLyB0aGVuYWJsZVxyXG4gICAgICogbG9hZGVyLmxvYWQoXCJhcHAtY25fbWFpbC5jb25mLmpzb25cIikudGhlbihcclxuICAgICAqICAgICAgKGNvbmYpID0+IHtjb25zb2xlLmxvZyhjb25mKTt9LCAvLyBjb25zb2xlLmxvZ3MgdGhlIHBsYWluIHRleHQgZnJvbSB0aGUgbG9hZGVkIGZpbGVcclxuICAgICAqICAgICAgKGV4YykgPT4ge2NvbnNvbGUubG9nKGV4Yyk7fSAvLyBjb25zb2xlIGxvZ3MgdGhlIGV4Y2VwdGlvbiwgaWYgYW55IG9jY3VyZWQsXHJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hpY2ggaXMgYSBjb29uLmNvcmUuZGF0YS5yZXF1ZXN0Lkh0dHBSZXF1ZXN0RXhjZXB0aW9uXHJcbiAgICAgKiApO1xyXG4gICAgICogLy8gb3JcclxuICAgICAqIGxldCB0eHQ7XHJcbiAgICAgKiB0cnkge1xyXG4gICAgICogICAgdHh0ID0gYXdhaXQgbG9hZGVyLmxvYWQoXCJhcHAtY25fbWFpbC5jb25mLmpzb25cIik7XHJcbiAgICAgKiB9IGNhdGNoIChlKSB7XHJcbiAgICAgKiAgICAvLyBleGNlcHRpb24gaGFuZGxpbmcgZm9yICBjb29uLmNvcmUuZGF0YS5yZXF1ZXN0Lkh0dHBSZXF1ZXN0RXhjZXB0aW9uXHJcbiAgICAgKiB9XHJcbiAgICAgKiBjb25zb2xlLmxvZyh0eHQpOyAvLyBmaWxlIGNvbnRlbnRzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHVybCBUaGUgbG9jYXRpb24gdG8gcmVhZCB0aGUgZmlsZSBmcm9tXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB7UHJvbWlzZTwqPn1cclxuICAgICAqXHJcbiAgICAgKiBAdGhyb3dzIGlmIGFueSBleGNlcHRpb24gb2NjdXJlZCwgb3IgaWYgdXJsIHdhcyBub3QgYSBzdHJpbmdcclxuICAgICAqL1xyXG4gICAgYXN5bmMgbG9hZCAodXJsKSB7XHJcbiAgICAgICAgbGV0IHJlcXVlc3QgPSBhd2FpdCB0aGlzLnJlcXVlc3QodXJsLCBcIkdFVFwiKTtcclxuICAgICAgICByZXR1cm4gcmVxdWVzdC5yZXNwb25zZVRleHQ7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEBwYXJhbSB1cmxcclxuICAgICAqIEBwYXJhbSBtZXRob2RcclxuICAgICAqL1xyXG4gICAgYXN5bmMgcmVxdWVzdCAodXJsLCBtZXRob2QpIHtcclxuXHJcbiAgICAgICAgaWYgKFtcIkdFVFwiLCBcIkhFQURcIl0uaW5kZXhPZihtZXRob2QpID09PSAtMSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFwibWV0aG9kXCIgKCR7bWV0aG9kfSkgaXMgbm90IHN1cHBvcnRlZGApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFpc1N0cmluZyh1cmwpKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlxcXCJ1cmxcXFwiIG11c3QgYmUgYSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSByZXNvdXJjZSBsb2NhdGlvblwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCByZXQgPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgcmVxdWVzdC5vcGVuKG1ldGhvZCwgdXJsKTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVlc3Qub25sb2FkID0gKHByb2dyZXNzRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGh0dHBSZXF1ZXN0ID0gcHJvZ3Jlc3NFdmVudC50YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoaHR0cFJlcXVlc3Quc3RhdHVzID09PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGh0dHBSZXF1ZXN0KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHR0cFJlcXVlc3Quc3RhdHVzICsgXCIgXCIgKyBodHRwUmVxdWVzdC5zdGF0dXNUZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSAocHJvZ3Jlc3NFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaHR0cFJlcXVlc3QgPSBwcm9ncmVzc0V2ZW50LnRhcmdldDtcclxuICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICAgICAgYEFuIHVuZXhwZWN0ZWQgZXJyb3Igb2NjdXJlZCB3aGlsZSB0cnlpbmcgdG8gbG9hZCBmcm9tIFwiJHtodHRwUmVxdWVzdC5yZXNwb25zZVVSTH1cImBcclxuICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgcmVxdWVzdC5zZW5kKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcblxyXG5cclxufVxuXG4vKipcbiAqIGw4LmpzXG4gKiBsOFxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9sOGpzL2w4XG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxudmFyIF9sOGpzID0gLyojX19QVVJFX18qL09iamVjdC5mcmVlemUoe1xuICAgIF9fcHJvdG9fXzogbnVsbCxcbiAgICBGaWxlTG9hZGVyOiBGaWxlTG9hZGVyXG59KTtcblxuZXhwb3J0IHsgYXNzaWduLCBjaGFpbiwgY2huLCBjcmVhdGVSYW5nZSwgZmYsIGZpbmRGaXJzdCwgZmxpcCwgZ3JvdXBJbmRpY2VzLCBpcywgaXNBcnJheSwgaXNGdW5jdGlvbiwgaXNOb3QsIGlzTnVtYmVyLCBpc09iamVjdCwgaXNQbGFpbk9iamVjdCwgaXNSZWdFeHAsIGlzU3RyaW5nLCBpc2EsIGlzZiwgaXNuLCBpc28sIGlzcG8sIGlzcngsIGlzcywgbGNrLCBsaXF1aWZ5LCBsaXN0TmVpZ2hib3VycywgbG9jaywgbmNobiwgcHVyZ2UsIHJlcGxhY2UsIF9sOGpzIGFzIHJlcXVlc3QsIHJwbCwgX2w4anMkMSBhcyB0ZW1wbGF0ZSwgX2w4anMkMyBhcyB0ZXh0LCB1bmNoYWluLCB1bmlmeSwgdmlzaXQsIHZzdCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bDgucGFja2FnZXMuZXNtLmpzLm1hcFxuIiwiLyoqXG4gKiBjb29uLmpzXG4gKiBzaWVzdGEtbGliLWhlbHBlclxuICogQ29weXJpZ2h0IChDKSAyMDIxIFRob3JzdGVuIFN1Y2tvdy1Ib21iZXJnIGh0dHBzOi8vZ2l0aHViLmNvbS9jb29uLWpzL3NpZXN0YS1saWItaGVscGVyXG4gKlxuICogUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb25cbiAqIG9idGFpbmluZyBhIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uXG4gKiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sXG4gKiBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLFxuICogcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSxcbiAqIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sXG4gKiBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuICogaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCxcbiAqIEVYUFJFU1MgT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFU1xuICogT0YgTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULlxuICogSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4gKiBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1JcbiAqIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbiAqIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG4gKi9cblxuaW1wb3J0ICogYXMgbDggZnJvbSBcIkBsOGpzL2w4XCI7XG5cblxuLyoqXG4gKiBVc2VzIHRoZSBzcGVjaWZpZWQgdGVzdENvbmZpZyBmb3IgdGVoIHByZUxvYWRlci1zZWN0aW9uIGFuZCBhcHBsaWVzIHRoZSByZWxhdGVkIHBhdGhzIGZvdW5kIGF0XG4gKiBwYXRoQ29uZmlnVXJsIChjb25maWctZmlsZSB1cmwoKSkgdG8gaXQsIHRoZW4gcGFzc2VzIGl0IHRvIGdldFBhdGhzKCkgYW5kIHJldHVybnMgdGhlIHZhbHVlLlxuICogY29udGVudCBmb3VuZCBhdCBwYXRoQ29uZmlnVXJsIHNob3VsZCBiZSBpbiBhIGZvcm1hdCBAY29vbi1qcy9leHRqcy1saW5rIHByb2R1Y2VzLlxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogIGpzb24gYXQgXCJwYXRoQ29uZmlnVXJsLmpzb25cIjpcbiAqXG4gKiAge1xuICogICAgICAgY3NzOiBbe1xuICogICAgICAgICAgICAgICBtb2Rlcm46IFtcbiAqICAgICAgICAgICAgICAgICAgIFwiZm9vLmNzc1wiXG4gKiAgICAgICAgICAgICAgIF0sXG4gKiAgICAgICAgICAgICAgIGNsYXNzaWM6IFtcbiAqICAgICAgICAgICAgICAgICAgIFwiYmFyLmNzc1wiXG4gKiAgICAgICAgICAgICAgIF1cbiAqXG4gKiAgICAgICB9XSxcbiAqICAgICAgIGpzOiB7XG4gKiAgICAgICAgICAgICAgIG1vZGVybjogXCJtb2Rlcm4uanNcIixcbiAqICAgICAgICAgICAgICAgY2xhc3NpYzogXCJjbGFzc2ljLmpzXCJcbiAqXG4gKiAgICAgIH1cbiAqICAgfVxuICpcbiAqXG4gKiAgY29uc3QgY29uZmlnID0ge1xuICogICAgICBsb2FkZXJQYXRoOiB7XG4gKiAgICAgICBcIkV4dC5QYWNrYWdlXCI6IFwiL25vZGVfbW9kdWxlcy9AY29vbi1qcy9leHRqcy1wYWNrYWdlLWxvYWRlci9wYWNrYWdlcy9wYWNrYWdlLWxvYWRlci9zcmMvc3JjL1BhY2thZ2UuanNcIixcbiAqICAgICAgIFwiY29vbi5jb3JlXCI6IFwiLi4vc3JjL1wiLFxuICogICB9LFxuICogICBwcmVsb2Fkczoge1xuICogICAgICAgY3NzOiBbe1xuICogICAgICAgICAgICAgICBtb2Rlcm46IFtcbiAqICAgICAgICAgICAgICAgICAgIFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1tb2Rlcm4tcnVudGltZS9tYXRlcmlhbC9tYXRlcmlhbC1hbGxfMS5jc3NcIixcbiAqICAgICAgICAgICAgICAgICAgIFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1tb2Rlcm4tcnVudGltZS9tYXRlcmlhbC9tYXRlcmlhbC1hbGxfMi5jc3NcIlxuICogICAgICAgICAgICAgICBdLFxuICogICAgICAgICAgICAgICBjbGFzc2ljOiBbXG4gKiAgICAgICAgICAgICAgICAgICBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtY2xhc3NpYy1ydW50aW1lL21hdGVyaWFsL21hdGVyaWFsLWFsbF8xLmNzc1wiLFxuICogICAgICAgICAgICAgICAgICAgXCIvbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LWNsYXNzaWMtcnVudGltZS9tYXRlcmlhbC9tYXRlcmlhbC1hbGxfMi5jc3NcIixcbiAqICAgICAgICAgICAgICAgICAgIFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1jbGFzc2ljLXJ1bnRpbWUvbWF0ZXJpYWwvbWF0ZXJpYWwtYWxsXzMuY3NzXCJcbiAqICAgICAgICAgICAgICAgXVxuICogICAgICAgfV0sXG4gKiAgICAgICBqczogW1xuICogICAgICAgICAgIFwiL25vZGVfbW9kdWxlcy9AbDhqcy9sOC9kaXN0L2w4LnJ1bnRpbWUuanNcIiwge1xuICogICAgICAgICAgICAgICBtb2Rlcm46IFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1tb2Rlcm4tcnVudGltZS9tb2Rlcm4uZW5naW5lLmVudGVycHJpc2UuanNcIixcbiAqICAgICAgICAgICAgICAgY2xhc3NpYzogXCIvbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LW1vZGVybi1ydW50aW1lL2NsYXNzaWMuZW5naW5lLmVudGVycHJpc2UuanNcIlxuICogICAgICAgICAgIH1cbiAqICAgICAgIF1cbiAqICAgfX07XG4gKlxuICogIGNvbmZpZ3VyZVdpdGhFeHRKc0xpbmtQYXRocyhjb25maWcsIFwicGF0aENvbmZpZ1VybC5qc29uXCIsIHRydWUpOyAvLyByZXR1cm5zIHtcbiAqICAgLy8gICBwcmVsb2FkIDogW1xuICogICAvLyAgICAgICBcImZvby5jc3NcIixcbiAqICAgLy8gICAgICAgXCIvbm9kZV9tb2R1bGVzL0BsOGpzL2w4L2Rpc3QvbDgucnVudGltZS5qc1wiLFxuICogICAvLyAgICAgICBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtbW9kZXJuLXJ1bnRpbWUvbW9kZXJuLmVuZ2luZS5lbnRlcnByaXNlLmpzXCJcbiAqICAgLy8gICAgICAgXCJtb2Rlcm4uanNcIlxuICogICAvLyAgIF0sXG4gKiAgIC8vICAgbG9hZGVyUGF0aCA6IHtcbiAqICAgLy8gICAgICAgXCJFeHQuUGFja2FnZVwiOiBcIi9ub2RlX21vZHVsZXMvQGNvb24tanMvZXh0anMtcGFja2FnZS1sb2FkZXIvcGFja2FnZXMvcGFja2FnZS1sb2FkZXIvc3JjL3NyYy9QYWNrYWdlLmpzXCIsXG4gKiAgIC8vICAgICAgIFwiY29vbi5jb3JlXCI6IFwiLi4vc3JjL1wiXG4gKiAgIC8vICAgfVxuICogIC8vIH07XG4gKlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB0ZXN0Q29uZmlnXG4gKiBAcGFyYW0ge1N0cmluZ30gcGF0aENvbmZpZ1VybFxuICogQHBhcmFtIHtCb29sZWFufSBpc01vZGVyblxuICogQHJldHVybnMge1Byb21pc2U8e2xvYWRlclBhdGg6IHt9LCBwcmVsb2FkOiAqW119Pn1cbiAqL1xuZXhwb3J0IGNvbnN0IGNvbmZpZ3VyZVdpdGhFeHRKc0xpbmtQYXRocyA9IGFzeW5jIGZ1bmN0aW9uICh0ZXN0Q29uZmlnLCBwYXRoQ29uZmlnVXJsLCBpc01vZGVybikge1xuXG4gICAgY29uc3RcbiAgICAgICAgbG9hZGVyID0gbmV3IGw4LnJlcXVlc3QuRmlsZUxvYWRlcigpO1xuXG4gICAgaWYgKGF3YWl0IGxvYWRlci5waW5nKHBhdGhDb25maWdVcmwpKSB7XG5cbiAgICAgICAgY29uc3RcbiAgICAgICAgICAgIGV4dGpzTGlua0NvbmZpZyA9IEpTT04ucGFyc2UoYXdhaXQgbG9hZGVyLmxvYWQocGF0aENvbmZpZ1VybCkpLFxuICAgICAgICAgICAgbWVyZ2VkQ3NzID0ge30sIG1lcmdlZEpzID0ge30sXG4gICAgICAgICAgICBjb2xsZWN0ID0gKHNlY3Rpb24sIHRvb2xraXQpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmVzID0gW107XG4gICAgICAgICAgICAgICAgc2VjdGlvbi5mb3JFYWNoKGVudHJ5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGw4LmlzU3RyaW5nKGVudHJ5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzLnB1c2goZW50cnkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGw4LmlzcG8oZW50cnkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMgPSByZXMuY29uY2F0KGVudHJ5W3Rvb2xraXRdID8/IFtdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIFtcImNsYXNzaWNcIiwgXCJtb2Rlcm5cIl0uZm9yRWFjaCh0b29sa2l0ID0+IHtcblxuICAgICAgICAgICAgbGV0IGZmID0gbDguZmYuYmluZChudWxsLCB0b29sa2l0KSxcbiAgICAgICAgICAgICAgICBjc3MgPSBjb2xsZWN0KFtdLmNvbmNhdChsOC5uY2huKFwicHJlbG9hZC5jc3NcIiwgdGVzdENvbmZpZykpLCB0b29sa2l0KSxcbiAgICAgICAgICAgICAgICBqcyA9IGNvbGxlY3QoW10uY29uY2F0KGw4Lm5jaG4oXCJwcmVsb2FkLmpzXCIsIHRlc3RDb25maWcpKSwgdG9vbGtpdCksXG4gICAgICAgICAgICAgICAgZXh0Q3NzID0gbDgubmNobihcImNzc1wiLCBleHRqc0xpbmtDb25maWcsIGZmKSxcbiAgICAgICAgICAgICAgICBleHRKcyA9ICBsOC5uY2huKFwianNcIiwgZXh0anNMaW5rQ29uZmlnLCBmZik7XG5cblxuXG4gICAgICAgICAgICBsOC5jaG4odG9vbGtpdCwgbWVyZ2VkQ3NzLCBbXS5jb25jYXQoY3NzLCBbXS5jb25jYXQoZXh0Q3NzKSkpO1xuICAgICAgICAgICAgbDguY2huKHRvb2xraXQsIG1lcmdlZEpzLCBbXS5jb25jYXQoanMsIFtdLmNvbmNhdChleHRKcykpKTtcbiAgICAgICAgfSk7XG5cblxuICAgICAgICBsOC5jaG4oXCJwcmVsb2FkLmNzc1wiLCB0ZXN0Q29uZmlnLCBtZXJnZWRDc3MsIHRydWUpO1xuICAgICAgICBsOC5jaG4oXCJwcmVsb2FkLmpzXCIsIHRlc3RDb25maWcsIG1lcmdlZEpzLCB0cnVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2V0UGF0aHModGVzdENvbmZpZywgaXNNb2Rlcm4pO1xuXG59O1xuXG5cbi8qKlxuICogQ29uc3VtZXMgYSBjb25maWd1cmF0aW9uIG9iamVjdCBhbmQgbG9va3MgdXAganMvY3NzLXJlbGF0ZWQgcGF0aCBpbmZvcm1hdGlvbixcbiAqIHRoZW4gcmV0dXJucyBpdCBwcmUtY29uZmlndXJlZCB0byBiZSB1c2VkIHdpdGggU2llc3RhcyBTaWVzdGEuSGFybmVzcy5Ccm93c2VyLkV4dEpTKCkjY29uZmlnLlxuICpcbiAqIEBleGFtcGxlXG4gKlxuICogIGNvbnN0IGNvbmZpZyA9IHtcbiAqICAgICAgbG9hZGVyUGF0aDoge1xuICogICAgICAgXCJFeHQuUGFja2FnZVwiOiBcIi9ub2RlX21vZHVsZXMvQGNvb24tanMvZXh0anMtcGFja2FnZS1sb2FkZXIvcGFja2FnZXMvcGFja2FnZS1sb2FkZXIvc3JjL3NyYy9QYWNrYWdlLmpzXCIsXG4gKiAgICAgICBcImNvb24uY29yZVwiOiBcIi4uL3NyYy9cIixcbiAqICAgfSxcbiAqICAgcHJlbG9hZHM6IHtcbiAqICAgICAgIGNzczogW3tcbiAqICAgICAgICAgICAgICAgbW9kZXJuOiBbXG4gKiAgICAgICAgICAgICAgICAgICBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtbW9kZXJuLXJ1bnRpbWUvbWF0ZXJpYWwvbWF0ZXJpYWwtYWxsXzEuY3NzXCIsXG4gKiAgICAgICAgICAgICAgICAgICBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtbW9kZXJuLXJ1bnRpbWUvbWF0ZXJpYWwvbWF0ZXJpYWwtYWxsXzIuY3NzXCJcbiAqICAgICAgICAgICAgICAgXSxcbiAqICAgICAgICAgICAgICAgY2xhc3NpYzogW1xuICogICAgICAgICAgICAgICAgICAgXCIvbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LWNsYXNzaWMtcnVudGltZS9tYXRlcmlhbC9tYXRlcmlhbC1hbGxfMS5jc3NcIixcbiAqICAgICAgICAgICAgICAgICAgIFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1jbGFzc2ljLXJ1bnRpbWUvbWF0ZXJpYWwvbWF0ZXJpYWwtYWxsXzIuY3NzXCIsXG4gKiAgICAgICAgICAgICAgICAgICBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtY2xhc3NpYy1ydW50aW1lL21hdGVyaWFsL21hdGVyaWFsLWFsbF8zLmNzc1wiXG4gKiAgICAgICAgICAgICAgIF1cbiAqICAgICAgIH1dLFxuICogICAgICAganM6IFtcbiAqICAgICAgICAgICBcIi9ub2RlX21vZHVsZXMvQGw4anMvbDgvZGlzdC9sOC5ydW50aW1lLmpzXCIsIHtcbiAqICAgICAgICAgICAgICAgbW9kZXJuOiBcIi9ub2RlX21vZHVsZXMvQHNlbmNoYS9leHQtbW9kZXJuLXJ1bnRpbWUvbW9kZXJuLmVuZ2luZS5lbnRlcnByaXNlLmpzXCIsXG4gKiAgICAgICAgICAgICAgIGNsYXNzaWM6IFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1tb2Rlcm4tcnVudGltZS9jbGFzc2ljLmVuZ2luZS5lbnRlcnByaXNlLmpzXCJcbiAqICAgICAgICAgIH1cbiAqICAgICAgIF1cbiAqICAgfX07XG4gKlxuICogIGdldFBhdGhzKGNvbmZpZywgdHJ1ZSk7IC8vIHJldHVybnMge1xuICogICAvLyAgIHByZWxvYWQgOiBbXG4gKiAgIC8vICAgICAgIFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1tb2Rlcm4tcnVudGltZS9tYXRlcmlhbC9tYXRlcmlhbC1hbGxfMS5jc3NcIixcbiAqICAgLy8gICAgICAgXCIvbm9kZV9tb2R1bGVzL0BzZW5jaGEvZXh0LW1vZGVybi1ydW50aW1lL21hdGVyaWFsL21hdGVyaWFsLWFsbF8yLmNzc1wiLFxuICogICAvLyAgICAgICBcIi9ub2RlX21vZHVsZXMvQGw4anMvbDgvZGlzdC9sOC5ydW50aW1lLmpzXCIsXG4gKiAgIC8vICAgICAgIFwiL25vZGVfbW9kdWxlcy9Ac2VuY2hhL2V4dC1tb2Rlcm4tcnVudGltZS9tb2Rlcm4uZW5naW5lLmVudGVycHJpc2UuanNcIlxuICogICAvLyAgIF0sXG4gKiAgIC8vICAgbG9hZGVyUGF0aCA6IHtcbiAqICAgLy8gICAgICAgXCJFeHQuUGFja2FnZVwiOiBcIi9ub2RlX21vZHVsZXMvQGNvb24tanMvZXh0anMtcGFja2FnZS1sb2FkZXIvcGFja2FnZXMvcGFja2FnZS1sb2FkZXIvc3JjL3NyYy9QYWNrYWdlLmpzXCIsXG4gKiAgIC8vICAgICAgIFwiY29vbi5jb3JlXCI6IFwiLi4vc3JjL1wiXG4gKiAgIC8vICAgfVxuICogIC8vIH07XG4gKlxuICpcbiAqXG4gKi9cbmV4cG9ydCBjb25zdCBnZXRQYXRocyA9IChjb25maWcsIGlzTW9kZXJuKSA9PiB7XG5cbiAgICBjb25zdFxuICAgICAgICByZXN1bHQgPSB7cHJlbG9hZDogW10sIGxvYWRlclBhdGg6IHt9fSxcbiAgICAgICAgaXNPYmplY3QgPSBsOC5pc09iamVjdCxcbiAgICAgICAgaXNBcnJheSA9IGw4LmlzQXJyYXksXG4gICAgICAgIGlzU3RyaW5nID0gbDguaXNTdHJpbmcsXG4gICAgICAgIHRvb2xraXQgPSBpc01vZGVybiA/IFwibW9kZXJuXCIgOiBpc01vZGVybiA9PT0gZmFsc2UgPyBcImNsYXNzaWNcIiA6IG51bGwsXG4gICAgICAgIHBhcnNlU2VjdGlvbiA9IChzZWN0aW9uKSA9PiB7XG5cbiAgICAgICAgICAgIHNlY3Rpb24gPSBbXS5jb25jYXQoc2VjdGlvbik7XG5cbiAgICAgICAgICAgIHNlY3Rpb24uZm9yRWFjaCgoZW50cnkpID0+IHtcblxuICAgICAgICAgICAgICAgIGlmIChpc1N0cmluZyhlbnRyeSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnByZWxvYWQucHVzaChlbnRyeSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc09iamVjdChlbnRyeSkgJiYgdG9vbGtpdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNBcnJheShlbnRyeVt0b29sa2l0XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wcmVsb2FkID0gcmVzdWx0LnByZWxvYWQuY29uY2F0KGVudHJ5W3Rvb2xraXRdKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc1N0cmluZyhlbnRyeVt0b29sa2l0XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wcmVsb2FkLnB1c2goZW50cnlbdG9vbGtpdF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9O1xuXG4gICAgbDguYXNzaWduKFxuICAgICAgICByZXN1bHQubG9hZGVyUGF0aCxcbiAgICAgICAgW2NvbmZpZy5sb2FkZXJQYXRoIHx8IHt9LCBcImNsYXNzaWNcIiwgXCJtb2Rlcm5cIl0sXG4gICAgICAgIGNvbmZpZy5sb2FkZXJQYXRoICYmIGNvbmZpZy5sb2FkZXJQYXRoW3Rvb2xraXRdID8gY29uZmlnLmxvYWRlclBhdGhbdG9vbGtpdF0gOiB7fVxuICAgICk7XG5cbiAgICBjb25zdCB7anMsIGNzc30gPSBjb25maWcucHJlbG9hZCB8fCB7fTtcblxuICAgIHBhcnNlU2VjdGlvbihjc3MpO1xuICAgIHBhcnNlU2VjdGlvbihqcyk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuXG59OyJdLCJuYW1lcyI6WyJsOC5yZXF1ZXN0IiwibDguaXNTdHJpbmciLCJsOC5pc3BvIiwiZmYiLCJsOC5mZiIsImw4Lm5jaG4iLCJsOC5jaG4iLCJpc09iamVjdCIsImw4LmlzT2JqZWN0IiwiaXNBcnJheSIsImw4LmlzQXJyYXkiLCJpc1N0cmluZyIsImw4LmFzc2lnbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTSxRQUFRLEdB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QUFDO0FBQ3RELFNBQVMsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNwQixZQUFZLE9BQU8sS0FBSyxDQUFDO0FBQ3pCLFNBQVM7QUFDVDtBQUNBLFFBQVEsT0FBTyxPQUFPLENBQUMsTUFBTSxLQUFLLEdBQUcsQ0FBQztBQUN0QyxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxNQUFNLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRTtBQUNyQixRQUFRLElBQUksT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDckQsUUFBUSxPQUFPLE9BQU8sQ0FBQyxZQUFZLENBQUM7QUFDcEMsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSSxNQUFNLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUU7QUFDaEM7QUFDQSxRQUFRLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO0FBQ3BELFlBQVksTUFBTSxJQUFJLEtBQUssQ0FBQyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO0FBQ3JFLFNBQVM7QUFDVDtBQUNBLFFBQVEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUM1QixZQUFZLE1BQU0sSUFBSSxLQUFLLENBQUMsNkRBQTZELENBQUMsQ0FBQztBQUMzRixTQUFTO0FBQ1Q7QUFDQSxRQUFRLElBQUksR0FBRyxHQUFHLE1BQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxLQUFLO0FBQ3pE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Z0JBQWdCLEtBQUssSUFBSUUsSUFBTyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUVGLElBQUUsQ0FBQyxDQUFDO0FBQzVEO0FBQ0E7QUFDQTtBQUNBLFlBQVlHLEdBQU0sQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFFLFlBQVlBLEdBQU0sQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZFLFNBQVMsQ0FBQyxDQUFDO0FBQ1g7QUFDQTtBQUNBLFFBQVFBLEdBQU0sQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzRCxRQUFRQSxHQUFNLENBQUMsWUFBWSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDekQsS0FBSztBQUNMO0FBQ0EsSUFBSSxPQUFPLFFBQVEsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDMUM7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDWSxNQUFDLFFBQVEsR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLEtBQUs7QUFDOUM7QUFDQSxJQUFJO0FBQ0osUUFBUSxNQUFNLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxFQUFFLFVBQVUsRUFBRSxFQUFFLENBQUM7QUFDOUMsUUFBUUMsVUFBUSxHQUFHQyxRQUFXO0FBQzlCLFFBQVFDLFNBQU8sR0FBR0MsT0FBVTtBQUM1QixRQUFRQyxVQUFRLEdBQUdWLFFBQVc7QUFDOUIsUUFBUSxPQUFPLEdBQUcsUUFBUSxHQUFHLFFBQVEsR0FBRyxRQUFRLEtBQUssS0FBSyxHQUFHLFNBQVMsR0FBRyxJQUFJO0FBQzdFLFFBQVEsWUFBWSxHQUFHLENBQUMsT0FBTyxLQUFLO0FBQ3BDO0FBQ0EsWUFBWSxPQUFPLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN6QztBQUNBLFlBQVksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssS0FBSztBQUN2QztBQUNBLGdCQUFnQixJQUFJVSxVQUFRLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDckMsb0JBQW9CLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9DLGlCQUFpQixNQUFNLElBQUlKLFVBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO0FBQ2hFLG9CQUFvQixJQUFJRSxTQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUU7QUFDakQsd0JBQXdCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDL0UscUJBQXFCLE1BQU0sSUFBSUUsVUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFO0FBQ3pELHdCQUF3QixNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUM1RCxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCO0FBQ0EsYUFBYSxDQUFDLENBQUM7QUFDZjtBQUNBLFNBQVMsQ0FBQztBQUNWO0FBQ0EsSUFBSUMsTUFBUztBQUNiLFFBQVEsTUFBTSxDQUFDLFVBQVU7QUFDekIsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQUksRUFBRSxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUM7QUFDdEQsUUFBUSxNQUFNLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFO0FBQ3pGLEtBQUssQ0FBQztBQUNOO0FBQ0EsSUFBSSxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO0FBQzNDO0FBQ0EsSUFBSSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEIsSUFBSSxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDckI7QUFDQSxJQUFJLE9BQU8sTUFBTSxDQUFDO0FBQ2xCO0FBQ0E7Ozs7In0=
