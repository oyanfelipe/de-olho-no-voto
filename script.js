// Função para buscar foto na API da Câmara
async function buscarFotoDeputado(nome) {
  try {
    const resp = await fetch(`https://dadosabertos.camara.leg.br/api/v2/deputados?nome=${encodeURIComponent(nome)}`);
    if (!resp.ok) throw new Error('Erro ao consultar API da Câmara');
    const json = await resp.json();

    if (json.dados && json.dados.length > 0) {
      const id = json.dados[0].id;
      return `https://www.camara.leg.br/internet/deputado/bandep/${id}.jpg`;
    } else {
      return 'imagens/default.jpg';
    }
  } catch (err) {
    console.error('Erro buscarFotoDeputado:', err);
    return 'imagens/default.jpg';
  }
}

async function carregarDeputados() {
  try {
    const resposta = await fetch('dados.json');
    if (!resposta.ok) throw new Error('Erro ao carregar dados.');
    const dados = await resposta.json();

    const todosDeputados = [];

    // percorre todos os projetos do JSON
    dados.projetos.forEach(projeto => {
      for (const partido in projeto.votos) {
        projeto.votos[partido].forEach(nome => {
          let dep = todosDeputados.find(d => d.nome === nome);

          if (!dep) {
            dep = {
              nome,
              partido,
              estado: "",
              votou_a_favor: [],
              votou_contra: []
            };
            todosDeputados.push(dep);
          }

          dep.votou_a_favor.push({
            titulo: projeto.titulo,
            descricao: projeto.descricao,
            link: projeto.link
          });
        });
      }
    });

    return todosDeputados;
  } catch (erro) {
    console.error('Erro ao carregar deputados:', erro);
    document.getElementById('resultados').innerHTML = `
      <p>⚠️ Não foi possível carregar os dados no momento. 
      Tente novamente mais tarde.</p>`;
    return [];
  }
}

function carregarProjetos() {
  const lista = document.getElementById('lista-projetos');
  const projetos = [
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
      resumo: "Propõe alterar as regras do licenciamento ambiental no Brasil, criando modalidades simplificadas de autorização e ampliando o autolicenciamento para determinados empreendimentos. Especialistas alertam que a proposta pode reduzir a fiscalização e aumentar riscos a biomas e comunidades tradicionais. Ficou conhecida como “PL da Devastação”.",
      link: "projetos/pl21592021.html"
    }
  ];

  projetos.forEach(pl => {
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

document.addEventListener('DOMContentLoaded', async () => {
  const buscaInput = document.getElementById('busca');
  const resultadosDiv = document.getElementById('resultados');
  const projetosSection = document.getElementById('projetos');
  const deputados = await carregarDeputados();

  carregarProjetos();

  if (deputados.length === 0) {
    resultadosDiv.innerHTML = "<p>Não há dados disponíveis.</p>";
    return;
  }

  let searchCounter = 0;
  let debounceTimer = null;

  buscaInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => handleSearch(), 120);
  });

  async function handleSearch() {
    const termo = buscaInput.value.trim().toLowerCase();
    searchCounter++;
    const localSearchId = searchCounter;

    if (termo.length === 0) {
      projetosSection.style.display = 'block';
      resultadosDiv.innerHTML = '<p>Comece digitando um nome acima para ver como o deputado votou.</p>';
      return;
    }

    projetosSection.style.display = 'none';
    resultadosDiv.innerHTML = '';

    const encontrados = deputados.filter(dep => dep.nome.toLowerCase().includes(termo));

    if (encontrados.length === 0) {
      if (localSearchId !== searchCounter) return;
      resultadosDiv.innerHTML = '<p>Nenhum deputado encontrado.</p>';
      return;
    }

    for (const dep of encontrados) {
      if (localSearchId !== searchCounter) return;

      const fotoUrl = await buscarFotoDeputado(dep.nome);
      if (localSearchId !== searchCounter) return;

      const projetosHTML = dep.votou_a_favor.map(pl => `
        <li class="projeto-item">
        <p class="projeto-titulo">✅ <strong>${pl.titulo}</strong></p>
        <p class="projeto-descricao">${pl.descricao}</p>
        <a href="${pl.link}">Ver detalhes</a>
        </li>
        `).join('');


      const bloco = document.createElement('div');
      bloco.classList.add('deputado');
      bloco.innerHTML = `
        <div class="deputado-card">
          <img src="${fotoUrl}" alt="Foto de ${dep.nome}" onerror="this.src='imagens/default.jpg'">
          <div class="deputado-info">
            <h2>${dep.nome}</h2>
            <p><strong>Partido:</strong> ${dep.partido}</p>
            <h3>Votou a favor de:</h3>
            <ul class="lista-votos">
              ${projetosHTML}
            </ul>
          </div>
        </div>
      `;

      if (localSearchId !== searchCounter) return;
      resultadosDiv.appendChild(bloco);
    }
  }
});
