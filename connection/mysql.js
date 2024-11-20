// DB 連線
const mysql = require('mysql2');

// 建立 MySQL 連接
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // host: DB_HOST,
    // user: DB_USER,
    // password: DB_PASSWORD,
    // database: DB_NAME,
});

module.exports = db;