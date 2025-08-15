document.addEventListener('DOMContentLoaded', () => {
    const syllablesActivity = {
        data: {
            facil: [{ palavra: "bola", separada: "bo-la" }, { palavra: "casa", separada: "ca-sa" }, { palavra: "gato", separada: "ga-to" }],
            medio: [{ palavra: "janela", separada: "ja-ne-la" }, { palavra: "sapato", separada: "sa-pa-to" }, { palavra: "escola", separada: "es-co-la" }],
            dificil: [{ palavra: "bicicleta", separada: "bi-ci-cle-ta" }, { palavra: "computador", separada: "com-pu-ta-dor" }]
        },
        state: { currentLevel: null },
        elements: {
            screen: document.getElementById('syllables-activity'),
            levelSelection: document.getElementById('syllable-level-selection'),
            levelButtons: document.getElementById('syllable-level-buttons'),
            gameArea: document.getElementById('syllable-game-area'),
            wordDisplay: document.getElementById('syllable-word-display'),
            result: document.getElementById('syllable-result'),
            nextButton: document.getElementById('syllable-next-word-button'),
        },
        start() {
            this.elements.gameArea.classList.add('hidden');
            this.elements.levelSelection.classList.remove('hidden');
            this.state.currentLevel = null;
            this.elements.levelButtons.onclick = (event) => {
                if (event.target.dataset.level) this.startLevel(event.target.dataset.level);
            };
            this.elements.nextButton.onclick = () => this.showNewWord();
        },
        startLevel(level) {
            this.state.currentLevel = level;
            this.elements.levelSelection.classList.add('hidden');
            this.elements.gameArea.classList.remove('hidden');
            this.showNewWord();
        },
        showNewWord() {
            if (!this.state.currentLevel) return;
            const words = this.data[this.state.currentLevel];
            const word = words[Math.floor(Math.random() * words.length)];
            this.elements.wordDisplay.textContent = word.palavra;
            this.elements.result.textContent = word.separada;
            // Esta atividade é de observação, então não incrementa a pontuação.
        }
    };

    // --- INICIALIZAÇÃO ---
    musicManager.init();
    scoreManager.updateDisplay();
    syllablesActivity.start();
});