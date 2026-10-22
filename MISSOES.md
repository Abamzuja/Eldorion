# Diário de missões de Eldorion

## Instalar

Esta versão parte de Eldorion-main(4).rar. Publique o conteúdo de `public/` ou atualize apenas estes arquivos, mantendo os caminhos:

- `public/index.html`
- `public/assets/js/atlas.js`
- `public/assets/js/data/quests.js` (novo)
- `public/assets/js/quests.js` (novo)
- `public/assets/css/quests.css` (novo)

Os locais, suas coordenadas, o código do mapa, os textos de História e as imagens foram preservados.

## Como usar

O botão de pergaminho no cabeçalho abre e recolhe o diário. No computador, ele ocupa 320 px quando aberto e 72 px quando recolhido; a preferência é lembrada no navegador. Até 1100 px de largura, abre como um painel sobre o mapa para preservar o espaço de exploração. Pode ser fechado pelo botão, pela área escura ou por Escape. O diário aparece apenas na seção Mapa.

Os filtros separam missões em andamento e concluídas. Cada missão pode mostrar objetivos, a última sessão, o resumo completo da missão, o contato, uma recompensa conhecida e acesso ao local no mapa. Os objetivos são somente leitura para os jogadores.

## Cadastrar missões

Edite `public/assets/js/data/quests.js`. O arquivo começa com uma lista vazia porque nenhuma missão real foi fornecida. Há um modelo comentado no próprio arquivo. Não é necessário instalar nada ou criar um banco de dados.

Exemplo de estrutura (substitua os textos antes de publicar):

```js
const campaignQuests = [
  {
    id: 'missao-001',
    title: 'Título da missão',
    type: 'principal',
    status: 'ativa',
    summary: 'Resumo completo da missão, descobertas e próximos passos.',
    lastSession: 'Sessão 1 · 22/10/2026',
    contact: 'Nome do contato',
    location: 'Aurora Magna',
    objectives: [
      { text: 'Um objetivo já resolvido', done: true },
      { text: 'O próximo objetivo', done: false }
    ],
    reward: 'Recompensa conhecida'
  }
];
```

- `type`: `principal` ou `secundaria`.
- `status`: `ativa` ou `concluida`. Ao concluir a missão, atualize também os objetivos conforme a história.
- `location`: nome exato em `locations.js`. Se não houver correspondência, será mostrado como texto, sem link.
- `objectives`: cada item tem `text` e `done` (`true` ou `false`).
- Campos opcionais vazios não aparecem. Preserve aspas e vírgulas ao editar.
- As missões principais aparecem antes das secundárias, independentemente do ID e da ordem de cadastro. Dentro de cada grupo, a ordem de cadastro é mantida.

Depois da sessão, altere os objetivos e o resumo e publique o arquivo `quests.js` de dados atualizado. Todos recebem o mesmo conteúdo ao recarregar o site; se necessário, use Ctrl+F5 para limpar a versão em cache. Não há sincronização em tempo real nem edição administrativa pelo site. O armazenamento local guarda somente a preferência de recolher o menu, nunca o progresso da campanha.

## Resumo único

Use apenas `summary` para todo o resumo. O campo `recap` não é utilizado e pode ser removido das missões já cadastradas. `lastSession` continua opcional, exibindo apenas a identificação da sessão.

## Contato e recompensa opcionais

Contato e recompensa aparecem diretamente no cartão, sem seta ou submenu. Cada campo é independente. Use `null` (sem aspas), `""`, apenas espaços, ou omita a propriedade para ocultá-la. Se ambos estiverem vazios, nenhuma divisória ou espaço de informações adicionais será criado. Não use `Empty` sem aspas: isso não é um valor especial em JavaScript.

```js
contact: 'Nome do contato',
reward: null
```

Ou, sem os dois campos:

```js
contact: null,
reward: null
```

Para atualizar apenas essa apresentação, substitua `public/assets/js/quests.js` e `public/assets/css/quests.css`. Preserve seu arquivo `public/assets/js/data/quests.js` caso já tenha cadastrado missões nele.

## Página de missões e grupos

A navegação esquerda agora inclui Missões, com cards maiores e filtros de status. O botão Abrir diário completo no painel da direita leva à mesma página. As duas telas usam os dados de `public/assets/js/data/quests.js`.

Principais aparecem antes de Secundárias. Cada grupo possui uma seta para expandir ou recolher; isso apenas muda a apresentação, não o progresso. Grupos sem missões no filtro atual não aparecem. A escolha de recolher cada grupo é lembrada durante a navegação na página atual, mas não é salva ao recarregar o site.

O painel direito agora tem 320 px de largura, ou 72 px recolhido. Em telas pequenas, abre sobre o mapa com largura máxima de 320 px e limite de 90% da tela.

Para atualizar esta versão, substitua `public/index.html`, `public/assets/js/atlas.js`, `public/assets/js/quests.js` e `public/assets/css/quests.css`. Preserve `public/assets/js/data/quests.js` se já cadastrou suas missões; a estrutura de dados não mudou.
