// =======================================
// Módulo de Deputados - Busca de dados
// =======================================

// Cache global de deputados eleitos
let deputadosEleitos = [];

// Função para buscar todos os deputados eleitos
async function buscarDeputadosEleitos() {
  try {
    const resp = await fetch('https://dadosabertos.camara.leg.br/api/v2/deputados?ordem=ASC&ordenarPor=nome');
    if (!resp.ok) throw new Error('Erro ao consultar API da Câmara');
    const json = await resp.json();

    if (json.dados && json.dados.length > 0) {
      deputadosEleitos = json.dados.map(dep => ({
        id: dep.id,
        nome: dep.nome,
        siglaPartido: dep.siglaPartido,
        uf: dep.uf
      }));
      console.log(`✓ ${deputadosEleitos.length} deputados carregados da API`);
      return deputadosEleitos;
    }
  } catch (err) {
    console.error('Erro ao buscar deputados eleitos:', err);
  }
  return [];
}

// Função para validar se um deputado existe na lista oficial
function verificarDeputadoExiste(nome) {
  if (deputadosEleitos.length === 0) return null;
  return deputadosEleitos.find(dep => 
    dep.nome.toLowerCase() === nome.toLowerCase()
  );
}

// Função para buscar deputado com fuzzy search
function buscarDeputadoFuzzy(termo) {
  if (deputadosEleitos.length === 0) return [];
  return deputadosEleitos.filter(dep =>
    dep.nome.toLowerCase().includes(termo.toLowerCase())
  );
}
