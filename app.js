import { BOOKS } from './data/books.js';
import { SOURCES, sourceById } from './data/sources.js';
import { filterBooks, readerHref, sortBooks } from './catalogue.js';

const escapeHtml = value => String(value || '').replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
const state = { query: '', source: '', rights: '', sortKey: 'title', sortDirection: 'asc' };

function sourceCard(source) {
  return `<article class="source-card" id="fonte-${source.id}"><p class="eyebrow">Fonte</p><h2>${escapeHtml(source.name)}</h2><p>${escapeHtml(source.description)}</p><a class="text-link" href="${source.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.action)} <span aria-hidden="true">↗</span></a></article>`;
}

function bookRow(book) {
  const source = sourceById(book.source);
  const read = readerHref(book);
  const rightsClass = /^não indicada/i.test(book.rights) ? 'rights-unknown' : 'rights-stated';
  return `<tr><td data-label="Título"><strong>${escapeHtml(book.title)}</strong></td><td data-label="Autor">${escapeHtml(book.author)}</td><td data-label="Ano">${escapeHtml(book.year || '—')}</td><td data-label="Fonte">${escapeHtml(source?.shortName || book.source)}</td><td data-label="Direitos" class="rights ${rightsClass}">${escapeHtml(book.rights)}<small>${escapeHtml(book.rightsSource)}</small></td><td data-label="Ações"><div class="actions">${read ? `<a class="button primary" data-reader-link href="${read}">Ler aqui</a>` : ''}${book.downloadUrl ? `<a class="button" href="${book.downloadUrl}" target="_blank" rel="noopener noreferrer">Descarregar</a>` : ''}<a class="button quiet" href="${book.sourceUrl}" target="_blank" rel="noopener noreferrer">Fonte <span aria-hidden="true">↗</span></a></div></td></tr>`;
}

function sortHeader(key, label) {
  const active = state.sortKey === key;
  const direction = active ? state.sortDirection : 'none';
  const glyph = active ? (direction === 'asc' ? '↑' : '↓') : '↕';
  return `<th scope="col" aria-sort="${active ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}"><button type="button" class="sort-button" data-sort="${key}" aria-label="Ordenar por ${label}${active ? (direction === 'asc' ? ', ascendente' : ', descendente') : ''}">${label} <span aria-hidden="true">${glyph}</span></button></th>`;
}

function render() {
  const visible = sortBooks(filterBooks(BOOKS, state), { key: state.sortKey, direction: state.sortDirection });
  document.querySelector('#catalogue-count').textContent = `${visible.length} ${visible.length === 1 ? 'livro' : 'livros'}`;
  document.querySelector('#books').innerHTML = visible.length ? `<table><thead><tr>${sortHeader('title', 'Título')}${sortHeader('author', 'Autor')}${sortHeader('year', 'Ano')}${sortHeader('source', 'Fonte')}${sortHeader('rights', 'Direitos')}<th scope="col">Ações</th></tr></thead><tbody>${visible.map(bookRow).join('')}</tbody></table>` : '<p class="empty">Não encontrámos livros com estes filtros.</p>';
  document.querySelectorAll('[data-sort]').forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.sort;
    state.sortDirection = state.sortKey === key && state.sortDirection === 'asc' ? 'desc' : 'asc';
    state.sortKey = key;
    render();
  }));
}

document.querySelector('#sources').innerHTML = SOURCES.map(sourceCard).join('');
document.querySelector('#source-filter').innerHTML += SOURCES.map(source => `<option value="${source.id}">${escapeHtml(source.name)}</option>`).join('');
document.querySelector('#query').addEventListener('input', event => { state.query = event.currentTarget.value; render(); });
document.querySelector('#source-filter').addEventListener('change', event => { state.source = event.currentTarget.value; render(); });
document.querySelector('#rights-filter').addEventListener('change', event => { state.rights = event.currentTarget.value; render(); });
render();
