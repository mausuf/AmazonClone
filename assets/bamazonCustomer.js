var mysql = require("mysql");

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
    console.log(results);
    connection.end();
  });
});
