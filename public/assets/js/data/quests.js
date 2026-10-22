// Diário público da campanha. Edite aqui e publique o arquivo atualizado.
// O progresso é definido pelo mestre, não pelo navegador dos jogadores.
const campaignQuests = [];

/* Modelo: copie o objeto para dentro de campaignQuests e substitua os textos.
{
  id: 'missao-001',                 // Identificador único e permanente.
  title: 'Título da missão',
  type: 'principal',               // principal ou secundaria
  status: 'ativa',                 // ativa ou concluida
  summary: 'Resumo completo da missão, descobertas e próximos passos.',
  lastSession: 'Sessão 1 · 22/10/2026',
  contact: null,                   // Texto do contato, ou null para ocultar.
  location: 'Aurora Magna',         // Nome exato de um local do mapa, ou ''.
  objectives: [
    { text: 'Primeiro objetivo', done: true },
    { text: 'Próximo passo do grupo', done: false }
  ],
  reward: null                     // Texto da recompensa, ou null para ocultar.
}
*/
