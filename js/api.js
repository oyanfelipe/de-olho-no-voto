// =======================================
// Módulo de API - Requisições de dados
// =======================================

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
