# Livros Livres Portugueses

Um catálogo aberto de livros em português, publicado em [guaka.github.io/livros](https://guaka.github.io/livros/).

O catálogo contém uma coleção inicial revista de 45 livros, incluindo Fernando Pessoa e os heterónimos Alberto Caeiro, Álvaro de Campos, Ricardo Reis e Bernardo Soares, e ligações para seis fontes públicas: Biblioteca Nacional Digital, Project Gutenberg, Wikisource em português, Internet Archive, Europeana e Iberian Books.

## Direitos e leitura

Não inferimos direitos: cada ficha mostra a indicação publicada pela fonte e a sua proveniência; quando a fonte não a apresenta, dizemos **“Não indicada pela fonte”**. O botão **Ler aqui** só é oferecido para ficheiros EPUB/PDF diretos e testados para leitura no navegador. Nos restantes casos, a ficha mantém a ligação à fonte e, quando aplicável, a descarga.

## Desenvolvimento

Não há dependências de execução. Sirva a pasta com qualquer servidor estático e execute:

```sh
node --test tests/*.test.mjs
```

O código e os dados curados estão sob AGPL-3.0-or-later. `vendor/epub.min.js` é o ativo de leitor reutilizado de Bookstr e é distribuído sob a mesma licença do projeto.
