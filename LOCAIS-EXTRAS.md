# Imagens e descrições de locais dentro das cidades

Esta atualização usa Eldorion-main(5).rar como base. A imagem e a descrição geral de cada lugar continuam vindo dos dados originais.

## Uso no site

Ao abrir uma cidade com locais extras, a ficha mostra uma grade de botões compactos em duas colunas logo abaixo da imagem. Selecione um título para trocar a imagem, o título e a descrição. Todos os botões ficam visíveis, sem setas ou rolagem horizontal. Nomes longos quebram em mais de uma linha.

O botão **Visão geral** aparece sempre no topo, sozinho e ocupando toda a largura da grade. Ele restaura a imagem e a descrição originais. Ao fechar e reabrir uma cidade, a ficha começa novamente na visão geral. Cidades sem locais extras não exibem botões nem a grade de navegação.

## Cadastrar e editar

Edite `public/assets/js/data/location-details.js`. Cada chave é o nome exato de uma cidade ou região em `locations.js`. Cada item tem três campos:

```js
const locationDetails = {
  'Aurora Magna': [
    {
      title: 'Praça de Aurora',
      image: './assets/images/placeholder.png',
      description: 'Texto da descrição deste local.'
    },
    {
      title: 'Outro local',
      image: './assets/images/locations/aurora-magna/outro-local.png',
      description: 'Descrição do outro local.'
    }
  ],
  'Ferrova': [
    {
      title: 'Nome do local em Ferrova',
      image: './assets/images/placeholder.png',
      description: 'Descrição do local.'
    }
  ]
};
```

Acrescente os itens ao objeto existente; não declare `const locationDetails` duas vezes. A ordem dos itens é a ordem dos botões. Os caminhos das imagens são relativos ao `index.html`; use barras `/` nos caminhos. Para retirar os botões de uma cidade, remova sua chave ou use uma lista vazia `[]`.

## Aurora Magna

Foram cadastrados Praça de Aurora, Ponte da Aliança, Palácio de Aurora, Mercado de Alyria Windrer — O Mercadão, Torre Multíscia, Catedral de Mystra e Casa das Artes. Todos usam `public/assets/images/placeholder.png` enviado no projeto. Basta trocar o campo `image` de cada um quando as imagens definitivas estiverem disponíveis.

## Atualizar a hospedagem

O ZIP contém o site completo. Para atualizar apenas este recurso, substitua/adicionе:

- `public/index.html`
- `public/assets/js/app.js`
- `public/assets/js/data/location-details.js` (novo)
- `public/assets/css/location-details.css` (novo)

Preserve `placeholder.png` em `public/assets/images/`. O HTML carrega `location-details.js` antes de `app.js`. Não é necessário build, API ou banco de dados.
