const myConfig = require('../config/myConfig.js');
const mysql = myConfig.mysql;


var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'dbname',
    multipleStatements: true
});
mysqlConnection.connect((err) => {
    if (!err)
        console.log('Connection Established Successfully');
    else
        console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
});
module.exports.mysqlConnection = mysqlConnection;
