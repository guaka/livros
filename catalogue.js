import { SOURCES, sourceById } from './data/sources.js';

const REQUIRED_FIELDS = ['id', 'title', 'author', 'source', 'sourceUrl', 'formats', 'rights', 'rightsSource'];

export function readerHref(book) {
  if (!book?.readerUrl || !['epub', 'pdf'].includes(book.readerFormat)) return '';
  const params = new URLSearchParams({ url: book.readerUrl, format: book.readerFormat, title: book.title, source: book.sourceUrl });
  return `reader.html?${params.toString()}`;
}

export function filterBooks(books, { query = '', source = '', rights = '' } = {}) {
  const terms = String(query).trim().toLocaleLowerCase();
  return books.filter(book => {
    const haystack = [book.title, book.author, book.year, book.rights, sourceById(book.source)?.name].join(' ').toLocaleLowerCase();
    return (!terms || haystack.includes(terms)) && (!source || book.source === source)
      && (!rights || (rights === 'stated' ? !/^não indicada/i.test(book.rights) : /^não indicada/i.test(book.rights)));
  });
}

export function sortBooks(books, { key = 'title', direction = 'asc' } = {}) {
  const factor = direction === 'desc' ? -1 : 1;
  const valueFor = book => key === 'source' ? (sourceById(book.source)?.name || book.source) : book[key] || '';
  return [...books].sort((left, right) => String(valueFor(left)).localeCompare(String(valueFor(right)), 'pt', {
    numeric: key === 'year', sensitivity: 'base',
  }) * factor);
}

export function validateCatalogue(books, sources = SOURCES) {
  const sourceIds = new Set(sources.map(source => source.id));
  const ids = new Set();
  const errors = [];
  for (const [index, book] of books.entries()) {
    for (const field of REQUIRED_FIELDS) if (!book?.[field] || (Array.isArray(book[field]) && !book[field].length)) errors.push(`${index}: missing ${field}`);
    if (ids.has(book?.id)) errors.push(`${index}: duplicate id ${book?.id}`);
    ids.add(book?.id);
    if (!sourceIds.has(book?.source)) errors.push(`${index}: unknown source ${book?.source}`);
    for (const url of [book?.sourceUrl, book?.downloadUrl, book?.readerUrl].filter(Boolean)) {
      try { if (new URL(url).protocol !== 'https:') errors.push(`${index}: non-HTTPS URL`); } catch { errors.push(`${index}: invalid URL`); }
    }
    if (book?.readerUrl && !['epub', 'pdf'].includes(book?.readerFormat)) errors.push(`${index}: invalid reader format`);
    if (!book?.readerUrl && book?.readerFormat) errors.push(`${index}: reader format without URL`);
  }
  return errors;
}
