// ==UserScript==
// @name         Utility
// @namespace    http://tampermonkey.net/
// @version      2024-06-21
// @description  Various utility functions
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  window.getElementByXpath = (path) => {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }

  window.scrollToElement = (element) => {
    element.scrollIntoView({ behavior: 'smooth' });
  }

  // Didn't work for ChatGPT page
  window.scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }

  window.scrollToTopOfElement = (element) => {
    element.scrollTop = 0;
  }

  window.scrollToBottomOfElement = (element) => {
    element.scrollTop = element.scrollHeight;
  }

  window.querySelectorWithClassSubstring = (substring, selector = '*', all = false) => {
    let allElements = document.querySelectorAll(selector);
    // Filter elements to find those with a class name containing the substring
    let matchingElements = Array.prototype.filter.call(allElements, function(element) {
      return element.className && element.className.indexOf(substring) !== -1;
    });
    return all ? matchingElements : matchingElements[0];
  }

  window.lastOfArray = (array) => {
    return array[array.length - 1];
  }
})();
