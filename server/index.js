const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Store active games and users
const activeGames = new Map();
const connectedUsers = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user login
    socket.on('userLogin', (username) => {
        connectedUsers.set(socket.id, username);
        io.emit('updateUsersList', Array.from(connectedUsers.values()));
    });

    // Handle game creation
    socket.on('createGame', (gameData) => {
        const username = connectedUsers.get(socket.id);
        const game = {
            ...gameData,
            creator: username,
            id: `game_${Date.now()}`,
            status: 'waiting'
        };
        activeGames.set(game.id, game);
        io.emit('gameCreated', game);
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
    });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});