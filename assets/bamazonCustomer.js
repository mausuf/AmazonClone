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

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  //Always keep /.end otherwise it will stay connected
  connection.query("select * from products", function(error,results) {
    if (error) throw error;
    var itemsForSale = results;
    console.log(itemsForSale);

    buyPrompt(itemsForSale);
  });

  function buyPrompt() {
    inquirer
      .prompt({
        name: "action",
        type: "rawlist",
        message: "What would you like to purchase?",
        choices: [
        ]
      })

  }




  connection.end();
});
