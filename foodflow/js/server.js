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

    // 1. 食谱表（商品信息）
    db.run(`CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,       -- 食谱名称
      img TEXT NOT NULL,         -- 图片路径
      price REAL NOT NULL,       -- 价格
      author TEXT,               -- 作者（可选）
      createTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) console.error('创建食谱表失败：', err.message);
      else {
        console.log('食谱表初始化成功');
        // 插入示例数据（若不存在）
        db.get("SELECT * FROM recipes WHERE id=1", (err, row) => {
          if (!row) {
            const stmt = db.prepare("INSERT INTO recipes (title, img, price, author) VALUES (?, ?, ?, ?)");
            stmt.run('随园食单', '随园食单40_6.jpg', 40.6, '袁枚');
            stmt.run('每天都要吃蔬菜', '每天都要吃蔬菜16_7.jpg', 16.7, '');
            stmt.run('绝不失手的基础料理', '绝不失手的基础料理25_9.jpg', 25.9, '');
            stmt.finalize();
          }
        });
      }
    });

    // 2. 购物车表（关联用户和食谱，同一用户的同一商品唯一）
    db.run(`CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,  -- 关联用户ID
      recipe_id INTEGER NOT NULL,-- 关联食谱ID
      quantity INTEGER NOT NULL DEFAULT 1, -- 数量
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (recipe_id) REFERENCES recipes(id),
      UNIQUE(user_id, recipe_id) -- 避免重复添加
    )`, (err) => {
      if (err) console.error('创建购物车表失败：', err.message);
      else console.log('购物车表初始化成功');
    });

    // 3. 订单项表（按时间区分订单，每个商品为一个订单项）
    db.run(`CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,  -- 关联用户ID
      recipe_id INTEGER NOT NULL,-- 关联食谱ID
      quantity INTEGER NOT NULL, -- 购买数量
      price REAL NOT NULL,       -- 下单时的价格（固定）
      order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 下单时间
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (recipe_id) REFERENCES recipes(id)
    )`, (err) => {
      if (err) console.error('创建订单项表失败：', err.message);
      else console.log('订单项表初始化成功');
    });

    // 4. 关注表（关联用户和被关注用户）
    db.run(`CREATE TABLE IF NOT EXISTS follows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      follower_id INTEGER NOT NULL,  -- 关注者ID（当前用户）
      following_id INTEGER NOT NULL, -- 被关注者ID（食谱作者）
      FOREIGN KEY (follower_id) REFERENCES users(id),
      FOREIGN KEY (following_id) REFERENCES users(id),
      UNIQUE(follower_id, following_id) -- 避免重复关注
    )`, (err) => {
      if (err) console.error('创建关注表失败：', err.message);
      else console.log('关注表初始化成功');
    });
});

// 验证用户是否登录的中间件（放在所有接口前）
const checkLogin = (req, res, next) => {
  const { user_id } = req.body || req.query; // 支持POST（body）和GET（query）
  if (!user_id) return res.json({ code: 401, msg: '请先登录' });
  
  // 验证用户是否存在
  db.get("SELECT id FROM users WHERE id = ?", [user_id], (err, row) => {
    if (err) return res.json({ code: 500, msg: '数据库错误' });
    if (!row) return res.json({ code: 401, msg: '用户不存在' });
    next(); // 验证通过，继续处理请求
  });
};

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

// 新增：查询所有用户数据的接口（仅开发环境使用，上线后删除）
// 重启后端服务，访问 http://localhost:3000/api/test/db：
app.get('/api/test/db', (req, res) => {
  // 查询 users 表所有数据
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      return res.json({ code: 500, msg: '查询失败', error: err.message });
    }
    // 打印到控制台
    console.log('数据库 users 表数据：', rows);
    // 同时也可以返回给前端查看
    res.json({ code: 200, data: rows });
  });
});



// （1）添加商品到购物车（存在则数量+1，否则新增）
app.post('/api/cart/add', checkLogin, (req, res) => {
  const { user_id, recipe_id } = req.body;
  if (!recipe_id) return res.json({ code: 400, msg: '商品ID不能为空' });

  // 检查商品是否存在
  db.get("SELECT id FROM recipes WHERE id = ?", [recipe_id], (err, row) => {
    if (err) return res.json({ code: 500, msg: '数据库错误' });
    if (!row) return res.json({ code: 400, msg: '商品不存在' });

    // 检查购物车中是否已有该商品
    db.get("SELECT quantity FROM cart WHERE user_id = ? AND recipe_id = ?", 
      [user_id, recipe_id], (err, cartRow) => {
        if (err) return res.json({ code: 500, msg: '数据库错误' });
        
        if (cartRow) {
          // 已有商品，数量+1
          const newQty = cartRow.quantity + 1;
          db.run("UPDATE cart SET quantity = ? WHERE user_id = ? AND recipe_id = ?", 
            [newQty, user_id, recipe_id], (err) => {
              if (err) return res.json({ code: 500, msg: '更新失败' });
              res.json({ code: 200, msg: '添加成功', data: { quantity: newQty } });
            });
        } else {
          // 新增商品
          db.run("INSERT INTO cart (user_id, recipe_id) VALUES (?, ?)", 
            [user_id, recipe_id], (err) => {
              if (err) return res.json({ code: 500, msg: '添加失败' });
              res.json({ code: 200, msg: '添加成功', data: { quantity: 1 } });
            });
        }
      });
  });
});

// （2）获取用户购物车列表
app.get('/api/cart', checkLogin, (req, res) => {
  const { user_id } = req.query;
  // 联表查询购物车+商品详情
  const sql = `
    SELECT c.quantity, r.id as recipe_id, r.title, r.img, r.price, r.author
    FROM cart c
    JOIN recipes r ON c.recipe_id = r.id
    WHERE c.user_id = ?
  `;
  db.all(sql, [user_id], (err, rows) => {
    if (err) return res.json({ code: 500, msg: '数据库错误' });
    res.json({ code: 200, data: rows });
  });
});

// （3）删除购物车商品
app.delete('/api/cart', checkLogin, (req, res) => {
  const { user_id, recipe_id } = req.body;
  db.run("DELETE FROM cart WHERE user_id = ? AND recipe_id = ?", 
    [user_id, recipe_id], (err) => {
      if (err) return res.json({ code: 500, msg: '删除失败' });
      res.json({ code: 200, msg: '删除成功' });
    });
});

// （4）更新购物车商品数量
app.put('/api/cart/update', checkLogin, (req, res) => {
  const { user_id, recipe_id, quantity } = req.body;
  if (!recipe_id || quantity < 1) return res.json({ code: 400, msg: '数量必须≥1' });

  db.run("UPDATE cart SET quantity = ? WHERE user_id = ? AND recipe_id = ?", 
    [quantity, user_id, recipe_id], (err) => {
      if (err) return res.json({ code: 500, msg: '更新失败' });
      res.json({ code: 200, msg: '更新成功' });
    });
});



// （1）创建订单（从购物车选中商品生成订单，同时删除购物车中对应商品）
app.post('/api/orders/create', checkLogin, (req, res) => {
  const { user_id, items } = req.body; // items格式：[{recipe_id, quantity}, ...]
  if (!items || !items.length) return res.json({ code: 400, msg: '请选择商品' });

  // 开启数据库事务（确保订单创建和购物车删除原子性）
  db.run("BEGIN TRANSACTION", (err) => {
    if (err) return res.json({ code: 500, msg: '创建订单失败' });

    let completed = 0;
    let hasError = false;

    items.forEach((item) => {
      const { recipe_id, quantity } = item;
      if (!recipe_id || quantity < 1) {
        hasError = true;
        return;
      }

      // 获取商品价格（下单时固定价格）
      db.get("SELECT price FROM recipes WHERE id = ?", [recipe_id], (err, row) => {
        if (err || !row) {
          hasError = true;
          finalize();
          return;
        }

        // 插入订单项
        db.run("INSERT INTO order_items (user_id, recipe_id, quantity, price) VALUES (?, ?, ?, ?)", 
          [user_id, recipe_id, quantity, row.price], (err) => {
            if (err) {
              hasError = true;
              finalize();
              return;
            }

            // 从购物车删除该商品
            db.run("DELETE FROM cart WHERE user_id = ? AND recipe_id = ?", 
              [user_id, recipe_id], (err) => {
                if (err) hasError = true;
                finalize();
              });
          });
      });
    });

    // 所有商品处理完成后提交/回滚事务
    function finalize() {
      completed++;
      if (completed === items.length) {
        if (hasError) {
          db.run("ROLLBACK", () => res.json({ code: 400, msg: '订单创建失败' }));
        } else {
          db.run("COMMIT", () => res.json({ code: 200, msg: '订单创建成功' }));
        }
      }
    }
  });
});

// （2）获取用户订单列表（按时间倒序）
app.get('/api/orders', checkLogin, (req, res) => {
  const { user_id } = req.query;
  const sql = `
    SELECT oi.id, oi.quantity, oi.price, oi.order_time, r.title, r.img, r.author
    FROM order_items oi
    JOIN recipes r ON oi.recipe_id = r.id
    WHERE oi.user_id = ?
    ORDER BY oi.order_time DESC
  `;
  db.all(sql, [user_id], (err, rows) => {
    if (err) return res.json({ code: 500, msg: '数据库错误' });
    res.json({ code: 200, data: rows });
  });
});

// （3）删除订单
app.delete('/api/orders', checkLogin, (req, res) => {
  const { user_id, order_id } = req.body;
  db.run("DELETE FROM order_items WHERE id = ? AND user_id = ?", 
    [order_id, user_id], (err) => {
      if (err) return res.json({ code: 500, msg: '删除失败' });
      res.json({ code: 200, msg: '删除成功' });
    });
});




// 关注接口
app.post('/api/follow', checkLogin, (req, res) => {
  const { follower_id, following_id } = req.body;

  // 打印接收到的参数
  // console.log('接收参数：', { follower_id, following_id });

  // 检查是否已关注
  db.get("SELECT * FROM follows WHERE follower_id = ? AND following_id = ?", [follower_id, following_id], (err, row) => {
      if (err) {
        console.error('数据库查询错误:', err); // 打印详细错误
        return res.json({ code: 500, msg: '数据库查询失败' });
      }
      if (row) {
        // 取消关注逻辑
        db.run("DELETE FROM follows WHERE follower_id = ? AND following_id = ?", [follower_id, following_id], (delErr) => {
          if (delErr) {
            console.error('取消关注错误:', delErr);
            return res.json({ code: 500, msg: '取消关注失败' });
          }
          res.json({ code: 200, msg: '取消关注成功' });
        });
      } else {
        // 关注逻辑
        db.run("INSERT INTO follows (follower_id, following_id) VALUES (?, ?)", [follower_id, following_id], (insErr) => {
          if (insErr) {
            console.error('关注插入错误:', insErr);
            // 常见错误如 UNIQUE 约束冲突（重复关注）、外键约束失败（用户不存在）
            if (insErr.message.includes('UNIQUE constraint failed')) {
              return res.json({ code: 400, msg: '已关注过该用户' });
            }
            if (insErr.message.includes('FOREIGN KEY constraint failed')) {
              return res.json({ code: 400, msg: '关注对象或当前用户不存在' });
            }
            return res.json({ code: 500, msg: '关注失败' });
          }
          res.json({ code: 200, msg: '关注成功' });
        });
      }
  });
});

// 获取关注列表接口（确保正确关联用户表）
app.get('/api/follow/list', checkLogin, (req, res) => {
  const { user_id } = req.query;
  console.log('当前用户ID:', user_id); // 确认传递的user_id正确

  // 正确的关联查询
  db.all(`
      SELECT u.id, u.username, u.phone 
      FROM follows f 
      JOIN users u ON f.following_id = u.id 
      WHERE f.follower_id = ?
  `, [user_id], (err, rows) => {
      if (err) {
          console.error('查询关注列表失败:', err);
          return res.json({ code: 500, msg: '服务器错误' });
      }
      console.log('查询结果:', rows); // 打印结果，确认是否有数据
      res.json({ code: 200, data: rows });
  });
});

// 检查是否已关注
app.get('/api/checkFollow', checkLogin, (req, res) => {
  const { follower_id, following_id } = req.query;
  
  // 验证参数
  if (!follower_id || !following_id) {
      return res.json({ code: 400, msg: '参数不完整' });
  }

  // 查询关注关系
  db.get(
      "SELECT * FROM follows WHERE follower_id = ? AND following_id = ?",
      [follower_id, following_id],
      (err, row) => {
          if (err) {
              console.error('查询关注状态失败:', err);
              return res.json({ code: 500, msg: '服务器错误' });
          }
          // 存在记录则已关注，否则未关注
          res.json({ 
              code: 200, 
              data: { isFollowed: !!row } 
          });
      }
  );
});


// 启动服务器
app.listen(port, () => {
  console.log(`后端服务运行在 http://localhost:${port}`);
});