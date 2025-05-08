document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.querySelector('.toggle-btn');

    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    const loginBtn = document.getElementById('loginBtn');
    const loginPopup = document.getElementById('loginPopup');
    const closeBtn = document.querySelector('.close-btn');
    const loginForm = document.getElementById('loginForm');

    loginBtn.addEventListener('click', () => {
        loginPopup.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        loginPopup.classList.remove('active');
    });

    // Fermer la popup si on clique en dehors
    loginPopup.addEventListener('click', (e) => {
        if (e.target === loginPopup) {
            loginPopup.classList.remove('active');
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('robloxUsername').value;
        
        // Store username
        localStorage.setItem('robloxUsername', username);
        
        // Notify server
        window.gameSocket.emit('userLogin', username);
        
        // Close login popup
        loginPopup.classList.remove('active');
    });

    // Vérifier si l'utilisateur était déjà connecté
    const savedUsername = localStorage.getItem('robloxUsername');
    if (savedUsername) {
        const userSection = document.querySelector('.user-section');
        // Dans l'événement submit du formulaire et dans la vérification du localStorage
        userSection.innerHTML = `
            <div class="user-display">
                <span>${savedUsername}</span>
            </div>
        `;
    }

    // Compteur de clics pour le logo
    let logoClickCount = 0;
    let lastClickTime = 0;
    const CLICK_TIMEOUT = 3000; // 3 secondes pour réinitialiser le compteur
    const ADMIN_PASSWORD = "admin123"; // Changez ceci pour votre mot de passe

    const centerLogo = document.querySelector('.center-logo');
    const adminPopup = document.getElementById('adminPopup');
    const adminCloseBtn = document.getElementById('adminCloseBtn');
    const adminForm = document.getElementById('adminForm');

    centerLogo.addEventListener('click', () => {
        const currentTime = new Date().getTime();
        
        if (currentTime - lastClickTime > CLICK_TIMEOUT) {
            logoClickCount = 1;
        } else {
            logoClickCount++;
        }
        
        lastClickTime = currentTime;

        if (logoClickCount === 5) {
            adminPopup.classList.add('active');
            logoClickCount = 0;
        }
    });

    adminCloseBtn.addEventListener('click', () => {
        adminPopup.classList.remove('active');
    });

    // Modifier la partie admin du code existant
    adminForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;

        if (password === ADMIN_PASSWORD) {
            adminPopup.classList.remove('active');
            document.getElementById('adminPanel').classList.add('active');
            document.getElementById('adminPassword').value = '';
        } else {
            alert('Incorrect password');
            document.getElementById('adminPassword').value = '';
        }
    });

    // Ajouter le gestionnaire pour le bouton retour
    document.getElementById('adminBackBtn').addEventListener('click', () => {
        document.getElementById('adminPanel').classList.remove('active');
    });

    // Fermer la popup si on clique en dehors
    adminPopup.addEventListener('click', (e) => {
        if (e.target === adminPopup) {
            adminPopup.classList.remove('active');
        }
    });

    // Mettre à jour la liste des utilisateurs quand on ouvre le panneau admin
    adminPanel.addEventListener('show', () => {
        window.usersManager.displayUsersList();
        window.usersManager.updateUserCount();
    });

    // Gestion de l'inventaire
    const inventoryBtn = document.querySelector('.inventory-section');
    const inventoryPopup = document.getElementById('inventoryPopup');
    const inventoryCloseBtn = document.getElementById('inventoryCloseBtn');

    inventoryBtn.addEventListener('click', () => {
        inventoryPopup.classList.add('active');
        loadInventory(); // Fonction à implémenter pour charger l'inventaire
    });

    inventoryCloseBtn.addEventListener('click', () => {
        inventoryPopup.classList.remove('active');
    });

    // Fermer la popup si on clique en dehors
    inventoryPopup.addEventListener('click', (e) => {
        if (e.target === inventoryPopup) {
            inventoryPopup.classList.remove('active');
        }
    });

    // Exemple de fonction pour charger l'inventaire
    async function loadInventory() {
        const inventoryGrid = document.querySelector('.inventory-grid');
        inventoryGrid.innerHTML = '';

        try {
            const inventoryData = localStorage.getItem('globalInventory');
            if (!inventoryData) {
                localStorage.setItem('globalInventory', JSON.stringify(defaultInventory));
            }
            
            const data = JSON.parse(inventoryData || JSON.stringify(defaultInventory));
            
            // Ne montrer que les items qui ne sont pas en jeu
            const availableItems = data.items.filter(item => !item.inGame);
            
            availableItems.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'inventory-item';
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="item-image">
                    <span class="item-name">${item.name}</span>
                    <span class="item-value">${item.value}</span>
                `;

                // Ajout d'un tooltip au survol
                itemElement.setAttribute('title', `${item.name}\nValue: ${item.value}\nRarity: ${item.rarity}`);

                inventoryGrid.appendChild(itemElement);
            });

            // Mise à jour des statistiques avec uniquement les items disponibles
            const totalItems = availableItems.length;
            const totalValue = availableItems.reduce((sum, item) => sum + item.rawValue, 0);
            
            document.querySelectorAll('.stat-value')[0].textContent = totalItems;
            document.querySelectorAll('.stat-value')[1].textContent = totalValue >= 1000000 ? 
                `${(totalValue / 1000000).toFixed(1)}M` : totalValue;

        } catch (error) {
            console.error('Error loading inventory:', error);
        }
    }

    // Gestion des inventaires par l'admin
    const initEmptyInv = document.getElementById('initEmptyInv');
    const init3Penguins = document.getElementById('init3Penguins');

    const defaultInventory = {
        items: []
    };

    const penguinInventory = {
        items: [
            {
                id: "HMP001",
                name: "Huge Mining Penguin",
                value: "15M",
                rawValue: 15000000,
                image: "https://i.postimg.cc/cHx9Sk2y/Huge-Mining-Penguin.png",
                rarity: "Huge",
                category: "Pet",
            },
            {
                id: "HMP002",
                name: "Huge Mining Penguin",
                value: "15M",
                rawValue: 15000000,
                image: "https://i.postimg.cc/cHx9Sk2y/Huge-Mining-Penguin.png",
                rarity: "Huge",
                category: "Pet",
            },
            {
                id: "HMP003",
                name: "Huge Mining Penguin",
                value: "15M",
                rawValue: 15000000,
                image: "https://i.postimg.cc/cHx9Sk2y/Huge-Mining-Penguin.png",
                rarity: "Huge",
                category: "Pet",
            }
        ]
    };

    initEmptyInv.addEventListener('click', () => {
        localStorage.setItem('globalInventory', JSON.stringify(defaultInventory));
        alert('Global inventory initialized as empty');
    });

    init3Penguins.addEventListener('click', () => {
        localStorage.setItem('globalInventory', JSON.stringify(penguinInventory));
        alert('Global inventory initialized with 3 Huge Mining Penguins');
    });

    // Gestion du CoinFlip
    const createGameBtn = document.getElementById('createGameBtn');
    const createGamePopup = document.getElementById('createGamePopup');
    const createGameCloseBtn = document.getElementById('createGameCloseBtn');
    const finalCreateBtn = document.getElementById('finalCreateBtn');
    const selectedItems = document.getElementById('selectedItems');
    let selectedSide = null;

    createGameBtn.addEventListener('click', () => {
        if (!localStorage.getItem('robloxUsername')) {
            alert('Please login first!');
            return;
        }
        createGamePopup.classList.add('active');
        loadInventoryForGame();
    });

    createGameCloseBtn.addEventListener('click', () => {
        createGamePopup.classList.remove('active');
    });

    document.querySelectorAll('.side-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.side-option').forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedSide = option.dataset.side;
            updateCreateButton();
        });
    });

    function loadInventoryForGame() {
        const inventory = JSON.parse(localStorage.getItem('globalInventory') || '{"items":[]}');
        const inventoryGrid = document.querySelector('.create-game-inventory');
        inventoryGrid.innerHTML = '';

        // Filtrer les items qui ne sont pas dans des parties actives
        const availableItems = inventory.items.filter(item => !item.inGame);

        availableItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'inventory-item';
            itemElement.dataset.itemId = item.id;
            itemElement.innerHTML = `
                <div class="item-hover-effect"></div>
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <span class="item-name">${item.name}</span>
                <span class="item-value">${item.value}</span>
            `;
            
            itemElement.addEventListener('click', () => {
                itemElement.classList.add('selecting');
                setTimeout(() => {
                    addToSelected(item);
                    itemElement.remove();
                }, 300);
            });

            inventoryGrid.appendChild(itemElement);
        });
    }

    function addToSelected(item) {
        // Vérifier si l'item n'est pas déjà sélectionné
        if (document.querySelector(`.selected[data-item-id="${item.id}"]`)) {
            return;
        }

        const itemElement = document.createElement('div');
        itemElement.className = 'inventory-item selected';
        itemElement.dataset.itemId = item.id;
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <span class="item-name">${item.name}</span>
            <span class="item-value">${item.value}</span>
        `;
        
        itemElement.addEventListener('click', () => {
            // Retourner l'item à l'inventaire
            const inventoryGrid = document.querySelector('.create-game-inventory');
            const newItemElement = document.createElement('div');
            newItemElement.className = 'inventory-item';
            newItemElement.dataset.itemId = item.id;
            newItemElement.innerHTML = `
                <div class="item-hover-effect"></div>
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <span class="item-name">${item.name}</span>
                <span class="item-value">${item.value}</span>
            `;
            
            newItemElement.addEventListener('click', () => {
                newItemElement.classList.add('selecting');
                setTimeout(() => {
                    addToSelected(item);
                    newItemElement.remove();
                }, 300);
            });

            inventoryGrid.appendChild(newItemElement);
            itemElement.remove();
            
            updateTotalValue();
            updateCreateButton();
        });

        document.getElementById('selectedItems').appendChild(itemElement);
        updateTotalValue();
        updateCreateButton();
    }

    function updateTotalValue() {
        const items = selectedItems.querySelectorAll('.inventory-item');
        let total = 0;
        items.forEach(item => {
            const value = item.querySelector('.item-value').textContent;
            total += parseFloat(value.replace('M', '')) * 1000000;
        });
        
        document.getElementById('totalValue').textContent = total >= 1000000 ? 
            `${(total / 1000000).toFixed(1)}M` : total;
    }

    function updateCreateButton() {
        const hasItems = selectedItems.querySelectorAll('.inventory-item').length > 0;
        const hasSide = selectedSide !== null;
        finalCreateBtn.disabled = !(hasItems && hasSide);
    }

    finalCreateBtn.addEventListener('click', () => {
        const items = Array.from(selectedItems.querySelectorAll('.inventory-item')).map(item => ({
            id: item.dataset.itemId,
            name: item.querySelector('.item-name').textContent,
            value: item.querySelector('.item-value').textContent,
            image: item.querySelector('.item-image').src
        }));

        createGame(items, selectedSide);
        createGamePopup.classList.remove('active');
    });

    const ACTIVE_GAMES_KEY = 'activeGames';

    function createGame(items, side) {
        // Mettre à jour l'inventaire global
        const inventory = JSON.parse(localStorage.getItem('globalInventory') || '{"items":[]}');
        const selectedItemIds = items.map(item => item.id);
        
        // Créer un ID unique pour la partie
        const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Marquer les items comme étant en jeu
        inventory.items = inventory.items.map(item => {
            if (selectedItemIds.includes(item.id)) {
                return { ...item, inGame: true, gameId: gameId };
            }
            return item;
        });
        
        localStorage.setItem('globalInventory', JSON.stringify(inventory));

        // Créer l'objet de la partie
        const gameData = {
            id: gameId,
            creator: localStorage.getItem('robloxUsername'),
            side: side,
            items: items,
            totalValue: document.getElementById('totalValue').textContent,
            createdAt: Date.now()
        };

        // Sauvegarder la partie dans le localStorage
        const activeGames = JSON.parse(localStorage.getItem(ACTIVE_GAMES_KEY) || '[]');
        activeGames.push(gameData);
        localStorage.setItem(ACTIVE_GAMES_KEY, JSON.stringify(activeGames));

        // Créer la carte de jeu
        createGameCard(gameData);
        
        // Mettre à jour le compteur de parties
        updateGamesCount();
        
        // Vider la sélection et fermer la popup
        document.getElementById('selectedItems').innerHTML = '';
        document.querySelector('.create-game-popup').classList.remove('active');
        
        // Recharger l'inventaire
        loadInventory();
    }

    // Modifier la fonction createGameCard pour ajouter le bouton Cancel
    function createGameCard(gameData) {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.dataset.gameId = gameData.id;
        
        const isCreator = gameData.creator === localStorage.getItem('robloxUsername');
        const actionButtons = isCreator ? 
            `<button class="cancel-btn" data-game-id="${gameData.id}">Cancel Game</button>` :
            `<div class="game-buttons">
                <button class="join-btn" data-game-id="${gameData.id}">Join Game</button>
                <div class="bet-info">
                    <span class="bet-side">${gameData.side === 'red' ? 'blue' : 'red'} side</span>
                    <span class="bet-amount">${gameData.totalValue}</span>
                </div>
            </div>`;
        
        gameCard.innerHTML = `
            <div class="game-info">
                <div class="player-side ${gameData.side}">
                    <span class="player-name">${gameData.creator}</span>
                    <div class="coin ${gameData.side}-coin"></div>
                </div>
                <div class="items-value">
                    <span class="value-label">Total Value:</span>
                    <span class="value-amount">${gameData.totalValue}</span>
                </div>
                <div class="items-preview">
                    ${gameData.items.map(item => `
                        <img src="${item.image}" 
                             alt="${item.name}" 
                             class="preview-image" 
                             title="${item.name} - ${item.value}"
                        >
                    `).join('')}
                </div>
                ${actionButtons}
            </div>
        `;

        const gamesContainer = document.getElementById('gamesContainer');
        gamesContainer.insertBefore(gameCard, gamesContainer.firstChild);
    }

    function loadExistingGames() {
        const activeGames = JSON.parse(localStorage.getItem(ACTIVE_GAMES_KEY) || '[]');
        const gamesContainer = document.getElementById('gamesContainer');
        gamesContainer.innerHTML = '';

        activeGames.forEach(gameData => {
            createGameCard(gameData);
        });

        updateGamesCount();
    }

    function updateGamesCount() {
        const count = document.querySelectorAll('.game-card').length;
        document.getElementById('gamesCount').textContent = count;
    }

    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('join-btn')) {
            const gameId = e.target.dataset.gameId;
            const username = localStorage.getItem('robloxUsername');
            
            if (!username) {
                alert('Please login first!');
                return;
            }

            // Vérifier si l'utilisateur a déjà rejoint une partie
            const inventory = JSON.parse(localStorage.getItem('globalInventory'));
            const userItems = inventory.items.filter(item => item.gameId);
            
            if (userItems.length > 0) {
                alert('You already have items in another game!');
                return;
            }

            const gameCard = e.target.closest('.game-card');
            const currentSide = gameCard.querySelector('.player-side').classList.contains('red') ? 'blue' : 'red';
            
            // Ouvrir la popup de sélection d'items
            createGamePopup.classList.add('active');
            loadInventoryForGame();
            
            // Présélectionner le côté opposé
            document.querySelector(`.side-option.${currentSide}`).click();
            
            // Désactiver le changement de côté
            document.querySelectorAll('.side-option').forEach(option => {
                option.style.pointerEvents = 'none';
                option.style.opacity = option.classList.contains(currentSide) ? '1' : '0.5';
            });

            // Après avoir rejoint une partie avec succès
            const activeGames = JSON.parse(localStorage.getItem(ACTIVE_GAMES_KEY) || '[]');
            const gameIndex = activeGames.findIndex(game => game.id === gameId);
            
            if (gameIndex !== -1) {
                // Mettre à jour la partie avec les informations du second joueur
                activeGames[gameIndex].opponent = {
                    username: username,
                    side: currentSide,
                    items: selectedItems
                };
                localStorage.setItem(ACTIVE_GAMES_KEY, JSON.stringify(activeGames));
            }
        }
    });

    // Ajouter le gestionnaire pour le bouton Cancel
    document.addEventListener('click', async (e) => {
        if (e.target.classList.contains('cancel-btn')) {
            const gameId = e.target.dataset.gameId;
            
            // Récupérer les données de la partie
            const activeGames = JSON.parse(localStorage.getItem(ACTIVE_GAMES_KEY) || '[]');
            const gameToCancel = activeGames.find(game => game.id === gameId);
            
            if (gameToCancel) {
                // Vérifier si l'utilisateur est le créateur de la partie
                if (gameToCancel.creator !== localStorage.getItem('robloxUsername')) {
                    alert('You can only cancel your own games!');
                    return;
                }

                // Récupérer l'inventaire
                const inventory = JSON.parse(localStorage.getItem('globalInventory') || '{"items":[]}');
                
                // Retirer le statut "inGame" des items
                inventory.items = inventory.items.map(item => {
                    if (item.gameId === gameId) {
                        const { inGame, gameId, ...rest } = item;
                        return rest;
                    }
                    return item;
                });
                
                // Mettre à jour l'inventaire
                localStorage.setItem('globalInventory', JSON.stringify(inventory));
                
                // Retirer la partie des parties actives
                const updatedGames = activeGames.filter(game => game.id !== gameId);
                localStorage.setItem(ACTIVE_GAMES_KEY, JSON.stringify(updatedGames));
                
                // Mettre à jour l'affichage
                removeGame(gameId);
                loadInventory();
                
                alert('Game cancelled successfully!');
            }
        }
    });

    function removeGame(gameId) {
        const activeGames = JSON.parse(localStorage.getItem(ACTIVE_GAMES_KEY) || '[]');
        const updatedGames = activeGames.filter(game => game.id !== gameId);
        localStorage.setItem(ACTIVE_GAMES_KEY, JSON.stringify(updatedGames));
        
        // Mettre à jour l'affichage
        const gameCard = document.querySelector(`.game-card[data-game-id="${gameId}"]`);
        if (gameCard) {
            gameCard.remove();
        }
        updateGamesCount();
    }

    // Gestion de la navigation
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const sections = document.querySelectorAll('.content-section');

    function showSection(sectionId) {
        sections.forEach(section => section.classList.remove('active'));
        navItems.forEach(item => item.classList.remove('active'));

        const targetSection = document.getElementById(`${sectionId}-section`);
        const targetNavItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);

        if (targetSection && targetNavItem) {
            targetSection.classList.add('active');
            targetNavItem.classList.add('active');
        }
    }

    // Mettre à jour les liens de navigation
    navItems.forEach(item => {
        const section = item.querySelector('.nav-text').textContent.toLowerCase();
        item.setAttribute('data-section', section);
        
        item.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(section);
        });
    });

    // Afficher la section Home par défaut
    showSection('home');
    loadExistingGames();
});
