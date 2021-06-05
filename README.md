# @coon-js/siesta-lib-helper
This npm-package provides a collection of utility- and helper-methods when working with [Siesta](https://bryntum.com) 
in an [ExtJS](https://sencha.com)-Browser environment and **npm-packages** containing ExtJS-code.

## prerrquisites
Siesta was installed as a npm-package and is available in the projects ```node_modules```-folder.

```
npm install --save-dev siesta-lite
```

## Installation
```
npm install --save-dev @coon-js/siesta-lib-helper
```

## Usage

### getPaths()
The following example shows how to use a _test.config.js_ for configuring the tested environment to be used 
with [Siesta.Harness.Browser.ExtJS](https://www.bryntum.com/docs/siesta/#!/api/Siesta.Harness.Browser.ExtJS).
The corresponding builds and paths for the ExtJS-library were automatically created with [@coon-js/extjs-build](https://github.com/coon-js/extjs-build).


_index.html_
```
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
 required options::


_index.js_:
```
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
```
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
            extjs: {
                modern: [
                    "./build/extjs-build/extjs/modern/theme-triton/resources/theme-triton-all-debug.css"
                ],
                classic: [
                    "./build/extjs-build/extjs/classic/theme-triton/resources/theme-triton-all-debug.css"
                ]
            }
        },
        js: ["../node_modules/@l8js/l8/dist/l8.runtime.umd.js", {
            extjs: {
                modern: "./build/extjs-build/extjs/modern/ext-modern-all-debug.js",
                classic: "./build/extjs-build/extjs/classic/ext-all-debug.css"
            }
        }]
    }
};

```


## CI
### tests
```
npm test
```

### builds
```
rollup -c
```