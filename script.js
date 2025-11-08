// Função para buscar foto na API da Câmara (mesma que você já usa)
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

    const projeto = dados.projetos[0]; // aqui pegamos o PL 1904/2024
    const todosDeputados = [];

    for (const partido in projeto.votos) {
      projeto.votos[partido].forEach(nome => {
        todosDeputados.push({
          nome,
          partido,
          estado: "",
          votou_a_favor: [projeto.titulo],
          votou_contra: []
        });
      });
    }

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
      resumo: "Propõe equiparar o aborto após 22 semanas ao crime de homicídio, exceto em casos previstos em lei.",
      link: "projetos/pl1904.html"
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

  // contador para evitar race conditions: incrementa a cada input
  let searchCounter = 0;
  // debounce timer
  let debounceTimer = null;

  buscaInput.addEventListener('input', () => {
    // debounce curto para reduzir chamadas enquanto o usuário digita rápido
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => handleSearch(), 120);
  });

  async function handleSearch() {
    const termo = buscaInput.value.trim().toLowerCase();
    // marcar nova busca
    searchCounter++;
    const localSearchId = searchCounter;

    // quando campo vazio: mostra projetos e limpa resultados imediatos
    if (termo.length === 0) {
      projetosSection.style.display = 'block';
      resultadosDiv.innerHTML = '<p>Comece digitando um nome acima para ver como o deputado votou.</p>';
      return;
    }

    // esconder projetos (como hoje)
    projetosSection.style.display = 'none';
    resultadosDiv.innerHTML = ''; // limpa resultados antigos

    // filtra localmente (igual sua lógica)
    const encontrados = deputados.filter(dep => dep.nome.toLowerCase().includes(termo));

    if (encontrados.length === 0) {
      // antes de escrever, checa se a busca ainda é a última
      if (localSearchId !== searchCounter) return;
      resultadosDiv.innerHTML = '<p>Nenhum deputado encontrado.</p>';
      return;
    }

    // percorre encontrados; usamos for..of pra poder await a foto
    for (const dep of encontrados) {
      // se durante o processamento o usuário digitou outra coisa, interrompe
      if (localSearchId !== searchCounter) return;

      // busca a foto (pode demorar)
      const fotoUrl = await buscarFotoDeputado(dep.nome);

      // checa de novo depois do await — se não for a busca atual, aborta
      if (localSearchId !== searchCounter) return;

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
              ${dep.votou_a_favor.map(pl => `<li>✅ ${pl}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;

      // antes de inserir, cheque novamente para evitar race
      if (localSearchId !== searchCounter) return;
      resultadosDiv.appendChild(bloco);
    }
  }
});
