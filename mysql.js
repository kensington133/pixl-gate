var mysql = require('mysql');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'pixl-admin',
	password : 'testing123',
	database : 'pixl_gate'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

module.exports = connection;