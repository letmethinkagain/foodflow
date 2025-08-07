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
    jumpWithTip('html/login.html', '已成功退出登录');
}
    