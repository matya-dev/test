// Утилиты для всего приложения

// Функция для показа уведомлений
function showToast(message, isSuccess = false) {
    const toast = document.getElementById('toast');
    if (!toast) {
        console.log('Toast message:', message);
        return;
    }
    
    toast.textContent = message;
    toast.className = 'toast';
    
    if (isSuccess) {
        toast.classList.add('success');
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Функция для форматирования номера телефона
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 10) {
        value = value.substring(0, 10);
    }
    
    let formatted = '';
    if (value.length > 0) {
        formatted = value.substring(0, 3);
    }
    if (value.length > 3) {
        formatted += ' ' + value.substring(3, 6);
    }
    if (value.length > 6) {
        formatted += ' ' + value.substring(6, 8);
    }
    if (value.length > 8) {
        formatted += ' ' + value.substring(8, 10);
    }
    
    input.value = formatted;
}

// Функция для валидации username
function validateUsername(username) {
    const regex = /^[a-z0-9]{5,}$/;
    return regex.test(username);
}

// Функция для сохранения пользователя в базе
async function saveUserToDB(phoneNumber, username) {
    try {
        const response = await fetch('/.netlify/functions/save-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber, username })
        });
        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Пользователь сохранен в Supabase:', data.user);
        } else {
            console.error('❌ Ошибка сохранения:', data.error);
        }
        
        return data;
    } catch (error) {
        console.error('Error saving user:', error);
        return null;
    }
}

// Функция для загрузки данных из файла
async function loadJSON(filePath) {
    try {
        const response = await fetch(filePath);
        return await response.json();
    } catch (error) {
        console.error('Error loading JSON:', error);
        return null;
    }
}

// Функция для получения параметров URL
function getUrlParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split('&');
    
    for (let pair of pairs) {
        const [key, value] = pair.split('=');
        if (key) {
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
    }
    
    return params;
}

// Глобальные функции для админ-панели
function adminAddGift(giftId) {
    if (typeof window.adminAddGift === 'function') {
        window.adminAddGift(giftId);
    }
}

function adminRemoveGift(giftId) {
    if (typeof window.adminRemoveGift === 'function') {
        window.adminRemoveGift(giftId);
    }
}