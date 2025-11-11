const mysql = require('mysql2')

let connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'gaoyidan',
	database:'vueshop'
})


module.exports = connection
/*const mysql = require('mysql2')

let connection = mysql.createConnection({
  host: '118.195.143.106',          // 本地数据库
  user: 'vueshop',            // 用户名
  password: 'CRMLZFsn4Lf8wkYR',  // 密码
  database: 'vueshop'         // 数据库名
})

module.exports = connection*/
