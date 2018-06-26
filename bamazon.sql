DROP DATABASE IF EXISTS bamazon_DB;

-- Create new database
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

-- Create new table to hold product information
CREATE TABLE products (
    item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(30), 
    price DECIMAL(13,2),
    stock_quantity INTEGER(10),
    PRIMARY KEY (item_id)
);

-- Add products to the database
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Banana peeler", "Kitchen", 30.00, 300),
       ("Solar-powered defibrillator", "Medical", 525.00, 4),
       ("Edible pens", "Office", 5.25, 500),
       ("Baby walking cane", "Baby", 35.00, 75),
       ("Two-way baby monitor", "Baby", 150.75, 50),
       ("Raccoon treats", "Pets", 21.00, 200),
       ("Salmon hot pockets", "Grocery", 5.99, 400),
       ("2-in-1 computer/chopping board", "Kitchen", 1500.00, 150),
       ("Cat diapers", "Pets", 25.75, 300),
       ("Cinnamon scented bandages", "Medical", 10.00, 250);