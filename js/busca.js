// =======================================
// Módulo de Busca - Lógica de pesquisa
// =======================================

class BuscaDeputados {
  constructor(deputados, buscaInput, resultadosDiv, projetosSection) {
    this.deputados = deputados;
    this.buscaInput = buscaInput;
    this.resultadosDiv = resultadosDiv;
    this.projetosSection = projetosSection;
    this.searchCounter = 0;
    this.debounceTimer = null;

    this.init();
  }

  init() {
    this.buscaInput.addEventListener('input', () => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => this.handleSearch(), 120);
    });
  }

  async handleSearch() {
    const termo = this.buscaInput.value.trim().toLowerCase();
    this.searchCounter++;
    const localSearchId = this.searchCounter;

    if (termo.length === 0) {
      this.mostrarProjetos();
      return;
    }

    this.ocultarProjetos();
    this.resultadosDiv.innerHTML = '';

    // Busca entre os deputados com registros de votação
    // Prioriza: começa com o termo, depois contém o termo
    const encontrados = this.deputados
      .filter(dep => dep.nome.toLowerCase().includes(termo))
      .sort((a, b) => {
        const nomeA = a.nome.toLowerCase();
        const nomeB = b.nome.toLowerCase();
        
        // Se um começa com o termo e o outro não, o que começa vem primeiro
        const aComeca = nomeA.startsWith(termo);
        const bComeca = nomeB.startsWith(termo);
        
        if (aComeca && !bComeca) return -1;
        if (!aComeca && bComeca) return 1;
        
        // Se ambos começam ou ambos não começam, ordena alfabeticamente
        return nomeA.localeCompare(nomeB);
      });

    // Se não encontrou nos projetos, busca na lista oficial
    if (encontrados.length === 0) {
      if (localSearchId !== this.searchCounter) return;
      
      const deputadosOfficiais = buscarDeputadoFuzzy(termo);
      
      if (deputadosOfficiais.length > 0) {
        // Encontrou deputados na lista oficial mas sem votações registradas
        for (const dep of deputadosOfficiais) {
          if (localSearchId !== this.searchCounter) return;
          
          const fotoUrl = await buscarFotoDeputado(dep.nome);
          if (localSearchId !== this.searchCounter) return;
          
          this.adicionarResultadoSemVotacoes(dep, fotoUrl);
        }
      } else {
        // Nenhum deputado encontrado
        this.resultadosDiv.innerHTML = `
          <div class="alerta-erro">
            <p>❌ Nenhum deputado encontrado com <strong>"${termo.trim()}"</strong>.</p>
            <p style="margin-top: 10px; font-size: 0.9em; color: #666;">Tente novamente com outro termo.</p>
          </div>
        `;
      }
      return;
    }

    for (const dep of encontrados) {
      if (localSearchId !== this.searchCounter) return;

      const fotoUrl = await buscarFotoDeputado(dep.nome);
      if (localSearchId !== this.searchCounter) return;

      this.adicionarResultado(dep, fotoUrl);
    }
  }

  adicionarResultado(dep, fotoUrl) {
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

    this.resultadosDiv.appendChild(bloco);
  }

  adicionarResultadoSemVotacoes(dep, fotoUrl) {
    const bloco = document.createElement('div');
    bloco.classList.add('deputado');
    bloco.innerHTML = `
      <div class="deputado-card">
        <img src="${fotoUrl}" alt="Foto de ${dep.nome}" onerror="this.src='imagens/default.jpg'">
        <div class="deputado-info">
          <h2>${dep.nome}</h2>
          <p><strong>Partido:</strong> ${dep.siglaPartido}</p>
          <p><strong>Estado:</strong> ${dep.uf}</p>
          <div class="aviso-sem-votacoes">
            <p>🔍 Este deputado não possui votações registradas nos projetos em destaque do site.</p>
          </div>
        </div>
      </div>
    `;

    this.resultadosDiv.appendChild(bloco);
  }

  mostrarProjetos() {
    this.projetosSection.style.display = 'block';
    this.resultadosDiv.classList.remove('ativo');
    this.resultadosDiv.innerHTML = '<p>Comece digitando um nome acima para ver como o deputado votou.</p>';
  }

  ocultarProjetos() {
    this.resultadosDiv.classList.add('ativo');
    this.projetosSection.style.display = 'none';
  }
}
