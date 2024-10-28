// server.js
require('dotenv').config({ path: "./config.env" });
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.json());

// 使用路由
app.use('/auth', authRoutes);

// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
