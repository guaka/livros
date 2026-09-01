import { BOOKS } from './data/books.js';
import { SOURCES, sourceById } from './data/sources.js';
import { filterBooks, readerHref } from './catalogue.js';

const escapeHtml = value => String(value || '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
const state = { query: '', source: '', rights: '' };

function sourceCard(source) {
  return `<article class="source-card" id="fonte-${source.id}"><p class="eyebrow">Fonte</p><h2>${escapeHtml(source.name)}</h2><p>${escapeHtml(source.description)}</p><a class="text-link" href="${source.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.action)} <span aria-hidden="true">↗</span></a></article>`;
}

function bookCard(book) {
  const source = sourceById(book.source);
  const read = readerHref(book);
  const rightsClass = /^não indicada/i.test(book.rights) ? 'rights-unknown' : 'rights-stated';
  return `<article class="book-card"><div class="book-copy"><p class="eyebrow">${escapeHtml(source?.shortName || book.source)}${book.year ? ` · ${escapeHtml(book.year)}` : ''}</p><h2>${escapeHtml(book.title)}</h2><p class="author">${escapeHtml(book.author)}</p><p class="rights ${rightsClass}"><span>Direitos</span> ${escapeHtml(book.rights)}</p><p class="rights-source">Fonte dos direitos: ${escapeHtml(book.rightsSource)}</p></div><div class="actions">${read ? `<a class="button primary" data-reader-link href="${read}">Ler aqui</a>` : ''}${book.downloadUrl ? `<a class="button" href="${book.downloadUrl}" target="_blank" rel="noopener noreferrer">Descarregar</a>` : ''}<a class="button quiet" href="${book.sourceUrl}" target="_blank" rel="noopener noreferrer">Ver na fonte <span aria-hidden="true">↗</span></a></div></article>`;
}

function render() {
  const visible = filterBooks(BOOKS, state);
  document.querySelector('#catalogue-count').textContent = `${visible.length} ${visible.length === 1 ? 'livro' : 'livros'}`;
  document.querySelector('#books').innerHTML = visible.length ? visible.map(bookCard).join('') : '<p class="empty">Não encontrámos livros com estes filtros.</p>';
}

document.querySelector('#sources').innerHTML = SOURCES.map(sourceCard).join('');
document.querySelector('#source-filter').innerHTML += SOURCES.map(source => `<option value="${source.id}">${escapeHtml(source.name)}</option>`).join('');
document.querySelector('#query').addEventListener('input', event => { state.query = event.currentTarget.value; render(); });
document.querySelector('#source-filter').addEventListener('change', event => { state.source = event.currentTarget.value; render(); });
document.querySelector('#rights-filter').addEventListener('change', event => { state.rights = event.currentTarget.value; render(); });
render();
