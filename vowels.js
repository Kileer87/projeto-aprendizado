document.addEventListener('DOMContentLoaded', () => {
    const vowelsActivity = {
        data: [
            { palavra: "gato", emoji: "🐈" }, { palavra: "bola", emoji: "⚽" }, { palavra: "casa", emoji: "🏠" },
            { palavra: "sol", emoji: "☀️" }, { palavra: "lua", emoji: "🌙" }, { palavra: "peixe", emoji: "🐟" },
            { palavra: "livro", emoji: "📚" }, { palavra: "fogo", emoji: "🔥" }, { palavra: "doce", emoji: "🍬" },
            { palavra: "pato", emoji: "🦆" }, { palavra: "dado", emoji: "🎲" }, { palavra: "pipa", emoji: "🪁" }
        ],
        state: { currentWord: null, missingVowels: [], userAnswer: [] },
        elements: {
            screen: document.getElementById('vowels-activity'),
            image: document.getElementById('vowel-game-image'),
            word: document.getElementById('vowel-game-word'),
            options: document.getElementById('vowel-game-options'),
            feedback: document.getElementById('vowel-game-feedback'),
            nextButton: document.getElementById('vowel-game-next-button'),
        },
        start() {
            this.newRound();
            this.elements.nextButton.onclick = () => this.newRound();
        },
        newRound() {
            this.state.currentWord = this.data[Math.floor(Math.random() * this.data.length)];
            this.state.missingVowels = [];
            this.state.userAnswer = [];
            const vowels = "aeiou";
            let wordWithBlanks = "";
            for (const char of this.state.currentWord.palavra) {
                if (vowels.includes(utils.normalizeChar(char))) {
                    wordWithBlanks += "_";
                    this.state.missingVowels.push(char);
                } else {
                    wordWithBlanks += char;
                }
            }
            this.elements.image.textContent = this.state.currentWord.emoji;
            this.elements.word.textContent = wordWithBlanks.toUpperCase();
            this.elements.feedback.textContent = '';
            this.elements.feedback.className = 'result-box';
            this.elements.nextButton.classList.add('hidden');
            this.elements.options.innerHTML = '';
            vowels.split('').forEach(vowel => {
                const button = document.createElement('button');
                button.textContent = vowel.toUpperCase();
                button.onclick = () => this.selectVowel(vowel);
                this.elements.options.appendChild(button);
            });
        },
        selectVowel(vowel) {
            if (this.state.userAnswer.length >= this.state.missingVowels.length) return;
            this.state.userAnswer.push(vowel);
            this.elements.word.textContent = this.elements.word.textContent.replace('_', vowel.toUpperCase());
            if (this.state.userAnswer.length === this.state.missingVowels.length) {
                this.checkAnswer();
            }
        },
        checkAnswer() {
            // Compara os arrays de vogais como strings para simplificar
            if (JSON.stringify(this.state.userAnswer) === JSON.stringify(this.state.missingVowels)) {
                this.elements.feedback.textContent = '🎉 Perfeito! Você acertou! 🎉';
                this.elements.feedback.classList.add('correct');
                scoreManager.increase();
                soundManager.play('correct');
            } else {
                this.elements.feedback.textContent = `❌ Quase! A palavra certa era "${this.state.currentWord.palavra.toUpperCase()}".`;
                this.elements.feedback.classList.add('incorrect');
                soundManager.play('incorrect');
            }
            this.elements.nextButton.classList.remove('hidden');
            Array.from(this.elements.options.children).forEach(button => button.disabled = true);
        }
    };

    musicManager.init();
    scoreManager.updateDisplay();
    vowelsActivity.start();
});