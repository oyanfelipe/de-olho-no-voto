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
document.addEventListener('DOMContentLoaded', () => {
  const menu = document.getElementById('menu');

  if (!menu) return;

  const pontoDeAtivacao = menu.offsetTop;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
      menu.classList.add('floating');
    } else {
      menu.classList.remove('floating');
    }
  });
});
