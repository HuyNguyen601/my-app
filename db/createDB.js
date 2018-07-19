const mysql = require('mysql')

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "117602702"
});

connection.connect(function(error){
  if(error) throw error;
  console.log("Connected");
});
connection.query('DROP DATABASE IF EXISTS FOO',
    function (error, results, fields) {
        if (error) throw error;
        // we should do something more interesting for errors
    }
);

connection.query('CREATE DATABASE FOO',
     function (error, results, fields) {
          if (error) throw error;
     }
);
connection.query('USE FOO', function (error, results, fields) {
   if (error) throw error;
});
connection.query('CREATE TABLE IF NOT EXISTS TEST(ID INTEGER)',
    function (error, results, fields) {
        if (error) throw error;
    }
);
// Just to illustrate a wqay to escape strings in this module:
var escaped_1 = connection.escape("1");
// Now do an insert
connection.query('INSERT INTO TEST VALUES (' + escaped_1 +
    '), (2), (3), (4), (5)',
    function (error, results, fields) {
        if (error) throw error;
    }
);
/* close the connection.
   makes sure all queries terminate before closing connection
 */
connection.end(function(err) {
});
console.log("Database Created!");
