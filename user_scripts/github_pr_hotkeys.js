// ==UserScript==
// @name         GitHub PR Hotkeys
// @namespace    http://tampermonkey.net/
// @version      7_26_2024
// @description  Add a few hotkeys to chatgpt.com
// @author       You
// @match        https://github.com/*/pull/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
  'use strict';

  const navigateToConversation = () => {
    window.location.href = window.location.href.replace(/(https:\/\/github\.com\/[^\/]+\/[^\/]+\/pull\/\d+).*/, '$1');
  }

  const navigateToCommits = () => {
    document.querySelector('a[href$="/commits"]').click();
  }

  const navigateToChecks = () => {
    document.querySelector('a[href$="/checks"]').click();
    
  }

  const navigateToFilesChanged = () => {
    document.querySelector('a[href$="/files"]').click();
  }

  const editBody = () => {
    document.querySelector('.js-comment-edit-button').click();
  }

  const editTitle = () => {
    document.querySelector('.js-title-edit-button').click();
  }

  const cancel = () => {
    try {
      document.querySelector('.js-cancel-issue-edit').click()
    } catch (e) {
      document.querySelector('.js-comment-cancel-button').click()
    }
  }

  // For better readability
  const notTyping = window.notTyping;

  window.registerHotkeys({
    'Alt + v': notTyping(navigateToConversation),
    'Alt + c': notTyping(navigateToCommits),
    'Alt + k': notTyping(navigateToChecks),
    'Alt + f': notTyping(navigateToFilesChanged),
    'Alt + t': notTyping(editTitle),
    'Alt + b': notTyping(editBody),
    'Esc': cancel, // currently not triggering
  });
})();
