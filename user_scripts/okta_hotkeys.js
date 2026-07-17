// ==UserScript==
// @name         Okta hotkeys
// @namespace    http://tampermonkey.net/
// @version      7/15/2026
// @description  Give Okta some hotkeys
// @author       omgreenfield
// @match        https://fleetio.okta.com/app/UserHome
// @icon         https://www.google.com/s2/favicons?sz=64&domain=okta.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
  'use strict';

  const focusSearch = () => {
    let searchField = document.querySelector('[name="dashboard-search-input"]');
    searchField ? searchField.focus() : console.log("[TM] Couldn't find search field");
  };

  window.tmRegisterHotkeys({
    '/': focusSearch,
  });
})();
