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

    if (db.users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'Користувач вже існує' });
    }

    db.users.push({ email, password, firstName, lastName });
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

    db.orders.push({
        id: Date.now(),
        name,
        email,
        phone,
        delivery,
        address,
        payment,
        comment,
        cart
    });

    writeDB(db);
    res.json({ message: 'Замовлення прийнято' });
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
    import('open').then(open => {
        open.default('http://localhost:3000/pages/index.html');
    });
});