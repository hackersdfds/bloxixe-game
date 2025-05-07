const express = require('express');
const path = require('path');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Middleware - Important: order matters!
app.use(cors());

// Serve static files - This should come BEFORE other routes
app.use(express.static(path.join(__dirname, '..', 'web-project', 'src')));
app.use(express.json());

// Store active games and users
const activeGames = new Map();
const connectedUsers = new Map();

// Your socket.io setup
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Envoyer les parties existantes au nouveau client
    socket.emit('initializeGames', Array.from(activeGames.values()));

    // Handle user login
    socket.on('userLogin', (username) => {
        connectedUsers.set(socket.id, username);
        io.emit('updateUsersList', Array.from(connectedUsers.values()));
    });

    // Handle game creation
    socket.on('createGame', (gameData) => {
        const username = connectedUsers.get(socket.id);
        const game = {
            id: `game_${Date.now()}`,
            creator: username,
            side: gameData.side,
            items: gameData.items,
            totalValue: gameData.totalValue,
            status: 'waiting',
            createdAt: Date.now()
        };
        
        activeGames.set(game.id, game);
        io.emit('gameCreated', game);
    });

    // Gérer le join d'une partie
    socket.on('joinGame', (data) => {
        const { gameId, items, side } = data;
        const username = connectedUsers.get(socket.id);
        const game = activeGames.get(gameId);

        if (game && game.status === 'waiting') {
            game.opponent = {
                username,
                items,
                side
            };
            game.status = 'playing';
            
            activeGames.set(gameId, game);
            io.emit('gameJoined', game);
            
            // Lancer le tirage après un délai
            setTimeout(() => {
                const winner = Math.random() < 0.5 ? game.creator : game.opponent.username;
                game.status = 'completed';
                game.winner = winner;
                io.emit('gameCompleted', game);
            }, 5000);
        }
    });

    // Gérer la suppression d'une partie
    socket.on('cancelGame', (gameId) => {
        const game = activeGames.get(gameId);
        if (game && game.creator === connectedUsers.get(socket.id)) {
            activeGames.delete(gameId);
            io.emit('gameCancelled', gameId);
        }
    });

    // Handle admin actions
    socket.on('adminAction', (action) => {
        if (action.type === 'giveItems') {
            io.emit('itemsDistributed', action.data);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        connectedUsers.delete(socket.id);
        io.emit('updateUsersList', Array.from(connectedUsers.values()));
        console.log('User disconnected:', socket.id);
    });
});

// Catch-all route - This should come AFTER static files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'web-project', 'src', 'index.html'));
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
