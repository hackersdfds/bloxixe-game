const express = require('express');
const path = require('path');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Active games storage
const activeGames = new Map();
const connectedUsers = new Map();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'web-project', 'src')));

// Socket connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Send existing games to new client
    socket.emit('initializeGames', Array.from(activeGames.values()));

    // Handle user login
    socket.on('userLogin', (username) => {
        connectedUsers.set(socket.id, username);
        io.emit('updateUsers', Array.from(connectedUsers.values()));
    });

    // Handle game creation
    socket.on('createGame', (gameData) => {
        const username = connectedUsers.get(socket.id);
        const game = {
            id: `game_${Date.now()}`,
            creator: username,
            items: gameData.items,
            side: gameData.side,
            totalValue: gameData.totalValue,
            status: 'waiting',
            createdAt: Date.now()
        };

        activeGames.set(game.id, game);
        io.emit('gameCreated', game);
    });

    // Handle game joining
    socket.on('joinGame', ({ gameId, items, side }) => {
        const game = activeGames.get(gameId);
        if (game && game.status === 'waiting') {
            game.opponent = {
                username: connectedUsers.get(socket.id),
                items,
                side
            };
            game.status = 'playing';
            
            // Simulate coin flip
            setTimeout(() => {
                const winner = Math.random() < 0.5 ? game.creator : game.opponent.username;
                game.winner = winner;
                game.status = 'completed';
                io.emit('gameCompleted', game);
            }, 3000);

            activeGames.set(gameId, game);
            io.emit('gameJoined', game);
        }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        const username = connectedUsers.get(socket.id);
        connectedUsers.delete(socket.id);
        io.emit('updateUsers', Array.from(connectedUsers.values()));
        console.log('User disconnected:', username);
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
