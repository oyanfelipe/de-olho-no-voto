async function buscarFotoDeputado(nome) {
  try {
    const resposta = await fetch(`https://dadosabertos.camara.leg.br/api/v2/deputados?nome=${encodeURIComponent(nome)}`);
    const dados = await resposta.json();
    if (dados.dados.length > 0) {
      const id = dados.dados[0].id;
      return `https://www.camara.leg.br/internet/deputado/band