/* Renderização da seção. Para cadastrar conteúdo, edite data/factions.js. */
(() => {
  const text = value => typeof value === 'string' ? value.trim() : '';
  const normalize = value => text(value).normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR');
  function element(tag, content = '', className = '') {
    const node = document.createElement(tag);
    node.textContent = content;
    if (className) node.className = className;
    return node;
  }

  window.renderFactionPage = container => {
    const entries = (typeof factions !== 'undefined' && Array.isArray(factions) ? factions : [])
      .filter(item => item && text(item.name))
      .slice().sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    if (!entries.length) {
      const empty = element('div', '', 'atlas-empty');
      empty.append(element('h3', 'Novos registros em breve'),
        element('p', 'Os grupos e facções conhecidos de Eldorion serão reunidos aqui.'));
      container.append(empty);
      return;
    }

    const filters = element('div', '', 'faction-filters');
    const searchLabel = element('label', 'Buscar por nome, sede ou atividade', 'location-search');
    const search = element('input');
    search.type = 'search';
    search.placeholder = 'Buscar organizações…';
    searchLabel.append(search);
    const typeLabel = element('label', 'Tipo de organização', 'location-search');
    const select = element('select');
    const all = element('option', 'Todos os tipos');
    all.value = '';
    select.append(all);
    const types = new Map();
    entries.forEach(item => {
      if (text(item.type)) types.set(normalize(item.type), text(item.type));
    });
    [...types.entries()].sort((a, b) => a[1].localeCompare(b[1], 'pt-BR')).forEach(([key, label]) => {
      const option = element('option', label);
      option.value = key;
      select.append(option);
    });
    typeLabel.append(select);
    typeLabel.hidden = types.size === 0;
    filters.append(searchLabel, typeLabel);
    const count = element('p', '', 'faction-count');
    count.setAttribute('role', 'status');
    const grid = element('div', '', 'location-grid faction-grid');
    const cards = entries.map(item => {
      const card = element('article', '', 'location-card faction-card');
      if (text(item.image)) {
        const image = element('img', '', 'faction-image');
        image.alt = `Imagem de ${text(item.name)}`;
        image.loading = 'lazy';
        image.addEventListener('error', () => image.remove(), { once: true });
        image.src = text(item.image);
        card.append(image);
      }
      if (text(item.type)) card.append(element('p', text(item.type), 'eyebrow'));
      card.append(element('h3', text(item.name)));
      if (text(item.summary)) card.append(element('p', text(item.summary), 'description'));

      const info = element('div', '', 'faction-information');
      if (text(item.description)) info.append(element('p', text(item.description), 'description'));
      const metadata = element('dl', '', 'faction-metadata');
      [['Sede', item.headquarters], ['Liderança', item.leader], ['Atividades', item.activities]].forEach(([label, value]) => {
        if (text(value)) metadata.append(element('dt', label), element('dd', text(value)));
      });
      if (metadata.childElementCount) info.append(metadata);
      const members = Array.isArray(item.members) ? item.members.map(text).filter(Boolean) : [];
      if (members.length) {
        info.append(element('h4', 'Integrantes conhecidos'));
        const list = element('ul');
        members.forEach(name => list.append(element('li', name)));
        info.append(list);
      }
      if (info.childElementCount) {
        const details = element('details', '', 'faction-details');
        const summary = element('summary', 'Ver detalhes');
        details.addEventListener('toggle', () => {
          summary.textContent = details.open ? 'Recolher detalhes' : 'Ver detalhes';
        });
        details.append(summary, info);
        card.append(details);
      }
      grid.append(card);
      const keywords = normalize([item.name, item.type, item.summary, item.description,
        item.headquarters, item.leader, item.activities, ...members].map(text).join(' '));
      return { card, keywords, type: normalize(item.type) };
    });
    function filter() {
      const query = normalize(search.value);
      let visible = 0;
      cards.forEach(({ card, keywords, type }) => {
        card.hidden = !keywords.includes(query) || Boolean(select.value && select.value !== type);
        if (!card.hidden) visible++;
      });
      count.textContent = visible
        ? `${visible} ${visible === 1 ? 'organização encontrada' : 'organizações encontradas'}`
        : 'Nenhuma organização encontrada. Tente outra busca ou tipo.';
    }
    search.addEventListener('input', filter);
    select.addEventListener('change', filter);
    filter();
    container.append(filters, count, grid);
  };
})();
