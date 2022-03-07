CREATE TABLE technology (
    `id` INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `logo` VARCHAR(255) NOT NULL,
    `category_id` INT NOT NULL,
    `under_category_id` INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE,
    FOREIGN KEY (under_category_id) REFERENCES under_category(id) ON DELETE CASCADE
);
