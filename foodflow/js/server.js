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
        username TEXT UNIQUE NOT NULL,  -- 账号（唯一）
        password TEXT NOT NULL,         -- 密码
        phone TEXT UNIQUE,              -- 手机号（可选，唯一）
        createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 注册时间
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
    const { loginName, password } = req.body; // 用loginName接收（支持账号或手机号）
  
    // 1. 验证参数
    if (!loginName || !password) {
      return res.json({ code: 400, msg: '账号/手机号和密码不能为空' });
    }
  
    // 2. 查询数据库（同时匹配username或phone）
    const sql = `
      SELECT * FROM users 
      WHERE (username = ? OR phone = ?) AND password = ?
    `;
    db.get(sql, [loginName, loginName, password], (err, row) => {
      if (err) {
        return res.json({ code: 500, msg: '数据库错误' });
      }
      if (row) {
        // 登录成功，返回用户信息（脱敏处理，不返回密码）
        res.json({ 
          code: 200, 
          msg: '登录成功', 
          data: { 
            id: row.id,
            username: row.username,
            phone: row.phone 
          } 
        });
      } else {
        res.json({ code: 401, msg: '账号/手机号或密码错误' });
      }
    });
  });

// 注册接口
app.post('/api/register', (req, res) => {
    const { phone, username, password } = req.body; // 新增phone字段接收
  
    // 1. 后端基础验证
    if (!username || !password) {
      return res.json({ code: 400, msg: '账号和密码不能为空' });
    }
    if (password.length < 6) {
      return res.json({ code: 400, msg: '密码长度不能少于6位' });
    }
  
    // 2. 插入数据库（包含手机号，若有）
    const sql = phone 
      ? 'INSERT INTO users (username, password, phone) VALUES (?, ?, ?)'
      : 'INSERT INTO users (username, password) VALUES (?, ?)';
    const params = phone ? [username, password, phone] : [username, password];
  
    db.run(sql, params, function (err) {
      if (err) {
        // 处理唯一约束错误（用户名或手机号已存在）
        if (err.message.includes('UNIQUE constraint failed: users.username')) {
          return res.json({ code: 400, msg: '用户名已存在' });
        }
        if (err.message.includes('UNIQUE constraint failed: users.phone')) {
          return res.json({ code: 400, msg: '手机号已被注册' });
        }
        return res.json({ code: 500, msg: '注册失败，请重试' });
      }
      res.json({ code: 200, msg: '注册成功', data: { id: this.lastID } });
    });
  });

// 启动服务器
app.listen(port, () => {
    console.log(`后端服务运行在 http://localhost:${port}`);
});
