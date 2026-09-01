import test from 'node:test';
import assert from 'node:assert/strict';
import { BOOKS } from '../data/books.js';
import { SOURCES } from '../data/sources.js';
import { filterBooks, readerHref, validateCatalogue } from '../catalogue.js';

test('the initial collection has 40 unique, valid records', () => {
  assert.equal(BOOKS.length, 40);
  assert.deepEqual(validateCatalogue(BOOKS, SOURCES), []);
});

test('catalogue search matches title, author, source, and rights', () => {
  assert.equal(filterBooks(BOOKS, { query: 'Casmurro' })[0].title, 'Dom Casmurro');
  assert.ok(filterBooks(BOOKS, { query: 'Camilo Castelo Branco' }).length >= 3);
  assert.equal(filterBooks(BOOKS, { query: 'Gutenberg' }).length, 32);
  assert.equal(filterBooks(BOOKS, { rights: 'unknown' }).length, 8);
});

test('source and rights filters preserve transparent rights states', () => {
  assert.equal(filterBooks(BOOKS, { source: 'wikisource' }).length, 8);
  assert.equal(filterBooks(BOOKS, { source: 'gutenberg', rights: 'stated' }).length, 32);
});

test('only verified direct files receive an in-site reader route', () => {
  const readable = { title: 'Teste', sourceUrl: 'https://example.org/book', readerUrl: 'https://example.org/book.epub', readerFormat: 'epub' };
  const externalOnly = BOOKS.find(book => !book.readerUrl);
  assert.match(readerHref(readable), /^reader\.html\?url=https/);
  assert.equal(readerHref(externalOnly), '');
});
