async function carregarDeputados() {
  const resposta = await fetch('dados.json');
  const deputados = await resposta.json();
  return deputados;
}

document.addEventListener('DOMContentLoaded', async () => {
  const buscaInput = document.getElementById('busca');
  const resultadosDiv = document.getElementById('resultados');
  const deputados = await carregarDeputados();

  buscaInput.addEventListener('input', () => {
    const termo = buscaInput.value.trim().toLowerCase();
    resultadosDiv.innerHTML = '';

    if (termo.length === 0) {
      resultadosDiv.innerHTML = '<p>Comece digitando um nome acima para ver como o deputado votou.</p>';
      return;
    }

    const encontrados = deputados.filter(dep => dep.nome.toLowerCase().includes(termo));

    if (encontrados.length === 0) {
      resultadosDiv.innerHTML = '<p>Nenhum deputado encontrado.</p>';
      return;
    }

    encontrados.forEach(dep => {
      const bloco = document.createElement('div');
      bloco.classList.add('deputado');

      bloco.innerHTML = `
        <h2>${dep.nome}</h2>
        <p><strong>Partido:</strong> ${dep.partido} - ${dep.estado}</p>
        <h3>Projetos que votou a favor:</h3>
        <ul class="lista-votos">
          ${dep.votou_a_favor.map(pl => `<li>✅ ${pl}</li>`).join('')}
        </ul>
        <h3>Projetos que votou contra:</h3>
        <ul class="lista-votos">
          ${dep.votou_contra.map(pl => `<li>❌ ${pl}</li>`).join('')}
        </ul>
      `;
      resultadosDiv.appendChild(bloco);
    });
  });
});