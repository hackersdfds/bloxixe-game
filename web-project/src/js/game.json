class GameManager {
    constructor() {
        this.socket = io();
        this.setupListeners();
    }

    setupListeners() {
        this.socket.on('initializeGames', (games) => {
            this.displayGames(games);
        });

        this.socket.on('gameCreated', (game) => {
            this.addGameToDisplay(game);
        });

        this.socket.on('gameJoined', (game) => {
            this.updateGameDisplay(game);
        });

        this.socket.on('gameCompleted', (game) => {
            this.showGameResult(game);
        });

        this.socket.on('gameCancelled', (gameId) => {
            this.removeGameFromDisplay(gameId);
        });
    }

    createGame(gameData) {
        this.socket.emit('createGame', gameData);
    }

    joinGame(gameId, items, side) {
        this.socket.emit('joinGame', { gameId, items, side });
    }

    cancelGame(gameId) {
        this.socket.emit('cancelGame', gameId);
    }

    displayGames(games) {
        const container = document.getElementById('gamesContainer');
        container.innerHTML = '';
        games.forEach(game => this.addGameToDisplay(game));
    }

    addGameToDisplay(game) {
        // Créer l'élément HTML pour la partie
        const gameElement = this.createGameElement(game);
        document.getElementById('gamesContainer').prepend(gameElement);
    }

    updateGameDisplay(game) {
        const gameElement = document.querySelector(`[data-game-id="${game.id}"]`);
        if (gameElement) {
            gameElement.innerHTML = this.createGameContent(game);
        }
    }

    showGameResult(game) {
        const gameElement = document.querySelector(`[data-game-id="${game.id}"]`);
        if (gameElement) {
            gameElement.classList.add('completed');
            gameElement.innerHTML += `
                <div class="game-result">
                    <h3>${game.winner} wins!</h3>
                </div>
            `;
        }
    }

    removeGameFromDisplay(gameId) {
        const gameElement = document.querySelector(`[data-game-id="${gameId}"]`);
        if (gameElement) {
            gameElement.remove();
        }
    }
}

window.gameManager = new GameManager();
