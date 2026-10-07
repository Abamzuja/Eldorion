/* Adaptado de “Contextualização do Universo para os Jogadores” (06/10/2026).
   Conteúdo público; as datas e incertezas seguem o documento de referência. */
function renderHistory(container) {
  container.innerHTML = `
    
    <section class="history-block" aria-labelledby="world-history-title">
      <p class="eyebrow">O Mundo Entrelaçado</p>
      <h3 id="world-history-title">Sussurros do Passado</h3>
      <p>Eldorion é um mundo vasto, formado pelos continentes de Aniloria, Serpenat e Verdantia, separados por amplos oceanos e acompanhados por ilhas. Seu apelido de “Mundo Entrelaçado” vem das histórias sobre as Correntes Místicas, que entrelaçam o mundo e mantêm seu equilíbrio mágico.</p>
      <p>Os povos que hoje habitam essas terras conhecem apenas uma fração de seu passado. A origem de Eldorion remonta à Confluência Arcana, e sua história conhecida é organizada em seis grandes eras.</p>
    </section>
    <section class="history-block" aria-labelledby="moons-title">
      <p class="eyebrow">As Luas de Eldorion</p>
      <h3 id="moons-title">Éteris e Abissis</h3>
      <div class="history-moons">
        <article><h4>Éteris</h4><p>Grande e majestosa, Éteris é avistada quase sempre, tanto nos céus noturnos quanto durante o dia. Sua presença se tornou um pilar importante para algumas religiões que veneram a lua como deusa.</p><img class="moon-image" src="./assets/images/eteris.png" alt="Ilustração da lua Éteris" loading="lazy" decoding="async" /></article>
        <article><h4>Abissis</h4><p>Menor, marcada por crateras, parcialmente destruída, e com estruturas construídas ao seu redor, Abissis percorre o céu acompanhada por seus próprios fragmentos. Há relatos de anos sem que fosse vista e de dezenas de noites consecutivas em que apareceu. Segundo uma crença comum, sua presença visível anuncia que o mal aflora em Eldorion.</p><img class="moon-image" src="./assets/images/abissis.png" alt="Ilustração da lua Abissis" loading="lazy" decoding="async" /></article>
      </div>
    </section>
    <section class="history-block" aria-labelledby="eras-title">
      <p class="eyebrow">Da Confluência à atualidade</p>
      <h3 id="eras-title">As eras de Eldorion</h3>
      <aside class="history-calendar"><strong>Como os anos são contados</strong><p>O Pacto de Aurora Magna marca a divisão do calendário: </p><ul><li><abbr title="Antes da Pacificação">A.P.</abbr> : Antes da Pacificação.</li><li> <abbr title="Depois da Pacificação">D.P.</abbr> : Depois da Pacificação.</li></ul></aside>
      <ol class="history-timeline">
        <li><article>
          <p class="era-period">Origem desconhecida → 2.000 A.P.</p>
          <h4>Era dos Deuses</h4>
          <p>Eldorion nasceu da Confluência Arcana, uma tempestade cósmica que atraiu deuses ao plano material. Mystra, Bahamut, Tiamat e outras divindades deram forma ao mundo e criaram seres como elementais e dragões.</p>
          <p>A harmonia foi rompida por Tiamat, dando início à Guerra dos Ecos: um conflito entre as criações dos deuses pelo poder arcano do mundo. Acredita-se que Bahamut e Mystra tenham aprisionado a deusa em um plano elemental.</p>
        </article></li>
        <li><article>
          <p class="era-period">2.000 A.P. → 1 A.P.</p>
          <h4>Era da Ascensão</h4>
          <p>Após a guerra, a vida voltou a florescer. Elfos, anões, humanos, tieflings e outros povos desenvolveram suas tradições. O Descobrimento dos Povos abriu caminhos para a exploração e o contato entre diferentes culturas, mas também trouxe disputas.</p>
          <p>Entre 150 A.P. e 50 A.P., a Guerra das Fronteiras Verdes colocou elfos e outros povos de Verdantia em conflito por terras e valores.</p>
        </article></li>
        <li><article>
          <p class="era-period">1 D.P. → 1.000 D.P.</p>
          <h4>Era da Pacificação</h4>
          <p>A Guerra das Fronteiras Verdes terminou em 50 A.P., mas deixou desconfiança e animosidades. Cerca de cinquenta anos depois, representantes de diversos reinos assinaram o Pacto de Aurora Magna, em 1 D.P., abrindo um período de paz e cooperação.</p>
          <p>Humanos e halflings tiveram papéis fundamentais na mediação dos conflitos. Embora algumas feridas permanecessem, o pacto inaugurou um novo entendimento entre os povos e tornou-se o marco do calendário de Eldorion.</p>
        </article></li>
        <li><article>
          <p class="era-period">1.000 D.P. → 1.350 D.P.</p>
          <h4>Era das Trevas</h4>
          <p>Em 1.000 D.P., os primeiros sinais do Flagelo de Tiamat inauguraram o Crepúsculo do Milênio. Heróis de vários povos, armados com artefatos divinos, enfrentaram e selaram a ameaça.</p>
          <div class="era-phases"><p><strong>Crepúsculo do Milênio · 1.000–1.130 D.P.</strong>Período marcado pela manifestação do Flagelo e pela luta contra a ameaça.</p><p><strong>As Trevas Persistem · 1.130–1.350 D.P.</strong>Mesmo após a vitória, cultos, corrupção e dificuldades de sobrevivência continuaram a assolar o mundo.</p></div>
        </article></li>
        <li><article>
          <p class="era-period">1.350 D.P. → 1.615 D.P.</p>
          <h4>Era do Renascimento</h4>
          <p>A reconstrução das cidades acompanhou um florescimento da cultura, da magia e da tecnologia. Novas invenções transformaram a vida cotidiana, enquanto o avanço trouxe desafios que exigiam equilíbrio entre prosperidade e ética.</p>
        </article></li>
        <li class="era-current"><article>
          <p class="era-period">1.615 D.P. → Atualidade · 1.826 D.P.</p>
          <h4>Era da Prosperidade</h4>
          <p>Eldorion vive um período de metrópoles vibrantes e grande diversidade cultural. Dentro desta era, a Época de Ouro começou em 1.750 D.P. e se estende até o presente.</p>
          <p>Após as provações do passado, a religião ganhou força. Templos e clérigos de divindades benevolentes florescem nas cidades, enquanto o progresso abre novas possibilidades e alimenta debates sobre o futuro.</p>
        </article></li>
      </ol>
    </section>
    <section class="history-block" aria-labelledby="present-title">
      <p class="eyebrow">Viver em 1.826 D.P.</p>
      <h3 id="present-title">Os desafios da Época de Ouro</h3>
      <div class="history-topics">
        <article><h4>Trabalho e autômatos</h4><p>A criação de autômatos mágicos amplia a automação e provoca debates sobre a substituição da mão de obra.</p></article>
        <article><h4>Progresso e natureza</h4><p>O desenvolvimento tecnológico desenfreado coloca as questões ambientais no centro das discussões políticas.</p></article>
        <article><h4>Memória e cultura</h4><p>Preservar a arte, a história e as heranças culturais dos povos do passado é um dos desafios da prosperidade atual.</p></article>
      </div>
    </section>`;
}
