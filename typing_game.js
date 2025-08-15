document.addEventListener('DOMContentLoaded', () => {
    const typingGameActivity = {
        data: {
            facil: [
                { name: 'sol', emoji: '☀️' }, { name: 'lua', emoji: '🌙' }, { name: 'gato', emoji: '🐈' },
                { name: 'bola', emoji: '⚽' }, { name: 'casa', emoji: '🏠' }, { name: 'pão', emoji: '🍞' },
                { name: 'flor', emoji: '🌸' }, { name: 'rei', emoji: '👑' }
            ],
            medio: [
                { name: 'macaco', emoji: '🐒' }, { name: 'cavalo', emoji: '🐎' }, { name: 'sapato', emoji: '👞' },
                { name: 'janela', emoji: '🪟' }, { name: 'peixe', emoji: '🐟' }, { name: "relógio", emoji: "⏰" },
                { name: 'foguete', emoji: '🚀' }, { name: 'castelo', emoji: '🏰' }
            ],
            dificil: [
                { name: 'elefante', emoji: '🐘' }, { name: 'bicicleta', emoji: '🚲' }, { name: 'helicóptero', emoji: '🚁' },
                { name: 'computador', emoji: '💻' }, { name: 'borboleta', emoji: '🦋' }, { name: 'dinossauro', emoji: '🦖' },
                { name: 'astronauta', emoji: '🧑‍🚀' }, { name: 'microscópio', emoji: '🔬' }
            ]
        },
        state: { currentLevel: null, currentWord: null },
        elements: {
            screen: document.getElementById('typing-game-activity'),
            levelSelection: document.getElementById('typing-game-level-selection'),
            levelButtons: document.getElementById('typing-game-level-buttons'),
            gameArea: document.getElementById('typing-game-area'),
            image: document.getElementById('typing-game-image'),
            input: document.getElementById('typing-game-input'),
            checkButton: document.getElementById('typing-game-check-button'),
            feedback: document.getElementById('typing-game-feedback'),
            nextButton: document.getElementById('typing-game-next-button'),
        },
        start() {
            this.elements.gameArea.classList.add('hidden');
            this.elements.levelSelection.classList.remove('hidden');
            this.state.currentLevel = null;
            
            this.elements.levelButtons.onclick = (event) => {
                const level = event.target.dataset.level;
                if (level) {
                    this.startLevel(level);
                }
            };

            this.elements.checkButton.onclick = () => this.checkAnswer();
            this.elements.nextButton.onclick = () => this.newRound();
            
            // Permite pressionar Enter para verificar a resposta
            this.elements.input.addEventListener('keyup', (event) => {
                if (event.key === 'Enter' && !this.elements.checkButton.classList.contains('hidden')) {
                    this.checkAnswer();
                }
            });
        },
        startLevel(level) {
            this.state.currentLevel = level;
            this.elements.levelSelection.classList.add('hidden');
            this.elements.gameArea.classList.remove('hidden');
            this.newRound();
        },
        newRound() {
            if (!this.state.currentLevel) return;
            const words = this.data[this.state.currentLevel];
            this.state.currentWord = words[Math.floor(Math.random() * words.length)];
            
            this.elements.image.textContent = this.state.currentWord.emoji;
            this.elements.input.value = '';
            this.elements.input.disabled = false;
            this.elements.feedback.textContent = '';
            this.elements.feedback.className = 'result-box';
            this.elements.checkButton.classList.remove('hidden');
            this.elements.nextButton.classList.add('hidden');
            this.elements.input.focus();
        },
        checkAnswer() {
            // Não verifica se a resposta já foi checada
            if (this.elements.input.disabled) return;

            const userAnswer = utils.normalizeChar(this.elements.input.value.trim());
            const correctAnswer = utils.normalizeChar(this.state.currentWord.name);

            if (userAnswer === correctAnswer) {
                this.elements.feedback.textContent = '🏆 Excelente! Você acertou! 🏆';
                this.elements.feedback.classList.add('correct');
                scoreManager.increase();
                soundManager.play('correct');
            } else {
                this.elements.feedback.textContent = `❌ Não foi dessa vez. A resposta era "${this.state.currentWord.name}".`;
                this.elements.feedback.classList.add('incorrect');
                soundManager.play('incorrect');
            }
            this.elements.input.disabled = true;
            this.elements.checkButton.classList.add('hidden');
            this.elements.nextButton.classList.remove('hidden');
        }
    };

    // --- INICIALIZAÇÃO ---
    musicManager.init();
    scoreManager.updateDisplay();
    typingGameActivity.start();
});