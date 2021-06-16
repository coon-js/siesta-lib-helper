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

import {configureWithExtJsLinkPaths} from "./index.js";

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

toolkitGroups = groups.filter(entry => ["universal", toolkit].indexOf(entry.group) !== -1);
// we need to check if the loader specifies different classes for modern/classic here, as the tests
// might be declared as "universal", but the test cases load different files for the toolkits
toolkit = toolkitGroups.length ? toolkitGroups[0].group : "universal";
if (toolkit === "universal" && (testConfig.loaderPath.classic || testConfig.loaderPath.modern)) {
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