// ==UserScript==
// @name         Global Hotkeys
// @namespace    http://tampermonkey.net/
// @version      7_26_2024
// @description  Adds hotkeys used for all webpages
// @author       You
// @match        https://*/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
  'use strict';

  // Function to highlight the selected text
  const highlightSelection = () => {
    // Get the selected text
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    // Get the selected range
    const range = selection.getRangeAt(0);

    // Create a span element to wrap the selected text
    const span = document.createElement('span');
    span.style.transition = 'background-color 0.3s, transform 0.3s';
    span.style.backgroundColor = 'yellow';
    span.style.transform = 'scale(1.2)';

    // Wrap the selected text in the span element
    range.surroundContents(span);

    // Revert the highlight after 1 second
    setTimeout(() => {
        span.style.backgroundColor = '';
        span.style.transform = '';
    }, 1000);
  }

  window.registerHotkeys({
    'Ctrl + Shift + Enter': highlightSelection,
  });
})();
