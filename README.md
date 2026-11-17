# Eldorion — Atlas interativo

Atlas do mundo de Eldorion para explorar cidades e regiões, consultar a história do cenário e acompanhar as missões da campanha. Desenvolvido em HTML, CSS e JavaScript, sem dependências externas, instalação, compilação ou banco de dados.

## Recursos

- **Mapa interativo:** 31 locais cadastrados, navegação por regiões, zoom, arraste e suporte a gestos em telas sensíveis ao toque.
- **Fichas de locais:** imagens e descrições de cidades e regiões, com navegação entre pontos de interesse dentro de uma cidade. Aurora Magna possui sete locais extras ilustrados.
- **Catálogo de locais:** lista em ordem alfabética, busca por nome ou região sem diferenciar acentos e acesso direto ao mapa.
- **História:** apresentação do mundo, das luas Éteris e Abissis, do calendário e das seis grandes eras de Eldorion.
- **Missões:** painel junto ao mapa e página de diário completo, com filtros de status, grupos de missões principais e secundárias, objetivos e links para os locais.
- **Interface adaptável:** menus recolhíveis, navegação por teclado e respeito à preferência de movimento reduzido do dispositivo.

As seções **Guildas e Facções** e **Pessoas importantes** já aparecem no menu, mas ainda exibem mensagens de conteúdo em breve. O diário contém duas missões de exemplo; os dados reais da campanha precisam ser cadastrados.

## Visualizar no computador

Abra [`public/index.html`](public/index.html) em um navegador atualizado, com JavaScript habilitado. Os scripts são tradicionais e os arquivos são locais, portanto não é necessário iniciar um servidor.

Mantenha a pasta `assets/` ao lado do `index.html`, preservando sua estrutura interna.

## Navegação e controles

| Ação | Como usar |
| --- | --- |
| Explorar uma região | Na visão geral, selecione Verdantia, Aniloria, Serpenat ou Ilhas Draca’el para aproximar o mapa e revelar os locais |
| Mover o mapa | Arraste com o mouse ou com um dedo; use as setas do teclado quando o mapa ou um marcador estiver em foco |
| Ajustar o zoom | Use a roda do mouse, os botões `+` e `−`, as teclas `+` e `−` com o mapa em foco ou a pinça com dois dedos |
| Restaurar a visão completa | Selecione **Mapa inteiro**, que também fecha a ficha aberta |
| Consultar um local | Selecione seu marcador ou use **Ver no mapa** na seção **Locais** |
| Explorar pontos de interesse | Na ficha, selecione um local extra; **Visão geral** restaura a imagem e a descrição da cidade |
| Fechar uma ficha | Use o botão de fechar ou a tecla `Escape` |
| Consultar missões | Abra o painel pelo botão de pergaminho no cabeçalho ou acesse **Missões** no menu lateral |

Glacialis, Alto Trovão e Coralinas também aparecem na visão geral. Ao aproximar o mapa, todos os marcadores ficam disponíveis. Em telas pequenas, a ficha do local aparece na parte inferior, e os menus abrem sobre o conteúdo.

O carregamento acompanha a imagem do mapa. Se ela não carregar, a tela oferece o botão **Tentar novamente**.

## Organização do projeto

| Caminho | Responsabilidade |
| --- | --- |
| `public/index.html` | Estrutura da página, menus, painéis e ordem de carregamento dos arquivos |
| `public/assets/css/style.css` | Estilos gerais, mapa, marcadores e ficha de detalhes |
| `public/assets/css/atlas.css` | Navegação lateral, páginas do atlas, história e catálogo de locais |
| `public/assets/css/quests.css` | Painel e página de missões |
| `public/assets/css/location-details.css` | Navegação entre os locais extras de uma cidade |
| `public/assets/js/app.js` | Interações do mapa, marcadores, fichas e associação das imagens gerais dos locais |
| `public/assets/js/atlas.js` | Navegação entre seções e catálogo de locais com busca |
| `public/assets/js/history.js` | Conteúdo e apresentação da história de Eldorion |
| `public/assets/js/quests.js` | Interface do diário e lista de missões usada atualmente |
| `public/assets/js/data/locations.js` | Nomes, regiões, coordenadas e descrições gerais dos locais |
| `public/assets/js/data/location-details.js` | Títulos, imagens e descrições dos locais extras |
| `public/assets/js/data/quests.js` | Lista vazia e modelo comentado de missão; veja a observação abaixo |
| `public/assets/images/maps/` | Imagens do mapa; o fundo atual é `eldorion-original.png` |
| `public/assets/images/locations/` | Imagens das cidades, regiões e pontos de interesse |
| `public/assets/images/` | Também contém as ilustrações das luas e `placeholder.png` |
| `public/assets/icons/` | Favicon |

## Editar o conteúdo

### Cidades, regiões e coordenadas

Edite a lista `places` em [`public/assets/js/data/locations.js`](public/assets/js/data/locations.js). Cada local usa esta estrutura:

```js
[
  "Nome do local",
  "Região",
  50, // posição horizontal, em porcentagem da largura do mapa
  40, // posição vertical, em porcentagem da altura do mapa
  "Descrição breve.",
  true, // opcional: aplica a aparência de marcador de região
]
```

As coordenadas vão de 0 a 100 e indicam o ponto geográfico na imagem. O mapa atual usa `public/assets/images/maps/eldorion-original.png`, com dimensões de 3344 × 1882 pixels, referenciado no `index.html`.

As imagens gerais são associadas aos nomes dos locais no objeto `locationImages`, no início de [`public/assets/js/app.js`](public/assets/js/app.js). Para adicionar ou trocar uma imagem, salve o arquivo em `public/assets/images/locations/` e atualize essa associação. Um local sem imagem associada usa um recorte do mapa.

Use o mesmo nome, incluindo acentos, nas associações de imagens, nos locais extras e nas missões. Os caminhos de imagens usados pelo JavaScript são relativos ao `index.html`; use barras `/`, por exemplo `./assets/images/locations/ferrova.png`.

### Locais extras dentro de uma cidade

Edite o objeto `locationDetails` em [`public/assets/js/data/location-details.js`](public/assets/js/data/location-details.js). Cada chave corresponde ao nome exato de um local em `places`, e cada item contém `title`, `image` e `description`:

```js
'Aurora Magna': [
  {
    title: 'Praça de Aurora',
    image: './assets/images/locations/aurora-magna/praca-de-aurora.png',
    description: 'Descrição deste ponto de interesse.'
  }
]
```

Acrescente ou edite as entradas no objeto existente, sem declarar `locationDetails` novamente. A ordem da lista define a ordem dos botões. Remova a chave ou use `[]` para retirar os locais extras daquela cidade. A ficha sempre começa na **Visão geral** ao ser aberta.

### Missões da campanha

**Na implementação atual, a lista exibida é o `campaignQuests` declarado dentro de [`public/assets/js/quests.js`](public/assets/js/quests.js).** Ela contém duas missões de exemplo e tem prioridade sobre a declaração em `public/assets/js/data/quests.js`. Alterar apenas o arquivo de dados não modifica o diário exibido.

Para atualizar as missões nesta versão, edite essa lista no script da interface. O arquivo de dados separado contém um modelo comentado com os campos disponíveis:

| Campo | Conteúdo |
| --- | --- |
| `id` | Identificador único da missão |
| `title` | Título exibido |
| `type` | `principal` ou `secundaria` |
| `status` | `ativa` ou `concluida` |
| `summary` | Resumo completo da missão |
| `objectives` | Lista de objetos com `text` e `done` (`true` ou `false`) |
| `location` | Nome exato de um local cadastrado, para criar o botão de acesso ao mapa |
| `lastSession` | Texto opcional identificando a última sessão |
| `contact` e `reward` | Textos opcionais; use `null`, texto vazio ou omita os campos para ocultá-los |

As missões principais aparecem antes das secundárias. Dentro de cada grupo, a ordem de cadastro é mantida. Se `location` não corresponder a um local, o nome aparece como texto, sem botão.

Os objetivos são somente leitura no site. O progresso é atualizado nos arquivos e publicado junto com o conteúdo; não há edição administrativa nem sincronização em tempo real. O `localStorage` guarda as preferências de recolher os menus, sem armazenar o progresso da campanha.

### História e outras seções

Edite os textos e as imagens da história em [`public/assets/js/history.js`](public/assets/js/history.js). Os títulos, as introduções e as mensagens das seções ainda sem conteúdo ficam em [`public/assets/js/atlas.js`](public/assets/js/atlas.js).

## Publicar ou atualizar a hospedagem

1. Envie **o conteúdo de `public/`** para a pasta pública da hospedagem, mantendo `index.html` na raiz dessa pasta.
2. Se o serviço pedir um diretório de publicação, indique `public` e deixe o comando de build vazio.
3. Preserve a estrutura de `assets/`. Os caminhos relativos permitem publicar na raiz de um domínio ou em uma subpasta.
4. Para atualizar uma instalação, publique o conteúdo atualizado de `public/`, incluindo os arquivos de dados, estilos, scripts e imagens utilizados. Incorpore antes as personalizações que existam apenas na versão hospedada.
5. Recarregue o site após a publicação. Se o navegador continuar mostrando a versão anterior, use `Ctrl+F5`.

Mantenha a ordem dos scripts definida no `index.html`:

```text
assets/js/data/locations.js
assets/js/data/location-details.js
assets/js/app.js
assets/js/history.js
assets/js/atlas.js
assets/js/data/quests.js
assets/js/quests.js
```

Os scripts compartilham dados e funções nessa sequência. Ao atualizar os arquivos de interação, preserve também os cadastros personalizados — inclusive a lista de missões dentro de `assets/js/quests.js` enquanto ela estiver definida ali.

## Guias complementares

- [Diário de missões](MISSOES.md): exemplos de cadastro e regras dos campos.
- [Locais extras](LOCAIS-EXTRAS.md): estrutura dos pontos de interesse dentro das cidades.

Esses guias registram etapas anteriores do projeto. Para a origem atual das missões, as imagens já cadastradas e a publicação da versão completa, siga as instruções deste README.
