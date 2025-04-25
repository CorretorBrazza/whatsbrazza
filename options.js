document.addEventListener('DOMContentLoaded', function () {
    // Carrega as configurações salvas
    carregarConfiguracoes();

    // Adiciona eventos aos botões
    document.getElementById('salvar-config').addEventListener('click', salvarConfiguracoes);
    document.getElementById('cancelar').addEventListener('click', cancelarConfiguracoes);

    function salvarConfiguracoes() {
        const envioAutomatico = document.getElementById('envio-automatico').checked;
        const minimizarAoIniciar = document.getElementById('minimizar-ao-iniciar').checked;
        const tempoDelay = document.getElementById('tempo-delay').value;
        const posicao = document.getElementById('posicao').value;
        const tema = document.getElementById('tema').value;
        const corPrincipal = document.querySelector('.color-option.selected').dataset.color;
        const atalhosHabilitados = document.getElementById('atalhos-habilitados').checked;

        chrome.storage.sync.set({
            envioAutomatico,
            minimizarAoIniciar,
            tempoDelay,
            posicao,
            tema,
            corPrincipal,
            atalhosHabilitados
        }, function () {
            alert('Configurações salvas com sucesso!');
        });
    }

    function carregarConfiguracoes() {
        chrome.storage.sync.get({
            envioAutomatico: false,
            minimizarAoIniciar: false,
            tempoDelay: 500,
            posicao: 'top-right',
            tema: 'auto',
            corPrincipal: '#007bff',
            atalhosHabilitados: true
        }, function (items) {
            document.getElementById('envio-automatico').checked = items.envioAutomatico;
            document.getElementById('minimizar-ao-iniciar').checked = items.minimizarAoIniciar;
            document.getElementById('tempo-delay').value = items.tempoDelay;
            document.getElementById('posicao').value = items.posicao;
            document.getElementById('tema').value = items.tema;
            selecionarCor(items.corPrincipal);
            document.getElementById('atalhos-habilitados').checked = items.atalhosHabilitados;
        });
    }

    function cancelarConfiguracoes() {
        // Recarrega as configurações salvas (desfaz as alterações)
        carregarConfiguracoes();
        alert('Alterações canceladas!');
    }

    // Eventos para o seletor de cores
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function () {
            selecionarCor(this.dataset.color);
        });
    });

    function selecionarCor(color) {
        document.querySelectorAll('.color-option').forEach(opt => {
            opt.classList.remove('selected');
            if (opt.dataset.color === color) {
                opt.classList.add('selected');
            }
        });
    }
});