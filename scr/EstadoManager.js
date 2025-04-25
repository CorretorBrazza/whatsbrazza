class EstadoManager {
    constructor() {
        this.categorias = [];
        this.envioAutomatico = false;
        this.carregarEstado();
    }

    gerarId() {
        return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    async salvarEstado() {
        try {
            await localStorage.setItem('categorias', JSON.stringify(this.categorias));
            await localStorage.setItem('envioAutomatico', String(this.envioAutomatico));
            console.log("Estado salvo com sucesso:", {
                categorias: this.categorias,
                envioAutomatico: this.envioAutomatico
            });
        } catch (error) {
            console.error("Erro ao salvar estado:", error);
        }
    }

    async carregarEstado() {
        console.log("Carregando estado...");
        try {
            const categoriasSalvas = await localStorage.getItem('categorias');
            this.categorias = categoriasSalvas ? JSON.parse(categoriasSalvas) : [];
            this.categorias = this.categorias.map(categoria => ({
                ...categoria,
                mensagens: Array.isArray(categoria.mensagens) ? categoria.mensagens : []
            }));
            const envioAutomaticoSalvo = await localStorage.getItem('envioAutomatico');
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

    resetarDados() {
        localStorage.removeItem('categorias');
        localStorage.removeItem('envioAutomatico');
        this.categorias = [];
        this.envioAutomatico = false;
        console.log("Dados resetados com sucesso!");
    }

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

    removerCategoria(id) {
        const categoriaAnterior = this.categorias.length;
        this.categorias = this.categorias.filter(c => c.id !== id);
        if (categoriaAnterior !== this.categorias.length) {
            this.salvarEstado();
            return true;
        }
        return false;
    }

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

    setEnvioAutomatico(valor) {
        this.envioAutomatico = valor;
        this.salvarEstado();
    }
}

export default EstadoManager;