const mysql = require("mysql2");

const connection = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
};


let db;
function connectDB() {
  if (!db) {
    db = mysql.createConnection(connection);

    db.connect((err) => {
      if (!err) {
        console.log("MySql database connected successfully ...!!");
      } else {
        console.log("Error database connect !!");
      }
    });
  }
  return db.promise(); 
}

module.exports = connectDB();
