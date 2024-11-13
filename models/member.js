const db = require('../connection/mysql');

// 檢查會員帳號是否存在
const findMemberByUsername = (username, callback) => {
    db.query('SELECT username, password FROM members WHERE username = ?', [username], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// 新增會員
const createMember = (username, hashedPassword, firstName, lastName, role, callback) => {
    db.query('INSERT INTO members (username, password, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)', [username, hashedPassword, firstName, lastName, role], (err, results) => {
        if (err) {
            console.error('插入會員失敗:', err);
            return callback(err);
        }
        console.log('插入成功，新增的會員ID:', results.insertId);
        callback(null, results);
    });
};

const getMember = (username, callback) => {
    db.query('SELECT username, first_name, last_name, role FROM members WHERE username = ?', [username], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};

// 導出模型
module.exports = {
    findMemberByUsername,
    createMember,
    getMember
};
