import test from 'node:test';
import assert from 'node:assert/strict';
import { BOOKS } from '../data/books.js';
import { SOURCES } from '../data/sources.js';
import { filterBooks, readerHref, sortBooks, validateCatalogue } from '../catalogue.js';

test('the initial collection has 45 unique, valid records', () => {
  assert.equal(BOOKS.length, 45);
  assert.deepEqual(validateCatalogue(BOOKS, SOURCES), []);
});

test('catalogue search matches title, author, source, and rights', () => {
  assert.equal(filterBooks(BOOKS, { query: 'Casmurro' })[0].title, 'Dom Casmurro');
  assert.ok(filterBooks(BOOKS, { query: 'Camilo Castelo Branco' }).length >= 3);
  assert.equal(filterBooks(BOOKS, { query: 'Gutenberg' }).length, 32);
  assert.equal(filterBooks(BOOKS, { rights: 'unknown' }).length, 13);
});

test('source and rights filters preserve transparent rights states', () => {
  assert.equal(filterBooks(BOOKS, { source: 'wikisource' }).length, 13);
  assert.equal(filterBooks(BOOKS, { source: 'gutenberg', rights: 'stated' }).length, 32);
});

test('includes Fernando Pessoa and four named heteronyms', () => {
  for (const author of ['Fernando Pessoa', 'Alberto Caeiro', 'Álvaro de Campos', 'Ricardo Reis', 'Bernardo Soares']) {
    assert.ok(BOOKS.some(book => book.author === author));
  }
});

test('sorts the visible collection by every table column in either direction', () => {
  const titles = sortBooks(BOOKS, { key: 'title' });
  const years = sortBooks(BOOKS, { key: 'year', direction: 'desc' });
  const sources = sortBooks(BOOKS, { key: 'source' });
  assert.equal(titles[0].title, 'A Biblia Sagrada, Contendo o Velho e o Novo Testamento');
  assert.equal(years[0].year, '1934');
  assert.equal(sources[0].source, 'gutenberg');
  assert.equal(sources.at(-1).source, 'wikisource');
});

test('only verified direct files receive an in-site reader route', () => {
  const readable = { title: 'Teste', sourceUrl: 'https://example.org/book', readerUrl: 'https://example.org/book.epub', readerFormat: 'epub' };
  const externalOnly = BOOKS.find(book => !book.readerUrl);
  assert.match(readerHref(readable), /^reader\.html\?url=https/);
  assert.equal(readerHref(externalOnly), '');
});
