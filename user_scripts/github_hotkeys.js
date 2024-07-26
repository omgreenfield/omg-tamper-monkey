// ==UserScript==
// @name         GitHub PR Hotkeys
// @namespace    http://tampermonkey.net/
// @version      7_26_2024
// @description  Add a few hotkeys to chatgpt.com
// @author       You
// @match        https://github.com/*/pull/*
// @grant        none
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
    document.querySelector('a[href$="/checks"]').checksTab.click();
    
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
    v: notTyping(navigateToConversation),
    c: notTyping(navigateToCommits),
    k: notTyping(navigateToChecks),
    f: notTyping(navigateToFilesChanged),
    t: notTyping(editTitle),
    b: notTyping(editBody),
    'Esc': cancel, // currently not triggering
  });
})();
