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
    }

    displayGames(games) {
        const container = document.getElementById('gamesContainer');
        container.innerHTML = '';
        games.forEach(game => this.addGameToDisplay(game));
    }

    addGameToDisplay(game) {
        const gameElement = this.createGameElement(game);
        document.getElementById('gamesContainer').prepend(gameElement);
    }

    createGameElement(game) {
        const div = document.createElement('div');
        div.className = 'game-card';
        div.dataset.gameId = game.id;
        // Add game display logic here
        return div;
    }
}

// Initialize the game manager
window.gameManager = new GameManager();
