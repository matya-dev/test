// Данные чатов и сообщений
const chatsData = {
    botfather: {
        id: 1,
        name: "BotFather",
        username: "botfather",
        avatar: "B",
        status: "self.bot_botfather-id1",
        lastMessage: "self.test_message1",
        lastMessageTime: "12:30",
        unreadCount: 1,
        messages: [
            { 
                id: 1, 
                text: "self.test_message1", 
                incoming: true, 
                time: "12:25",
                sender: "botfather"
            },
            { 
                id: 2, 
                text: "test", 
                incoming: false, 
                time: "12:26",
                sender: "current"
            },
            { 
                id: 3, 
                text: "self.test_message1", 
                incoming: true, 
                time: "12:30",
                sender: "botfather"
            }
        ]
    },
    test: {
        id: 2,
        name: "test", 
        username: "test",
        avatar: "T",
        status: "self.bot_test-id2",
        lastMessage: "self.test_message1",
        lastMessageTime: "11:45",
        unreadCount: 0,
        messages: [
            { 
                id: 1, 
                text: "self.test_message1", 
                incoming: true, 
                time: "11:40",
                sender: "test"
            },
            { 
                id: 2, 
                text: "test message", 
                incoming: false, 
                time: "11:42",
                sender: "current"
            },
            { 
                id: 3, 
                text: "self.test_message1", 
                incoming: true, 
                time: "11:45",
                sender: "test"
            }
        ]
    },
    support: {
        id: 3,
        name: "Support",
        username: "support",
        avatar: "S",
        status: "online",
        lastMessage: "self.support_message",
        lastMessageTime: "10:20",
        unreadCount: 0,
        messages: [
            { 
                id: 1, 
                text: "self.support_message", 
                incoming: true, 
                time: "10:15",
                sender: "support"
            },
            { 
                id: 2, 
                text: "Hello!", 
                incoming: false, 
                time: "10:20",
                sender: "current"
            }
        ]
    }
};

// Функции для работы с чатами
function getChatById(chatId) {
    return chatsData[chatId];
}

function getAllChats() {
    return Object.values(chatsData);
}

function addMessageToChat(chatId, message) {
    const chat = chatsData[chatId];
    if (!chat) return null;
    
    const newMessage = {
        id: chat.messages.length + 1,
        text: message.text,
        incoming: message.incoming,
        time: message.time,
        sender: message.sender || (message.incoming ? chatId : 'current')
    };
    
    chat.messages.push(newMessage);
    chat.lastMessage = message.text;
    chat.lastMessageTime = message.time;
    
    if (message.incoming) {
        chat.unreadCount++;
    }
    
    return newMessage;
}

function markChatAsRead(chatId) {
    const chat = chatsData[chatId];
    if (chat) {
        chat.unreadCount = 0;
    }
}

function searchChats(searchTerm) {
    const term = searchTerm.toLowerCase();
    return Object.values(chatsData).filter(chat => 
        chat.name.toLowerCase().includes(term) ||
        chat.lastMessage.toLowerCase().includes(term)
    );
}