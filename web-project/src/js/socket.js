const socket = io('http://localhost:3000');

class SocketManager {
    constructor() {
        this.setupListeners();
    }

    setupListeners() {
        socket.on('updateUsersList', (users) => {
            window.usersManager.updateUsersFromServer(users);
        });

        socket.on('gameCreated', (game) => {
            window.gameManager.addGame(game);
        });

        socket.on('itemsDistributed', (data) => {
            window.inventoryManager.updateInventory(data);
        });
    }

    login(username) {
        socket.emit('userLogin', username);
    }

    createGame(gameData) {
        socket.emit('createGame', gameData);
    }

    adminAction(action) {
        socket.emit('adminAction', action);
    }
}

window.socketManager = new SocketManager();