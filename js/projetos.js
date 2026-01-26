// =======================================
// Módulo de Projetos
// =======================================

const PROJETOS_DESTAQUE = [
  {
    numero: "PL 1904/2024",
    titulo: "Criminalização do aborto após 22 semanas de gestação",
    resumo: "Propõe alterar o Código Penal para punir com prisão o aborto realizado após 22 semanas de gestação, inclusive em casos de estupro. O projeto também impede campanhas públicas sobre educação sexual e prevenção do casamento infantil.",
    link: "projetos/pl19042024.html"
  },
  {
    numero: "PEC 3/2021",
    titulo: "Alterações nas regras de investigação e prisão de parlamentares",
    resumo: "Propõe que prisões, investigações e processos contra deputados e senadores só pudessem ocorrer com autorização prévia da Casa Legislativa, além de ampliar o foro privilegiado a líderes partidários.",
    link: "projetos/pec32021.html"
  },
  {
    numero: "PL 2.159/2021",
    titulo: "Alterações nas Regras de Licenciamento Ambiental",
    resumo: "Propõe alterar as regras do licenciamento ambiental no Brasil, criando modalidades simplificadas de autorização e ampliando o autolicenciamento para determinados empreendimentos. Especialistas alertam que a proposta pode reduzir a fiscalização e aumentar riscos a biomas e comunidades tradicionais. Ficou conhecida como 'PL da Devastação'.",
    link: "projetos/pl21592021.html"
  }
];

function carregarProjetos() {
  const lista = document.getElementById('lista-projetos');
  
  PROJETOS_DESTAQUE.forEach(pl => {
    const card = document.createElement('div');
    card.classList.add('card-projeto');
    card.innerHTML = `
      <h3>${pl.numero}</h3>
      <p><strong>${pl.titulo}</strong></p>
      <p>${pl.resumo}</p>
      <a href="${pl.link}">Ver detalhes</a>
    `;
    lista.appendChild(card);
  });
}
