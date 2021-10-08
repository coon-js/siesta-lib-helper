# @coon-js/siesta-lib-helper ![MIT](https://img.shields.io/npm/l/@coon-js/siesta-lib-helper) [![npm version](https://badge.fury.io/js/@coon-js%2Fsiesta-lib-helper.svg)](https://badge.fury.io/js/@coon-js%2Fsiesta-lib-helper) ![build](https://github.com/coon-js/siesta-lib-helper/actions/workflows/run.tests.yml/badge.svg)

This npm-package provides a collection of utility- and helper-methods when working with [Siesta](https://bryntum.com) 
in an [ExtJS](https://sencha.com)-Browser environment and **npm-packages** containing ExtJS-code.

## Installation

To use this package as an utility-lib with ExtJS-projects, include the package as a `devDependency`:

```bash
$ npm i --save-dev @coon-js/siesta-lib-helper
```

Once the package was installed, you have to make sure that building the sources succeeds
within the target package. For this purpose, you need to call the `build:dev`-script of `@coon-js/siesta-lib-helper`.

Edit the `scripts`-section of the **target package**, like so:

```json
"scripts": {
  "build:deps" : "npm explore @coon-js/siesta-lib-helper npm run build:dev"
}
```

Afterwards, the bin-script of `@coon-js/siesta-lib-helper` can be called via
`
npx siesta-lib-helper
`


## Usage

### Using the BoilerPlate.js for setting up ExtJS Browser Environment
The `BoilerPlate.js` contains code that automatically creates an ExtJS-testing environment.
To use the BoilerPlate, it should be sufficient to copy the `index.extjs-browser.html` into the target directory
where your tests should run. Paths should be adjusted accordingly, if your testing environment does not
match the following structure:

(In this example, `index.extjs-browser.html` will be placed into `tests`)
```
./[MODULE_ROOT]
./node_modules
./tests
```

To simplify setting up your testing environment, `siesta-lib-helper` is available as a cli-programm that
will copy a `tests.redirect.html`- and a `index.extjs-browser.html`-file into your module:

```shell
$ npx siesta-lib-helper
```

```
./tests/index.extjs-browser.html
./tests.redirect.html
```

Note: `tests.redirect.html` serves as a redirect in case your local web server requires a file being specified as the index of the 
document-root. It is not require to properly create the ExtJS-Testing-Browser. 


### getPaths()
The following example shows how to use a _test.config.js_ for configuring the tested environment to be used 
with [Siesta.Harness.Browser.ExtJS](https://www.bryntum.com/docs/siesta/#!/api/Siesta.Harness.Browser.ExtJS).
The corresponding builds and paths for the ExtJS-library were automatically created with [@coon-js/extjs-link](https://github.com/coon-js/extjs-link).


_index.html_
```html
<!DOCTYPE html>
<html>
<head>
    <title>example</title>
    <link rel="stylesheet" type="text/css" href="../node_modules/siesta-lite/resources/css/siesta-all.css">
    <script type="text/javascript" src="../node_modules/siesta-lite/siesta-all.js"></script>
    <script type="module" src="index.js"></script>
</head>
<body>
</body>
</html>

```

_index.js_ contains the instantiation of the browser-class and configures the Siesta-Browser with the
 required options:


_index.js_:
```javascript
import groups from "./groups.config.js"; // contains test-structure
import testConfig from "./tests.config.js";
import {getPaths} from "../node_modules/@coon-js/siesta-lib-helper/dist/siesta-lib-helper.runtime.esm.js";

const 
    browser = new Siesta.Harness.Browser.ExtJS(),
    isModern = window.location.href.indexOf("toolkit=modern") !== -1,
    paths = getPaths(testConfig, isModern);

browser.configure(Object.assign({
    title: "example - " + (isModern ? "modern" : "classic"),
    isEcmaModule: true,
    disableCaching: true
}, paths));


browser.start(...groups);
```

In this example, the configuration looks like this. While the ```loaderPath``` is most of the time depending
on the existing resources you want to include in your tests, the preload of the ExtJS-library is mandatory:

_tests.config.js_
```javascript
export default {
    loaderPath: {
        "Ext.Package": "../node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/Package.js",
        "Ext.package": "../node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/package",
        "coon.core.overrides.core": "../overrides",
        "coon.core.fixtures": "./fixtures",
        "coon.core": "../src/",
        "coon.test": "./src"
    },
    preload: {
        css: {
           modern: [
               "./build/extjs-link/extjs/modern/theme-triton/resources/theme-triton-all-debug.css"
           ],
           classic: [
               "./build/extjs-link/extjs/classic/theme-triton/resources/theme-triton-all-debug.css"
           ]
       
        },
        js: ["../node_modules/@l8js/l8/dist/l8.runtime.umd.js", {
                modern: "./build/extjs-link/extjs/modern/ext-modern-all-debug.js",
                classic: "./build/extjs-link/extjs/classic/ext-all-debug.css"
        }]
    }
};

```

### configureWithExtJsLinkPaths()
A helper method to inject the configuration generated by [@coon-js/extjs-link](https://npmnjs.org/@coon-js/extjs-link)
into a configuration as defined by a ```tests.config.js```-file, then passing it to [getPaths()](#getPaths()).
Basically, toolkit-groups defined in both files get merged.

_index.html_
```html
<!DOCTYPE html>
<html>
<head>
    <title>example</title>
    <link rel="stylesheet" type="text/css" href="../node_modules/siesta-lite/resources/css/siesta-all.css">
    <script type="text/javascript" src="../node_modules/siesta-lite/siesta-all.js"></script>
    <script type="module" src="index.js"></script>
</head>
<body>
</body>
</html>

```

_index.js_ contains the instantiation of the browser-class and configures the Siesta-Browser with the
required options:


_index.js_:
```javascript
import testConfig from "./tests.config.js";
import groups from "./groups.config.js";
import {configureWithExtJsLinkPaths} from "../node_modules/@coon-js/siesta-lib-helper/dist/siesta-lib-helper.runtime.esm.js";

const 
    browser = new Siesta.Harness.Browser.ExtJS(),
    isModern = window.location.href.indexOf("toolkit=modern") !== -1,
    paths = await configureWithExtJsLinkPaths(testConfig, "../.extjs-link.conf.json", isModern);
console.log(paths);
browser.configure(Object.assign({
    title: "extjs-lib-core - " + (isModern ? "modern" : "classic"),
    isEcmaModule: true,
    disableCaching: true
}, paths));


browser.start(...groups);
```

_.extjs-link.conf.json_

```json
 
   {
        "css": [{
                "modern": [
                    "foo.css"
                ],
                "classic": [
                    "bar.css"
                ]
        }],
        "js": {
                "modern": "modern.js",
                "classic": "classic.js"
       }
    }
 ```

_tests.config.js_
```javascript
export default {
    loaderPath: {
        "Ext.Package": "../node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/Package.js",
        "Ext.package": "../node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/package",
        "coon.core.overrides.core": "../overrides",
        "coon.core.fixtures": "./fixtures",
        "coon.core": "../src/",
        "coon.test": "./src"
    },
    preload: {
        css: {
                modern: [
                    "./build/extjs-link/extjs/modern/theme-triton/resources/theme-triton-all-debug.css"
                ],
                classic: [
                    "./build/extjs-link/extjs/classic/theme-triton/resources/theme-triton-all-debug.css"
                ]
           
        },
        js: ["../node_modules/@l8js/l8/dist/l8.runtime.umd.js", {
                modern: "./build/extjs-link/extjs/modern/ext-modern-all-debug.js",
                classic: "./build/extjs-link/extjs/classic/ext-all-debug.css"
           
        }]
    }
};

```

config produced by ```configureWithExtJsLinkPaths(testConfig, "../.extjs-link.conf.json", true)```

```json
{
    "loaderPath": {
        "Ext.Package": "../node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/Package.js",
        "Ext.package": "../node_modules/@coon-js/extjs-package-loader/packages/package-loader/src/package",
        "coon.core.overrides.core": "../overrides",
        "coon.core.fixtures": "./fixtures",
        "coon.core": "../src/",
        "coon.test": "./src"
    },
    "preload": [
       "foo.css",
       "modern.js",
       "./build/extjs-link/extjs/modern/theme-triton/resources/theme-triton-all-debug.css",
       "foo.css",
       "../node_modules/@l8js/l8/dist/l8.runtime.umd.js",
       "./build/extjs-link/extjs/modern/ext-modern-all-debug.js"
    ]
}

```

## CI
### tests
```shell
$ npm test
```

### builds
```
npm run build
```