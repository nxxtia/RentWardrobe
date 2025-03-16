-- Створення бази даних
CREATE DATABASE IF NOT EXISTS evening_dresses;
USE evening_dresses;

-- Створення таблиці користувачів
CREATE TABLE Users (
                       user_id INT PRIMARY KEY AUTO_INCREMENT,  -- Унікальний ідентифікатор користувача
                       email VARCHAR(255) UNIQUE NOT NULL,       -- Унікальний email користувача
                       password_hash VARCHAR(255) NOT NULL,      -- Хешований пароль
                       age INT CHECK (age >= 0),                 -- Вік (опціональний, не може бути від’ємним)
                       gender VARCHAR(255) NOT NULL,             -- Стать користувача
                       username VARCHAR(255) UNIQUE NOT NULL,    -- Унікальне ім’я користувача
                       rating INT DEFAULT 0,                     -- Рейтинг користувача (за замовчуванням 0)
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Дата створення акаунту
);

-- Створення таблиці адміністраторів із ролями
CREATE TABLE Admins (
                        admin_id INT PRIMARY KEY AUTO_INCREMENT,  -- Унікальний ідентифікатор адміністратора
                        email VARCHAR(255) UNIQUE NOT NULL,       -- Унікальний email адміністратора
                        password_hash VARCHAR(255) NOT NULL,      -- Хешований пароль
                        name VARCHAR(255) NOT NULL,               -- Ім'я адміністратора
                        role ENUM('superadmin', 'moderator', 'support') NOT NULL DEFAULT 'moderator', -- Роль адміністратора
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Дата створення акаунту
);

-- Додавання індексу для швидкого пошуку адміністраторів за email
CREATE INDEX idx_admins_email ON Admins(email);

CREATE TABLE Partners (
                          partner_id INT PRIMARY KEY AUTO_INCREMENT,  -- Унікальний ідентифікатор партнера
                          name VARCHAR(255) NOT NULL,                 -- Назва компанії або ім'я партнера
                          email VARCHAR(255) UNIQUE NOT NULL,         -- Email партнера
                          phone VARCHAR(20) NOT NULL,                 -- Контактний телефон
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Створення таблиці товарів
CREATE TABLE Products (
                          product_id INT PRIMARY KEY AUTO_INCREMENT,   -- Унікальний ідентифікатор товару
                          name VARCHAR(255) NOT NULL,                  -- Назва товару
                          category VARCHAR(255) NOT NULL,              -- Основна категорія товару
                          subcategory VARCHAR(255) DEFAULT NULL,       -- Підкатегорія (необов'язкове поле)
                          description TEXT NOT NULL,                   -- Опис товару
                          price DECIMAL(10,2) NOT NULL,                -- Ціна товару
                          sizes VARCHAR(255) NOT NULL,                 -- Доступні розміри (наприклад, "S, M, L")
                          colors VARCHAR(255) NOT NULL,                -- Доступні кольори (наприклад, "Червоний, Синій, Чорний")
                          materials TEXT NOT NULL,                     -- Матеріали товару
                          photos JSON DEFAULT NULL,                    -- Фото товару (масив URL-адрес зображень)
                          partner_id INT NOT NULL,                     -- ID партнера (зв’язок із постачальником/продавцем)
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Дата додавання товару
                          care_instructions TEXT DEFAULT NULL,         -- Інструкція з догляду (необов'язкове поле)
                          FOREIGN KEY (partner_id) REFERENCES Partners(partner_id) ON DELETE CASCADE
);

-- Додавання індексу для швидкого пошуку за категоріями
CREATE INDEX idx_products_category ON Products(category);
CREATE INDEX idx_products_subcategory ON Products(subcategory);
CREATE INDEX idx_products_name ON Products(name);

CREATE TABLE Orders (
                        order_id INT PRIMARY KEY AUTO_INCREMENT,    -- Унікальний ідентифікатор замовлення
                        user_id INT NOT NULL,                       -- ID користувача (покупця)
                        order_date DATETIME DEFAULT CURRENT_TIMESTAMP, -- Дата оформлення замовлення
                        start_date DATE NOT NULL,                    -- Дата початку оренди
                        end_date DATE NOT NULL,                      -- Дата завершення оренди
                        total_price DECIMAL(10,2) NOT NULL,          -- Загальна сума замовлення
                        status ENUM('pending', 'confirmed', 'canceled', 'completed') DEFAULT 'pending', -- Статус замовлення
                        product_id INT NOT NULL,                     -- ID товару, який орендується
                        FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE, -- Видалення замовлення при видаленні користувача
                        FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE -- Видалення замовлення при видаленні товару
) ENGINE=InnoDB;

CREATE TABLE Reviews (
                         review_id INT PRIMARY KEY AUTO_INCREMENT, -- Унікальний ID відгуку
                         user_id INT NOT NULL,                     -- Користувач, який залишив відгук
                         product_id INT NOT NULL,                  -- Товар, на який залишено відгук
                         rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5), -- Оцінка товару (від 1 до 5)
                         comment TEXT DEFAULT NULL,                -- Додатковий коментар
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Дата створення відгуку
                         FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
                         FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Щоб користувач міг додавати товари в список “Обране”.
CREATE TABLE Favorites (
                           favorite_id INT PRIMARY KEY AUTO_INCREMENT,
                           user_id INT NOT NULL,
                           product_id INT NOT NULL,
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
                           FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Payments (
                          payment_id INT PRIMARY KEY AUTO_INCREMENT,
                          order_id INT NOT NULL,
                          user_id INT NOT NULL,
                          amount DECIMAL(10,2) NOT NULL,
                          payment_status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
                          payment_method VARCHAR(50) NOT NULL,
                          transaction_id VARCHAR(255) DEFAULT NULL,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
                          FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE Order_Items (
                             order_item_id INT PRIMARY KEY AUTO_INCREMENT,
                             order_id INT NOT NULL,
                             product_id INT NOT NULL,
                             rental_days INT NOT NULL CHECK (rental_days > 0),
                             price_per_day DECIMAL(10,2) NOT NULL,
                             total_price DECIMAL(10,2) NOT NULL,
                             FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
                             FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
) ENGINE=InnoDB;