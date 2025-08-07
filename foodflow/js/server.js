// 引入依赖
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

// 创建Express应用
const app = express();
const port = 3000; // 后端服务端口

// 中间件配置
app.use(cors()); // 允许跨域
app.use(bodyParser.json()); // 解析JSON格式的请求体

// 连接SQLite数据库（不存在会自动创建）
const db = new sqlite3.Database('./mydb.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('成功连接到SQLite数据库');

    // 初始化用户表（如果不存在）
    db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
        if (err) {
            console.error('创建表失败：', err.message);
        } else {
            console.log('用户表初始化成功');
        }
    });
});

// 测试接口（前端可以访问这个接口验证后端是否正常）
app.get('/api/test', (req, res) => {
    res.json({ message: '后端服务正常运行中' });
});

// 登录接口
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // 查询数据库中是否有匹配的用户
    db.get('SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, row) => {
            if (err) {
                return res.json({ code: 500, msg: '数据库错误' });
            }
            if (row) {
                // 登录成功（实际项目可以加token，这里简化处理）
                res.json({ code: 200, msg: '登录成功', data: { username: row.username } });
            } else {
                res.json({ code: 401, msg: '账号或密码错误' });
            }
        }
    );
});

// 注册接口
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    // 插入新用户
    db.run('INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password],
        function (err) {
            if (err) {
                return res.json({ code: 500, msg: '注册失败，用户名可能已存在' });
            }
            res.json({ code: 200, msg: '注册成功', data: { id: this.lastID } });
        }
    );
});

// 启动服务器
app.listen(port, () => {
    console.log(`后端服务运行在 http://localhost:${port}`);
});
