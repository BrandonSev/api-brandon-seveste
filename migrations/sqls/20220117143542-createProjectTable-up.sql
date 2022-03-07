CREATE TABLE project (
    `id` INT PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `start_date` DATETIME NOT NULL,
    `end_date` DATETIME NOT NULL,
    `active` BOOLEAN DEFAULT FALSE,
    `tags` VARCHAR(255),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP()
);