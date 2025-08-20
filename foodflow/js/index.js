// 从localStorage获取当前登录用户
function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

// 绑定添加购物车事件
document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', async (e) => {
    e.preventDefault(); // 阻止默认行为（如跳转）
    e.stopPropagation(); // 阻止事件冒泡
    e.stopImmediatePropagation();

    const user = getCurrentUser();
    if (!user) {
      showToast('请先登录',true);
      localStorage.setItem('redirectAfterLogin', window.location.href);
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1500); // 延迟跳转，让提示可见
      return;
    }

    const recipeItem = button.closest('.recipe-item');
    if (!recipeItem) {
      showToast('获取商品信息失败', true);
      return;
    }
    
    const recipeId = recipeItem.dataset.id;
    try {
      const res = await fetch('http://localhost:3000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, recipe_id: parseInt(recipeId) })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.msg || '添加成功');
        // 关键：局部更新购物车UI，不刷新页面
        updateCartUI();
      } else {
        showToast(data.msg || '添加失败', true);
      }
    } catch (err) {
      console.error('添加失败', err);
      showToast('网络错误，请重试', true);
    }
  });
});

// 新增：局部更新购物车UI的函数
async function updateCartUI() {
  try {
    // 1. 更新购物车数量标记（如导航栏的购物车图标旁的数字）
    const cartCountEl = document.querySelector('.cart-count');
    if (cartCountEl) {
      // 从服务器获取最新购物车数量
      const res = await fetch(`http://localhost:3000/api/cart/count?user_id=${user.id}`);
      const data = await res.json();
      if (data.count !== undefined) {
        cartCountEl.textContent = data.count;
        // 添加数字变化动画，提升体验
        cartCountEl.classList.add('animate-pulse');
        setTimeout(() => cartCountEl.classList.remove('animate-pulse'), 500);
      }
    }

    // 2. 如果当前在"我的"页面的购物车标签下，刷新购物车列表
    const isMinePage = window.location.pathname.includes('mine.html');
    const activeTab = document.querySelector('.func-item[data-type="cart"] i.active');
    
    if (isMinePage && activeTab) {
      // 找到内容展示区域
      const contentDisplay = document.getElementById('contentDisplay');
      if (contentDisplay) {
        // 显示加载状态
        contentDisplay.innerHTML = '<div class="loading">更新购物车中...</div>';
        // 重新渲染购物车
        setTimeout(() => renderContent('cart'), 300);
      }
    }
  } catch (err) {
    console.error('更新购物车UI失败', err);
  }
}



// 轮播图基础功能
document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.querySelector('.carousel');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const items = document.querySelectorAll('.carousel-item');
    let autoPlayInterval;
    let currentIndex = 0;
    const totalItems = items.length;
    const visibleCount = 3;

    // 复制首尾元素，实现循环
    const cloneFirst = items[0].cloneNode(true);
    const cloneLast = items[totalItems - 1].cloneNode(true);
    carousel.insertBefore(cloneLast, carousel.firstChild);
    carousel.appendChild(cloneFirst);

    // 计算单个项目宽度（包含间距）
    let itemWidthWithMargin;
    function calculateItemWidth() {
      itemWidthWithMargin = document.querySelector('.carousel-item').offsetWidth;
    }
    window.addEventListener('resize', calculateItemWidth);
    calculateItemWidth();

    // 自动轮播函数
    function autoPlay() {
      autoPlayInterval = setInterval(() => {
        nextSlide();
      }, 3000);
    }

    // 切换到下一张
    function nextSlide() {
      currentIndex = (currentIndex + 1) % totalItems;
      const scrollPosition = (currentIndex + 1) * itemWidthWithMargin; // 考虑复制的元素
      if (scrollPosition > (totalItems + 1) * itemWidthWithMargin) {
        // 滚动到末尾后跳回开头
        carousel.scrollTo({
          left: itemWidthWithMargin,
          behavior: 'instant'
        });
        currentIndex = 0;
      } else {
        carousel.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }

    // 切换到上一张
    function prevSlide() {
      currentIndex = (currentIndex - 1 + totalItems) % totalItems;
      const scrollPosition = (currentIndex + 1) * itemWidthWithMargin;
      if (scrollPosition < itemWidthWithMargin) {
        // 滚动到开头后跳回末尾
        carousel.scrollTo({
          left: totalItems * itemWidthWithMargin,
          behavior: 'instant'
        });
        currentIndex = totalItems - 1;
      } else {
        carousel.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }

    // 绑定事件
    prevBtn.addEventListener('click', () => {
      clearInterval(autoPlayInterval);
      prevSlide();
      autoPlay();
    });

    nextBtn.addEventListener('click', () => {
      clearInterval(autoPlayInterval);
      nextSlide();
      autoPlay();
    });

    // 鼠标悬停时停止自动轮播
    carousel.addEventListener('mouseenter', () => {
      clearInterval(autoPlayInterval);
    });
    carousel.addEventListener('mouseleave', autoPlay);

    // 初始化自动轮播
    autoPlay();
});
      

// 修复滚动 + 省略号逻辑
document.addEventListener('DOMContentLoaded', function() {
  // 1. 左侧滚动自动生效（只要内容超出sidebar高度）
  
  // 2. 描述文字省略号优化
  const descriptions = document.querySelectorAll('.desc');
  descriptions.forEach(desc => {
    if (desc.scrollHeight > desc.clientHeight) {
      desc.classList.add('overflow');
      desc.querySelector('::after').style.display = 'block';
    }
  });

  // 3. 窗口变化时重新计算
  window.addEventListener('resize', () => {
    descriptions.forEach(desc => {
      if (desc.scrollHeight > desc.clientHeight) {
        desc.classList.add('overflow');
        desc.querySelector('::after').style.display = 'block';
      } else {
        desc.classList.remove('overflow');
        desc.querySelector('::after').style.display = 'none';
      }
    });
  });
});