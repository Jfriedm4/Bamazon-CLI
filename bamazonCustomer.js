var mysql =  require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    afterConnection();
  });

  function afterConnection() {

    // gather and display products from database
    connection.query("SELECT * FROM products", function(err, res) {
        var results = [];
        for (var i = 0; i < res.length; i++) {
            console.log("product ID: " + res[i].id);
            console.log("product: " + res[i].product_name + " $" + res[i].price);
            console.log("department: " + res[i].department_name);
            console.log("---------------------------------------------------------");
            results.push(res[i]);
        }

        // ask user which product and how many of the product they would like to purchase
        inquirer
        .prompt([
            {
                name: "id",
                type: "list",
                message: "Please choose the product ID of the item you would like to purchase.",
                choices: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
            },
            {
                name: "quantity",
                type: "input",
                message: "Please enter how many you would like to purchase.",
                default: "1"

            }
        ])
        .then(function(inquirerResponse) {
            // store the user input in variables as numbers
           var chosenID = parseInt(inquirerResponse.id);
           var quantity = parseInt(inquirerResponse.quantity);
           if (isNaN(quantity)) {
               console.log("I'm sorry that quantity is not valid.");
           } else {
                // get the chosen product name and quantity
               var productName = res[chosenID].product_name;
               var stock = parseInt(res[chosenID].stock_quantity);
               var productPrice = res[chosenID].price;
               // compare the db quantity with the desired quantity

               if (stock >= quantity) {
                   var remainingStock = stock - quantity;
                   connection.query(`UPDATE products SET stock_quantity = '${remainingStock}' WHERE id = '${chosenID}'`, function(err, res) {
                        var totalPrice = parseFloat(productPrice * quantity).toFixed(2);
                        console.log(`Your total is $${totalPrice}. Thank you for your purchase!`); 
                   }
                );
               } else {
                   console.log("I'm sorry, we are unable to process your order due to not having enough stock.");
               }
            }
        })

        connection.end();
    });
  };