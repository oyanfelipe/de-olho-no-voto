// =======================================
// Script Principal - Inicialização
// =======================================

document.addEventListener('DOMContentLoaded', async () => {
  const buscaInput = document.getElementById('busca');
  const resultadosDiv = document.getElementById('resultados');
  const projetosSection = document.getElementById('projetos');
  
  // Carrega a lista de deputados eleitos primeiro
  await buscarDeputadosEleitos();
  
  const deputados = await carregarDeputados();
  carregarProjetos();

  if (deputados.length === 0) {
    resultadosDiv.innerHTML = "<p>Não há dados disponíveis.</p>";
    return;
  }

  // Inicializa o sistema de busca
  const buscaDeputados = new BuscaDeputados(deputados, buscaInput, resultadosDiv, projetosSection);

  // Adiciona listeners aos links do menu
  const menuLinks = document.querySelectorAll('.menu a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Limpa a barra de pesquisa
      buscaInput.value = '';
      
      // Mostra os projetos novamente
      buscaDeputados.mostrarProjetos();
    });
  });
});

