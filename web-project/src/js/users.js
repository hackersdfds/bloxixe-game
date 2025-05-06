class UsersManager {
    constructor() {
        this.usersKey = 'bloxixe_users';
        this.initializeUsers();
        this.setupSearchListener();
    }

    initializeUsers() {
        if (!localStorage.getItem(this.usersKey)) {
            localStorage.setItem(this.usersKey, JSON.stringify([]));
        }
    }

    addUser(username) {
        const users = this.getUsers();
        const now = new Date().toISOString();
        
        if (!users.find(u => u.name === username)) {
            users.push({
                name: username,
                joinDate: now,
                lastSeen: now
            });
            localStorage.setItem(this.usersKey, JSON.stringify(users));
            this.updateUsersList();
            return true;
        }
        return false;
    }

    getUsers() {
        return JSON.parse(localStorage.getItem(this.usersKey) || '[]');
    }

    updateUsersList(searchTerm = '') {
        const users = this.getUsers();
        const usersList = document.getElementById('usersList');
        const totalUsers = document.getElementById('totalUsers');
        
        if (usersList) {
            const filteredUsers = searchTerm ? 
                users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase())) : 
                users;

            usersList.innerHTML = filteredUsers.map(user => `
                <div class="user-item">
                    <div class="user-info">
                        <div class="user-avatar">
                            ${user.name.charAt(0).toUpperCase()}
                        </div>
                        <div class="user-details">
                            <span class="user-name">${user.name}</span>
                            <span class="user-date">Joined: ${new Date(user.joinDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="user-last-seen">
                        Last seen: ${this.getTimeAgo(new Date(user.lastSeen))}
                    </div>
                </div>
            `).join('');
        }
        
        if (totalUsers) {
            totalUsers.textContent = users.length;
        }
    }

    setupSearchListener() {
        const searchInput = document.getElementById('searchUsers');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.updateUsersList(e.target.value);
            });
        }
    }

    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
            }
        }
        return 'Just now';
    }

    updateUsersFromServer(users) {
        const usersList = document.getElementById('usersList');
        if (usersList) {
            usersList.innerHTML = users.map(username => `
                <div class="user-item">
                    <div class="user-info">
                        <div class="user-avatar">
                            ${username.charAt(0).toUpperCase()}
                        </div>
                        <div class="user-details">
                            <span class="user-name">${username}</span>
                            <span class="user-status online">Online</span>
                        </div>
                    </div>
                </div>
            `).join('');
            
            document.getElementById('totalUsers').textContent = users.length;
        }
    }
}

// Initialize users manager
window.usersManager = new UsersManager();
document.addEventListener('DOMContentLoaded', () => {
    window.usersManager.updateUsersList();
});