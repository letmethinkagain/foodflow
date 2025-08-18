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

    // 检查按钮是否在<form>内，如果是则阻止表单提交
    if (button.closest('form')) {
      e.stopImmediatePropagation(); // 阻止其他可能的事件监听器
    }

    const user = getCurrentUser();
    if (!user) {
      showToast('请先登录',true);
      localStorage.setItem('redirectAfterLogin', window.location.href);
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 5000); // 延迟跳转，让提示可见
      return;
    }

    const recipeId = button.closest('.recipe-item').dataset.id;
    try {
      const res = await fetch('http://localhost:3000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, recipe_id: parseInt(recipeId) })
      });
      const data = await res.json();
      showToast(data.msg); // 提示"添加成功"或错误信息
    } catch (err) {
      console.error('添加失败', err);
      showToast('添加失败，请重试', true);
    }
  });
});


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