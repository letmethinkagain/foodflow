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
 * @param {number} delay - 延迟时间(毫秒)，默认1500
 */
function jumpWithTip(url, msg, delay = 1500) {
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

    // 创建新的toast元素
    const toast = document.createElement('div');
    toast.className = `custom-toast fixed bottom-8 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg text-white z-50 transition-all duration-300 ${
        isError ? 'bg-red-500' : 'bg-green-500'
    }`;
    toast.textContent = msg;

    // 添加到页面
    document.body.appendChild(toast);

    // 3秒后自动消失
    setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * 检查用户是否已登录
 * @returns {boolean} 是否登录
 */
function checkLogin() {
    const userInfo = localStorage.getItem('userInfo');
    return !!userInfo;
}

/**
 * 获取当前登录用户信息
 * @returns {object|null} 用户信息对象或null
 */
function getCurrentUser() {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
}

/**
 * 退出登录
 */
function logout() {
    localStorage.removeItem('userInfo');
    jumpWithTip('login.html', '已成功退出登录');
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
            <div class="flex gap-3 mt-6">
                <button id="cancelLogin" class="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                    取消
                </button>
                <button id="goLogin" class="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
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
 * 扩展：页面加载时更新头部用户操作区（登录/头像切换）
 */
function updateHeaderUserAction() {
    const container = document.getElementById('userActionContainer');
    if (!container) return; // 非首页无容器，直接返回
  
    if (checkLogin()) {
        // 已登录：渲染仅带边框头像 + 退出按钮（隐藏用户名）
        const user = getCurrentUser();
        container.innerHTML = `
          <a href="html/cart.html" class="cart-icon"><i class="fa fa-shopping-cart"></i></a>
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
        <a href="html/cart.html" class="cart-icon"><i class="fa fa-shopping-cart"></i></a>
        <div class="login-register">
          <a href="login.html">登录</a><span>|</span>
          <a href="register.html">注册</a>
        </div>
      `;
    }
  }
  
  // 页面加载时自动执行更新
  window.addEventListener('load', () => {
    updateHeaderUserAction();
  });