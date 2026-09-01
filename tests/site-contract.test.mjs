import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

test('the public page exposes search, source navigation, and reader controls', async () => {
  const html = await readFile(new URL('index.html', root), 'utf8');
  const app = await readFile(new URL('app.js', root), 'utf8');
  assert.match(html, /id="query"/);
  assert.match(html, /id="source-filter"/);
  assert.match(html, /id="rights-filter"/);
  assert.match(app, /data-reader-link/);
  assert.match(app, /target="_blank"/);
});

test('the reader has a source recovery route when a remote file fails', async () => {
  const html = await readFile(new URL('reader.html', root), 'utf8');
  const app = await readFile(new URL('reader.js', root), 'utf8');
  assert.match(html, /id="reader-source"/);
  assert.match(html, /id="reader-error"/);
  assert.match(app, /Não foi possível abrir este EPUB aqui/);
});
