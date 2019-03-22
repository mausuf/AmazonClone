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
  connection.query("select * from products", function(error, results) {
    if (error) throw error;

    for (var i=0; i<results.length; i++){
    var itemsForSale = results[i].id;
    var productName = results[i].product_name;
    var departmentName = results[i].department_name;
    var itemPrice = results[i].price;
    var stockQuantity = results[i].stock_quantity;
    console.log("Item#: " + itemsForSale);
    console.log("Department: " + departmentName);
    console.log("Product: " + productName);
    console.log("Price: " + itemPrice);
    console.log("Stock: " + stockQuantity);
    console.log("-----------");
    }
    buyPrompt(itemsForSale);
  });

  function buyPrompt() {
    inquirer.prompt({
      name: "action",
      type: "list",
      message: "What would you like to purchase?",
      choices: []
    });
  }
  //Always keep /.end otherwise it will stay connected
  connection.end();
});
