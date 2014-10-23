var mysql = require('mysql');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'pixl-admin',
	password : 'QD3ULVTbCerZ8C9e',
	database : 'pixl-gate',
	port : '8888'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

module.exports = connection;