/*

encontrados.forEach(async dep => {
  const bloco = document.createElement('div');
  bloco.classList.add('deputado');

  // Busca a imagem da API
  const fotoUrl = await buscarFotoDeputado(dep.nome);

  bloco.innerHTML = `
    <div class="foto-container">
      <img src="${fotoUrl || 'assets/imagens/placeholder.png'}" 
           alt="Foto de ${dep.nome}" 
           class="foto-deputado">
    </div>
    <h2>${dep.nome}</h2>
    <p><strong>Partido:</strong> ${dep.partido}</p>
    <h3>Votou a favor de:</h3>
    <ul class="lista-votos">
      ${dep.votou_a_favor.map(pl => `<li>✅ ${pl}</li>`).join('')}
    </ul>
  `;

  resultadosDiv.appendChild(bloco);
});

*/

const menu = document.getElementById('menu');
const header = document.getElementById('topo');

window.addEventListener('scroll', () => {
  const headerBottom = header.getBoundingClientRect().bottom;

  if (headerBottom <= 0) {
    menu.classList.add('floating');
  } else {
    menu.classList.remove('floating');
  }
});