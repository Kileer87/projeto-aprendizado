// Módulo de Música: Gerencia a música de fundo
const musicManager = {
    config: {
        // ==================================================================
        //   O LUGAR PARA COLOCAR SUA MÚSICA
        //   Basta alterar o nome do arquivo aqui.
        //   Lembre-se de colocar o arquivo na pasta "sounds".
        //   Exemplo: 'sounds/minha-outra-musica.mp3'
        // ==================================================================
        filePath: 'sounds/background-music.mp3'
    },
    audio: null,
    toggleButton: null,
    isPlaying: false,

    init() {
        // Seleciona os elementos aqui, quando o DOM está garantidamente pronto.
        this.audio = document.getElementById('background-music');
        this.toggleButton = document.getElementById('music-toggle-btn');

        console.log("Music Manager: Iniciando...");
        if (!this.audio || !this.toggleButton) {
            console.error("Music Manager: Elemento de áudio ou botão não encontrado no HTML.");
            return;
        }
        this.audio.src = this.config.filePath; // Define a música a partir da configuração
        this.audio.volume = 0.1; // Volume baixo para não atrapalhar
        this.toggleButton.onclick = () => this.toggleMusic();
        
        // Adiciona um listener para o primeiro clique do usuário
        document.body.addEventListener('click', () => {
            console.log("Music Manager: Primeiro clique do usuário detectado. Tentando tocar a música.");
            this.play();
        }, { once: true });

        // Adiciona um listener para verificar se o arquivo de áudio carregou com erro
        this.audio.addEventListener('error', (e) => {
            console.error("Music Manager: OCORREU UM ERRO NO ÁUDIO!");
            console.error("VERIFIQUE: O arquivo 'sounds/background-music.mp3' existe e não está corrompido?");
        });
        console.log("Music Manager: Iniciado com sucesso. Aguardando clique do usuário.");
    },
    toggleMusic() {
        this.isPlaying ? this.pause() : this.play();
    },
    play() {
        if (!this.audio) return;
        if (this.isPlaying) return; // Não tenta tocar se já estiver tocando

        console.log("Music Manager: Função play() chamada.");
        this.audio.play().then(() => {
            console.log("Music Manager: Música tocando com sucesso!");
            this.isPlaying = true;
            this.toggleButton.textContent = '🔇';
        }).catch((error) => {
            console.error("Music Manager: Erro ao tentar tocar a música.", error.message);
        });
    },
    pause() {
        if (!this.audio) return;
        this.audio.pause();
        this.isPlaying = false;
        this.toggleButton.textContent = '🎵';
        console.log("Music Manager: Música pausada.");
    }
};

// Módulo de Som: Gerencia os efeitos sonoros
const soundManager = {
    sounds: {
        correct: new Audio('sounds/correct.mp3'),
        incorrect: new Audio('sounds/incorrect.mp3')
    },
    play(soundName) {
        this.sounds[soundName]?.play().catch(e => console.log("Não foi possível tocar o som."));
    }
};

// Módulo de Pontuação: Gerencia a pontuação do jogador
const scoreManager = {
    score: parseInt(localStorage.getItem('aprendizado-score')) || 0,
    scoreElement: null, // Inicia como nulo
    increase() {
        this.score++;
        localStorage.setItem('aprendizado-score', this.score);
        this.updateDisplay();
        this.checkMilestone();
    },
    reset() {
        this.score = 0;
        localStorage.setItem('aprendizado-score', this.score);
        this.updateDisplay();
    },
    updateDisplay() {
        // Seleciona o elemento na primeira vez que for necessário, garantindo que ele exista.
        if (!this.scoreElement) {
            this.scoreElement = document.getElementById('score-value');
        }
        if (this.scoreElement) {
            this.scoreElement.textContent = this.score;
        }
    },
    checkMilestone() {
        if (this.score > 0 && this.score % 10 === 0) {
            uiManager.showCongratsModal(this.score);
            soundManager.play('correct');
        }
    }
};

// Módulo de UI: Gerencia elementos de UI como modais
const uiManager = {
    congratsModal: null,
    congratsScore: null,
    modalCloseBtn: null,
    showCongratsModal(score) {
        // Seleciona os elementos do modal apenas quando for mostrá-lo.
        if (!this.congratsModal) {
            this.congratsModal = document.getElementById('congrats-modal');
            this.congratsScore = document.getElementById('congrats-score');
            this.modalCloseBtn = document.getElementById('modal-close-btn');
        }

        if (!this.congratsModal) return;
        this.congratsScore.textContent = score;
        this.congratsModal.classList.remove('hidden');
        // Garante que o botão de fechar exista antes de adicionar o evento
        if (this.modalCloseBtn) {
            this.modalCloseBtn.onclick = () => this.congratsModal.classList.add('hidden');
        }
    }
};

// Módulo Utilitário: Funções de ajuda geral
const utils = {
    normalizeChar(char) {
        return char.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    },
    shuffleArray(array) {
        return [...array].sort(() => Math.random() - 0.5);
    }
};

// Módulo do Jogador: Gerencia dados do jogador como o nome
const playerManager = {
    name: localStorage.getItem('aprendizado-playerName') || '',
    saveName(newName) {
        this.name = newName;
        localStorage.setItem('aprendizado-playerName', newName);
    },
    getName() {
        return this.name;
    }
};
