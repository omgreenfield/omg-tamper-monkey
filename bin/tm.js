#!/usr/bin/env node
'use strict';

/**
 * tm - dev CLI for this Tampermonkey userscript repo.
 *
 * Commands:
 *   new <name> [--match <pattern>] [--desc <text>]  Scaffold a new user script.
 *   sync                                             Generate/refresh loader scripts.
 *
 * Loaders let Tampermonkey pull a script off disk via `@require file://...`, so
 * editing the source and reloading the page picks up changes with no copy/paste.
 * Install the LOADER in Tampermonkey, not the source.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const SCRIPTS_DIR = path.join(REPO_ROOT, 'user_scripts');
const LOADERS_DIR = path.join(SCRIPTS_DIR, 'loaders');

// Metadata keys copied into loaders, in the order they should appear.
const LOADER_META_KEYS = [
  '@namespace',
  '@version',
  '@description',
  '@author',
  '@match',
  '@icon',
  '@grant',
  '@run-at',
];

// Column at which metadata values start (matches existing scripts).
const META_KEY_WIDTH = 14;

/**
 * Today's date as M/D/YYYY (no leading zeros), matching the repo's @version style.
 */
const today = () => {
  const now = new Date();
  return `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
};

/**
 * Normalize a raw name into a snake_case file base (no extension).
 *
 * @param {string} raw
 */
const toSnakeCase = (raw) =>
  raw
    .replace(/\.js$/i, '')
    .trim()
    .replace(/[\s-]+/g, '_')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .toLowerCase()
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

/**
 * Turn a snake_case base into a Title Case display name for @name.
 *
 * @param {string} snake
 */
const toTitleCase = (snake) =>
  snake
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

/**
 * Format one metadata line: `// @key<pad>value`.
 *
 * @param {string} key
 * @param {string} value
 */
const metaLine = (key, value) => `// ${key.padEnd(META_KEY_WIDTH)}${value}`;

/**
 * Parse a script's ==UserScript== block into ordered [key, value] pairs.
 * Repeated keys (e.g. @match) are preserved as separate entries.
 *
 * @param {string} source
 */
const parseMetadata = (source) => {
  const lines = source.split('\n');
  const start = lines.findIndex((l) => l.includes('==UserScript=='));
  const end = lines.findIndex((l) => l.includes('==/UserScript=='));
  if (start === -1 || end === -1 || end < start) return [];

  const pairs = [];
  for (const line of lines.slice(start + 1, end)) {
    const match = line.match(/^\s*\/\/\s*(@[\w-]+)\s*(.*)$/);
    if (match) pairs.push([match[1], match[2].trim()]);
  }
  return pairs;
};

/**
 * Find all values for a metadata key.
 *
 * @param {Array<[string, string]>} pairs
 * @param {string} key
 */
const metaValues = (pairs, key) =>
  pairs.filter(([k]) => k === key).map(([, v]) => v);

/**
 * Build loader file contents for a source script.
 *
 * @param {Array<[string, string]>} pairs  Parsed metadata of the source.
 * @param {string} sourceAbsPath           Absolute path required by the loader.
 */
const buildLoader = (pairs, sourceAbsPath) => {
  const nameValues = metaValues(pairs, '@name');
  const origName = nameValues[0] || path.basename(sourceAbsPath, '.js');

  const header = ['// ==UserScript==', metaLine('@name', `${origName} (dev loader)`)];

  for (const key of LOADER_META_KEYS) {
    for (const value of metaValues(pairs, key)) {
      if (value) header.push(metaLine(key, value));
    }
  }

  header.push(metaLine('@require', `file://${sourceAbsPath}`));
  header.push('// ==/UserScript==');

  // Body stays empty: the required source file provides all behavior.
  return `${header.join('\n')}\n`;
};

/**
 * Skeleton for a brand-new user script.
 *
 * @param {object} opts
 * @param {string} opts.name         Title Case display name.
 * @param {string} opts.match        @match pattern.
 * @param {string} opts.description  @description text.
 */
const buildSkeleton = ({ name, match, description }) => {
  const meta = [
    '// ==UserScript==',
    metaLine('@name', name),
    metaLine('@namespace', 'http://tampermonkey.net/'),
    metaLine('@version', today()),
    metaLine('@description', description),
    metaLine('@author', 'omgreenfield'),
    metaLine('@match', match),
    metaLine('@grant', 'none'),
    metaLine('@run-at', 'document-end'),
    '// ==/UserScript==',
  ].join('\n');

  return `${meta}

(function() {
  'use strict';

  const doSomething = () => {
    // TODO: implement
  };

  window.tmRegisterHotkeys({
    // 'key': doSomething,
  });
})();
`;
};

/**
 * List source script paths (top-level .js files under user_scripts/).
 */
const listSources = () =>
  fs
    .readdirSync(SCRIPTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.js'))
    .map((entry) => path.join(SCRIPTS_DIR, entry.name));

/**
 * `sync` command: regenerate a loader for every source script and prune orphans.
 */
const sync = () => {
  fs.mkdirSync(LOADERS_DIR, { recursive: true });

  const sources = listSources();
  const expected = new Set();
  let created = 0;
  let updated = 0;
  let unchanged = 0;

  for (const sourcePath of sources) {
    const base = path.basename(sourcePath);
    expected.add(base);

    const pairs = parseMetadata(fs.readFileSync(sourcePath, 'utf8'));
    if (pairs.length === 0) {
      console.warn(`⚠️  ${base}: no ==UserScript== block, skipping`);
      expected.delete(base);
      continue;
    }

    const loaderPath = path.join(LOADERS_DIR, base);
    const next = buildLoader(pairs, sourcePath);
    const prev = fs.existsSync(loaderPath) ? fs.readFileSync(loaderPath, 'utf8') : null;

    if (prev === null) {
      fs.writeFileSync(loaderPath, next);
      console.log(`+ created  loaders/${base}`);
      created += 1;
    } else if (prev !== next) {
      fs.writeFileSync(loaderPath, next);
      console.log(`~ updated  loaders/${base}`);
      updated += 1;
    } else {
      unchanged += 1;
    }
  }

  // Prune loader .js files whose source no longer exists.
  let pruned = 0;
  for (const entry of fs.readdirSync(LOADERS_DIR)) {
    if (entry.endsWith('.js') && !expected.has(entry)) {
      fs.unlinkSync(path.join(LOADERS_DIR, entry));
      console.log(`- pruned   loaders/${entry}`);
      pruned += 1;
    }
  }

  console.log(
    `\nSynced ${sources.length} script(s): ` +
      `${created} created, ${updated} updated, ${unchanged} unchanged, ${pruned} pruned.`,
  );
};

/**
 * Parse `--flag value` options out of an argv slice.
 *
 * @param {string[]} argv
 */
const parseFlags = (argv) => {
  const flags = {};
  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      flags[arg.slice(2)] = argv[i + 1];
      i += 1;
    } else {
      positional.push(arg);
    }
  }
  return { flags, positional };
};

/**
 * `new` command: scaffold a source script, then sync so its loader exists.
 *
 * @param {string[]} argv  Arguments after `new`.
 */
const newScript = (argv) => {
  const { flags, positional } = parseFlags(argv);
  const rawName = positional[0];
  if (!rawName) {
    console.error('Usage: tm new <name> [--match <pattern>] [--desc <text>]');
    process.exit(1);
  }

  const base = toSnakeCase(rawName);
  if (!base) {
    console.error(`Invalid name: ${rawName}`);
    process.exit(1);
  }

  const filePath = path.join(SCRIPTS_DIR, `${base}.js`);
  if (fs.existsSync(filePath)) {
    console.error(`Already exists: user_scripts/${base}.js`);
    process.exit(1);
  }

  const name = toTitleCase(base);
  const content = buildSkeleton({
    name,
    match: flags.match || 'https://*/*',
    description: flags.desc || `Hotkeys and tweaks for ${name}`,
  });

  fs.writeFileSync(filePath, content);
  console.log(`+ created  user_scripts/${base}.js`);

  sync();
};

const HELP = `tm - dev CLI for Tampermonkey userscripts

Usage:
  tm new <name> [--match <pattern>] [--desc <text>]   Scaffold a new script + its loader
  tm sync                                              Refresh all loaders to match sources
  tm help                                              Show this help
`;

const main = () => {
  const [command, ...rest] = process.argv.slice(2);
  switch (command) {
    case 'new':
      newScript(rest);
      break;
    case 'sync':
      sync();
      break;
    case 'help':
    case '--help':
    case '-h':
    case undefined:
      console.log(HELP);
      break;
    default:
      console.error(`Unknown command: ${command}\n`);
      console.log(HELP);
      process.exit(1);
  }
};

main();
