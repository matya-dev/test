// База данных всех подарков
const allGifts = {
    socks: {
        id: 'socks',
        name: 'Socks NFT',
        image: 'NFT/socks.gif',
        detailsFile: 'socks.txt',
        rarity: 'common',
        available: true
    },
    pen: {  // ИЗМЕНИЛ НА pen
        id: 'pen',
        name: 'Plaggy"s dildo',
        image: 'NFT/pen.gif',
        detailsFile: 'pen.txt',
        rarity: 'common',
        available: false
    },
    
    astral_shard: {  // ИЗМЕНИЛ НА pen
        id: 'astral_shard',
        name: 'Astral Shard',
        image: 'NFT/astral_shard.gif',
        detailsFile: 'astral_shard.txt',
        rarity: 'common',
        available: false
    },

    galaxy_pepe: {  // ИЗМЕНИЛ НА pen
        id: 'galaxy_pepe',
        name: 'Galaxy Pepe',
        image: 'NFT/galaxy_pepe.gif',
        detailsFile: 'galaxy_pepe.txt',
        rarity: 'common',
        available: false
    },

    persik: {  // ИЗМЕНИЛ НА pen
        id: 'persik',
        name: 'Precious Peach',
        image: 'NFT/persik.gif',
        detailsFile: 'persik.txt',
        rarity: 'common',
        available: false
    },

    rose: {  // ИЗМЕНИЛ НА pen
        id: 'rose',
        name: 'Rose',
        image: 'NFT/rose.gif',
        detailsFile: 'rose.txt',
        rarity: 'common',
        available: false
    },
    
    plush_pepe: {  // ИЗМЕНИЛ НА pen
        id: 'plush_pepe',
        name: 'Plush Pepe',
        image: 'NFT/plush_pepe.gif',
        detailsFile: 'plush_pepe.txt',
        rarity: 'rare',
        available: false
    }
};

// Функции для работы с подарками
function getAllGifts() {
    return Object.values(allGifts);
}

function getGiftById(giftId) {
    return allGifts[giftId];
}

function addGiftToUser(giftId) {
    const gift = allGifts[giftId];
    if (!gift) return false;
    
    // Проверяем, нет ли уже такого подарка у пользователя
    const existingGiftIndex = userGifts.findIndex(g => g.id === giftId);
    if (existingGiftIndex === -1) {
        userGifts.push({
            ...gift,
            details: {
                owner: 'you',
                model: 'Loading...',
                background: 'Loading...',
                pattern: 'Loading...',
                quantity: '1 из 1',
                visible: true
            }
        });
        
        // Загружаем детали из файла
        loadGiftData(giftId).then(details => {
            if (details) {
                const giftIndex = userGifts.findIndex(g => g.id === giftId);
                if (giftIndex !== -1) {
                    userGifts[giftIndex].details = {
                        ...userGifts[giftIndex].details,
                        model: details['модель'] || details['model'] || gift.name,
                        background: details['фон'] || details['background'] || 'Default',
                        pattern: details['узор'] || details['pattern'] || 'Standard',
                        quantity: details['количество'] || details['quantity'] || '1 из 1'
                    };
                }
            }
        });
        
        return true;
    }
    return false;
}

function removeGiftFromUser(giftId) {
    const index = userGifts.findIndex(g => g.id === giftId);
    if (index !== -1) {
        userGifts.splice(index, 1);
        return true;
    }
    return false;
}