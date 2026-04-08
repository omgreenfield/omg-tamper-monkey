// ==UserScript==
// @name         Util
// @namespace    http://tampermonkey.net/
// @version      7_26_2024
// @description  Various utility functions
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function() {
  'use strict';

  window.tmGetElementByXpath = (path) => {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  };

  window.tmGetElementsWithText = (text, elementType = '*') => {
    return Array.from(document.querySelectorAll(elementType)).filter(element =>
      element.textContent === text
    );
  };

  window.tmGetElementsIncludingText = (text, elementType = '*') => {
    return Array.from(document.querySelectorAll(elementType)).filter(element =>
      element.textContent.includes(text)
    );
  };

  window.tmScrollToElement = (element) => {
    element.scrollIntoView({ behavior: 'smooth' });
  };

  // Didn't work for ChatGPT page
  window.tmScrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  };

  window.tmScrollToTopOfElement = (element) => {
    element.scrollTop = 0;
  };

  window.tmScrollToBottomOfElement = (element) => {
    element.scrollTop = element.scrollHeight;
  };

  window.tmQuerySelectorWithRegex = (regex, selector = '*', all = false) => {
    let allElements = document.querySelectorAll(selector);
    // Filter elements to find those with a class name matching the regex
    let matchingElements = Array.prototype.filter.call(allElements, function(element) {
      return element.outerHTML.match(regex);
    });

    return all ? matchingElements : matchingElements[0];
  };

  window.tmQuerySelectorWithClassSubstring = (substring, selector = '*', all = false) => {
    let allElements = document.querySelectorAll(selector);
    // Filter elements to find those with a class name containing the substring
    let matchingElements = Array.prototype.filter.call(allElements, function(element) {
      return element.className && element.className.indexOf(substring) !== -1;
    });
    return all ? matchingElements : matchingElements[0];
  };

  window.tmLastOfArray = (array) => {
    return array[array.length - 1];
  };

  window.tmParseHotkey = ([hotkey, action]) => {
    const components = hotkey.split(/\s?\+\s?/);
    const key = components.pop().toUpperCase();
    const ctrl = components.includes('Ctrl');
    const shift = components.includes('Shift');
    const alt = components.includes('Alt');
    const meta = components.includes('Meta');

    return { key, ctrl, shift, alt, meta, action };
  };

  window.tmNotTyping = (action) => {
    return () => {
      if (!window.tmIsTyping()) {
        action();
      }
    };
  };

  window.tmIsTyping = () => {
    const focusedElement = document.activeElement;
    return focusedElement.tagName === 'INPUT' || 
           focusedElement.tagName === 'TEXTAREA' || 
           focusedElement.isContentEditable;
  };

  window.tmDebug = (...args) => {
    if (window.tamperMonkey.debug) {
      console.log(...args);
    }
  }

  window.tmRegisterHotkeys = (hotkeys) => {
    const preprocessedHotkeys = Object.entries(hotkeys).map((hotkey) => {
      console.log('[TM] Registering TamperMonkey hotkey: ', hotkey);
      const parsedHotkey = window.tmParseHotkey(hotkey)
      ;(window.tamperMonkey.hotkeys ||= []).push(parsedHotkey)

      return parsedHotkey
    });

    document.addEventListener('keydown', (e) => {
      if (window.tamperMonkey.debugKeys) {
        window.tmDebug('keydown', { e });
      }
      for (const { key, ctrl, shift, alt, meta, action } of preprocessedHotkeys) {
        if (
          (ctrl === e.ctrlKey) &&
          (shift === e.shiftKey) &&
          (alt === e.altKey) &&
          (meta === e.metaKey) &&
          (e.key.toUpperCase() === key)
        ) {
          window.tmDebug('TamperMonkey hotkey triggered: ', window.tmHotkeyToString({ key, ctrl, shift, alt, meta, action }));
          action();
          e.preventDefault();
          break;
        }
      }
    }, false);
  };

  window.tmClick = (selector) => {
    try {
      document.querySelector(selector).click()
    } catch (e) {
      console.log(`[TM] Could not click element with selector '${selector}'`)
    }
  }

  window.tmFocus = (selector) => {
    try {
      document.querySelector(selector).focus()
    } catch (e) {
      console.log(`[TM] Could not focus element with selector '${selector}'`)
    }
  }

  window.tmIsElementFocused = (selector) => {
    return document.activeElement == document.querySelector(selector)
  };

  window.tmWaitForElement = (selector, callback, interval = 100, maxRetries = 10) => {
    let retries = 0;

    const checkForElement = () => {
      const element = document.querySelector(selector)
      if (element) {
        callback()
      } else if (retries < maxRetries) {
        retries ++;
        setTimeout(checkForElement, interval)
      } else {
        console.log(`[TM] Element with selector: '${selector}' did not appear after ${maxRetries} retries`);
      }
    }

    checkForElement()
  };

  window.tmToggleDebug = () => {
    window.tamperMonkey.debug = !window.tamperMonkey.debug
  }

  window.tmHotkeyToString = (hotkey) => {
    const platform = navigator.userAgentData?.platform
    let meta = 'Meta'
    if (platform == 'Windows') {
      meta = 'Win'
    } else if (platform == 'macOS') {
      meta = 'Cmd'
    }

    const keys = []
    if (hotkey.ctrl) keys.push('Ctrl')
    if (hotkey.shift) keys.push('Shift')
    if (hotkey.alt) keys.push('Alt')
    if (hotkey.meta) keys.push(meta)

    keys.push(hotkey.key)
    const hotkeyString = keys.join(' + ')
    return [hotkeyString, hotkey.action.name].join(' = ')
  }

  window.tmHelp = () => {
    console.log("/////////////////////////////////////////////////////////////////")
    console.log("// Config: `window.tamperMonkey")
    console.log("/////////////////////////////////////////////////////////////////")
    console.log('')
    console.log({ ...window.tamperMonkey })

    window.tamperMonkey.hotkeys.forEach((hotkey) => {
      console.log(window.tmHotkeyToString(hotkey))
    })
  }

  window.tamperMonkey = {
    debug: true,
    debugKeys: false,
    gitHub: {},
    chatGpt: {},
    global: {},
    hotkeys: [],
  }
})();
