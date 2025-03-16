// Animação das barras de habilidades
document.addEventListener('DOMContentLoaded', () => {
    const skillLevels = document.querySelectorAll('.skill-level');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const level = entry.target.getAttribute('data-level');
                entry.target.style.setProperty('--width', `${level}%`);
            }
        });
    }, { threshold: 0.5 });

    skillLevels.forEach(skill => observer.observe(skill));

    // Menu lateral
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;
    
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Impede que o clique se propague
        menuToggle.classList.toggle('active');
        sidebar.classList.toggle('active');
        body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            sidebar.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        const clickedOutsideSidebar = !sidebar.contains(e.target);
        const clickedOutsideToggle = !menuToggle.contains(e.target);
        const isMenuActive = sidebar.classList.contains('active');

        if (clickedOutsideSidebar && clickedOutsideToggle && isMenuActive) {
            menuToggle.classList.remove('active');
            sidebar.classList.remove('active');
            body.style.overflow = '';
        }
    });
});

// Smooth scroll para as âncoras
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
    // Jogo da Velha
    const gameBoard = document.getElementById('game-board');
    const cells = document.querySelectorAll('.cell');
    const gameStatus = document.getElementById('game-status');
    const difficultySelect = document.getElementById('difficulty');
    const restartButton = document.getElementById('restart-game');
    
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
        [0, 4, 8], [2, 4, 6] // Diagonais
    ];

    function handleCellClick(e) {
        const cell = e.target;
        const index = parseInt(cell.getAttribute('data-index'));

        if (gameState[index] !== '' || !gameActive) return;

        gameState[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());

        if (checkWin()) {
            gameStatus.textContent = `Jogador ${currentPlayer} venceu!`;
            gameActive = false;
            return;
        }

        if (checkDraw()) {
            gameStatus.textContent = 'Empate!';
            gameActive = false;
            return;
        }

        currentPlayer = 'O';
        gameStatus.textContent = 'Vez do computador...';

        // Simula um pequeno delay para a jogada do computador
        setTimeout(() => {
            makeComputerMove();
        }, 500);
    }

    function makeComputerMove() {
        if (!gameActive) return;

        const difficulty = difficultySelect.value;
        let move;

        switch(difficulty) {
            case 'hard':
                move = getBestMove();
                break;
            case 'medium':
                move = Math.random() < 0.7 ? getBestMove() : getRandomMove();
                break;
            default: // easy
                move = getRandomMove();
        }

        gameState[move] = 'O';
        cells[move].textContent = 'O';
        cells[move].classList.add('o');

        if (checkWin()) {
            gameStatus.textContent = 'Computador venceu!';
            gameActive = false;
            return;
        }

        if (checkDraw()) {
            gameStatus.textContent = 'Empate!';
            gameActive = false;
            return;
        }

        currentPlayer = 'X';
        gameStatus.textContent = 'Sua vez!';
    }

    function getBestMove() {
        let bestScore = -Infinity;
        let bestMove;

        for (let i = 0; i < 9; i++) {
            if (gameState[i] === '') {
                gameState[i] = 'O';
                let score = minimax(gameState, 0, false);
                gameState[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = i;
                }
            }
        }

        return bestMove;
    }

    function minimax(board, depth, isMaximizing) {
        if (checkWinForPlayer('O')) return 1;
        if (checkWinForPlayer('X')) return -1;
        if (checkDraw()) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'O';
                    let score = minimax(board, depth + 1, false);
                    board[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === '') {
                    board[i] = 'X';
                    let score = minimax(board, depth + 1, true);
                    board[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function getRandomMove() {
        const emptyCells = gameState.reduce((acc, cell, index) => {
            if (cell === '') acc.push(index);
            return acc;
        }, []);
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    function checkWin() {
        return winningConditions.some(condition => {
            return condition.every(index => {
                return gameState[index] === currentPlayer;
            });
        });
    }

    function checkWinForPlayer(player) {
        return winningConditions.some(condition => {
            return condition.every(index => {
                return gameState[index] === player;
            });
        });
    }

    function checkDraw() {
        return gameState.every(cell => cell !== '');
    }

    function resetGame() {
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
        gameStatus.textContent = 'Sua vez!';
    }

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    restartButton.addEventListener('click', resetGame);
    difficultySelect.addEventListener('change', resetGame);

    // Inicializa o status do jogo
    gameStatus.textContent = 'Sua vez!';
