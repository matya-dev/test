// Логика авторизации

const CORRECT_CODE = "77923";
let enteredCode = "";
let userPhoneNumber = "";

// Функция для проверки формы username
function validateUsernameForm() {
    const usernameInput = document.getElementById('usernameInput');
    const usernameContinueBtn = document.getElementById('usernameContinueBtn');
    const usernameError = document.getElementById('usernameError');
    
    const username = usernameInput.value.trim();
    const isUsernameValid = validateUsername(username);
    
    // Показываем/скрываем ошибку username
    if (username && !isUsernameValid) {
        usernameError.style.display = 'block';
    } else {
        usernameError.style.display = 'none';
    }
    
    // Активируем/деактивируем кнопку
    usernameContinueBtn.disabled = !isUsernameValid;
}

// Функция для перехода на страницу кода
function showCodePage() {
    document.querySelector('.phone-page').style.display = 'none';
    document.getElementById('codePage').style.display = 'block';
    
    setTimeout(() => {
        document.querySelector('.code-input[data-index="0"]').focus();
    }, 100);
}

// Функция для перехода на страницу username
function showUsernamePage() {
    document.getElementById('codePage').style.display = 'none';
    document.getElementById('usernamePage').style.display = 'block';
    
    setTimeout(() => {
        document.getElementById('usernameInput').focus();
    }, 100);
}

// Функция для перехода на страницу чатов
function goToChatsPage() {
    window.location.href = 'chats.html';
}

// Функция для обработки ввода кода
function handleCodeInput(e, index) {
    const input = e.target;
    const value = input.value;
    
    if (value && !/^\d$/.test(value)) {
        input.value = '';
        return;
    }
    
    enteredCode = enteredCode.split('');
    enteredCode[index] = value;
    enteredCode = enteredCode.join('');
    
    if (value && index < 4) {
        document.querySelector(`.code-input[data-index="${index + 1}"]`).focus();
    }
    
    if (!value && index > 0) {
        document.querySelector(`.code-input[data-index="${index - 1}"]`).focus();
    }
    
    if (enteredCode.length === 5) {
        checkCode();
    }
}

// Функция для проверки кода
function checkCode() {
    const codeInputs = document.querySelectorAll('.code-input');
    
    if (enteredCode === CORRECT_CODE) {
        codeInputs.forEach((input, index) => {
            setTimeout(() => {
                input.classList.add('correct');
                input.classList.remove('incorrect');
            }, index * 200);
        });
        
        setTimeout(() => {
            showToast('Код подтвержден!', true);
            setTimeout(showUsernamePage, 1000);
        }, 1500);
        
    } else {
        codeInputs.forEach(input => {
            input.classList.add('incorrect');
            input.classList.remove('correct');
        });
        
        setTimeout(() => {
            codeInputs.forEach(input => {
                input.value = '';
                input.classList.remove('incorrect');
            });
            enteredCode = '';
            codeInputs[0].focus();
        }, 1000);
    }
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phoneInput');
    const usernameInput = document.getElementById('usernameInput');
    const continueBtn = document.getElementById('continueBtn');
    const usernameContinueBtn = document.getElementById('usernameContinueBtn');
    const codeInputs = document.querySelectorAll('.code-input');
    
    // Валидация username (только латинские буквы и цифры)
    usernameInput.addEventListener('input', function(e) {
        let value = e.target.value.toLowerCase();
        value = value.replace(/[^a-z0-9]/g, '');
        e.target.value = value;
        validateUsernameForm();
    });
    
    // Форматирование при вводе номера
    phoneInput.addEventListener('input', function(e) {
        const cursorPosition = this.selectionStart;
        const originalValue = this.value;
        
        formatPhoneNumber(this);
        
        let newCursorPosition = cursorPosition;
        const addedSpaces = (this.value.match(/ /g) || []).length - (originalValue.match(/ /g) || []).length;
        
        if (addedSpaces > 0 && this.value.charAt(cursorPosition) === ' ') {
            newCursorPosition = cursorPosition + 1;
        } else if (addedSpaces < 0) {
            newCursorPosition = Math.max(0, cursorPosition - 1);
        }
        
        this.setSelectionRange(newCursorPosition, newCursorPosition);
    });
    
    // Обработчик для кнопки "Продолжить" на странице номера
    continueBtn.addEventListener('click', async function() {
        const numbers = phoneInput.value.replace(/\D/g, '');
        
        if (numbers.length === 10) {
            userPhoneNumber = '+7' + numbers;
            localStorage.setItem('userPhone', userPhoneNumber);
            showCodePage();
        } else {
            showToast('Пожалуйста, введите полный номер телефона (10 цифр)');
        }
    });
    
    // Обработчик для кнопки создания профиля
    usernameContinueBtn.addEventListener('click', async function() {
        const username = usernameInput.value.trim();
        
        if (validateUsername(username)) {
            // Сохраняем username в localStorage
            localStorage.setItem('userUsername', username);
            
            // Сохраняем пользователя в базе данных
            const userResult = await saveUserToDB(userPhoneNumber, username);
            if (userResult && userResult.success) {
                localStorage.setItem('userId', userResult.user.id);
            }
            
            showToast('Профиль создан!', true);
            setTimeout(goToChatsPage, 1000);
        } else {
            showToast('Пожалуйста, проверьте имя пользователя');
        }
    });
    
    // Обработчики для полей ввода кода
    codeInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            handleCodeInput(e, index);
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && parseInt(e.target.getAttribute('data-index')) > 0) {
                const prevIndex = parseInt(e.target.getAttribute('data-index')) - 1;
                document.querySelector(`.code-input[data-index="${prevIndex}"]`).focus();
            }
        });
    });
    
    // Обработчик нажатия Enter в поле username
    usernameInput.addEventListener('keypress', async function(e) {
        if (e.key === 'Enter') {
            const username = usernameInput.value.trim();
            
            if (validateUsername(username)) {
                // Сохраняем username в localStorage
                localStorage.setItem('userUsername', username);
                
                // Сохраняем пользователя в базе данных
                const userResult = await saveUserToDB(userPhoneNumber, username);
                if (userResult && userResult.success) {
                    localStorage.setItem('userId', userResult.user.id);
                }
                
                showToast('Профиль создан!', true);
                setTimeout(goToChatsPage, 1000);
            } else {
                showToast('Пожалуйста, проверьте имя пользователя');
            }
        }
    });

    // Инициализация валидации формы username
    validateUsernameForm();
});