-- Створення бази даних
CREATE DATABASE IF NOT EXISTS evening_dresses;
USE evening_dresses;

-- Створення таблиці користувачів
CREATE TABLE Users (
                       user_id INT PRIMARY KEY AUTO_INCREMENT,
                       first_name VARCHAR(50) NOT NULL,
                       last_name VARCHAR(50) NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       phone VARCHAR(20),
                       password_hash VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Створення таблиці категорій
CREATE TABLE Categories (
                            category_id INT PRIMARY KEY AUTO_INCREMENT,
                            name VARCHAR(100) NOT NULL,
                            parent_id INT DEFAULT NULL,
                            FOREIGN KEY (parent_id) REFERENCES Categories(category_id) ON DELETE SET NULL
);

-- Початкові дані
INSERT INTO Categories (name, parent_id) VALUES
                                             ('Жіночий одяг', NULL),
                                             ('Чоловічий одяг', NULL),
                                             ('Сукні', 1),
                                             ('Костюми', 2);