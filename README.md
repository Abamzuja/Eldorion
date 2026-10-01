# Eldorion — Atlas interativo

Site estático em HTML, CSS e JavaScript. Não exige instalação, compilação ou banco de dados.

## Hospedar

Envie **o conteúdo da pasta `public/`** para a pasta pública da sua hospedagem. O `index.html` deve ficar na raiz dessa pasta. Se o serviço pedir um diretório de publicação, indique `public` e deixe o comando de build vazio.

Os caminhos são relativos: o site funciona na raiz de um domínio ou em uma subpasta. Preserve a estrutura interna de `public/assets/`.

Para visualizar no computador, abra `public/index.html` no navegador.

## Organização

| Caminho | Conteúdo |
| --- | --- |
| `public/index.html` | Estrutura da página e carregamento dos arquivos |
| `public/assets/css/style.css` | Estilos e adaptação a telas menores |
| `public/assets/js/app.js` | Marcadores, janela de detalhes, galeria e zoom |
| `public/assets/js/data/locations.js` | Nomes, regiões, posições, descrições e imagens da galeria |
| `public/assets/images/maps/` | Mapa otimizado usado pelo site |
| `public/assets/images/locations/aurora-magna/` | Imagens de Aurora Magna com nomes descritivos |
| `public/assets/icons/` | Favicon |
| `source-assets/maps/` | Mapa PNG original para edição; não precisa ser publicado |

## Editar locais e imagens

Em `public/assets/js/data/locations.js`, cada item de `places` mantém a sequência original:

```js
[
  "Nome do local",
  "Região",
  50, // posição horizontal, em porcentagem
  40, // posição vertical, em porcentagem
  "Descrição breve.",
  true, // opcional: aplica a aparência de rótulo de região
]
```

A lista `aurora` contém pares de caminho da imagem e legenda. Caminhos usados pelo JavaScript são relativos ao `index.html`, e não à pasta dos scripts.

O HTML carrega `locations.js` antes de `app.js`; mantenha essa ordem. Os scripts permanecem tradicionais para permitir a abertura local sem servidor.

## Sobre esta organização

A formatação, o conteúdo e o funcionamento dos arquivos enviados foram preservados. Foram alterados apenas a distribuição em pastas, os caminhos dos arquivos e a separação dos dados do código de interação. As três imagens da galeria receberam nomes descritivos. Este guia substitui o antigo LEIA-ME.txt.
