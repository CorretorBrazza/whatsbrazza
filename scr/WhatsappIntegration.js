class WhatsappIntegration {
    constructor(estadoManager) {
        this.estadoManager = estadoManager;
        this.setupMutationObserver();
    }

    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    async enviarMensagem(texto) {
        try {
            const inputField = await this.encontrarCampoDeEntrada();
            if (!inputField) {
                console.error("Campo de entrada não encontrado");
                return false;
            }

            inputField.focus();

            if (document.execCommand) {
                document.execCommand('insertText', false, texto);
            }
            else {
                const originalValue = inputField.textContent;
                inputField.textContent = texto;

                const inputEvent = new Event('input', { bubbles: true });
                inputField.dispatchEvent(inputEvent);
            }

            if (this.estadoManager.envioAutomatico) {
                await this.enviarMensagemAutomaticamente(inputField);
            }

            return true;
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            return false;
        }
    }

    async encontrarCampoDeEntrada(maxTentativas = 5) {
        return new Promise((resolve) => {
            let tentativas = 0;

            const checar = () => {
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

    async enviarMensagemAutomaticamente(inputField) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const enterEvent = new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true,
                    cancelable: true
                });

                inputField.dispatchEvent(enterEvent);
                resolve(true);
            }, 500);
        });
    }
}
export default WhatsappIntegration;