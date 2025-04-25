(function () {
  // Módulo de gerenciamento de estado
  class EstadoManager {
    constructor() {
      this.categorias = [];
      this.envioAutomatico = false;
      this.carregarEstado();
    }
  
    // Gera IDs únicos baseados em timestamp + random para evitar colisões
    gerarId() {
      return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
  
    // Salva o estado atual no localStorage
    salvarEstado() {
      try {
        localStorage.setItem('categorias', JSON.stringify(this.categorias));
        localStorage.setItem('envioAutomatico', String(this.envioAutomatico));
        console.log("Estado salvo com sucesso:", { 
          categorias: this.categorias, 
          envioAutomatico: this.envioAutomatico 
        });
      } catch (error) {
        console.error("Erro ao salvar estado:", error);
      }
    }
  
    // Carrega o estado do localStorage
    carregarEstado() {
      console.log("Carregando estado...");
      
      try {
        // Carrega as categorias
        const categoriasSalvas = localStorage.getItem('categorias');
        if (categoriasSalvas) {
          this.categorias = JSON.parse(categoriasSalvas) || [];
          
          // Validação de dados
          this.categorias = this.categorias.map(categoria => {
            return {
              ...categoria,
              mensagens: Array.isArray(categoria.mensagens) ? categoria.mensagens : []
            };
          });
        }
        
        // Carrega a configuração de envio automático
        const envioAutomaticoSalvo = localStorage.getItem('envioAutomatico');
        this.envioAutomatico = envioAutomaticoSalvo === "true";
        
        console.log("Estado carregado:", {
          categorias: this.categorias,
          envioAutomatico: this.envioAutomatico
        });
      } catch (error) {
        console.error("Erro ao carregar estado:", error);
        this.resetarDados();
      }
    }
  
    // Reset completo dos dados
    resetarDados() {
      localStorage.removeItem('categorias');
      localStorage.removeItem('envioAutomatico');
      this.categorias = [];
      this.envioAutomatico = false;
      console.log("Dados resetados com sucesso!");
    }
  
    // Adiciona uma nova categoria
    adicionarCategoria(nome, cor = "#e91e63") {
      const novaCategoria = {
        id: this.gerarId(),
        nome,
        cor,
        mensagens: [],
        dataCriacao: new Date().toISOString(),
        ultimaModificacao: new Date().toISOString()
      };
      
      this.categorias.push(novaCategoria);
      this.salvarEstado();
      return novaCategoria;
    }
  
    // Atualiza uma categoria existente
    atualizarCategoria(id, novosDados) {
      const index = this.categorias.findIndex(c => c.id === id);
      if (index !== -1) {
        this.categorias[index] = {
          ...this.categorias[index],
          ...novosDados,
          ultimaModificacao: new Date().toISOString()
        };
        this.salvarEstado();
        return true;
      }
      return false;
    }
  
    // Remove uma categoria
    removerCategoria(id) {
      const categoriaAnterior = this.categorias.length;
      this.categorias = this.categorias.filter(c => c.id !== id);
      
      if (categoriaAnterior !== this.categorias.length) {
        this.salvarEstado();
        return true;
      }
      return false;
    }
  
    // Adiciona uma mensagem a uma categoria
    adicionarMensagem(nome, cor = "#e91e63") {
      const novaCategoria = {
        id: this.gerarId(),
        nome,
        cor,
        mensagens: [],
        dataCriacao: new Date().toISOString(),
        ultimaModificacao: new Date().toISOString()
      };
      
      this.categorias.push(novaCategoria);
      this.salvarEstado();
      return novaCategoria;
    }
  
    // Atualiza uma categoria existente
    atualizarCategoria(id, novosDados) {
      const index = this.categorias.findIndex(c => c.id === id);
      if (index !== -1) {
        this.categorias[index] = {
          ...this.categorias[index],
          ...novosDados,
          ultimaModificacao: new Date().toISOString()
        };
        this.salvarEstado();
        return true;
      }
      return false;
    }
  
    // Remove uma categoria
    removerCategoria(id) {
      const categoriaAnterior = this.categorias.length;
      this.categorias = this.categorias.filter(c => c.id !== id);
      
      if (categoriaAnterior !== this.categorias.length) {
        this.salvarEstado();
        return true;
      }
      return false;
    }
  
    // Adiciona uma mensagem a uma categoria
    adicionarMensagem(categoriaId, texto) {
      const categoriaIndex = this.categorias.findIndex(c => c.id === categoriaId);
      if (categoriaIndex !== -1) {
        const novaMensagem = {
          id: this.gerarId(),
          texto,
          dataCriacao: new Date().toISOString(),
          contagemUso: 0
        };
        
        this.categorias[categoriaIndex].mensagens.push(novaMensagem);
        this.categorias[categoriaIndex].ultimaModificacao = new Date().toISOString();
        this.salvarEstado();
        return novaMensagem;
      }
      return null;
    }
  
    // Atualiza uma mensagem existente
    atualizarMensagem(categoriaId, mensagemId, novoTexto) {
      const categoriaIndex = this.categorias.findIndex(c => c.id === categoriaId);
      if (categoriaIndex !== -1) {
        const mensagemIndex = this.categorias[categoriaIndex].mensagens.findIndex(m => m.id === mensagemId);
        if (mensagemIndex !== -1) {
          this.categorias[categoriaIndex].mensagens[mensagemIndex].texto = novoTexto;
          this.categorias[categoriaIndex].mensagens[mensagemIndex].ultimaModificacao = new Date().toISOString();
          this.categorias[categoriaIndex].ultimaModificacao = new Date().toISOString();
          this.salvarEstado();
          return true;
        }
      }
      return false;
    }
  
    // Remove uma mensagem
    removerMensagem(categoriaId, mensagemId) {
      const categoriaIndex = this.categorias.findIndex(c => c.id === categoriaId);
      if (categoriaIndex !== -1) {
        const mensagensAnteriores = this.categorias[categoriaIndex].mensagens.length;
        this.categorias[categoriaIndex].mensagens = this.categorias[categoriaIndex].mensagens.filter(m => m.id !== mensagemId);
        
        if (mensagensAnteriores !== this.categorias[categoriaIndex].mensagens.length) {
          this.categorias[categoriaIndex].ultimaModificacao = new Date().toISOString();
          this.salvarEstado();
          return true;
        }
      }
      return false;
    }
  
    // Registra uso de uma mensagem
    registrarUsoMensagem(categoriaId, mensagemId) {
      const categoriaIndex = this.categorias.findIndex(c => c.id === categoriaId);
      if (categoriaIndex !== -1) {
        const mensagemIndex = this.categorias[categoriaIndex].mensagens.findIndex(m => m.id === mensagemId);
        if (mensagemIndex !== -1) {
          this.categorias[categoriaIndex].mensagens[mensagemIndex].contagemUso = 
            (this.categorias[categoriaIndex].mensagens[mensagemIndex].contagemUso || 0) + 1;
          this.categorias[categoriaIndex].mensagens[mensagemIndex].ultimoUso = new Date().toISOString();
          this.salvarEstado();
          return true;
        }
      }
      return false;
    }
  
    // Define o estado de envio automático
    setEnvioAutomatico(valor) {
      this.envioAutomatico = valor;
      this.salvarEstado();
    }
  }
  
  // Módulo de Interface do Usuário
  class InterfaceUI {
    constructor(estadoManager, whatsappIntegration) {
      this.estadoManager = estadoManager;
      this.whatsappIntegration = whatsappIntegration;
      this.container = null;
      this.categoriasContainer = null;
      this.envioAutomaticoCheckbox = null;
      this.temaEscuro = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      this.inicializar();
      this.aplicarTema();
    }
  
    // Cria e insere o container principal da extensão
    inicializar() {
      // Cria o container principal
      this.container = document.createElement('div');
      this.container.id = 'brazza-whats-extensao';
      this.container.className = 'extensao-container';
      
      // Adiciona o HTML inicial
      this.container.innerHTML = `
        <div class="extensao-header">
          <span>Brazza Whats</span>
          <div class="header-controls">
            <button id="minimizar-extensao" title="Minimizar/Maximizar" aria-label="Minimizar">➖</button>
            <button id="alternar-tema" title="Alternar Tema Claro/Escuro" aria-label="Alternar Tema">🌓</button>
          </div>
        </div>
        <div id="extensao-body">
          <div id="opcoes-container">
            <div class="opcao-item">
              <label for="envio-automatico">
                <input type="checkbox" id="envio-automatico" aria-label="Ativar envio automático" />
                <span>Envio Automático</span>
              </label>
            </div>
            <div class="opcao-item">
              <div class="configuracoes-container">
                <button class="action-btn configuracoes-btn" id="configuracoes-btn" aria-label="Configurações">⚙️ Configurações</button>
                <div id="configuracoes-opcoes" class="configuracoes-dropdown">
                  <button class="action-btn exportar-btn" id="exportar-dados" aria-label="Exportar dados">📤 Exportar</button>
                  <button class="action-btn importar-btn" id="importar-dados" aria-label="Importar dados">📥 Importar</button>
                  <button class="action-btn reset-btn" id="reset-dados" aria-label="Resetar dados">🗑️ Resetar</button>
                </div>
              </div>
            </div>
          </div>
          <div id="categorias-container">
            <div id="botoes-container">
              <button class="criar-btn" id="criar-categoria" aria-label="Criar nova categoria">Criar Categoria</button>
            </div>
            <div id="lista-categorias"></div>
          </div>
        </div>
      `;
      
      // Adiciona o container ao corpo do documento
      document.body.appendChild(this.container);
      
      // Armazena referências para elementos importantes
      this.categoriasContainer = document.getElementById('lista-categorias');
      this.envioAutomaticoCheckbox = document.getElementById('envio-automatico');
      
      // Configura eventos iniciais
      this.configurarEventos();
      
      // Cria elementos da UI com base no estado carregado
      this.renderizarEstadoAtual();
    }
  
    // Configura os eventos dos elementos da UI
    configurarEventos() {
        const configuracoesBtn = document.getElementById('configuracoes-btn');
        const configuracoesOpcoes = document.getElementById('configuracoes-opcoes');
      // Evento de checkbox de envio automático
      this.envioAutomaticoCheckbox.checked = this.estadoManager.envioAutomatico;
      this.envioAutomaticoCheckbox.addEventListener('change', () => {
        this.estadoManager.setEnvioAutomatico(this.envioAutomaticoCheckbox.checked);
      });
      
      // Evento do botão de criar categoria
      document.getElementById('criar-categoria').addEventListener('click', () => {
        this.promptCriarCategoria();
      });
      
      configuracoesBtn.addEventListener('click', () => {
              console.log('Botão de configurações clicado!'); // VERIFICAÇÃO
              if (configuracoesOpcoes.style.display === 'none') {
                  configuracoesOpcoes.style.display = 'flex';
                  console.log('Dropdown aberto.'); // VERIFICAÇÃO
              } else {
                  configuracoesOpcoes.style.display = 'none';
                  console.log('Dropdown fechado.'); // VERIFICAÇÃO
              }
          });
      
      // Evento do botão de resetar dados
      document.getElementById('reset-dados').addEventListener('click', () => {
        if (confirm('Tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita.')) {
          this.estadoManager.resetarDados();
          this.renderizarEstadoAtual();
        }
      });
      
      // Evento do botão minimizar/maximizar
      document.getElementById('minimizar-extensao').addEventListener('click', () => {
        const body = document.getElementById('extensao-body');
        if (body.style.display === 'none') {
          body.style.display = 'block';
          document.getElementById('minimizar-extensao').textContent = '➖';
        } else {
          body.style.display = 'none';
          document.getElementById('minimizar-extensao').textContent = '➕';
        }
      });
      
      // Evento do botão alternar tema
      document.getElementById('alternar-tema').addEventListener('click', () => {
        this.temaEscuro = !this.temaEscuro;
        this.aplicarTema();
      });
      
      // Evento do botão exportar dados
      document.getElementById('exportar-dados').addEventListener('click', () => {
        this.exportarDados();
      });
      
      // Evento do botão importar dados
      document.getElementById('importar-dados').addEventListener('click', () => {
        this.importarDados();
      });
     
      // Adiciona suporte para teclas de atalho
      document.addEventListener('keydown', (e) => {
        // Ctrl+Shift+B para mostrar/ocultar a extensão
        if (e.ctrlKey && e.shiftKey && e.key === 'B') {
          this.container.style.display = this.container.style.display === 'none' ? 'block' : 'none';
          e.preventDefault();
        }
      });
    }
  
    // Aplica tema claro ou escuro
    aplicarTema() {
      if (this.temaEscuro) {
        this.container.classList.add('tema-escuro');
      } else {
        this.container.classList.remove('tema-escuro');
      }
    }
  
    // Renderiza o estado atual completo
    renderizarEstadoAtual() {
      // Limpa o container de categorias
      this.categoriasContainer.innerHTML = '';
      
      // Renderiza cada categoria
      this.estadoManager.categorias.forEach(categoria => {
        this.renderizarCategoria(categoria);
      });
    }
  
    // Renderiza uma categoria e suas mensagens
    renderizarCategoria(categoria) {
      const categoriaElement = document.createElement('div');
      categoriaElement.className = 'categoria';
      categoriaElement.setAttribute('data-id', categoria.id);
      categoriaElement.setAttribute('data-cor', categoria.cor);
      
      categoriaElement.innerHTML = `
        <div class="categoria-header" style="border-left: 4px solid ${categoria.cor}">
          <span class="titulo">${this.sanitizarHTML(categoria.nome)}</span>
          <div class="icones">
            <button class="editar" title="Editar Categoria" aria-label="Editar categoria ${categoria.nome}">⚙️</button>
            <button class="excluir" title="Excluir Categoria" aria-label="Excluir categoria ${categoria.nome}">❌</button>
            <button class="expandir" title="Expandir/Recolher Categoria" aria-label="Expandir categoria ${categoria.nome}">🔽</button>
          </div>
        </div>
        <div class="categoria-mensagens" id="${categoria.id}-mensagens">
          <button class="criar-btn criar-mensagem" data-categoria-id="${categoria.id}" aria-label="Criar mensagem na categoria ${categoria.nome}">Criar Mensagem</button>
        </div>
      `;
      
      this.categoriasContainer.appendChild(categoriaElement);
      
      // Obtém referência para o container de mensagens
      const mensagensContainer = categoriaElement.querySelector(`#${categoria.id}-mensagens`);
      
      // Configura eventos da categoria
      this.configurarEventosCategoria(categoriaElement, categoria);
      
      // Renderiza as mensagens da categoria
      categoria.mensagens.forEach(mensagem => {
        this.renderizarMensagem(mensagem, mensagensContainer, categoria.id);
      });
    }
  
    // Configura eventos para uma categoria
    configurarEventosCategoria(categoriaElement, categoria) {
      const mensagensContainer = categoriaElement.querySelector(`#${categoria.id}-mensagens`);
      
      // Evento de expandir/recolher
      categoriaElement.querySelector('.expandir').addEventListener('click', (e) => {
        if (mensagensContainer.style.display === 'none') {
          mensagensContainer.style.display = 'block';
          e.target.textContent = '🔽';
        } else {
          mensagensContainer.style.display = 'none';
          e.target.textContent = '▶️';
        }
      });
      
      // Evento de editar categoria
      categoriaElement.querySelector('.editar').addEventListener('click', () => {
        this.promptEditarCategoria(categoria);
      });
      
      // Evento de excluir categoria
      categoriaElement.querySelector('.excluir').addEventListener('click', () => {
        this.confirmarExclusaoCategoria(categoria);
      });
      
      // Evento de criar mensagem
      categoriaElement.querySelector('.criar-mensagem').addEventListener('click', () => {
        this.promptCriarMensagem(categoria.id);
      });
    }
  
    // Renderiza uma mensagem
    renderizarMensagem(mensagem, container, categoriaId) {
      const mensagemElement = document.createElement('div');
      mensagemElement.className = 'mensagem';
      mensagemElement.setAttribute('data-id', mensagem.id);
      
      // Conta de uso para ordenação e estatísticas
      const contagem = mensagem.contagemUso || 0;
      
      mensagemElement.innerHTML = `
        <div class="texto-container">
          <span class="texto">${this.sanitizarHTML(mensagem.texto)}</span>
          ${contagem > 0 ? `<span class="badge-uso" title="Utilizada ${contagem} vezes">${contagem}</span>` : ''}
        </div>
        <div class="icones">
          <button class="editar" title="Editar Mensagem" aria-label="Editar mensagem">✏️</button>
          <button class="excluir" title="Excluir Mensagem" aria-label="Excluir mensagem">❌</button>
          <button class="enviar" title="Enviar Mensagem" aria-label="Enviar mensagem">📤</button>
        </div>
      `;
      
      container.appendChild(mensagemElement);
      
      // Configura eventos da mensagem
      this.configurarEventosMensagem(mensagemElement, mensagem, categoriaId);
    }
  
    // Configura eventos para uma mensagem
    configurarEventosMensagem(mensagemElement, mensagem, categoriaId) {
      // Evento de editar mensagem
      mensagemElement.querySelector('.editar').addEventListener('click', () => {
        this.promptEditarMensagem(mensagem, categoriaId);
      });
      
      // Evento de excluir mensagem
      mensagemElement.querySelector('.excluir').addEventListener('click', () => {
        this.confirmarExclusaoMensagem(mensagem, categoriaId);
      });
      
      // Evento de enviar mensagem
      mensagemElement.querySelector('.enviar').addEventListener('click', () => {
        this.whatsappIntegration.enviarMensagem(mensagem.texto);
        this.estadoManager.registrarUsoMensagem(categoriaId, mensagem.id);
        
        // Feedback visual
        mensagemElement.classList.add('mensagem-enviada');
        setTimeout(() => {
          mensagemElement.classList.remove('mensagem-enviada');
        }, 1000);
        
        // Atualiza o contador de uso se existir
        const badge = mensagemElement.querySelector('.badge-uso');
        if (badge) {
          const novoValor = parseInt(badge.textContent) + 1;
          badge.textContent = novoValor;
          badge.title = `Utilizada ${novoValor} vezes`;
        } else {
          const textoContainer = mensagemElement.querySelector('.texto-container');
          const novaBadge = document.createElement('span');
          novaBadge.className = 'badge-uso';
          novaBadge.title = 'Utilizada 1 vez';
          novaBadge.textContent = '1';
          textoContainer.appendChild(novaBadge);
        }
      });
    }
  
    // Sanitiza strings HTML para prevenir XSS
    sanitizarHTML(texto) {
      const element = document.createElement('div');
      element.textContent = texto;
      return element.innerHTML;
    }
  
    // Prompt para criar categoria
    promptCriarCategoria() {
      const nome = prompt('Nome da Categoria:');
      if (nome && nome.trim()) {
        const cores = ['#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#009688', '#4caf50', '#ff9800', '#795548'];
        const corAleatoria = cores[Math.floor(Math.random() * cores.length)];
        
        const novaCategoria = this.estadoManager.adicionarCategoria(nome.trim(), corAleatoria);
        this.renderizarCategoria(novaCategoria);
      }
    }
  
    // Prompt para editar categoria
    promptEditarCategoria(categoria) {
      const novoNome = prompt('Editar Nome da Categoria:', categoria.nome);
      if (novoNome && novoNome.trim()) {
        const categoriaElement = document.querySelector(`[data-id="${categoria.id}"]`);
        if (categoriaElement) {
          categoriaElement.querySelector('.titulo').textContent = novoNome.trim();
          this.estadoManager.atualizarCategoria(categoria.id, { nome: novoNome.trim() });
        }
      }
    }
  
    // Confirmação para excluir categoria
    confirmarExclusaoCategoria(categoria) {
      if (confirm(`Deseja realmente excluir a categoria "${categoria.nome}" e todas as suas mensagens?`)) {
        const categoriaElement = document.querySelector(`[data-id="${categoria.id}"]`);
        if (categoriaElement) {
          this.categoriasContainer.removeChild(categoriaElement);
          this.estadoManager.removerCategoria(categoria.id);
        }
      }
    }
  
    // Prompt para criar mensagem
    promptCriarMensagem(categoriaId) {
      const texto = prompt('Texto da Mensagem:');
      if (texto && texto.trim()) {
        const mensagensContainer = document.getElementById(`${categoriaId}-mensagens`);
        const novaMensagem = this.estadoManager.adicionarMensagem(categoriaId, texto.trim());
        
        if (novaMensagem && mensagensContainer) {
          this.renderizarMensagem(novaMensagem, mensagensContainer, categoriaId);
        }
      }
    }
  
    // Prompt para editar mensagem
    promptEditarMensagem(mensagem, categoriaId) {
      const novoTexto = prompt('Editar Texto da Mensagem:', mensagem.texto);
      if (novoTexto && novoTexto.trim()) {
        const mensagemElement = document.querySelector(`[data-id="${mensagem.id}"]`);
        if (mensagemElement) {
          mensagemElement.querySelector('.texto').textContent = novoTexto.trim();
          this.estadoManager.atualizarMensagem(categoriaId, mensagem.id, novoTexto.trim());
        }
      }
    }
  
    // Confirmação para excluir mensagem
    confirmarExclusaoMensagem(mensagem, categoriaId) {
      if (confirm('Deseja realmente excluir esta mensagem?')) {
        const mensagemElement = document.querySelector(`[data-id="${mensagem.id}"]`);
        if (mensagemElement) {
          mensagemElement.parentNode.removeChild(mensagemElement);
          this.estadoManager.removerMensagem(categoriaId, mensagem.id);
        }
      }
    }
  
    // Exportar dados para arquivo JSON
    exportarDados() {
      const dados = {
        categorias: this.estadoManager.categorias,
        envioAutomatico: this.estadoManager.envioAutomatico,
        versao: '2.0',
        dataExportacao: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `brazza-whats-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  
    // Importar dados de arquivo JSON
    importarDados() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const dados = JSON.parse(event.target.result);
            
            if (dados && dados.categorias && Array.isArray(dados.categorias)) {
              if (confirm('Deseja substituir todos os dados atuais pelos dados importados?')) {
                this.estadoManager.categorias = dados.categorias;
                
                if (typeof dados.envioAutomatico === 'boolean') {
                  this.estadoManager.envioAutomatico = dados.envioAutomatico;
                  this.envioAutomaticoCheckbox.checked = dados.envioAutomatico;
                }
                
                this.estadoManager.salvarEstado();
                this.renderizarEstadoAtual();
                
                alert('Dados importados com sucesso!');
              }
            } else {
              alert('O arquivo selecionado não contém dados válidos.');
            }
          } catch (error) {
            console.error('Erro ao importar dados:', error);
            alert('Erro ao processar o arquivo. Verifique se é um arquivo JSON válido.');
          }
        };
        
        reader.readAsText(file);
      };
      
      input.click();
    }
  
    // Filtra mensagens com base em um termo de pesquisa
    filtrarMensagens(termo) {
      const categorias = document.querySelectorAll('.categoria');
      
      if (!termo) {
        // Quando não há termo de pesquisa, mostra todas as categorias
        categorias.forEach(categoria => {
          categoria.style.display = 'block';
          const mensagens = categoria.querySelectorAll('.mensagem');
          mensagens.forEach(mensagem => {
            mensagem.style.display = 'flex';
          });
        });
        return;
      }
      
      categorias.forEach(categoria => {
        let temMensagemVisivel = false;
        const mensagens = categoria.querySelectorAll('.mensagem');
        
        mensagens.forEach(mensagem => {
          const texto = mensagem.querySelector('.texto').textContent.toLowerCase();
          if (texto.includes(termo)) {
            mensagem.style.display = 'flex';
            mensagem.classList.add('highlight-search');
            temMensagemVisivel = true;
          } else {
            mensagem.style.display = 'none';
            mensagem.classList.remove('highlight-search');
          }
        });
        
        // Mostra ou oculta a categoria inteira com base em se tem mensagens visíveis
        categoria.style.display = temMensagemVisivel ? 'block' : 'none';
      });
    }
  }
  
  // Módulo de integração com WhatsApp
  class WhatsappIntegration {
    constructor(estadoManager) {
      this.estadoManager = estadoManager;
      this.setupMutationObserver();
    }
  
    // Configura um observer para detectar mudanças na interface do WhatsApp
    setupMutationObserver() {
      const observer = new MutationObserver((mutations) => {
        // Exemplo de reação a mudanças na interface do WhatsApp
        // Isto pode ser expandido conforme necessário
      });
      
      // Observa mudanças no corpo do documento
      observer.observe(document.body, { 
        childList: true, 
        subtree: true 
      });
    }
  
    // Envia mensagem para o campo de texto do WhatsApp
    async enviarMensagem(texto) {
      try {
        // Tenta encontrar o campo de entrada do WhatsApp
        const inputField = await this.encontrarCampoDeEntrada();
        if (!inputField) {
          console.error("Campo de entrada não encontrado");
          return false;
        }
        
        // Foca no campo
        inputField.focus();
        
        // Método 1: Usando execCommand (deprecado mas ainda funcionando)
        if (document.execCommand) {
          document.execCommand('insertText', false, texto);
        } 
        // Método 2: Usando eventos de input diretos
        else {
          // Simula digitação
          const originalValue = inputField.textContent;
          inputField.textContent = texto;
          
          // Dispara evento de input para que o WhatsApp saiba que o conteúdo mudou
          const inputEvent = new Event('input', { bubbles: true });
          inputField.dispatchEvent(inputEvent);
        }
        
        // Se envio automático estiver ativado, envia a mensagem
        if (this.estadoManager.envioAutomatico) {
          await this.enviarMensagemAutomaticamente(inputField);
        }
        
        return true;
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        return false;
      }
    }
  
    // Encontra o campo de entrada do WhatsApp com tentativas múltiplas
    async encontrarCampoDeEntrada(maxTentativas = 5) {
      return new Promise((resolve) => {
        let tentativas = 0;
        
        const checar = () => {
          // Seletores comuns para o campo de entrada do WhatsApp Web
          const seletores = [
            'footer div[contenteditable="true"]',
            'div[data-tab="1"] div[contenteditable="true"]',
            'div.selectable-text[contenteditable="true"]',
            'div[role="textbox"][contenteditable="true"]'
          ];
          
          for (const seletor of seletores) {
            const campo = document.querySelector(seletor);
            if (campo) {
              resolve(campo);
              return;
            }
          }
          
          tentativas++;
          if (tentativas < maxTentativas) {
            setTimeout(checar, 500);
          } else {
            resolve(null);
          }
        };
        
        checar();
      });
    }
  // Envia a mensagem automaticamente simulando o pressionamento da tecla Enter
  async enviarMensagemAutomaticamente(inputField) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Cria evento de tecla para simular o pressionamento de Enter
        const enterEvent = new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          keyCode: 13,
          which: 13,
          bubbles: true,
          cancelable: true
        });
        
        // Dispara o evento
        inputField.dispatchEvent(enterEvent);
        resolve(true);
      }, 500);
    });
  }
  }
  
  // Detector de tema do sistema
  class TemaDetector {
  constructor(ui) {
    this.ui = ui;
    this.inicializar();
  }
  
  inicializar() {
    // Verifica se o sistema está em modo escuro inicialmente
    const prefereEscuro = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Configura detector de mudanças no tema do sistema
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', (e) => {
        this.ui.temaEscuro = e.matches;
        this.ui.aplicarTema();
      });
    }
  }
  }
  
  // Inicialização da aplicação
  function inicializarExtensao() {
  // Verifica se já existe uma instância da extensão para evitar duplicação
  if (document.getElementById('brazza-whats-extensao')) {
    console.log('Extensão já inicializada, abortando...');
    return;
  }
  
  console.log('Inicializando Brazza Whats...');
  
  // Cria e inicializa os módulos
  const estadoManager = new EstadoManager();
  const whatsappIntegration = new WhatsappIntegration(estadoManager);
  const ui = new InterfaceUI(estadoManager, whatsappIntegration);
  const temaDetector = new TemaDetector(ui);
  
  console.log('Brazza Whats inicializado com sucesso!');
  
  // Adiciona estilos dinâmicos para temas e animações
  adicionarEstilosDinamicos();
  }
  
  // Função para adicionar estilos dinâmicos via JavaScript
  function adicionarEstilosDinamicos() {
  const estilos = document.createElement('style');
  estilos.textContent = `
    /* Animações */
    @keyframes mensagemEnviada {
      0% { background-color: rgba(76, 175, 80, 0.1); }
      50% { background-color: rgba(76, 175, 80, 0.