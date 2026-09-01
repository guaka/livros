export const SOURCES = [
  { id: 'bnd', name: 'Biblioteca Nacional Digital', shortName: 'BND', description: 'Digitalizações da Biblioteca Nacional de Portugal.', url: 'https://bndigital.bnportugal.gov.pt/', action: 'Explorar coleção' },
  { id: 'gutenberg', name: 'Project Gutenberg', shortName: 'Gutenberg', description: 'Edições digitais de domínio público, incluindo livros em português.', url: 'https://www.gutenberg.org/browse/languages/pt', action: 'Explorar livros' },
  { id: 'wikisource', name: 'Wikisource em português', shortName: 'Wikisource', description: 'Textos livres, transcritos e revistos pela comunidade.', url: 'https://pt.wikisource.org/', action: 'Ler textos' },
  { id: 'internet-archive', name: 'Internet Archive', shortName: 'Internet Archive', description: 'Livros digitalizados e coleções de bibliotecas de todo o mundo.', url: 'https://archive.org/search?query=language%3Apor', action: 'Pesquisar coleção' },
  { id: 'europeana', name: 'Europeana', shortName: 'Europeana', description: 'Património cultural digital de instituições europeias.', url: 'https://www.europeana.eu/pt/search?query=portuguese%20books', action: 'Explorar coleção' },
  { id: 'iberian-books', name: 'Iberian Books', shortName: 'Iberian Books', description: 'Bibliografia de livros publicados na Península Ibérica.', url: 'https://iberianbooks.com/', action: 'Consultar bibliografia' },
];

export const sourceById = id => SOURCES.find(source => source.id === id) || null;
