// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const memberModel = require('../models/member');

const authController = {
    // 註冊
    register: async (req, res) => {
        console.log(req.body);
        const { username, password, firstName, lastName } = req.body;

        memberModel.findMemberByUsername(username, async (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error' });
            }
            if (results.length > 0) {
                return res.status(400).json({ message: 'Username already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            memberModel.createMember(username, hashedPassword, firstName, lastName, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Database error' });
                }
                res.status(201).json({ message: 'Member registered successfully' });
            });
        });
    },

    // 登入
    login: async (req, res) => {
        const { username, password } = req.body;
        memberModel.findMemberByUsername(username, async (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error' });
            }
            const user = results[0];
            console.log(user);
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        });
    },

    // 查詢會員資料
    getMember: async  (req, res) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.sendStatus(401);
        }

        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            memberModel.getMember(user.username, (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Database error' });
                }
                
                if(results.length === 0) {
                    return res.status(404).json({ message: 'Member not found' });
                }
                
                res.json(results[0]);
            })
        });
    },
}

module.exports = authController;
