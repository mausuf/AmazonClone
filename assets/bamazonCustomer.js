//-------------------------------------------------------
// -------------------Setup------------------------------
var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
  host: "localhost",
  // Port
  port: 3306,
  // Username
  user: "root",
  // Password
  password: "Qwerty555!",
  database: "bamazon"
});
//-------------------------------------------------------
// ---------------------Connection-----------------------
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  // connection.query("SELECT * FROM products", function(error, results) {
  //   if (error) throw error;

  //   for (var i = 0; i < results.length; i++) {
  //     var itemsForSale = results[i].id;
  //     var productName = results[i].product_name;
  //     var departmentName = results[i].department_name;
  //     var itemPrice = results[i].price;
  //     var stockQuantity = results[i].stock_quantity;
  //     console.log("Item#: " + itemsForSale);
  //     console.log("Department: " + departmentName);
  //     console.log("Product: " + productName);
  //     console.log("Price: " + itemPrice);
  //     console.log("Stock: " + stockQuantity);
  //     console.log("-----------");
  //   }

  //   //Calling Inquirer Functions
  //   // selectionPrompt(itemsForSale);
  // });

  // Puts items into Table
  var table = function() {
    connection.query("SELECT * FROM products", function(error, results) {
      console.log("----------------------------------------------------");
      for (var i = 0; i < results.length; i++) {
        console.log(
          results[i].id +
            " | " +
          results[i].product_name +
            " | $" +
          results[i].price +
            " | " +
          results[i].stock_quantity
        );
      }
      console.log("----------------------------------------------------");
      selectionPrompt();
    });  
  };

  //-------------------------------------------------------
  ////--------------Run bamazon App------------------------
  table();

  //-------------------------------------------------------
  // ---------------------Inquirer-------------------------
  function selectionPrompt() {
    inquirer
      .prompt([
        {
          name: "purchaseItemID",
          type: "input",
          message:
            "Please enter the ID number of the item you would like to purchase?"
        },
        {
          name: "purchaseQuantity",
          type: "input",
          message: "How many units of this product would you like to purchase?"
        }
      ])
      .then(function(buyPrompt) {
        //Connection to database to verify stock quantity
        connection.query(
          "SELECT * FROM products WHERE id=?",
          buyPrompt.purchaseItemID,
          function(error, results) {
            for (var i = 0; i < results.length; i++) {
              if (buyPrompt.purchaseQuantity > results[i.stock_quantity]) {
                console.log(
                  "Sorry, not enough stock. Please select the product and a lower quanity until our stocks have been replenished, we aplogize for the inconvenience."
                );
                selectionPrompt(itemsForSale);
              } else {
                console.log("Product: " + results[i.product_name]);
              }
            }
          }
        );
      });
  }

  //Always keep /.end otherwise it will stay connected
  connection.end();
});
