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

/*
Other hotkeys:

Used this JS code

```js
document.querySelectorAll('[data-hotkey]').forEach((thing) => console.log(thing?.text?.trim(), thing.getAttribute('data-hotkey'), thing.getAttribute('data-analytics-event')))`
```

- While not editing text
  - Home: `g d`
  - Issues: `g i`
  - Pull requests: `g p`
  - Dashboard: `g d`
  - Search 's,/'
  - Notifications: `g n`
  - Code: `g c`
  - Actions: `g a`
  - Projects: `g b`
  - Wiki: `g w`
  - Security: `g s`
  - Open in github.dev: `.`, `Mod+Alt+`
  - Open in a new github.dev tab: `Shift+.,Shift+>,>`
  - Open in codespace: `,`, `Mod+Alt+,`
  - Reviews: `q`
  - Assignees: `a`
  - Labels: `l`
  - Projects: `p`
  - Milestone: `m`
  - Development: `x`
- While editing text
  - Bold: `Control+b`
  - Italics: `Control+i`
  - Quote: `Control+Shift+>`
  - Code: `Control+e`
  - Link: `Control+k`
  - Ordered list: `Control+Shift+&`
  - Unordered list: `Control+Shift+*`
  - Task list: `Control+Shift+L`
*/

(function() {
  'use strict';

  const showHotkeys = () => {
    document.querySelectorAll('[data-hotkey]').forEach((thing) => console.log(thing?.text?.trim(), thing.getAttribute('data-hotkey'), thing.getAttribute('data-analytics-event')))
  }

  const toggleViewed = () => {
    Array.from(document.querySelectorAll('button'))
      .filter((button) => button.textContent?.includes('Viewed'))
      .filter((button) => button.getAttribute('aria-pressed') === `${!window.tamperMonkey.gitHub.viewed}`)
      .forEach(button => button.click())

    window.tamperMonkey.gitHub.viewed = !window.tamperMonkey.gitHub.viewed
  }

  const navigateToConversation = () => {
    if (!window.tmIsTyping()) {
      window.location.href = window.location.href.replace(/(https:\/\/github\.com\/[^\/]+\/[^\/]+\/pull\/\d+).*/, '$1');
    }
  }

  const navigateToCommits = () => {
    if (!window.tmIsTyping()) {
      window.tmClick('a[href$="/commits"]')
    }
  }

  const navigateToChecks = () => {
    if (!window.tmIsTyping()) {
      window.tmClick('a[href$="/checks"]')
    }
  }

  const navigateToFilesChanged = () => {
    if (!window.tmIsTyping()) {
      window.tmClick('a[href$="/files"]')
    }
  }

  const editBody = () => {
    let editButton = document.querySelector('.js-comment-edit-button')
    if (!editButton) {
      window.tmClick('.timeline-comment-action')
      window.tmWaitForElement('.js-comment-edit-button', () => {
        window.tmClick('.js-comment-edit-button')
      });
    } else {
      editButton.click();
    }
  }

  const editTitle = () => {
    window.tmClick('[data-component="PH_Title"] button')
  }

  const cancel = () => {
    window.tmGetElementsWithText('Cancel').filter((element) => element.checkVisibility()).forEach((button) => button.click())
    // if (window.tmIsElementFocused('.js-comment-field')) {
    //   window.tmClick('.js-comment-cancel-button')
    // } else if (window.tmIsElementFocused('#issue_title')) {
    //   window.tmClick('.js-cancel-issue-edit')
    // } else {
    //   window.tmClick('.js-comment-cancel-button')
    //   window.tmClick('.js-cancel-issue-edit')
    // }
  }

  const copyBranch = () => {
    const anchors = document.querySelectorAll('.octicon-copy')
    anchors.forEach((anchor) => {
      const button = anchor.closest('button')
      if (button && button.click) {
        button.click()
      }
    })
  }

  window.tmRegisterHotkeys({
    'Ctrl + Shift + v': navigateToConversation,
    'Ctrl + Shift + c': navigateToCommits,
    'Ctrl + Shift + k': navigateToChecks,
    'Ctrl + Shift + f': navigateToFilesChanged,
    'Ctrl + Shift + t': editTitle,
    'Ctrl + Shift + b': editBody,
    'Ctrl + Shift + r': copyBranch,
    'Ctrl + Shift + x': cancel, // currently not triggering
    'Ctrl + Shift + /': showHotkeys,
    'Ctrl + Shift + w': toggleViewed
  });
})();
