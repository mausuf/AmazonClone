CREATE DATABASE bamazon;
-- Makes it so all of the following code will affect bamazon --
USE bamazon;

CREATE TABLE products(
item_id INT NOT NULL, -- (unique id for each product) -- Creates a numeric column called "id" which will automatically increment its default value as we create new rows. --
product_name VARCHAR(100) NOT NULL,-- (Name of product)
department_name VARCHAR(100),
price DECIMAL(10,4), -- (cost to customer)
stock_quantity INT(10), -- (how much of the product is available in stores)
PRIMARY KEY (item_id)
);

select * from products;  -- select all from table

-- Insert products
use bamazon;
INSERT INTO products (itemn_id, product_name, department_name, price, stock_quantity)
VALUES (1, "Ice Cream", "Food", 10.00, 100);

select * from products;  -- into products tableproductsproductsproductsproducts


