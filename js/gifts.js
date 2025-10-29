// Логика работы с подарками

let userGifts = [];
let adminClickCount = 0;
let lastClickTime = 0;
let debugButtonAdded = false;

// Функция для обработки кликов на кнопку админа
function handleAdminClick() {
    const currentTime = Date.now();
    
    // Сбрасываем счетчик если прошло больше 3 секунд
    if (currentTime - lastClickTime > 3000) {
        adminClickCount = 0;
    }
    
    adminClickCount++;
    lastClickTime = currentTime;
    
    console.log(`Admin clicks: ${adminClickCount}`);
    
    // Показываем подсказку о кликах
    if (adminClickCount > 0 && adminClickCount < 7) {
        const hints = ['', '', 'Еще немного...', 'Почти готово!', 'Еще чуть-чуть!', 'Последний раз!', '🎉'];
        if (hints[adminClickCount]) {
            showToast(`🔓 ${hints[adminClickCount]} (${adminClickCount}/7)`, true);
        }
    }
    
    // Если нажали 7 раз - включаем админ-режим
    if (adminClickCount >= 7) {
        enableAdminMode();
        showToast('🔓 Админ-режим активирован! Доступна отладка 🐛', true);
        adminClickCount = 0;
        
        // Добавляем кнопку отладки в меню (ТОЛЬКО при новом включении)
        addDebugButtonToMenu();
        
        // Показываем админ-панель
        setTimeout(openAdminPanel, 1000);
    }
}

// Функции для админ-панели
function openAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    const overlay = document.getElementById('overlay');
    
    adminPanel.classList.add('active');
    overlay.classList.add('active');
    
    loadAdminGifts();
}

function closeAdminPanel() {
    const adminPanel = document.getElementById('adminPanel');
    const overlay = document.getElementById('overlay');
    
    adminPanel.classList.remove('active');
    overlay.classList.remove('active');
}

function loadAdminGifts() {
    const adminContent = document.getElementById('adminContent');
    const allGiftsList = getAllGifts();
    
    adminContent.innerHTML = '';
    
    allGiftsList.forEach(gift => {
        const hasGift = userGifts.some(g => g.id === gift.id);
        const giftElement = document.createElement('div');
        giftElement.className = 'admin-gift-item';
        
        giftElement.innerHTML = `
            <div class="admin-gift-preview">
                <img src="${gift.image}" alt="${gift.name}" class="admin-gift-image" onerror="this.style.display='none'">
                <div class="admin-gift-rarity ${gift.rarity}">${gift.rarity}</div>
            </div>
            <div class="admin-gift-info">
                <div class="admin-gift-name">${gift.name}</div>
                <div class="admin-gift-status ${hasGift ? 'owned' : 'not-owned'}">
                    ${hasGift ? '✅ В инвентаре' : '❌ Не получен'}
                </div>
            </div>
            <div class="admin-gift-actions">
                <button class="admin-btn add-btn" ${hasGift ? 'disabled' : ''}>
                    ➕ Выдать
                </button>
                <button class="admin-btn remove-btn" ${!hasGift ? 'disabled' : ''}>
                    ➖ Забрать
                </button>
            </div>
        `;
        
        // Добавляем обработчики событий вместо onclick
        const addBtn = giftElement.querySelector('.add-btn');
        const removeBtn = giftElement.querySelector('.remove-btn');
        
        addBtn.addEventListener('click', () => adminAddGift(gift.id));
        removeBtn.addEventListener('click', () => adminRemoveGift(gift.id));
        
        adminContent.appendChild(giftElement);
    });
    
    updateAdminStats();
}

// Функция для обновления статистики
function updateAdminStats() {
    const allGiftsList = getAllGifts();
    
    const rareGifts = allGiftsList.filter(g => g.rarity === 'rare').length;
    const epicGifts = allGiftsList.filter(g => g.rarity === 'epic').length;
    const legendaryGifts = allGiftsList.filter(g => g.rarity === 'legendary').length;
    const mythicalGifts = allGiftsList.filter(g => g.rarity === 'mythical').length;
    
    document.getElementById('totalGifts').textContent = allGiftsList.length;
    document.getElementById('userGiftsCount').textContent = userGifts.length;
    document.getElementById('rareGifts').textContent = rareGifts;
    document.getElementById('epicGifts').textContent = epicGifts;
    document.getElementById('legendaryGifts').textContent = legendaryGifts;
    document.getElementById('mythicalGifts').textContent = mythicalGifts;
}

// Функции для админ-действий (делаем их глобальными)
window.adminAddGift = function(giftId) {
    console.log('🔄 Admin adding gift:', giftId);
    
    const gift = getGiftById(giftId);
    if (!gift) {
        showToast('❌ Подарок не найден');
        return;
    }
    
    // Проверяем, есть ли уже такой подарок
    const existingGift = userGifts.find(g => g.id === giftId);
    if (existingGift) {
        showToast('❌ Подарок уже есть в инвентаре');
        return;
    }
    
    // Добавляем подарок
    const newGift = {
        id: gift.id,
        name: gift.name,
        image: gift.image,
        details: {
            owner: 'you',
            model: gift.name,
            background: 'Default',
            pattern: 'Standard',
            quantity: '1 из 1',
            visible: true
        }
    };
    
    userGifts.push(newGift);
    showToast(`🎁 Подарок "${gift.name}" выдан!`, true);
    
    // Обновляем обе панели
    setTimeout(() => {
        loadAdminGifts();
        loadGifts();
    }, 100);
}

window.adminRemoveGift = function(giftId) {
    console.log('🔄 Admin removing gift:', giftId);
    
    // Не даем удалить socks
    if (giftId === 'socks') {
        showToast('❌ Нельзя удалить базовый подарок Socks');
        return;
    }
    
    const index = userGifts.findIndex(g => g.id === giftId);
    if (index === -1) {
        showToast('❌ Подарок не найден в инвентаре');
        return;
    }
    
    const giftName = userGifts[index].name;
    userGifts.splice(index, 1);
    showToast(`🎁 Подарок "${giftName}" забран!`, true);
    
    // Обновляем обе панели
    setTimeout(() => {
        loadAdminGifts();
        loadGifts();
    }, 100);
}

// Основные функции подарков
function openGifts() {
    const giftsPanel = document.getElementById('giftsPanel');
    const overlay = document.getElementById('overlay');
    
    giftsPanel.classList.add('active');
    overlay.classList.add('active');
    
    loadGifts();
    closeProfile();
}

function closeGifts() {
    const giftsPanel = document.getElementById('giftsPanel');
    const overlay = document.getElementById('overlay');
    
    giftsPanel.classList.remove('active');
    overlay.classList.remove('active');
}

function openGiftDetails(giftId) {
    const gift = userGifts.find(g => g.id === giftId);
    if (!gift) return;

    const detailsPanel = document.getElementById('giftDetailsPanel');
    const overlay = document.getElementById('overlay');
    
    // Заполняем данные подарка
    document.getElementById('giftDetailsTitle').textContent = `Коллекционный подарок #${gift.id}`;
    document.getElementById('giftDetailsImage').src = gift.image;
    document.getElementById('giftOwner').textContent = gift.details.owner;
    document.getElementById('giftModel').textContent = gift.details.model;
    document.getElementById('giftBackground').textContent = gift.details.background;
    document.getElementById('giftPattern').textContent = gift.details.pattern;
    document.getElementById('giftQuantity').textContent = gift.details.quantity;
    
    document.getElementById('giftVisibility').textContent = 
        gift.details.visible ? 
        'Этот подарок виден всем в Вашем профиле.' : 
        'Этот подарок скрыт в Вашем профиле.';

    detailsPanel.classList.add('active');
    overlay.classList.add('active');
    
    closeGifts();
}

function closeGiftDetails() {
    const detailsPanel = document.getElementById('giftDetailsPanel');
    const overlay = document.getElementById('overlay');
    
    detailsPanel.classList.remove('active');
    overlay.classList.remove('active');
}

function loadGifts() {
    const giftsContent = document.getElementById('giftsContent');
    giftsContent.innerHTML = '';

    if (userGifts.length === 0) {
        giftsContent.innerHTML = '<div class="no-gifts">У вас пока нет подарков</div>';
        return;
    }

    userGifts.forEach(gift => {
        const giftElement = document.createElement('div');
        giftElement.className = 'gift-item';
        giftElement.innerHTML = `
            <div class="gift-preview">
                <img src="${gift.image}" alt="${gift.name}" class="gift-image" onerror="this.style.display='none'">
            </div>
            <div class="gift-name">${gift.name}</div>
            <div class="gift-info">Нажмите для просмотра</div>
        `;
        
        giftElement.addEventListener('click', () => openGiftDetails(gift.id));
        giftsContent.appendChild(giftElement);
    });
}

// Функция для загрузки данных подарка из файла
async function loadGiftData(giftId) {
    try {
        const response = await fetch(`NFT/${giftId}.txt`);
        if (response.ok) {
            const text = await response.text();
            const lines = text.split('\n');
            const details = {};
            
            lines.forEach(line => {
                const [key, value] = line.split(':').map(part => part.trim());
                if (key && value) {
                    const normalizedKey = key.toLowerCase().replace(/[^a-zа-яё]/gi, '');
                    details[normalizedKey] = value;
                }
            });
            
            return details;
        }
    } catch (error) {
        console.error('Error loading gift data:', error);
    }
    return null;
}

// Функция для инициализации подарков
async function initializeGifts() {
    // Если у пользователя еще нет подарков, добавляем ТОЛЬКО socks
    if (userGifts.length === 0) {
        const socksGift = getGiftById('socks');
        if (socksGift) {
            userGifts.push({
                id: socksGift.id,
                name: socksGift.name,
                image: socksGift.image,
                details: {
                    owner: 'you',
                    model: socksGift.name,
                    background: 'Default',
                    pattern: 'Standard',
                    quantity: '1 из 1',
                    visible: true
                }
            });
            console.log('✅ Added socks gift to user');
        }
    }
    
    // Инициализируем админ-режим, но НЕ добавляем кнопку отладки автоматически
    initializeAdminMode();
    
    // УБРАЛ автоматическое добавление кнопки отладки
    // Кнопка будет добавляться только при новом включении админ-режима
}

// Отладочные функции
function openDebugPanel() {
    const debugPanel = document.getElementById('debugPanel');
    const overlay = document.getElementById('overlay');
    
    debugPanel.classList.add('active');
    overlay.classList.add('active');
    
    updateDebugInfo();
}

function closeDebugPanel() {
    const debugPanel = document.getElementById('debugPanel');
    const overlay = document.getElementById('overlay');
    
    debugPanel.classList.remove('active');
    overlay.classList.remove('active');
}

function updateDebugInfo() {
    const allGiftsList = getAllGifts();
    
    // Обновляем статистику
    document.getElementById('debugTotalGifts').textContent = allGiftsList.length;
    document.getElementById('debugUserGifts').textContent = userGifts.length;
    document.getElementById('debugAdminStatus').textContent = checkAdminAccess() ? '✅' : '❌';
    document.getElementById('debugAdminClicks').textContent = `${adminClickCount}/7`;
    
    // Обновляем список подарков пользователя
    const userGiftsList = document.getElementById('debugUserGiftsList');
    userGiftsList.innerHTML = '';
    
    userGifts.forEach(gift => {
        const giftElement = document.createElement('div');
        giftElement.className = 'debug-gift-item';
        giftElement.innerHTML = `
            <span class="debug-gift-name">${gift.name}</span>
            <span class="debug-gift-id">${gift.id}</span>
        `;
        userGiftsList.appendChild(giftElement);
    });
    
    // Добавляем лог
    addDebugLog('📊 Обновлена информация отладки');
}

function addDebugLog(message) {
    const logsContainer = document.getElementById('debugLogs');
    const logItem = document.createElement('div');
    logItem.className = 'debug-log-item';
    logItem.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    
    logsContainer.appendChild(logItem);
    logsContainer.scrollTop = logsContainer.scrollHeight;
}

// Быстрые действия отладки
function debugAddGift(giftId) {
    adminAddGift(giftId);
    addDebugLog(`➕ Добавлен подарок: ${giftId}`);
    updateDebugInfo();
}

function debugRemoveGift(giftId) {
    adminRemoveGift(giftId);
    addDebugLog(`➖ Удален подарок: ${giftId}`);
    updateDebugInfo();
}

function debugResetGifts() {
    userGifts = [];
    initializeGifts();
    addDebugLog('🔄 Сброшены все подарки');
    updateDebugInfo();
    showToast('🎁 Подарки сброшены!', true);
}

function debugEnableAdmin() {
    enableAdminMode();
    addDebugLog('🔓 Включен админ-режим');
    updateDebugInfo();
    showToast('🔓 Админ-режим включен!', true);
}

function debugShowAdminPanel() {
    closeDebugPanel();
    setTimeout(openAdminPanel, 300);
    addDebugLog('🎮 Открыта админ-панель');
}

function debugTestToast() {
    showToast('🔔 Тестовое уведомление!', true);
    addDebugLog('🔔 Протестировано уведомление');
}

// Добавляем кнопку отладки в меню (только при явном включении админ-режима)
function addDebugButtonToMenu() {
    if (debugButtonAdded) return;
    
    const menuList = document.querySelector('.menu-list');
    if (menuList) {
        // Проверяем, не добавлена ли уже кнопка
        const existingDebugButton = document.getElementById('debugButton');
        if (existingDebugButton) {
            debugButtonAdded = true;
            return;
        }
        
        const debugButton = document.createElement('div');
        debugButton.className = 'debug-button';
        debugButton.id = 'debugButton';
        debugButton.style.display = 'none'; // Сначала скрыта
        debugButton.innerHTML = `
            <div class="menu-icon">🐛</div>
            <div class="menu-text">Отладка системы</div>
        `;
        
        // Вставляем перед кнопкой выхода
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            menuList.insertBefore(debugButton, logoutBtn);
        } else {
            menuList.appendChild(debugButton);
        }
        
        debugButton.addEventListener('click', openDebugPanel);
        debugButtonAdded = true;
        
        // Показываем кнопку с анимацией
        setTimeout(() => {
            debugButton.style.display = 'flex';
            debugButton.style.animation = 'fadeIn 0.5s ease-in';
        }, 500);
        
        console.log('🎯 Кнопка отладки добавлена в меню');
        if (typeof addDebugLog === 'function') {
            addDebugLog('🎯 Кнопка отладки добавлена в меню');
        }
    }
}

// Обновляем initializeGifts для логирования
const originalInitializeGifts = initializeGifts;
initializeGifts = async function() {
    await originalInitializeGifts();
    addDebugLog('🎁 Система подарков инициализирована');
    updateDebugInfo();
};

// Добавляем логирование к админ-действиям
const originalAdminAddGift = window.adminAddGift;
window.adminAddGift = function(giftId) {
    const result = originalAdminAddGift(giftId);
    addDebugLog(`🎮 Админ добавил подарок: ${giftId}`);
    updateDebugInfo();
    return result;
};

const originalAdminRemoveGift = window.adminRemoveGift;
window.adminRemoveGift = function(giftId) {
    const result = originalAdminRemoveGift(giftId);
    addDebugLog(`🎮 Админ удалил подарок: ${giftId}`);
    updateDebugInfo();
    return result;
};

// Инициализация отладки при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик закрытия отладочной панели
    const closeDebugBtn = document.getElementById('closeDebug');
    if (closeDebugBtn) {
        closeDebugBtn.addEventListener('click', closeDebugPanel);
    }
    
    addDebugLog('🚀 Модуль отладки загружен');
});

// Обработчики событий для подарков
document.addEventListener('DOMContentLoaded', function() {
    const giftsButton = document.getElementById('giftsButton');
    const closeGiftsBtn = document.getElementById('closeGifts');
    const closeGiftDetailsBtn = document.getElementById('closeGiftDetails');
    const closeAdminBtn = document.getElementById('closeAdmin');

    // Обработчики для подарков
    giftsButton.addEventListener('click', openGifts);
    closeGiftsBtn.addEventListener('click', closeGifts);
    closeGiftDetailsBtn.addEventListener('click', closeGiftDetails);
    closeAdminBtn.addEventListener('click', closeAdminPanel);

    // Инициализация подарков
    initializeGifts();
});