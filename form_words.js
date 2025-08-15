document.addEventListener('DOMContentLoaded', () => {
    const wordFormationActivity = {
        data: [
            { palavra: "bola", silabas: ["bo", "la"] }, { palavra: "macaco", silabas: ["ma", "ca", "co"] },
            { palavra: "sapato", silabas: ["sa", "pa", "to"] }, { palavra: "gato", silabas: ["ga", "to"] },
            { palavra: "janela", silabas: ["ja", "ne", "la"] }, { palavra: "cavalo", silabas: ["ca", "va", "lo"] },
            { palavra: "tomate", silabas: ["to", "ma", "te"] }, { palavra: "peteca", silabas: ["pe", "te", "ca"] },
            { palavra: "caneta", silabas: ["ca", "ne", "ta"] }, { palavra: "fivela", silabas: ["fi", "ve", "la"] }
        ],
        state: { currentWord: null, userAnswer: [] },
        elements: {
            screen: document.getElementById('form-words-activity'),
            options: document.getElementById('syllable-options'),
            answer: document.getElementById('word-formation-answer'),
            feedback: document.getElementById('word-formation-feedback'),
            clearButton: document.getElementById('word-formation-clear-button'),
            nextButton: document.getElementById('word-formation-next-button'),
        },
        start() {
            this.newRound();
            this.elements.clearButton.onclick = () => this.clearAnswer();
            this.elements.nextButton.onclick = () => this.newRound();
        },
        newRound() {
            this.state.currentWord = this.data[Math.floor(Math.random() * this.data.length)];
            const shuffledSyllables = utils.shuffleArray(this.state.currentWord.silabas);
            this.elements.options.innerHTML = '';
            shuffledSyllables.forEach(syllable => {
                const button = document.createElement('button');
                button.textContent = syllable;
                button.onclick = () => this.selectSyllable(button);
                this.elements.options.appendChild(button);
            });
            this.clearAnswer();
            this.elements.feedback.textContent = '';
            this.elements.feedback.className = 'result-box';
            this.elements.nextButton.classList.add('hidden');
            this.elements.clearButton.classList.remove('hidden');
        },
        selectSyllable(button) {
            this.state.userAnswer.push(button.textContent);
            this.elements.answer.textContent = this.state.userAnswer.join('');
            button.disabled = true;
            if (this.state.userAnswer.length === this.state.currentWord.silabas.length) {
                this.checkAnswer();
            }
        },
        checkAnswer() {
            const formedWord = this.state.userAnswer.join('');
            if (formedWord === this.state.currentWord.palavra) {
                this.elements.feedback.textContent = '🎉 Muito bem, você conseguiu! 🎉';
                this.elements.feedback.classList.add('correct');
                scoreManager.increase();
                soundManager.play('correct');
            } else {
                this.elements.feedback.textContent = `❌ Ops! A palavra certa era "${this.state.currentWord.palavra}".`;
                this.elements.feedback.classList.add('incorrect');
                soundManager.play('incorrect');
            }
            this.elements.nextButton.classList.remove('hidden');
            this.elements.clearButton.classList.add('hidden');
        },
        clearAnswer() {
            this.state.userAnswer = [];
            this.elements.answer.textContent = '';
            Array.from(this.elements.options.children).forEach(button => button.disabled = false);
        }
    };

    // --- INICIALIZAÇÃO ---
    musicManager.init();
    scoreManager.updateDisplay();
    wordFormationActivity.start();
});