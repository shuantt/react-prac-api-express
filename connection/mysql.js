// DB 連線
const mysql = require('mysql2');

// 建立 MySQL 連接
const db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
});

module.exports = db;