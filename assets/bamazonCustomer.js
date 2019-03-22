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
    var itemsForSale = results;
    console.log(itemsForSale);

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
