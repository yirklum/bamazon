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

connection.connect(function(err) {
    if (err) throw err;
    console.log("")
    console.log("connected as id " + connection.threadId);
    displayItems();
});

// display items for sale
function displayItems() {
    connection.query("SELECT * FROM products", function(err, res) {
        if(err) throw err;
        // loop through items in database and console log them
        console.log("Items For Sale")
        for(var i = 0; i < res.length; i++) {
            console.log("ID: " + res[i].item_id + " | " + "Product: " + res[i].product_name + " | " + "Department: " + res[i].department_name + " | " + "Price: $"+ res[i].price);
            console.log("")
        }
        
        inquirer.prompt([
            // ask user what product they want to buy
            {
            name: "productId",
            type: "input",
            message: "What is the ID of the product you would like to purchase?"
            },
            // ask user how many of the product they want to buy
            {
            name: "itemQuantity",
            type: "input",
            message: "How many units of this item would you like to purchase?",
            validate: function(value) {
                if (isNaN(value) === false) {
                    return true;
                }
                else {
                    return false;
                }
            }}
        ])
            // check if the item is in stock
            .then(function(answer) {
                connection.query("SELECT * FROM products WHERE item_id = ?", [answer.productId], function(err, res) {
                    if (answer.itemQuantity > res[0].stock_quantity){
                        console.log("Sorry, there is insufficient inventory to complete your order. Please try again.")
                        displayItems();
                    }
                    else {
                        var billAmount = res[0].price * answer.itemQuantity;
                        console.log("Your total is $" + billAmount);

                        // update inventory
                        connection.query("UPDATE products SET ? WHERE ?", 
                            [{stock_quantity: res[0].stock_quantity - answer.itemQuantity},
                             {item_id: answer.productId}],
                            function(err, res){}
                        );
                        console.log("")
                        console.log("-----------------------------------------------------------------------")
                        console.log("Please send a photo of your credit card, along with your social security number to legitimate_company@real_business.ng so we can complete your transaction.")
                        console.log("-----------------------------------------------------------------------")
                        console.log("")
                        
                        reset();
                    }
                })
            })
    })
}
    // ask user if they want to buy another product
    var reset = function () {
        inquirer.prompt(
            {
                name: "buyAnother",
                type: "confirm",
                message: "Would you like to purchase another item?"
            })
            .then((answer) => {
                if (answer.buyAnother) {
                    displayItems();
                }
                else {
                    connection.end();
                }
            })
    }

    

