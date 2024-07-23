// ==UserScript==
// @name         ChatGPT Hotkeys
// @namespace    http://tampermonkey.net/
// @version      2024-06-21
// @description  Add a few hotkeys to chatgpt.com
// @author       You
// @match        https://chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === '`') {
      focusChatArea(e) // Ctrl + ` --> Focus chat area
    } else if (e.key === 'Home') {
      scrollToTop(e) // End --> Scroll to top
    } else if (e.key === 'End') {
      scrollToBottom(e) // End --> Scroll to bottom
    } else if (e.ctrlKey && e.key === 'b') {
      startNewChat(e) // Ctrl + B --> Start new chat
    } else if (e.ctrlKey && e.key === '[') {
      toggleSidebar(e); // Ctrl + [ --> Toggle sidebar
    } else if (e.ctrlKey && e.key === 'ArrowUp') {
      editLastMessage(e); // Ctrl + Up --> Edit last message
    } else if (e.ctrlKey && e.key === 'Enter') {
      saveEditedMessage(e); // Ctrl + Enter --> Save edited message
    } else if (e.key === 'Esc') {
      cancelOrStop(e); // Ctrl + Esc --> (1) Cancel editing, (2) stop generating
    }
  }, false);

  const scrollToTop = (e) => {
    window.scrollToTopOfElement(getConversationPane())
  }

  const scrollToBottom = (e) => {
    window.scrollToBottomOfElement(getConversationPane())
  }

  const getConversationPane = () => {
    return window.lastOfArray(window.querySelectorWithClassSubstring('react-scroll-to-bottom', 'div', true))
  }

  const focusChatArea = (e) => {
    e.preventDefault();
    let textarea = document.querySelector('textarea');
    textarea ? textarea.focus() : console.log("Couldn't find chat textarea");
  }

  const startNewChat = (e) => {
    e.preventDefault();
    let button = window.getElementByXpath('/html/body/div[1]/div[1]/div[1]/div/div/div/div/nav/div[1]/span[2]/button')
    if (!button) button = document.querySelector('.icon-xl-heavy')?.parent
    button ? button.click() : console.log("Couldn't find new chat buttons");
  }

  const toggleSidebar = (e) => {
    e.preventDefault();
    let button = window.getElementByXpath('/html/body/div[1]/div[1]/div[2]/main/div[1]/div[1]/div/div[1]/div/div[2]/div[1]/span[1]/button')
    if (!button) button = window.getElementByXpath('/html/body/div[1]/div[1]/div[1]/div/div/div/div/nav/div[1]/span[1]/button')
    button ? button.click() : console.log("Couldn't find toggle sidebar buttons");
  }

  const editLastMessage = (e) => {
    e.preventDefault();
    let buttons = document.querySelectorAll('[data-message-author-role="user"] button')
    let button = window.lastOfArray(buttons)
    if (button) {
      button.click()
      window.scrollToElement(button)
    } else {
      console.log("Couldn't find last message button");
    }
  }

  const saveEditedMessage = (e) => {
    e.preventDefault();
    let button = document.querySelector('.group\\/conversation-turn .btn-primary')
    button ? button.click() : console.log("Couldn't find Send button");
  }

  const cancelOrStop = (e) => {
    e.preventDefault();
    let button = document.querySelector('.group\\/conversation-turn .btn-secondary')
    // Cancel button
    button ? button.click() : console.log("Couldn't find Cancel button");
    // Stop generating button
    // Only works when text area is focused for some reason
    button = document.querySelector('[data-testid="stop-button"]');
    button ? button.click() : console.log("Couldn't find stop button");
  }
})();
