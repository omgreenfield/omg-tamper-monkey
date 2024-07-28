# OMG Tampermonkey

- [Tampermonkey](#tampermonkey)
- [User scripts](#user-scripts)
  - [`util.js`](#utiljs)
  - [`chat_gpt_hotkeys.js`](#chat_gpt_hotkeysjs)
  - [`github_hotkeys.js`](#github_hotkeysjs)

## Tampermonkey

[Tampermonkey](https://www.tampermonkey.net/) is a browser extension used to add custom JavaScript to pages that match a filter you specify.

Although `Tampermonkey` is one word, I decided to separate `tamper` and `monkey` in the repo name.

## User scripts

The scripts in this repo add hotkeys to pages I used frequently, e.g. ChatGPT and GitHub.

Rather than the typical `YYYY-MM-DD` date format, I use `MM_DD_YYYY` because I use it other personal documents and I have a hotstring for it (via [AutoHotkey](https://autohotkey.com/) for Windows, [Keyboard Maestro](https://www.keyboardmaestro.com/) for Mac).

### `util.js`

Rather than using a library like lodash or jQuery, I include only the functions necessary to accomplish tasks I need: locating elements and registering hotkeys

Because other user scripts use these functions, I include the `@run-at document-start` directive while others use `@run-at document-end`.

The other user scripts below:

1. Define functions for each custom action
2. Call `window.registerHotkeys` to associate a key combination with each function

### `chat_gpt_hotkeys.js`

Adds hotkeys to `https://chatgpt.com/*` including:

- Focus chat textarea
- Start new chat
- Edit last message
- Submit/cancel edited message
- Toggle sidebar
- Scroll to top/bottom

### `github_hotkeys.js`

Adds hotkeys to `https://github.com/*/pull/*` (i.e. pull requests) including:

- Navigate to Conversation
- Navigate to Commits
- Navigate to Checks
- Navigate to Files
- Edit PR title
- Edit PR body
- (WIP) Cancel editing
