// 返回上一界面
function goBack() {
    window.history.back();
}

// 切换标签
function switchTab(tab) {
    const tabs = document.querySelectorAll('.tab');
    const followList = document.getElementById('followList');
    const fansList = document.getElementById('fansList');

    tabs.forEach(t => t.classList.remove('active'));
    document.querySelector(`.tab[onclick="switchTab('${tab}')"]`).classList.add('active');
    
    if (tab === 'follow') {
        followList.style.display = 'block';
        fansList.style.display = 'none';
        loadFollowList(); // 加载关注列表
    } else {
        followList.style.display = 'none';
        fansList.style.display = 'block';
    }
}

// 加载关注列表
function loadFollowList() {
    const currentUser = getCurrentUser();
    const followList = document.getElementById('followList');
    
    // 1. 检查登录状态
    if (!currentUser) {
        followList.innerHTML = '<div class="error">请先登录</div>';
        console.log('未登录：currentUser 为空');
        return;
    }
    console.log('当前登录用户ID：', currentUser.id);

    // 2. 显示加载中
    followList.innerHTML = '<div class="loading">加载中...</div>';

    // 3. 构建请求URL（带随机参数防缓存）
    const url = `http://localhost:3000/api/follow/list?user_id=${currentUser.id}&t=${Date.now()}`;
    console.log('请求URL：', url);

    // 4. 发送请求
    fetch(url)
        .then(res => {
            // 检查HTTP状态码（2xx才是成功）
            console.log('响应状态码：', res.status);
            if (!res.ok) {
                throw new Error(`请求失败，状态码：${res.status}`);
            }
            // 解析JSON
            return res.json().catch(err => {
                throw new Error(`JSON解析失败：${err.message}`);
            });
        })
        .then(data => {
            // 检查接口返回格式
            console.log('接口返回数据：', data);
            if (typeof data !== 'object' || data.code === undefined) {
                throw new Error('接口返回格式错误，缺少code字段');
            }

            // 处理业务逻辑
            if (data.code === 200) {
                if (data.data && Array.isArray(data.data)) {
                    if (data.data.length === 0) {
                        followList.innerHTML = '<div class="empty">暂无关注用户</div>';
                    } else {
                        renderFollowList(data.data);
                    }
                } else {
                    throw new Error('接口返回data不是数组');
                }
            } else {
                followList.innerHTML = `<div class="error">${data.msg || '获取失败'}</div>`;
            }
        })
        .catch(err => {
            // 捕获所有错误（网络错误、解析错误、业务错误）
            console.error('加载关注列表出错：', err.message);
            followList.innerHTML = `<div class="error">加载失败：${err.message}</div>`;
        });
}


// 渲染关注列表
function renderFollowList(users) {
    const followList = document.getElementById('followList');
    followList.innerHTML = '';
    users.forEach(user => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="user-info">
                <img src="../img/carousel1.png" alt="头像" class="avatar">
                <span class="name">${user.username}</span>
            </div>
            <div class="unfollow-btn" onclick="unfollow(${user.id})">已关注</button>
        `;
        followList.appendChild(item);
    });
}

function unfollow(followingId) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        showToast('请先登录', true);
        return;
    }

    // 找到当前按钮并临时禁用
    const buttons = document.querySelectorAll('.unfollow-btn');
    const currentBtn = Array.from(buttons).find(btn => {
        // 匹配点击的按钮（根据onclick参数）
        return btn.getAttribute('onclick') === `unfollow(${followingId})`;
    });
    
    if (currentBtn) {
        currentBtn.disabled = true;
        currentBtn.textContent = '处理中...';
    }

    fetch('http://localhost:3000/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: currentUser.id,
            follower_id: currentUser.id,
            following_id: followingId
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.code === 200) {
            showToast(data.msg);
            // 重新加载列表，自动更新所有按钮状态
            loadFollowList();
        } else {
            showToast(data.msg, true);
            // 恢复按钮状态
            if (currentBtn) {
                currentBtn.textContent = '已关注';
                currentBtn.disabled = false;
            }
        }
    })
    .catch(err => {
        console.error('取消关注失败:', err);
        showToast('网络错误，操作失败', true);
        // 恢复按钮状态
        if (currentBtn) {
            currentBtn.textContent = '已关注';
            currentBtn.disabled = false;
        }
    });
}


// 搜索关注
function searchFollow() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const userItems = document.querySelectorAll('.list-item');
    
    userItems.forEach(item => {
        const username = item.querySelector('.username').textContent.toLowerCase();
        if (username.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// 页面加载时默认加载关注列表
window.addEventListener('load', () => {
    // 检查登录状态
    if (!checkLogin()) {
        showLoginModal();
    } else {
        switchTab('follow'); // 默认显示关注列表
    }

    // 绑定搜索框事件
    document.getElementById('searchInput').addEventListener('input', searchFollow);
});