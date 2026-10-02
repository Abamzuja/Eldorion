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

Esta versão contém 31 pontos clicáveis, alinhados à referência rotulada do novo mapa. Foram adicionados Telora, Nerália, Escadaria dos Titãs, Aeral, Caldra e Forja Silenciosa. As descrições existentes foram preservadas; as dos seis novos pontos são apenas resumos geográficos baseados na referência.

## Interações

- Tela de carregamento com bússola, vinculada ao carregamento real do mapa. Em caso de falha, há um botão para tentar novamente.
- Arraste o mapa com o mouse ou com um dedo. Use a roda do mouse, os botões +/− ou o gesto de pinça com dois dedos para ampliar.
- Use “Mapa inteiro” para fechar a ficha e restaurar a visão completa.
- Selecione um marcador para destacar o local, aproximar o mapa e abrir sua ficha lateral. No celular, a ficha aparece na parte inferior.
- Feche a ficha pelo botão × ou pela tecla Escape. As setas movem o mapa quando o mapa ou um marcador está em foco; + e − controlam o zoom.
- As animações respeitam a preferência de movimento reduzido do dispositivo.
- A galeria de Aurora Magna permanece disponível.

## Atualizar uma instalação anterior

Substitua index.html, assets/css/style.css, assets/js/app.js e assets/js/data/locations.js pelos arquivos de public/. Você também pode enviar todo o conteúdo de public/, preservando as pastas.

Os nomes, descrições, coordenadas e caminhos de imagens permanecem em assets/js/data/locations.js. O código de interação está em assets/js/app.js.


## Atualização do mapa — 02/10/2026

O fundo usado é o PNG sem rótulos de 3344 × 1882 já presente no ZIP recebido. A imagem rotulada fornecida foi usada como referência para as posições; não foi colocada como fundo, para evitar nomes duplicados.

As coordenadas de cada local são porcentagens da largura e da altura da imagem. Elas correspondem ao ponto geográfico, com o nome clicável logo abaixo. Zoom, enquadramento e recortes agora usam as dimensões reais da imagem, preservando sua proporção.

Para atualizar uma instalação com este mesmo mapa, substitua public/index.html, public/assets/css/style.css, public/assets/js/app.js e public/assets/js/data/locations.js. Para instalar do zero, publique todo o conteúdo de public/. Recarregue com Ctrl+F5.
