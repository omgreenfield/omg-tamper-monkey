// ==UserScript==
// @name         ChatGPT Hotkeys
// @namespace    http://tampermonkey.net/
// @version      7_26_2024
// @description  Add a few hotkeys to chatgpt.com
// @author       You
// @match        https://chatgpt.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
  'use strict';

  const focusChatArea = () => {
    let textarea = document.querySelector('textarea');
    textarea ? textarea.focus() : console.log("[TM] Couldn't find chat textarea");
  };

  const startNewChat = () => {
    // TODO: make this just send Ctrl+Shift+O
  };

  const editLastMessage = () => {
    let buttons = document.querySelectorAll('[aria-label="Edit message"]')
    let button = window.tmLastOfArray(buttons)
    if (button) {
      button.click()
      window.tmScrollToElement(button)
      let textarea = document.querySelector('textarea')
      if (textarea) {
        textarea.focus()
      } else {
        console.log("[TM] Couldn't find edit textarea");
      }
    } else {
      console.log("[TM] Couldn't find last message button");
    }
  };

  const saveEditedMessage = () => {
    let button = window.tmLastOfArray(document.querySelectorAll('[as="button"].btn-primary'))
    button ? button.click() : console.log("[TM] Couldn't find Send button");
  };

  const cancelOrStop = () => {
    let button = window.tmLastOfArray(document.querySelectorAll('[as="button"].btn-secondary'))
    // Cancel button
    if (button) {
      button.click()
      console.log("[TM] Clicking Cancel")
      return
    } else {
      console.log("[TM] Couldn't find Cancel button");
    }

    // Stop generating button
    button = document.querySelector('#composer-submit-button');
    if (button) {
      button.click()
      console.log("[TM] Clicking Stop")
    } else {
      console.log("[TM] Couldn't find Stop button");
    }
  };

  window.tmRegisterHotkeys({
    'Ctrl + `': focusChatArea,
    'Ctrl + b': startNewChat,
    'Ctrl + ArrowUp': editLastMessage,
    'Ctrl + Enter': saveEditedMessage,
    'Ctrl + ArrowDown': cancelOrStop,
  });
})();
