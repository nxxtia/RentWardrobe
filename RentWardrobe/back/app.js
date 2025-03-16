const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// 🚀 1. Отримання всіх товарів
app.get("/api/products", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM Products");
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Помилка сервера" });
    }
});

// 🚀 2. Додавання нового товару (тільки для адміна або партнера)
app.post("/api/products", async (req, res) => {
    const { name, category, subcategory, description, price, sizes, colors, materials, photos, partner_id } = req.body;
    try {
        const query = "INSERT INTO Products (name, category, subcategory, description, price, sizes, colors, materials, photos, partner_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        await db.query(query, [name, category, subcategory, description, price, sizes, colors, materials, JSON.stringify(photos), partner_id]);
        res.status(201).json({ message: "Товар додано успішно!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Помилка при додаванні товару" });
    }
});

// 🚀 3. Отримання замовлень конкретного користувача
app.get("/api/orders/:user_id", async (req, res) => {
    const { user_id } = req.params;
    try {
        const [rows] = await db.query("SELECT * FROM Orders WHERE user_id = ?", [user_id]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Помилка отримання замовлень" });
    }
});

// 🚀 4. Додавання замовлення
app.post("/api/orders", async (req, res) => {
    const { user_id, start_date, end_date, total_price, status, product_id } = req.body;
    try {
        const query = "INSERT INTO Orders (user_id, order_date, start_date, end_date, total_price, status, product_id) VALUES (?, NOW(), ?, ?, ?, ?, ?)";
        await db.query(query, [user_id, start_date, end_date, total_price, status, product_id]);
        res.status(201).json({ message: "Замовлення створено успішно!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Помилка при створенні замовлення" });
    }
});

// 🚀 5. Додавання відгуку
app.post("/api/reviews", async (req, res) => {
    const { user_id, product_id, rating, comment } = req.body;
    try {
        const query = "INSERT INTO Reviews (user_id, product_id, rating, comment, created_at) VALUES (?, ?, ?, ?, NOW())";
        await db.query(query, [user_id, product_id, rating, comment]);
        res.status(201).json({ message: "Відгук успішно додано!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Помилка при додаванні відгуку" });
    }
});

// 🚀 6. Отримання відгуків для конкретного товару
app.get("/api/reviews/:product_id", async (req, res) => {
    const { product_id } = req.params;
    try {
        const [rows] = await db.query("SELECT * FROM Reviews WHERE product_id = ?", [product_id]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Помилка отримання відгуків" });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер працює на порту ${PORT}`);
});