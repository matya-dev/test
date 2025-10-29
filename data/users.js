// Данные пользователей
const usersData = {
    currentUser: {
        id: 1,
        name: "DeCoder",
        username: "decoder", 
        status: "online",
        phone: "+7 100 000 0001",
        bio: "20 y.o., designer",
        avatar: "D",
        isAdmin: false
    },
    
    contacts: {
        botfather: {
            id: 2,
            name: "BotFather",
            username: "botfather",
            status: "self.bot_botfather-id1",
            avatar: "B",
            isBot: true
        },
        test: {
            id: 3, 
            name: "test",
            username: "test",
            status: "self.bot_test-id2", 
            avatar: "T",
            isBot: true
        },
        support: {
            id: 4,
            name: "Support",
            username: "support", 
            status: "online",
            avatar: "S",
            isBot: false
        }
    }
};

// Функции для работы с пользователями
function getCurrentUser() {
    const savedPhone = localStorage.getItem('userPhone');
    const savedUsername = localStorage.getItem('userUsername');
    
    if (savedPhone) {
        usersData.currentUser.phone = savedPhone;
    }
    
    if (savedUsername) {
        usersData.currentUser.username = savedUsername;
        usersData.currentUser.name = savedUsername.charAt(0).toUpperCase() + savedUsername.slice(1);
        usersData.currentUser.avatar = usersData.currentUser.name.charAt(0);
    }
    
    return usersData.currentUser;
}

function updateCurrentUser(updates) {
    Object.assign(usersData.currentUser, updates);
    
    if (updates.username) {
        localStorage.setItem('userUsername', updates.username);
    }
    if (updates.phone) {
        localStorage.setItem('userPhone', updates.phone);
    }
    
    return usersData.currentUser;
}

function getContactByUsername(username) {
    return Object.values(usersData.contacts).find(contact => 
        contact.username === username
    );
}

function getContactById(id) {
    return Object.values(usersData.contacts).find(contact => 
        contact.id === parseInt(id)
    );
}

// Админ-функции
function checkAdminAccess() {
    return usersData.currentUser.isAdmin;
}

function enableAdminMode() {
    usersData.currentUser.isAdmin = true;
    localStorage.setItem('isAdmin', 'true');
    return true;
}

function initializeAdminMode() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
        usersData.currentUser.isAdmin = true;
    }
    return isAdmin;
}