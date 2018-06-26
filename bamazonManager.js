// require dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");

// establish connection
var connection = mysql.createConnection(
    {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        database: "bamazon_DB"
    }
);

// Build the start menu
function startMenu() {
    inquirer.prompt([
        {
            name: "menu",
            type: "list",
            message: "Restricted Manager Access: Choose a menu option.",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ])
    .then(function(answer) {
        if(answer.menu === "View Products for Sale"){
            viewProductsForSale();
        }
        else if(answer.menu === "View Low Inventory"){
            viewLowInventory();
        }
        else if(answer.menu === "Add to Inventory"){
            addToInventory();
        }
        else if(answer.menu === "Add New Product"){
            addNewProduct();
        }
    })
};

// Create a function to show all product information
function viewProductsForSale() {
    connection.query("SELECT * FROM products", function(err, res){
        if (err) throw err;

        console.log("");
        console.log("Items for Sale:");
        console.log("");

        for (i = 0; i < res.length; i ++) {
            console.log("Item ID: " + res[i].item_id);
            console.log("Product Name: " + res[i].product_name);
            console.log("Department Name: " + res[i].department_name);
            console.log("Price: $" + res[i].price);
            console.log("Stock Quantity: " + res[i].stock_quantity);
            console.log("");
            console.log("------------------------------------------------------------");
        }
        console.log("");
        console.log("");
        startMenu();
    })
}

// Create a function to show all products with an inventory of less than 5 units
function viewLowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
        if (err) throw err;
        console.log("");
        console.log("Items with Low Inventory Level: Reorder Soon!");
        console.log("");
            
        for(i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id);
            console.log("Product Name: " + res[i].product_name);
            console.log("Department Name: " + res[i].department_name);
            console.log("Price: $" + res[i].price);
            console.log("Stock Quantity: " + res[i].stock_quantity);
            console.log("");
            console.log("------------------------------------------------------------");
        }
        console.log("");
        console.log("");
        startMenu();
    })
}

// Create a function allowing the user to add items to the inventory
function addToInventory() {
    inquirer.prompt([
        {
            name: "addInventory",
            type: "input",
            message: "Enter the name of the product to which you would like to add inventory."
        },
        {
            name: "howManyMore",
            type: "input",
            message: "How many units of this product would you like to add to the inventory?"
        }
    ])
    .then(function(answer) {
        connection.query("SELECT * FROM products", function(err, res) 
            {
                total_quantity = res[0].stock_quantity + parseInt(answer.howManyMore);
            
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {stock_quantity: total_quantity},
                        {product_name: answer.addInventory}
                    ], function(err, res) {});

                connection.query("SELECT FROM products WHERE ?", {product_name: answer.addInventory}, function(err, res) {
                    console.log("Your products have been added to the inventory.");
                    console.log("");
                    console.log("");
                    startMenu();
                });
            }
        )    
    })
}

// Create a function allowing the user to add new products to the inventory
function addNewProduct() {
    inquirer.prompt([
        {
            name: "addProductName",
            type: "input",
            message: "Enter the name of the product you wish to add."
        },
        {
            name: "addProductDepartment",
            type: "input",
            message: "Enter the department of the product you wish to add."
        },
        {
            name: "addProductPrice",
            type: "input",
            message: "Enter the price of the product you wish to add."
        },
        {
            name: "addProductQuantity",
            type: "input",
            message: "Enter the stock quantity of the product you wish to add."
        }
    ])
    .then(function(answer) {
        connection.query("INSERT INTO products SET ?", 
            {
                product_name: answer.addProductName,
                department_name: answer.addProductDepartment,
                price: answer.addProductPrice,
                stock_quantity: answer.addProductQuantity
            },
            function(err, res) {
                console.log("Your new item has been added to the inventory.")
                console.log("");
                console.log("");
                startMenu();
            }
        )
    })
}

// Run application
startMenu();