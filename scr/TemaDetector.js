class TemaDetector {
    constructor(ui) {
        this.ui = ui;
        this.inicializar();
    }

    inicializar() {
        const prefereEscuro = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                this.ui.temaEscuro = e.matches;
                this.ui.aplicarTema();
            });
        }
    }
}
export default TemaDetector;