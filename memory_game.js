document.addEventListener('DOMContentLoaded', () => {
    const memoryGameActivity = {
        data: [
            { name: 'sol', emoji: '☀️' }, { name: 'lua', emoji: '🌙' },
            { name: 'gato', emoji: '🐈' }, { name: 'cão', emoji: '🐕' },
            { name: 'flor', emoji: '🌸' }, { name: 'casa', emoji: '🏠' },
            { name: 'carro', emoji: '🚗' }, { name: 'árvore', emoji: '🌳' },
            { name: 'maçã', emoji: '🍎' }, { name: 'livro', emoji: '📚' }
        ],
        state: {
            hasFlippedCard: false, lockBoard: false,
            firstCard: null, secondCard: null, matchedPairs: 0,
        },
        elements: {
            screen: document.getElementById('memory-game-activity'),
            grid: document.getElementById('memory-game-board'),
            feedback: document.getElementById('memory-game-feedback'),
            resetButton: document.getElementById('memory-game-reset-button'),
        },
        start() {
            this.resetGame();
            this.elements.resetButton.onclick = () => this.resetGame();
        },
        resetGame() {
            this.state.matchedPairs = 0;
            this.elements.feedback.textContent = '';
            this.elements.resetButton.classList.add('hidden');
            this.createBoard();
        },
        createBoard() {
            this.elements.grid.innerHTML = '';
            // Pega 8 pares aleatórios para um tabuleiro 4x4 consistente
            const gameData = utils.shuffleArray(this.data).slice(0, 8);
            const cardValues = [];
            gameData.forEach(item => {
                cardValues.push({ content: item.emoji, pairId: item.name });
                cardValues.push({ content: item.name, pairId: item.name });
            });

            const shuffledCards = utils.shuffleArray(cardValues);

            shuffledCards.forEach(cardData => {
                const cardElement = document.createElement('div');
                cardElement.classList.add('memory-card');
                cardElement.dataset.pairId = cardData.pairId;

                const frontFace = document.createElement('div');
                frontFace.classList.add('card-face', 'card-front');
                const backFace = document.createElement('div');
                backFace.classList.add('card-face', 'card-back');
                backFace.textContent = cardData.content;

                cardElement.append(frontFace, backFace);
                cardElement.addEventListener('click', () => this.flipCard(cardElement));
                this.elements.grid.appendChild(cardElement);
            });
        },
        flipCard(card) {
            if (this.state.lockBoard || card.classList.contains('is-flipped')) return;
            if (card === this.state.firstCard) return;
            card.classList.add('is-flipped');
            if (!this.state.hasFlippedCard) {
                this.state.hasFlippedCard = true;
                this.state.firstCard = card;
                return;
            }
            this.state.secondCard = card;
            this.checkForMatch();
        },
        checkForMatch() {
            const isMatch = this.state.firstCard.dataset.pairId === this.state.secondCard.dataset.pairId;
            isMatch ? this.disableCards() : this.unflipCards();
        },
        disableCards() {
            this.state.firstCard.classList.add('is-matched');
            this.state.secondCard.classList.add('is-matched');
            this.state.matchedPairs++;
            scoreManager.increase();
            soundManager.play('correct');
            if (this.state.matchedPairs === 8) { // Condição de vitória para 8 pares
                this.elements.feedback.textContent = '🏆 Parabéns! Você encontrou todos os pares! 🏆';
                this.elements.resetButton.classList.remove('hidden');
            }
            this.resetBoardState();
        },
        unflipCards() {
            this.state.lockBoard = true;
            soundManager.play('incorrect');
            setTimeout(() => {
                this.state.firstCard.classList.remove('is-flipped');
                this.state.secondCard.classList.remove('is-flipped');
                this.resetBoardState();
            }, 1200);
        },
        resetBoardState() {
            [this.state.hasFlippedCard, this.state.lockBoard] = [false, false];
            [this.state.firstCard, this.state.secondCard] = [null, null];
        }
    };

    musicManager.init();
    scoreManager.updateDisplay();
    memoryGameActivity.start();
});