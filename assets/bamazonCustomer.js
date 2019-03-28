//-------------------------------------------------------
// -------------------Setup------------------------------
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

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
          parseInt(results[i].stock_quantity, 10)
        ]);
      }
      console.log(inventoryTable.toString());
      selectionPrompt();
    });
  }

  //-------------------------------------------------------
  //----------------Run bamazon App------------------------
  showInventory();

  //-------------------------------------------------------
  // ---------------------Inquirer-------------------------
  function selectionPrompt() {
    inquirer
      .prompt([
        {
          name: "purchaseItemID",
          type: "input",
          message:
            "Hello, my friend. Stay awhile and listen... Please enter the ID number of the item you would like to purchase?"
        },
        {
          name: "purchaseQuantity",
          type: "input",
          message: "How many units of this product would you like to purchase?"
        }
      ])
      .then(function(answer) {
        //Connection to database to verify stock quantity
        var query = "SELECT * FROM products WHERE id = ?";
        var purchaseItemID;
        var productName = "SELECT product_name FROM products";

        connection.query(query, answer.purchaseItemID, function(
          error,
          results
        ) {
          // var selectedID = parseInt((answer.id) - 1, 10);
          // var selectedQuantity = parseInt(answer.stock_quantity, 10);
          // console.log(answer);
          // console.log(selectedID);
          for (var i = 0; i < results.length; i++) {
            console.log(
              "You selected " +
                results[i].product_name +
                " with quantity of " +
                answer.purchaseQuantity
            );
            if (answer.purchaseQuantity > results[i].stock_quantity) {
              console.log(
                "Sorry, not enough stock. Please select the product and a lower quantity until our stocks have been replenished, we aplogize for the inconvenience."
              );
              selectionPrompt();
              // console.log(error);
            } else {
              console.log("------------------------------------");
              console.log(
                "We can fullfill your order of " + results[i].product_name
              );
              console.log(
                "Your total will be $" +
                  results[i].price * answer.purchaseQuantity
              );

              var newStock =
                results[i].stock_quantity - answer.purchaseQuantity;
              var purchaseID = answer.purchaseItemID;
              checkout(newStock, purchaseID);
            }
          }
        });
      });
  }

  //-------------------------------------------------------
  // -----------------Customer Checkout--------------------
  function checkout(newStock, purchaseID) {
    inquirer
      .prompt([
        {
          name: "checkout",
          type: "confirm",
          message:
            "Are you sure you would like to purchase this item and quantity amount?",
          default: true
        }
      ])
      //-----------------Update SQL Table Inventory Column--------------------
      .then(function(user) {
        if (user.checkout === true) {
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: newStock
              },
              {
                id: purchaseID
              }
            ],
            function(error, results) {}
          );
          console.log("Thank you for your purchase");
          showInventory();
        } else {
          console.log(
            "No problem, we hope you come back again soon to see our new inventory!"
          );
          showInventory();
          console.log(
            "We have more items for you to purchase!"
          )
        }
      });
  }
  //Always keep /.end otherwise it will stay connected
  // connection.end();
});
