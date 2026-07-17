# OMG Tampermonkey

- [Tampermonkey](#tampermonkey)
- [User scripts](#user-scripts)
  - [`util.js`](#utiljs)
  - [`chat_gpt_hotkeys.js`](#chat_gpt_hotkeysjs)
  - [`github_pr_hotkeys.js`](#github_pr_hotkeysjs)
  - [`okta_hotkeys.js`](#okta_hotkeysjs)
  - [`global_hotkeys.js`](#global_hotkeysjs)
- [Development](#development)
  - [`tm` CLI](#tm-cli)
  - [Loaders](#loaders)

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

### `github_pr_hotkeys.js`

Adds hotkeys to `https://github.com/*/pull/*` (i.e. pull requests) including:

- Navigate to Conversation
- Navigate to Commits
- Navigate to Checks
- Navigate to Files
- Edit PR title
- Edit PR body
- (WIP) Cancel editing

### `okta_hotkeys.js`

Adds hotkeys to `https://fleetio.okta.com/app/UserHome` including:

- Focus the dashboard search field

### `global_hotkeys.js`

Adds hotkeys to every page (`https://*/*`) including:

- Highlight the current text selection

## Development

- [`tm` CLI](#tm-cli)
- [Loaders](#loaders)

Editing a script normally means copy/pasting it into the Tampermonkey dashboard. To skip that, install a **loader** (see below) that pulls the source straight off disk, so editing a file in [`user_scripts/`](user_scripts) and reloading the page picks up the change.

### `tm` CLI

[`bin/tm.js`](bin/tm.js) is a zero-dependency Node script with two commands:

```sh
# Scaffold a new script (+ its loader). --match and --desc are optional.
bin/tm.js new "My Site" --match "https://example.com/*" --desc "Hotkeys for My Site"

# Regenerate every loader to match its source (idempotent). Run after
# adding, renaming, or changing the metadata of a script.
bin/tm.js sync
```

`new` normalizes the name to `snake_case` for the filename, writes a skeleton with a `tmRegisterHotkeys` stub, then runs `sync` so the loader exists immediately.

### Loaders

A loader lives in [`user_scripts/loaders/`](user_scripts/loaders) and mirrors its source's metadata, but its body is empty — it just adds:

```js
// @require      file:///abs/path/to/user_scripts/<name>.js
```

`@require`'d files carry no metadata of their own, so the loader has to copy the source's `@match`, `@run-at`, `@grant`, etc. `sync` handles this and prunes loaders whose source was deleted.

To use them:

1. Run `bin/tm.js sync` to (re)generate loaders. The `file://` paths are absolute, so re-run after moving the repo.
2. In the Tampermonkey extension settings, enable **Allow access to file URLs**.
3. Install the **loader** in Tampermonkey (not the source). Reloading a matched page now runs the current file from disk.
