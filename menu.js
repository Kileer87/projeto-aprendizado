document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos do DOM ---
    const openNameBuilderBtn = document.getElementById('open-name-builder-btn');
    const nameBuilderContainer = document.getElementById('name-builder-container');
    const nameDisplay = document.getElementById('interactive-name-display');
    const keyboardContainer = document.getElementById('interactive-keyboard');
    const welcomeGreeting = document.getElementById('welcome-greeting');

    let currentName = '';

    // --- Funções ---

    /**
     * Carrega o nome do usuário do localStorage e atualiza a saudação.
     */
    const loadUserName = () => {
        // Usa o playerManager centralizado do common.js
        const savedName = playerManager.getName();
        if (savedName) {
            welcomeGreeting.textContent = `Bem-vindo(a), ${savedName}!`;
            // Altera o texto do botão se o nome já existe
            openNameBuilderBtn.textContent = 'Quer trocar o seu nome?';
        }
    };

    /**
     * Gera o teclado interativo.
     */
    const createKeyboard = () => {
        // Layout do teclado (simplificado)
        const keys = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('');
        
        keyboardContainer.innerHTML = ''; // Limpa o teclado antes de criar

        keys.forEach(key => {
            const keyElement = document.createElement('button');
            keyElement.textContent = key;
            keyElement.classList.add('key');
            keyElement.dataset.key = key;
            // Adicionado para garantir que o texto da tecla seja visível.
            keyElement.style.color = '#333';
            keyboardContainer.appendChild(keyElement);
        });

        // Adiciona botões especiais
        const backspaceKey = document.createElement('button');
        backspaceKey.textContent = 'Apagar';
        backspaceKey.classList.add('key', 'key-special');
        backspaceKey.dataset.key = 'BACKSPACE';
        // Adicionado para garantir que o texto da tecla seja visível.
        backspaceKey.style.color = '#333';
        keyboardContainer.appendChild(backspaceKey);

        const saveKey = document.createElement('button');
        saveKey.textContent = 'Salvar Nome';
        saveKey.classList.add('key', 'key-save');
        saveKey.dataset.key = 'SAVE';
        // Adicionado para garantir que o texto da tecla seja visível (branco para contraste).
        saveKey.style.color = '#fff';
        keyboardContainer.appendChild(saveKey);
    };

    /**
     * Atualiza o display do nome.
     */
    const updateNameDisplay = () => {
        nameDisplay.textContent = currentName || '...';
    };

    /**
     * Salva o nome no localStorage e atualiza a UI.
     */
    const saveName = () => {
        if (currentName.trim()) {
            const oldName = playerManager.getName();
            const newName = currentName.trim();

            // Zera a pontuação se o nome for novo ou diferente do anterior.
            if (oldName !== newName) {
                scoreManager.reset();
            }

            playerManager.saveName(newName);
            welcomeGreeting.textContent = `Bem-vindo(a), ${newName}!`;
            nameBuilderContainer.classList.add('hidden');
            openNameBuilderBtn.textContent = 'Quer trocar o seu nome?';
        } else {
            // Opcional: dar feedback se o nome estiver vazio
            nameDisplay.textContent = 'Digite um nome!';
            setTimeout(() => {
                updateNameDisplay();
            }, 1500);
        }
    };

    // --- Event Listeners ---

    // Abrir/Fechar o construtor de nome
    openNameBuilderBtn.addEventListener('click', () => {
        const isHidden = nameBuilderContainer.classList.toggle('hidden');
        
        if (!isHidden && keyboardContainer.innerHTML === '') {
            createKeyboard();
        }
        currentName = '';
        updateNameDisplay();
    });

    // Lidar com cliques no teclado (delegação de evento)
    keyboardContainer.addEventListener('click', (e) => {
        if (!e.target.matches('.key[data-key]')) return;

        const key = e.target.dataset.key;

        if (key === 'BACKSPACE') {
            currentName = currentName.slice(0, -1);
        } else if (key === 'SAVE') {
            saveName();
        } else if (currentName.length < 15) {
            currentName += key;
        }
        updateNameDisplay();
    });

    // --- Inicialização ---
    // Garante que os módulos comuns (música, pontuação) sejam iniciados na página principal
    musicManager.init();
    scoreManager.updateDisplay();

    loadUserName();
});