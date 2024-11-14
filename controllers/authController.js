// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { handleSuccess, handleError } = require('../utils/handleResponse');
const memberModel = require('../models/member');

const authController = {

    // 註冊
    register: async (req, res) => {
        console.log(req.body);
        const { username, password, firstName, lastName, role } = req.body;

        if (!username || !password || !firstName || !lastName || !role) {
            return handleError(res, 400, '請填寫所有欄位');
        }

        if (role !== 1 && role !== 2) {
            return handleError(res, 400, '角色錯誤，請填入角色代號 (1:一般會員 2:高級會員)');
        }

        memberModel.findMemberByUsername(username, async (err, results) => {
            if (err) {
                return handleError(res, 500, '例外錯誤#1');
            }
            if (results.length > 0) {
                return handleError(res, 400, '帳號已存在');
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            memberModel.createMember(username, hashedPassword, firstName, lastName, role, (err) => {
                if (err) {
                    return handleError(res, 500, '例外錯誤#1');
                }
                return handleSuccess(res, 201, '註冊成功');
            });
        });
    },

    // 登入
    login: async (req, res) => {
        const { username, password } = req.body;
        memberModel.findMemberByUsername(username, async (err, results) => {
            if (err) {
                return handleError(res, 500, '例外錯誤#1');
            }
            const user = results[0];
            console.log(user);
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return handleError(res, 401, '帳號或密碼錯誤');
            }
            const token = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            console.log(user)
            handleSuccess(res, 200, '登入成功', { token: token, firstName: user.first_name, lastName: user.last_name, userRole: user.role });
        });
    },

    // 查詢會員資料
    getMember: async (req, res) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return handleError(res, 500, '例外錯誤#1');
        }

        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return handleError(res, 403, '憑證驗證失敗');
            }

            memberModel.getMember(user.username, (err, results) => {
                if (err) {
                    return handleError(res, 500, '例外錯誤#1');
                }

                if (results.length === 0) {
                    return handleError(res, 404, '找不到會員資料');
                }

                console.log(results[0]);

                handleSuccess(res, 200, '查詢會員資料成功', results[0]);
            })
        });
    },

    getTestMsg: async (req, res) => {
        handleSuccess(res, 200, '測試接通', { msg: 'Hello World!' });
    }
}

module.exports = authController;
