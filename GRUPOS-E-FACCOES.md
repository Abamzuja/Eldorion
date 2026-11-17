# Cadastro de grupos e facções

Edite apenas `public/assets/js/data/factions.js` para cadastrar organizações. Os cards aparecem automaticamente na seção **Grupos e Facções**, em ordem alfabética. Não é necessário alterar HTML, CSS ou a lógica do site.

O cadastro começa vazio. Há um modelo comentado no arquivo; remova o comentário que envolve o objeto e preencha seus dados. Para adicionar mais organizações, copie o objeto dentro da mesma lista, separando os objetos por vírgula. Não declare `const factions` novamente.

```js
const factions = [
  {
    name: 'Nome da organização',
    type: 'Guilda',
    image: './assets/images/factions/minha-guilda.png',
    summary: 'Resumo público exibido no card.',
    description: 'Descrição completa.\n\nUse duas quebras para outro parágrafo.',
    headquarters: 'Aurora Magna',
    leader: null,
    activities: 'Atividades conhecidas pelos jogadores.',
    members: ['Nome de um integrante']
  },
  {
    name: 'Nome de outra organização',
    type: 'Facção',
    summary: 'Outro resumo.'
  }
];
```

Somente `name` é obrigatório. Campos opcionais podem ser omitidos, receber `null` ou `''`. Em `members`, use uma lista de nomes ou `[]`. Não escreva a palavra `null` entre aspas.

O tipo é livre: Grupo, Guilda, Facção, Ordem, Companhia etc. O filtro reúne automaticamente os tipos cadastrados. A busca ignora acentos e encontra nomes, sede, liderança, atividades, integrantes e textos das organizações.

O resumo aparece no card; descrição, sede, liderança, atividades e integrantes ficam em **Ver detalhes**. Se esses campos estiverem vazios, esse controle não aparece. Sem imagem, o card continua funcionando. Uma imagem que não carrega é ocultada.

Os caminhos são relativos ao `public/index.html`. Crie a pasta `public/assets/images/factions/` para suas imagens, se desejar. Somente informações públicas devem ser cadastradas: todo conteúdo do JS pode ser lido pelos visitantes, mesmo em seções recolhidas ou comentários.

## Instalação

O ZIP contém o site completo baseado em `Eldorion-main(7).rar`. Publique o conteúdo de `public/` como antes. Para atualizar só este recurso, substitua `public/index.html` e `public/assets/js/atlas.js`, e adicione:

- `public/assets/css/factions.css`
- `public/assets/js/factions.js`
- `public/assets/js/data/factions.js`

Os dados e posições do mapa, caminhos e ajustes das imagens, missões e demais conteúdos foram preservados.
