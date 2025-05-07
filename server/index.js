const express = require('express');
const path = require('path');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Middleware
app.use(cors());

// Servir les fichiers statiques depuis le dossier web-project/src
app.use(express.static(path.join(__dirname, '..', 'web-project', 'src')));

// Store active games and users
const activeGames = new Map();
const connectedUsers = new Map();

// Socket.IO connections
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
        console.log('User disconnected:', socket.id);
    });
});

// Route par défaut qui renvoie index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'web-project', 'src', 'index.html'));
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
