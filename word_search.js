document.addEventListener('DOMContentLoaded', () => {
    const wordSearchActivity = {
        data: ['sol', 'lua', 'casa', 'bola', 'gato', 'flor', 'doce', 'pato', 'dedo', 'faca', 'amor', 'feliz', 'peixe', 'livro'],
        config: { gridSize: 8, alphabet: 'abcdefghijklmnopqrstuvwxyz' },
        state: {
            grid: [], wordsToFind: [],
            isSelecting: false, selection: [],
            foundWords: []
        },
        elements: {
            screen: document.getElementById('word-search-activity'),
            grid: document.getElementById('word-search-grid'),
            list: document.getElementById('word-search-list'),
            resetButton: document.getElementById('word-search-reset-button'),
        },
        start() {
            this.elements.grid.innerHTML = '';
            this.elements.list.innerHTML = '';
            this.state.foundWords = [];
            this.state.selection = [];
            this.state.wordsToFind = utils.shuffleArray(this.data).slice(0, 4); // Pega 4 palavras aleatórias
            this.generateGrid();
            this.renderGrid();
            this.renderWordList();
            this.elements.resetButton.onclick = () => this.start();
        },
        generateGrid() {
            this.state.grid = Array(this.config.gridSize).fill(null).map(() => Array(this.config.gridSize).fill(null));
            
            this.state.wordsToFind.forEach(word => {
                let placed = false;
                while (!placed) {
                    const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
                    const row = Math.floor(Math.random() * this.config.gridSize);
                    const col = Math.floor(Math.random() * this.config.gridSize);

                    if (this.canPlaceWord(word, row, col, direction)) {
                        for (let i = 0; i < word.length; i++) {
                            if (direction === 'horizontal') this.state.grid[row][col + i] = word[i];
                            else this.state.grid[row + i][col] = word[i];
                        }
                        placed = true;
                    }
                }
            });

            for (let r = 0; r < this.config.gridSize; r++) {
                for (let c = 0; c < this.config.gridSize; c++) {
                    if (this.state.grid[r][c] === null) {
                        this.state.grid[r][c] = this.config.alphabet[Math.floor(Math.random() * this.config.alphabet.length)];
                    }
                }
            }
        },
        canPlaceWord(word, row, col, direction) {
            if (direction === 'horizontal') {
                if (col + word.length > this.config.gridSize) return false;
                for (let i = 0; i < word.length; i++) if (this.state.grid[row][col + i] !== null) return false;
            } else {
                if (row + word.length > this.config.gridSize) return false;
                for (let i = 0; i < word.length; i++) if (this.state.grid[row + i][col] !== null) return false;
            }
            return true;
        },
        renderGrid() {
            this.elements.grid.innerHTML = ''; // Limpa o grid antes de renderizar
            for (let r = 0; r < this.config.gridSize; r++) {
                for (let c = 0; c < this.config.gridSize; c++) {
                    const cell = document.createElement('div');
                    cell.textContent = this.state.grid[r][c];
                    cell.dataset.row = r;
                    cell.dataset.col = c;
                    cell.addEventListener('mousedown', () => this.startSelection(cell));
                    cell.addEventListener('mouseover', () => this.dragSelection(cell));
                    this.elements.grid.appendChild(cell);
                }
            }
            // Adiciona um listener para parar a seleção quando o mouse for solto em qualquer lugar
            document.addEventListener('mouseup', () => this.endSelection(), { once: true });
        },
        renderWordList() {
            this.state.wordsToFind.forEach(word => {
                const li = document.createElement('li');
                li.textContent = word;
                li.id = `word-${word}`;
                this.elements.list.appendChild(li);
            });
        },
        startSelection(cell) {
            this.state.isSelecting = true;
            this.state.selection = [cell];
            cell.classList.add('selected');
        },
        dragSelection(cell) {
            if (this.state.isSelecting && !this.state.selection.includes(cell)) {
                this.state.selection.push(cell);
                cell.classList.add('selected');
            }
        },
        endSelection() {
            this.state.isSelecting = false;
            const selectedWord = this.state.selection.map(c => c.textContent).join('');
            const foundWord = this.state.wordsToFind.find(w => (w === selectedWord || w === [...selectedWord].reverse().join('')) && !this.state.foundWords.includes(w));
            
            if (foundWord) {
                this.state.foundWords.push(foundWord);
                this.state.selection.forEach(c => c.classList.add('found'));
                document.getElementById(`word-${foundWord}`).classList.add('found');
                scoreManager.increase();
                soundManager.play('correct');
            }

            // Limpa a seleção visual
            this.elements.grid.querySelectorAll('.selected').forEach(c => c.classList.remove('selected'));
            this.state.selection = [];
        }
    };

    // --- INICIALIZAÇÃO ---
    musicManager.init();
    scoreManager.updateDisplay();
    wordSearchActivity.start();
});