const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Дозволити CORS (для з'єднання з фронтендом)
app.use(require('cors')());

// Отримати всі товари
app.get('/api/products', (req, res) => {
    const db = readDB();
    res.json(db.products || []);
});

// Статичні файли (фронт з public/)
app.use(express.static(path.join(__dirname, '../front')));
app.use('/pictures', express.static(path.join(__dirname, '../front/pictures')));
app.use('/styles', express.static(path.join(__dirname, '../front/styles')));
app.use('/scripts', express.static(path.join(__dirname, '../front/scripts')));

// Прочитати базу (файл)
const readDB = () => {
    const data = fs.readFileSync(path.join(__dirname, '../db.json'));
    return JSON.parse(data);
};

// Зберегти базу
const writeDB = (data) => {
    fs.writeFileSync(path.join(__dirname, '../db.json'), JSON.stringify(data, null, 2));
};

// Реєстрація
app.post('/api/register', (req, res) => {
    const db = readDB();
    const { email, password, firstName, lastName } = req.body;

    // Перевірка валідності email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return res.status(400).json({ message: 'Невалідна електронна пошта' });
    }

    // Перевірка довжини паролю
    if (password.length < 8) {
        return res.status(400).json({ message: 'Пароль має містити щонайменше 8 символів' });
    }

    if (db.users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'Користувач вже існує' });
    }

    db.users.push({ email, password, firstName, lastName, favorites: [], orders: [] });
    writeDB(db);

    res.json({ message: 'Реєстрація успішна' });
});

// Авторизація
app.post('/api/login', (req, res) => {
    const db = readDB();
    const { email, password } = req.body;

    const user = db.users.find(u => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ message: 'Невірний логін або пароль' });
    }

    res.json({ message: 'Успішний вхід', user });
});

// Збереження замовлення
app.post('/api/order', (req, res) => {
    const db = readDB();
    const { name, email, phone, delivery, address, payment, comment, cart } = req.body;

    const orderId = Date.now();
    db.orders.push({
        id: orderId,
        name,
        email,
        phone,
        delivery,
        address,
        payment,
        comment,
        cart
    });

    const user = db.users.find(u => u.email === email);
    if (user) {
        if (!user.orders) {
            user.orders = [];
        }
        user.orders.push(orderId);
    }

    writeDB(db);
    res.json({ message: 'Замовлення прийнято' });
});

// Отримати інформацію про користувача
app.get('/api/user/:email', (req, res) => {
    const db = readDB();
    const email = req.params.email;
    const user = db.users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ message: 'Користувача не знайдено' });
    }
    res.json(user);
});

// Отримати замовлення користувача
app.get('/api/user/:email/orders', (req, res) => {
    const db = readDB();
    const email = req.params.email;
    const user = db.users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    const userOrders = db.orders.filter(order => user.orders.includes(order.id));
    res.json(userOrders);
});

// Додати товар до обраного
app.post('/api/user/:email/favorites', (req, res) => {
    const db = readDB();
    const email = req.params.email;
    const { productCode } = req.body;

    const user = db.users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    if (!user.favorites.includes(productCode)) {
        user.favorites.push(productCode);
        writeDB(db);
    }

    res.json({ message: 'Товар додано до обраного', favorites: user.favorites });
});

// Видалити товар з обраного
app.delete('/api/user/:email/favorites/:code', (req, res) => {
    const db = readDB();
    const email = req.params.email;
    const code = req.params.code;

    const user = db.users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    user.favorites = user.favorites.filter(c => c !== code);
    writeDB(db);

    res.json({ message: 'Товар видалено з обраного', favorites: user.favorites });
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}/pages/index.html`);
    import('open').then(open => {
        open.default('http://localhost:3000/pages/index.html');
    });
});