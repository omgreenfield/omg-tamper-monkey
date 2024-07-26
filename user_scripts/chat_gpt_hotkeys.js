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

  const scrollToTop = () => {
    window.scrollToTopOfElement(getConversationPane())
  };

  const scrollToBottom = () => {
    window.scrollToBottomOfElement(getConversationPane())
  };

  const getConversationPane = () => {
    return window.lastOfArray(window.querySelectorWithClassSubstring('react-scroll-to-bottom', 'div', true))
  };

  const focusChatArea = () => {
    let textarea = document.querySelector('textarea');
    textarea ? textarea.focus() : console.log("Couldn't find chat textarea");
  };

  const startNewChat = () => {
    let button = window.getElementByXpath('/html/body/div[1]/div[1]/div[1]/div/div/div/div/nav/div[1]/span[2]/button')
    if (!button) button = document.querySelector('.icon-xl-heavy')?.parent
    button ? button.click() : console.log("Couldn't find new chat buttons");
  };

  const toggleSidebar = () => {
    let button = window.getElementByXpath('/html/body/div[1]/div[1]/div[2]/main/div[1]/div[1]/div/div[1]/div/div[2]/div[1]/span[1]/button')
    if (!button) button = window.getElementByXpath('/html/body/div[1]/div[1]/div[1]/div/div/div/div/nav/div[1]/span[1]/button')
    button ? button.click() : console.log("Couldn't find toggle sidebar buttons");
  };

  const editLastMessage = () => {
    let buttons = document.querySelectorAll('[data-message-author-role="user"] button')
    let button = window.lastOfArray(buttons)
    if (button) {
      button.click()
      window.scrollToElement(button)
    } else {
      console.log("Couldn't find last message button");
    }
  };

  const saveEditedMessage = () => {
    let button = document.querySelector('.group\\/conversation-turn .btn-primary')
    button ? button.click() : console.log("Couldn't find Send button");
  };

  const cancelOrStop = () => {
    let button = document.querySelector('.group\\/conversation-turn .btn-secondary')
    // Cancel button
    button ? button.click() : console.log("Couldn't find Cancel button");
    // Stop generating button
    // Only works when text area is focused for some reason
    button = document.querySelector('[data-testid="stop-button"]');
    button ? button.click() : console.log("Couldn't find stop button");
  };

  window.registerHotkeys({
    'Ctrl + `': focusChatArea,
    'Ctrl + Home': scrollToTop,
    'Ctrl + End': scrollToBottom,
    'Ctrl + b': startNewChat,
    'Ctrl + [': toggleSidebar,
    'Ctrl + ArrowUp': editLastMessage,
    'Ctrl + Enter': saveEditedMessage,
    'Esc': cancelOrStop,
  });
})();
