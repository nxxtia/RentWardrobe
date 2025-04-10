// Отримання email поточного користувача з localStorage
const currentUserEmail = localStorage.getItem('currentUserEmail');

// Функція завантаження даних користувача
async function loadUserData() {
    if (!currentUserEmail) return;

    try {
        // Завантаження даних користувача з API
        const userRes = await fetch(`/api/user/${currentUserEmail}`);
        const user = await userRes.json();

        // Оновлення елементів профілю
        document.getElementById('userFirstName').textContent = user.firstName || '-';
        document.getElementById('userPhone').textContent = user.phone || '-';
        document.getElementById('userEmail').textContent = user.email || '-';

        // Завантаження даних про замовлення (якщо потрібні, можна додати їх окремо)
        // Наприклад, якщо на сторінці є список замовлень або посилання
        const ordersRes = await fetch(`/api/user/${currentUserEmail}/orders`);
        const orders = await ordersRes.json();

        // Якщо потрібно відображати замовлення, можна вставити код для рендерингу
        // Приклад:
        // const ordersList = document.getElementById('ordersList');
        // orders.forEach(order => { ... });

        // Завантаження "обраних" товарів (якщо є відповідний блок на сторінці)
        // const favoritesList = document.getElementById('favoritesList');
        // user.favorites.forEach(code => { ... });

    } catch (err) {
        console.error('Помилка при завантаженні даних користувача', err);
    }
}

// Обробка зміни пароля
document.getElementById('savePasswordBtn').addEventListener('click', async () => {
    const newPass = document.getElementById('newPass').value.trim();
    const confirmPass = document.getElementById('confirmPass').value.trim();

    if (!newPass || !confirmPass) {
        alert('Будь ласка, заповніть всі поля для зміни паролю.');
        return;
    }

    if (newPass !== confirmPass) {
        alert('Паролі не співпадають.');
        return;
    }

    try {
        // Приклад запиту на зміну паролю (endpoint залежить від серверної логіки)
        const res = await fetch(`/api/user/${currentUserEmail}/change-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newPassword: newPass })
        });
        const data = await res.json();
        if (res.ok) {
            alert('Пароль успішно змінено.');
            // Можна також очистити поля
            document.getElementById('newPass').value = '';
            document.getElementById('confirmPass').value = '';
        } else {
            alert(data.message || 'Помилка при зміні паролю.');
        }
    } catch (err) {
        console.error('Помилка при зміні паролю', err);
        alert('Помилка при зміні паролю.');
    }
});

// Обробка кліку по кнопці "Вийти"
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUserEmail');
    window.location.href = 'auth.html';
});

// Завантаження даних профілю при завантаженні сторінки
window.addEventListener('DOMContentLoaded', loadUserData);
