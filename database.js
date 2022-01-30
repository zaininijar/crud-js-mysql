var mysql = require('mysql');

var database = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_javascript_mysql'
});

database.connect(function(err){
    if(err) throw err;
    console.log("Connected");
});

module.exports = database;