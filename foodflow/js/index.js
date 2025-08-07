// 轮播图基础功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取轮播元素
    const carousel = document.querySelector('.carousel');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const items = document.querySelectorAll('.carousel-item');
    
    // 轮播项宽度
    const itemWidth = items[0].offsetWidth + 15; // 包含间距
    
    // 上一张按钮
    prevBtn.addEventListener('click', function() {
      carousel.scrollBy({
        left: -itemWidth,
        behavior: 'smooth'
      });
    });
    
    // 下一张按钮
    nextBtn.addEventListener('click', function() {
      carousel.scrollBy({
        left: itemWidth,
        behavior: 'smooth'
      });
    });
    
    // 标签切换功能
    const tabItems = document.querySelectorAll('.tab-item');
    tabItems.forEach(tab => {
      tab.addEventListener('click', function() {
        // 移除所有激活状态
        tabItems.forEach(t => t.classList.remove('active'));
        // 添加当前激活状态
        this.classList.add('active');
        // 这里可以添加切换内容的逻辑
      });
    });
  });
      