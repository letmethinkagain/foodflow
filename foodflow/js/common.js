/**
 * 通用工具函数
 * 处理页面跳转、提示信息和登录状态管理
 */

/**
 * 页面跳转函数
 * @param {string} url - 目标页面路径
 */
function jumpTo(url) {
    window.location.href = url;
}

/**
 * 带提示的页面跳转
 * @param {string} url - 目标页面路径
 * @param {string} msg - 提示信息
 * @param {number} delay - 延迟时间(毫秒)，默认5000
 */
function jumpWithTip(url, msg, delay = 5000) {
    showToast(msg);
    setTimeout(() => {
        jumpTo(url);
    }, delay);
}

/**
 * 显示提示信息
 * @param {string} msg - 提示内容
 * @param {boolean} isError - 是否为错误提示，默认false
 */
function showToast(msg, isError = false) {
    // 先移除已存在的toast
    const oldToast = document.querySelector('.custom-toast');
    if (oldToast) {
        oldToast.remove();
    }

    // 创建新弹窗
    const toast = document.createElement('div');
    toast.className = `custom-toast ${isError ? 'error' : ''}`;
    toast.textContent = msg;
    toast.style.position = 'fixed';
    toast.style.top = '50%';
    toast.style.left = '50%';
    toast.style.transform = 'translate(-50%, -50%)';
    toast.style.padding = '0.75rem 1.5rem';
    toast.style.borderRadius = '0.5rem';
    toast.style.backgroundColor = isError ? '#ff4d4f' : 'rgba(0, 0, 0, 0.7)';
    toast.style.color = 'white';
    toast.style.zIndex = '9999';
    toast.style.transition = 'opacity 0.3s ease';

    // 添加到页面
    document.body.appendChild(toast);

    // 5秒后自动消失
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否登录
 */
function checkLogin() {
    const userInfo = localStorage.getItem('currentUser');
    return !!userInfo;
}

/**
 * 获取当前登录用户信息
 * @returns {object|null} 用户信息对象或null
 */
function getCurrentUser() {
    const userInfo = localStorage.getItem('currentUser');
    return userInfo ? JSON.parse(userInfo) : null;
}

/**
 * 退出登录
 */
function logout() {
    localStorage.removeItem('currentUser');
    showToast('已成功退出登录');
    updateHeaderUserAction(); // 更新头部
    if (window.location.pathname.includes('mine.html')) {
        updateMyPageUserInfo(); // 更新我的页面
    }
}
    

/**
 * 检查登录状态，未登录则显示弹窗提示（不自动跳转）
 * @returns {boolean} 是否已登录
 */
function checkLoginWithModal() {
    if (checkLogin()) {
        return true; // 已登录，返回true
    }

    // 未登录，显示提示弹窗
    showLoginModal();
    return false;
}

/**
 * 显示“需要登录”的弹窗
 */
function showLoginModal() {
    // 先移除已存在的弹窗（避免重复）
    const oldModal = document.querySelector('.login-modal');
    if (oldModal) {
        oldModal.remove();
    }

    // 创建弹窗容器
    const modal = document.createElement('div');
    modal.className = 'login-modal fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl transform transition-all">
            <div class="text-center mb-4">
                <i class="fa fa-info-circle text-blue-500 text-3xl mb-2"></i>
                <h3 class="text-lg font-medium text-gray-800">需要登录</h3>
                <p class="text-gray-500 mt-1">该操作需要登录账号，是否前往登录？</p>
            </div>
            <div class="flex justify-center gap-3 mt-6" id="button-area">
                <button id="cancelLogin" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                    取消
                </button>
                <button id="goLogin" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    去登录
                </button>
            </div>
        </div>
    `;

    // 添加到页面
    document.body.appendChild(modal);

    // 点击“取消”关闭弹窗
    modal.querySelector('#cancelLogin').addEventListener('click', () => {
        modal.remove();
    });

    // 点击“去登录”跳转到登录页（保留当前页面路径，登录后可返回）
    modal.querySelector('#goLogin').addEventListener('click', () => {
        // 记录当前页面URL，登录成功后返回
        localStorage.setItem('redirectAfterLogin', window.location.href);
        jumpTo('login.html'); // 跳转到登录页
    });

    // 点击弹窗外部关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

/**
 * 登录成功后返回之前的页面（如果有记录）
 */
function redirectAfterLogin() {
    const redirectUrl = localStorage.getItem('redirectAfterLogin');
    if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        jumpTo(redirectUrl); // 返回触发登录的页面
    } else {
        jumpTo('index.html'); // 默认跳转首页
    }
}


/**
 * 扩展：页面加载时更新头部用户操作区（登录/头像切换 + 购物车逻辑）
 */
function updateHeaderUserAction() {
    const container = document.getElementById('userActionContainer');
    if (!container) return; // 非首页无容器，直接返回
  
    if (checkLogin()) {
        // 已登录：渲染仅带边框头像 + 购物车跳转“我的”页面
        const user = getCurrentUser();
        container.innerHTML = `
          <a href="mine.html" class="cart-icon" id="loggedCartIcon"><i class="fa fa-shopping-cart"></i></a>
          <div class="logged-user flex items-center">
            <!-- 带边框的头像，用用户名首字母示例，可扩展真实头像 -->
            <div class="avatar bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2 border-2 border-white">
              ${user.username.charAt(0).toUpperCase()}
            </div>
          </div>
        `;

    } else {
      // 未登录：渲染登录注册
      container.innerHTML = `
        <a href="javascript:void(0)" class="cart-icon" id="unloggedCartIcon"><i class="fa fa-shopping-cart"></i></a>
        <div class="login-register">
          <a href="login.html">登录</a><span>|</span>
          <a href="register.html">注册</a>
        </div>
      `;

    }
  }


    // 绑定购物车图标点击事件（通用逻辑）
    function bindCartIconEvent() {
        const cartIcon = document.querySelector('.cart-icon');
        if (!cartIcon) return;

        cartIcon.addEventListener('click', (e) => {
            e.preventDefault(); // 阻止默认跳转

            if (checkLogin()) {
                // 已登录：标记跳转来源，跳转到我的页面
                localStorage.setItem('fromCart', 'true');
                jumpWithTip('mine.html', '前往我的购物车', 2000);
            } else {
                // 未登录：显示登录弹窗
                showLoginModal();
            }
        });
    }
  
    /**
     * 激活我的页面购物车功能区
     */
    function activateMyPageCart() {
        // 确保在mine.html中执行
        if (!window.location.pathname.includes('mine.html')) return;

        // 等待DOM完全加载（100ms延迟确保按钮已渲染）
        setTimeout(() => {
            const cartBtn = document.querySelector('.func-item[data-type="cart"]');
            if (cartBtn) {
                cartBtn.click(); // 触发点击加载内容

                // 找到按钮内的 i 元素，添加 active 类名（对应你的 CSS 置灰规则）
                const cartIcon = cartBtn.querySelector('i');
                if (cartIcon) {
                    cartIcon.classList.add('active');
                }

                // 移除其他按钮 i 元素的 active 类名
                document.querySelectorAll('.func-item i').forEach(icon => {
                    if (icon!== cartIcon) {
                        icon.classList.remove('active');
                    }
                });
            }
        }, 100);
    }


  
/**
 * 页面初始化（合并所有load事件）
 */
window.addEventListener('load', () => {
    // 1. 更新头部
    updateHeaderUserAction();

    // 2. 绑定购物车点击事件
    bindCartIconEvent();

    // 3. 绑定消息按钮事件
    const messageLink = document.getElementById('messageLink');
    if (messageLink) {
        messageLink.addEventListener('click', (e) => {
            if (!checkLoginWithModal()) e.preventDefault();
        });
    }

    // 4. 我的页面专属逻辑
    if (window.location.pathname.includes('mine.html')) {
        updateMyPageUserInfo(); // 更新用户信息
        // 检查是否从购物车图标跳转，若是则激活购物车
        if (localStorage.getItem('fromCart')) {
            localStorage.removeItem('fromCart'); // 清除标记
            activateMyPageCart(); // 激活购物车
        }
    }
});

// 监听storage事件，当currentUser变化时同步更新所有页面
window.addEventListener('storage', function(event) {
    if (event.key === 'currentUser') {
      if (document.getElementById('userInfoContainer')) {
        updateMyPageUserInfo();
      }
    }
  });