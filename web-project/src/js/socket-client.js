const socket = io(window.location.origin);

socket.on('connect', () => {
    console.log('Connected to server');
    
    // Re-login if username exists
    const username = localStorage.getItem('robloxUsername');
    if (username) {
        socket.emit('userLogin', username);
    }
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

window.gameSocket = socket;
