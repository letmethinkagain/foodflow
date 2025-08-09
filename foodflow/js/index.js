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