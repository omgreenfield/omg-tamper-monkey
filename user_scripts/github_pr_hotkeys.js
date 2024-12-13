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

  const navigateToConversation = () => {
    window.location.href = window.location.href.replace(/(https:\/\/github\.com\/[^\/]+\/[^\/]+\/pull\/\d+).*/, '$1');
  }

  const navigateToCommits = () => {
    window.click('a[href$="/commits"]')
  }

  const navigateToChecks = () => {
    window.click('a[href$="/checks"]')
  }

  const navigateToFilesChanged = () => {
    window.click('a[href$="/files"]')
  }

  const editBody = () => {
    let editButton = document.querySelector('.js-comment-edit-button')
    if (!editButton) {
      window.click('.timeline-comment-action')
      window.waitForElement('.js-comment-edit-button', () => {
        window.click('.js-comment-edit-button')
      });
    } else {
      editButton.click();
    }
  }

  const editTitle = () => {
    window.click('.js-title-edit-button');
    window.focus('#issue_title');
  }

  const cancel = () => {
    if (window.isElementFocused('.js-comment-field')) {
      window.click('.js-comment-cancel-button')
    } else if (window.isElementFocused('#issue_title')) {
      window.click('.js-cancel-issue-edit')
    } else {
      window.click('.js-comment-cancel-button')
      window.click('.js-cancel-issue-edit')
    }
  }

  const copyBranch = () => {
    const branch = window.click('.js-copy-branch')
  }

  const notTyping = window.notTyping;

  window.registerHotkeys({
    'Alt + v': notTyping(navigateToConversation),
    'Alt + c': notTyping(navigateToCommits),
    'Alt + k': notTyping(navigateToChecks),
    'Alt + f': notTyping(navigateToFilesChanged),
    'Alt + t': editTitle,
    'Alt + b': editBody,
    'Alt + r': copyBranch,
    'Alt + x': cancel, // currently not triggering
  });
})();
