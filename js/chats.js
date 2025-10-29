// Логика работы с чатами

let currentChat = 'botfather';
let isMobile = window.innerWidth <= 768;

// Функции для мобильного режима чатов
function showChat(chatId) {
    if (isMobile) {
        document.getElementById('chatsSidebar').classList.add('hidden');
        document.getElementById('messagesPanel').classList.add('active');
    }
    displayChat(chatId);
}

function showChatsList() {
    if (isMobile) {
        document.getElementById('messagesPanel').classList.remove('active');
        document.getElementById('chatsSidebar').classList.remove('hidden');
    }
}

// Функция для отображения сообщений чата
function displayChat(chatId) {
    const chatData = getChatById(chatId);
    if (!chatData) return;

    currentChat = chatId;
    markChatAsRead(chatId);

    // Обновляем заголовок
    document.getElementById('currentChatName').textContent = chatData.name;
    document.getElementById('currentChatStatus').textContent = chatData.status;
    document.getElementById('currentChatAvatar').textContent = chatData.avatar;

    // Очищаем контейнер сообщений
    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.innerHTML = '';

    // Добавляем сообщения
    chatData.messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.incoming ? 'message-incoming' : 'message-outgoing'}`;
        
        messageElement.innerHTML = `
            <div class="message-text">${message.text}</div>
            <div class="message-time">${message.time}</div>
        `;
        
        messagesContainer.appendChild(messageElement);
    });

    // Прокручиваем вниз
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    updateChatsList();
}

// Функция для обновления списка чатов
function updateChatsList() {
    const chatsList = document.getElementById('chatsList');
    const chats = getAllChats();
    
    chatsList.innerHTML = '';
    
    chats.forEach(chat => {
        const chatElement = document.createElement('div');
        chatElement.className = `chat-item ${chat.id === getChatById(currentChat)?.id ? 'active' : ''}`;
        chatElement.dataset.chat = Object.keys(chatsData).find(key => chatsData[key].id === chat.id);
        
        chatElement.innerHTML = `
            <div class="chat-avatar">${chat.avatar}</div>
            <div class="chat-info">
                <div class="chat-header">
                    <div class="chat-name">${chat.name}</div>
                    <div class="chat-time">${chat.lastMessageTime}</div>
                </div>
                <div class="chat-last-message">${chat.lastMessage}</div>
            </div>
            ${chat.unreadCount > 0 ? `<div class="unread-badge">${chat.unreadCount}</div>` : ''}
        `;
        
        chatElement.addEventListener('click', () => showChat(chatElement.dataset.chat));
        chatsList.appendChild(chatElement);
    });
}

// Функция для отправки сообщения
function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (text) {
        const now = new Date();
        const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        // Добавляем сообщение в данные
        addMessageToChat(currentChat, {
            text: text,
            incoming: false,
            time: time,
            sender: 'current'
        });

        // Обновляем отображение
        displayChat(currentChat);

        // Очищаем поле ввода
        input.value = '';
        input.style.height = 'auto';

        // Авто-ответ для ботов
        const chatData = getChatById(currentChat);
        if (chatData && chatData.username !== 'support') {
            setTimeout(() => {
                const responses = [
                    "self.test_message1",
                    "self.test_message2", 
                    "self.test_message3"
                ];
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                
                addMessageToChat(currentChat, {
                    text: randomResponse,
                    incoming: true,
                    time: `${now.getHours()}:${(now.getMinutes() + 1).toString().padStart(2, '0')}`,
                    sender: currentChat
                });
                displayChat(currentChat);
            }, 1000);
        }
    }
}

// Функция для поиска чатов
function searchChats() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const chatItems = document.querySelectorAll('.chat-item');
    
    if (!searchTerm) {
        chatItems.forEach(item => item.style.display = 'flex');
        return;
    }
    
    const filteredChats = searchChats(searchTerm);
    const filteredIds = filteredChats.map(chat => chat.id);
    
    chatItems.forEach(item => {
        const chatId = Object.keys(chatsData).find(key => chatsData[key].id === parseInt(item.dataset.chat));
        if (filteredIds.includes(chatsData[chatId]?.id)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Инициализация чатов
document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');
    const backButton = document.getElementById('backButton');
    const searchInput = document.getElementById('searchInput');

    // Обновляем флаг мобильного режима
    isMobile = window.innerWidth <= 768;

    // Кнопка "Назад" в мобильном режиме
    backButton.addEventListener('click', showChatsList);

    // Поиск чатов
    searchInput.addEventListener('input', searchChats);

    // Отправка сообщения
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Авто-высота текстового поля
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Обработчик для админ-кнопки (self.button_3)
    const adminButton = document.querySelector('.menu-item:nth-child(5)'); // 5-я кнопка это self.button_3
    if (adminButton) {
        adminButton.addEventListener('click', handleAdminClick);
    }

    // Обработчик закрытия админ-панели
    const closeAdminBtn = document.getElementById('closeAdmin');
    if (closeAdminBtn) {
        closeAdminBtn.addEventListener('click', closeAdminPanel);
    }

    // Обработчик изменения размера окна
    window.addEventListener('resize', function() {
        isMobile = window.innerWidth <= 768;
        
        if (!isMobile) {
            document.getElementById('chatsSidebar').classList.remove('hidden');
            document.getElementById('messagesPanel').classList.remove('active');
        }
    });

    // Инициализация чатов
    updateChatsList();
    displayChat(currentChat);
});