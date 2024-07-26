// ==UserScript==
// @name         Util
// @namespace    http://tampermonkey.net/
// @version      7_26_2024
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
  };

  window.scrollToElement = (element) => {
    element.scrollIntoView({ behavior: 'smooth' });
  };

  // Didn't work for ChatGPT page
  window.scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  };

  window.scrollToTopOfElement = (element) => {
    element.scrollTop = 0;
  };

  window.scrollToBottomOfElement = (element) => {
    element.scrollTop = element.scrollHeight;
  };

  window.querySelectorWithRegex = (regex, selector = '*', all = false) => {
    let allElements = document.querySelectorAll(selector);
    // Filter elements to find those with a class name matching the regex
    let matchingElements = Array.prototype.filter.call(allElements, function(element) {
      return element.outerHTML.match(regex);
    });

    return all ? matchingElements : matchingElements[0];
  };

  window.querySelectorWithClassSubstring = (substring, selector = '*', all = false) => {
    let allElements = document.querySelectorAll(selector);
    // Filter elements to find those with a class name containing the substring
    let matchingElements = Array.prototype.filter.call(allElements, function(element) {
      return element.className && element.className.indexOf(substring) !== -1;
    });
    return all ? matchingElements : matchingElements[0];
  };

  window.lastOfArray = (array) => {
    return array[array.length - 1];
  };

  window.parseHotkey = ([hotkey, action]) => {
    const components = hotkey.split(/\s?\+\s?/);
    const key = components.pop().toUpperCase();
    const ctrl = components.includes('Ctrl');
    const shift = components.includes('Shift');
    const alt = components.includes('Alt');
    const meta = components.includes('Meta');

    return { key, ctrl, shift, alt, meta, action };
  };

  window.notTyping = (action) => {
    return () => {
      if (!window.isTyping()) {
        action();
      }
    };
  };

  window.isTyping = () => {
    const focusedElement = document.activeElement;
    return focusedElement.tagName === 'INPUT' || 
           focusedElement.tagName === 'TEXTAREA' || 
           focusedElement.isContentEditable;
  };

  window.debug = (...args) => {
    if (window.debugTamperMonkey) {
      console.log(...args);
    }
  }

  window.registerHotkeys = (hotkeys) => {
    const preprocessedHotkeys = Object.entries(hotkeys).map((hotkey) => {
      console.log('Registering TamperMonkey hotkey: ', hotkey);
      return window.parseHotkey(hotkey)
    });

    document.addEventListener('keydown', (e) => {
      for (const { key, ctrl, shift, alt, meta, action } of preprocessedHotkeys) {
        if (
          (ctrl === e.ctrlKey) &&
          (shift === e.shiftKey) &&
          (alt === e.altKey) &&
          (meta === e.metaKey) &&
          (e.key.toUpperCase() === key)
        ) {
          window.debug('TamperMonkey hotkey triggered: ', { key, ctrl, shift, alt, meta, action });
          action();
          e.preventDefault();
          break;
        }
      }
    }, false);
  };

  window.debugTamperMonkey = true;
})();
