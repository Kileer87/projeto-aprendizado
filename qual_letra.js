document.addEventListener('DOMContentLoaded', () => {
    const qualLetraActivity = {
        data: [
            { emoji: "🐘", nome: "elefante" }, { emoji: "🦒", nome: "girafa" },
            { emoji: "🐒", nome: "macaco" }, { emoji: "🦁", nome: "leão" }, { emoji: "🐄", nome: "vaca" },
            { emoji: "🐈", nome: "gato" }, { emoji: "🐕", nome: "cachorro" }, { emoji: "🐖", nome: "porco" },
            { emoji: "🐝", nome: "abelha" }, { emoji: "🦉", nome: "coruja" }, { emoji: "🐟", nome: "peixe" },
            { emoji: "🦋", nome: "borboleta" }, { emoji: "🐢", nome: "tartaruga" }, { emoji: "🦓", nome: "zebra" },
            { emoji: "⚽", nome: "bola" }, { emoji: "🏠", nome: "casa" }, { emoji: "🚗", nome: "carro" },
            { emoji: "🌳", nome: "árvore" }, { emoji: "⭐", nome: "estrela" }, { emoji: "🍎", nome: "maçã" },
            { emoji: "🍌", nome: "banana" }, { emoji: "🍇", nome: "uva" }, { emoji: "🍓", nome: "morango" },
            { emoji: "⏰", nome: "relógio" }, { emoji: "📚", nome: "livro" }, { emoji: "✏️", nome: "lápis" },
            { emoji: "1️⃣", nome: "um" }, { emoji: "2️⃣", nome: "dois" }, { emoji: "3️⃣", nome: "três" },
            { emoji: "4️⃣", nome: "quatro" }, { emoji: "5️⃣", nome: "cinco" }
        ],
        state: { currentItem: null }, // Renomeado de currentAnimal para currentItem
        elements: {
            screen: document.getElementById('animals-activity'),
            emoji: document.getElementById('animal-emoji'),
            input: document.getElementById('animal-input'),
            checkButton: document.getElementById('animal-check-button'),
            feedback: document.getElementById('animal-feedback'),
            nextButton: document.getElementById('animal-next-button'),
        },
        start() {
            this.newRound();
            this.elements.checkButton.onclick = () => this.checkAnswer();
            this.elements.nextButton.onclick = () => this.newRound();
        },
        newRound() {
            this.state.currentItem = utils.shuffleArray(this.data)[0]; // Uma forma mais segura de pegar um item aleatório
            this.elements.emoji.textContent = this.state.currentItem.emoji;
            this.elements.feedback.textContent = '';
            this.elements.feedback.className = 'result-box';
            this.elements.input.value = '';
            this.elements.input.disabled = false;
            this.elements.checkButton.classList.remove('hidden');
            this.elements.nextButton.classList.add('hidden');
            this.elements.input.focus();
        },
        checkAnswer() {
            const answer = this.elements.input.value.trim();
            if (!answer) {
                this.elements.feedback.textContent = "Você precisa digitar uma letra!";
                return;
            }
            const correctAnswer = utils.normalizeChar(this.state.currentItem.nome[0]);
            const userAnswer = utils.normalizeChar(answer);

            if (userAnswer === correctAnswer) {
                this.elements.feedback.textContent = `🎉 Isso mesmo! É ${this.state.currentItem.nome.toUpperCase()}!`;
                this.elements.feedback.classList.add('correct');
                scoreManager.increase();
                soundManager.play('correct');
            } else {
                this.elements.feedback.textContent = `❌ Quase! A resposta certa é '${correctAnswer.toUpperCase()}' para ${this.state.currentItem.nome}.`;
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
    qualLetraActivity.start();
});