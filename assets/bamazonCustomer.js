//-------------------------------------------------------
// -------------------Setup------------------------------
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

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

  // ---Show Inventory---
  function showInventory(answer) {
    connection.query("SELECT * FROM products", function(error, results) {
      console.log("----------------------------------------------------");
      // ---Create Table---
      var inventoryTable = new Table({
        head: ["Item ID#", "Department", "Product", "Price", "Quantity"],
        colWidths: [10, 20, 20, 10, 10]
      });
      for (var i = 0; i < results.length; i++) {
        inventoryTable.push([
          results[i].id,
          results[i].department_name,
          results[i].product_name,
          results[i].price,
          results[i].stock_quantity
        ]);
      }
      console.log(inventoryTable.toString());
      selectionPrompt();
    });
  }

  //-------------------------------------------------------
  ////--------------Run bamazon App------------------------
  showInventory();

  //-------------------------------------------------------
  // ---------------------Inquirer-------------------------
  function selectionPrompt(answer) {
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
      .then(function(answer) {
        //Connection to database to verify stock quantity
        connection.query(
          "SELECT * FROM products WHERE ?",
          {id: answer.purchaseItemID},
          function(error, results) {
            // for (var i = 0; i < results.length; i++) {
            var selectedID = (answer.id) - 1;
            var selectedQuantity = parseInt(answer.stock_quantity);
            if (selectedQuantity > selectedID.stock_quantity) {
              console.log(
                "Sorry, not enough stock. Please select the product and a lower quantity until our stocks have been replenished, we aplogize for the inconvenience."
              );
              selectionPrompt();
              console.log(error);
              
            } else {
              // console.log("Product: " + results[0].product_name);
              console.log(answer.stock_quantity);
            }
            // }
          }
        );
      });
  }

  //Always keep /.end otherwise it will stay connected
  connection.end();
});
