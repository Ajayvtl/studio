-- Database: DataLens

-- Table: users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    title VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    mobile_number VARCHAR(20),
    country_id INT,
    department_id INT,
    role_id INT,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (country_id) REFERENCES countries(id),
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Table: countries
CREATE TABLE countries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    iso_code VARCHAR(2) UNIQUE NOT NULL,
    time_zone VARCHAR(255)
);

-- Table: departments
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Table: roles
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Table: role_permissions
CREATE TABLE role_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id),
    UNIQUE KEY unique_role_permission (role_id, permission_id)
);

-- Table: permissions
CREATE TABLE permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);

-- Table: exchanges
CREATE TABLE exchanges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    country_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    social_media_link VARCHAR(255),
    time_zone VARCHAR(255),
    holiday_schedule TEXT,
    web_link VARCHAR(255),
    FOREIGN KEY (country_id) REFERENCES countries(id)
);

-- Table: stocks
CREATE TABLE stocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exchange_id INT NOT NULL,
    symbol VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    FOREIGN KEY (exchange_id) REFERENCES exchanges(id)
);

-- Table: historical_data
CREATE TABLE historical_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stock_id INT NOT NULL,
    date DATE NOT NULL,
    open DECIMAL(18, 2),
    high DECIMAL(18, 2),
    low DECIMAL(18, 2),
    close DECIMAL(18, 2),
    adj_close DECIMAL(18, 2),
    volume BIGINT,
    FOREIGN KEY (stock_id) REFERENCES stocks(id),
    UNIQUE KEY unique_stock_date (stock_id, date)
);

-- Table: packages
CREATE TABLE packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2)
);

-- Table: client_management
CREATE TABLE client_management (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    package_id INT,
    email_verified BOOLEAN DEFAULT FALSE,
    is_blocked BOOLEAN DEFAULT FALSE,
    registration_ip VARCHAR(45),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (package_id) REFERENCES packages(id)
);

-- Table: activity_log
CREATE TABLE activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    activity_type VARCHAR(255) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sample Data Inserts
INSERT INTO countries (name, iso_code, time_zone) VALUES
('United States', 'US', 'America/New_York'),
('Canada', 'CA', 'America/Toronto'),
('United Kingdom', 'UK', 'Europe/London');

INSERT INTO departments (name) VALUES
('Trading'),
('Analytics'),
('Management');

INSERT INTO roles (name) VALUES
('Admin'),
('Analyst'),
('Trader');

INSERT INTO permissions (name, description) VALUES
('view_dashboard', 'Can view the main dashboard'),
('analyze_stocks', 'Can perform stock analysis'),
('manage_users', 'Can manage user accounts');

INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1), (1, 2), (1, 3), -- Admin has all permissions
(2, 1), (2, 2),       -- Analyst has dashboard and analysis permissions
(3, 1);              -- Trader has dashboard permission

-- Add more INSERT statements as needed
