const params = new URLSearchParams(location.search);
const url = params.get('url') || '';
const format = params.get('format') || '';
const title = params.get('title') || 'Livro';
const source = params.get('source') || '';
const titleNode = document.querySelector('#reader-title');
const errorNode = document.querySelector('#reader-error');
const sourceLink = document.querySelector('#reader-source');

titleNode.textContent = title;
sourceLink.href = source || url;

function fail(message) {
  errorNode.hidden = false;
  errorNode.querySelector('span').textContent = message;
}

if (!url || !['epub', 'pdf'].includes(format)) {
  fail('Este livro não tem um ficheiro compatível com o leitor.');
} else if (format === 'pdf') {
  const frame = document.createElement('iframe');
  frame.title = title;
  frame.src = url;
  frame.addEventListener('error', () => fail('Não foi possível abrir este PDF aqui.'));
  document.querySelector('#reader').append(frame);
} else {
  const script = document.createElement('script');
  script.src = 'vendor/epub.min.js';
  script.onload = async () => {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const bytes = await response.arrayBuffer();
      const book = ePub(bytes);
      const rendition = book.renderTo('reader', { width: '100%', height: '100%' });
      await rendition.display();
      document.querySelector('#previous').hidden = false;
      document.querySelector('#next').hidden = false;
      document.querySelector('#previous').onclick = () => rendition.prev();
      document.querySelector('#next').onclick = () => rendition.next();
    } catch {
      fail('Não foi possível abrir este EPUB aqui. Pode lê-lo ou descarregá-lo na fonte original.');
    }
  };
  script.onerror = () => fail('O leitor EPUB não pôde ser carregado.');
  document.head.append(script);
}
