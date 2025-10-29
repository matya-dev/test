// Логика работы с профилем

let isMenuOpen = false;
let isProfileOpen = false;
let isEditing = false;

// Функции для управления боковой панелью меню
function openMenu() {
    const menu = document.getElementById('menuSidebar');
    const overlay = document.getElementById('overlay');
    const burger = document.getElementById('burgerMenu');
    
    menu.classList.add('active');
    overlay.classList.add('active');
    burger.classList.add('active');
    
    isMenuOpen = true;
}

function closeMenu() {
    const menu = document.getElementById('menuSidebar');
    const overlay = document.getElementById('overlay');
    const burger = document.getElementById('burgerMenu');
    
    menu.classList.remove('active');
    overlay.classList.remove('active');
    burger.classList.remove('active');
    
    isMenuOpen = false;
}

function toggleMenu() {
    if (isMenuOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}

// Функции для управления панелью профиля
function openProfile() {
    const profile = document.getElementById('profilePanel');
    const overlay = document.getElementById('overlay');
    
    profile.classList.add('active');
    overlay.classList.add('active');
    
    isProfileOpen = true;
    closeMenu();
}

function closeProfile() {
    const profile = document.getElementById('profilePanel');
    const overlay = document.getElementById('overlay');
    
    profile.classList.remove('active');
    overlay.classList.remove('active');
    
    isProfileOpen = false;
    stopEditing();
}

function toggleEditing() {
    const bioInput = document.getElementById('profileBioInput');
    const usernameInput = document.getElementById('profileUsernameInput');
    const usernameError = document.getElementById('profileUsernameError');
    
    if (!isEditing) {
        // Включаем редактирование
        bioInput.disabled = false;
        usernameInput.disabled = false;
        bioInput.focus();
        isEditing = true;
        
        // Добавляем валидацию для username
        usernameInput.addEventListener('input', function(e) {
            let value = e.target.value.toLowerCase();
            value = value.replace(/[^a-z0-9]/g, '');
            e.target.value = value;
            
            if (value && !validateUsername(value)) {
                usernameError.style.display = 'block';
            } else {
                usernameError.style.display = 'none';
            }
        });
    }
}

function stopEditing() {
    const bioInput = document.getElementById('profileBioInput');
    const usernameInput = document.getElementById('profileUsernameInput');
    const usernameError = document.getElementById('profileUsernameError');
    
    bioInput.disabled = true;
    usernameInput.disabled = true;
    isEditing = false;
    usernameError.style.display = 'none';
    
    // Сохраняем изменения если были и валидны
    const newBio = bioInput.value;
    const newUsername = usernameInput.value;
    const currentUser = getCurrentUser();
    
    if ((newBio !== currentUser.bio || newUsername !== currentUser.username) && validateUsername(newUsername)) {
        updateCurrentUser({
            bio: newBio,
            username: newUsername,
            name: newUsername.charAt(0).toUpperCase() + newUsername.slice(1)
        });
        updateProfileDisplay();
        updateAccountDisplay();
    } else {
        // Восстанавливаем оригинальные значения если username невалиден
        bioInput.value = currentUser.bio;
        usernameInput.value = currentUser.username;
    }
}

function updateProfileDisplay() {
    const currentUser = getCurrentUser();
    
    document.getElementById('profileNameDisplay').textContent = currentUser.name;
    document.getElementById('profileStatusDisplay').textContent = currentUser.status;
    document.getElementById('profilePhoneDisplay').textContent = currentUser.phone;
    document.getElementById('profileBioInput').value = currentUser.bio;
    document.getElementById('profileUsernameInput').value = currentUser.username;
    document.getElementById('profileAvatar').textContent = currentUser.avatar;
}

function updateAccountDisplay() {
    const currentUser = getCurrentUser();
    
    document.getElementById('accountName').textContent = currentUser.name;
    document.getElementById('accountStatus').textContent = currentUser.status;
    document.getElementById('accountAvatar').textContent = currentUser.avatar;
}

function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('userPhone');
        localStorage.removeItem('userId');
        localStorage.removeItem('userUsername');
        window.location.href = 'index.html';
    }
}

// Инициализация профиля
document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.getElementById('burgerMenu');
    const overlay = document.getElementById('overlay');
    const profileBtn = document.getElementById('profileBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const editProfile = document.getElementById('editProfile');
    const closeProfileBtn = document.getElementById('closeProfile');

    // Бургер-меню
    burgerMenu.addEventListener('click', toggleMenu);

    // Закрытие по клику на оверлей
    overlay.addEventListener('click', function() {
        if (isMenuOpen) closeMenu();
        if (isProfileOpen) closeProfile();
    });

    // Кнопка профиля
    profileBtn.addEventListener('click', openProfile);

    // Кнопка выхода
    logoutBtn.addEventListener('click', logout);

    // Редактирование профиля
    editProfile.addEventListener('click', toggleEditing);
    
    // Кнопка закрытия профиля
    closeProfileBtn.addEventListener('click', closeProfile);

    // Загрузка данных пользователя
    updateProfileDisplay();
    updateAccountDisplay();
});