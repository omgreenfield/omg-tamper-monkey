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

  const copyBranch = () => {
    const branch = document.querySelector('.js-copy-branch').click();
  }

  const notTyping = window.notTyping;

  window.registerHotkeys({
    'Alt + v': notTyping(navigateToConversation),
    'Alt + c': notTyping(navigateToCommits),
    'Alt + k': notTyping(navigateToChecks),
    'Alt + f': notTyping(navigateToFilesChanged),
    'Alt + t': notTyping(editTitle),
    'Alt + b': notTyping(editBody),
    'Alt + r': notTyping(copyBranch),
    'Esc': cancel, // currently not triggering
  });
})();
