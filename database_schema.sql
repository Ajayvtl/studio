-- MySQL Database Schema for DataLens

-- -----------------------------------------------------
-- Table `users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `middleName` VARCHAR(255) NULL,
  `title` VARCHAR(255) NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `mobileNumber` VARCHAR(20) NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `staff`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `staff` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `role` ENUM('Admin', 'Editor', 'Viewer') NOT NULL DEFAULT 'Viewer',
  `status` ENUM('active', 'blocked') NOT NULL DEFAULT 'active',
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `clients`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clients` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `contactNumber` VARCHAR(20) NULL,
  `status` ENUM('active', 'blocked') NOT NULL DEFAULT 'active',
  `package` VARCHAR(255) NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `countries`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `countries` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `isoCode` VARCHAR(2) NOT NULL,
  `timeZone` VARCHAR(255) NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `exchanges`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `exchanges` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `country` VARCHAR(255) NOT NULL,
  `socialMediaLink` VARCHAR(255) NULL,
  `timeZone` VARCHAR(255) NULL,
  `holidaySchedule` VARCHAR(255) NULL,
  `webLink` VARCHAR(255) NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `permissions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `permissions` (
  `staffId` VARCHAR(255) NOT NULL,
  `module` VARCHAR(255) NOT NULL,
  `permission` ENUM('create', 'read', 'update', 'delete') NOT NULL,
  PRIMARY KEY (`staffId`, `module`, `permission`),
  CONSTRAINT `fk_permissions_staff`
    FOREIGN KEY (`staffId`)
    REFERENCES `staff` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `api_providers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `api_providers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `is_active` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `settings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `dataFetchingFrequency` INT NULL DEFAULT 60,
  `customScripts` TEXT NULL,
  `searxngUrl` VARCHAR(255) NULL,
  `defaultApiProviderId` INT NULL,
  `apiKey` VARCHAR(255) NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
    CONSTRAINT `fk_settings_api_providers`
    FOREIGN KEY (`defaultApiProviderId`)
    REFERENCES `api_providers` (`id`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `staff_departments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `staff_departments` (
  `staffId` VARCHAR(255) NOT NULL,
  `department` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`staffId`, `department`),
  CONSTRAINT `fk_staff_departments_staff`
    FOREIGN KEY (`staffId`)
    REFERENCES `staff` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Dummy Data Inserts
-- -----------------------------------------------------

-- Insert Admin Staff
INSERT INTO `staff` (`id`, `name`, `email`, `role`, `status`) VALUES
('admin1', 'Admin User', 'admin@example.com', 'Admin', 'active');

-- Insert Staff User
INSERT INTO `staff` (`id`, `name`, `email`, `role`, `status`) VALUES
('staff1', 'Staff User', 'staff@example.com', 'Editor', 'active');

-- Insert User Data
INSERT INTO `users` (`id`, `name`, `email`, `mobileNumber`) VALUES
('user1', 'John Doe', 'john.doe@example.com', '123-456-7890');

-- Insert Permissions for Admin
INSERT INTO `permissions` (`staffId`, `module`, `permission`) VALUES
('admin1', 'users', 'create'),
('admin1', 'users', 'read'),
('admin1', 'users', 'update'),
('admin1', 'users', 'delete'),
('admin1', 'clients', 'create'),
('admin1', 'clients', 'read'),
('admin1', 'clients', 'update'),
('admin1', 'clients', 'delete'),
('admin1', 'settings', 'create'),
('admin1', 'settings', 'read'),
('admin1', 'settings', 'update'),
('admin1', 'settings', 'delete'),
('admin1', 'staff', 'create'),
('admin1', 'staff', 'read'),
('admin1', 'staff', 'update'),
('admin1', 'staff', 'delete');

-- Insert Departments for Admin
INSERT INTO `staff_departments` (`staffId`, `department`) VALUES
('admin1', 'users'),
('admin1', 'clients'),
('admin1', 'settings'),
('admin1', 'staff');

-- Insert Permissions for Staff
INSERT INTO `permissions` (`staffId`, `module`, `permission`) VALUES
('staff1', 'users', 'read'),
('staff1', 'clients', 'read'),
('staff1', 'clients', 'create');

-- Insert Departments for Staff
INSERT INTO `staff_departments` (`staffId`, `department`) VALUES
('staff1', 'users'),
('staff1', 'clients');

-- Insert API Providers
INSERT INTO `api_providers` (`name`, `is_active`) VALUES
('Google AI', 1),
('Groq', 0);

-- Insert Default Settings
INSERT INTO `settings` (`dataFetchingFrequency`, `customScripts`, `searxngUrl`, `defaultApiProviderId`, `apiKey`) VALUES
(60, '', 'https://searx.example.com', 1, 'YOUR_GOOGLE_AI_API_KEY');

-- Dummy Admin and Staff Credentials:
-- Admin User: email: admin@example.com , No password needed (NextAuth simple auth)
-- Staff User: email: staff@example.com , No password needed (NextAuth simple auth)

-- You can import this file using a MySQL client like MySQL Workbench or the command line:
-- mysql -u <username> -p <database_name> < database_schema.sql

-- Please replace <username> and <database_name> with your actual MySQL credentials and database name.
-- Also, replace YOUR_GOOGLE_AI_API_KEY with your actual Google AI API key.
