// 图片滑动相关变量
let touchStartX = 0;
let touchEndX = 0;
const slideThreshold = 50; // 滑动阈值，超过则切换图片

// 返回上一界面
function goBack() {
    window.history.back();
  }
  
  // 搜索（示例，实际结合接口）
  function searchrecipe() {
    const inputVal = document.querySelector('.search-box input').value;
    alert(`模拟搜索，关键词：${inputVal}`);
    // 实际可调用接口请求数据并渲染
  }
  
  // 图片滑动（示例：点击小点切换）
const dots = document.querySelectorAll('.dot');
const sliderWrapper = document.querySelector('.slider-wrapper');
const sliderImgs = document.querySelectorAll('.slider-img');

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    // 更新小点激活状态
    dots.forEach(d => d.classList.remove('active'));
    dot.classList.add('active');
    // 滑动图片
    const offset = -index * 100;
    sliderWrapper.style.transform = `translateX(${offset}%)`;
  });
});

// 图片滑动：触摸开始
function touchStart(event) {
    touchStartX = event.touches[0].clientX;
  }
  
  // 图片滑动：触摸移动
  function touchMove(event) {
    touchEndX = event.touches[0].clientX;
  }
  
  // 图片滑动：触摸结束
  function touchEnd() {
    const diffX = touchStartX - touchEndX;
    if (diffX > slideThreshold) {
      // 向右滑动，下一张
      nextSlide();
    } else if (diffX < -slideThreshold) {
      // 向左滑动，上一张
      prevSlide();
    }
  }

  // 下一张图片
function nextSlide() {
    const currentIndex = Array.from(dots).findIndex(d => d.classList.contains('active'));
    const nextIndex = currentIndex + 1;
    if (nextIndex < sliderImgs.length) {
      updateSlide(nextIndex);
    }
  }
  
  // 上一张图片
  function prevSlide() {
    const currentIndex = Array.from(dots).findIndex(d => d.classList.contains('active'));
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      updateSlide(prevIndex);
    }
  }
  
  // 更新图片滑动
  function updateSlide(index) {
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');
    const offset = -index * 100;
    sliderWrapper.style.transform = `translateX(${offset}%)`;
  }

// 三个点：先检查登录，再显示操作
function checkLoginThenShowMore() {
  if (checkLogin()) {
    // 已登录：显示更多选项
    const moreOptions = document.querySelector('.more-options');
    moreOptions.style.display = 
      moreOptions.style.display === 'none' ? 'block' : 'none';
  } else {
    // 未登录：触发通用弹窗
    showLoginModal();
  }
}

// 收藏功能（示例）
function addToFavorite() {
  alert('已收藏该食谱～');
  removeModalElements(); // 收藏后关闭弹窗
  // 实际可调用接口记录收藏
}

// 移除弹窗和遮罩层的工具函数
function removeModalElements() {
    const moreOptions = document.querySelector('.more-options');
    const backdrop = document.querySelector('.modal-backdrop');
    
    if (moreOptions) {
      moreOptions.style.display = 'none';
    }
    if (backdrop) {
      backdrop.remove();
    }
  }


// 点击页面其他区域关闭弹窗（增强逻辑）
document.addEventListener('click', function(e) {
    const moreOptions = document.querySelector('.more-options');
    const moreIcon = document.querySelector('.more-icon');
    
    // 如果弹窗显示且点击的不是弹窗或更多按钮，关闭弹窗
    if (moreOptions && moreOptions.style.display === 'block' && 
        !moreOptions.contains(e.target) && !moreIcon.contains(e.target)) {
      removeModalElements();
    }
  });
  

// 评论输入框：点击触发登录态检查
function checkLoginThenComment() {
  if (!checkLogin()) {
    showLoginModal();
    // 阻止默认行为（若有表单提交）
    return false;
  }
  // 已登录：可输入评论
  document.querySelector('.comment-input input').focus();
}

// 提交评论
function submitComment() {
    const commentInput = document.getElementById('commentInput');
    const commentText = commentInput.value.trim();
    if (commentText === '') {
      alert('请输入评论内容');
      return;
    }
    if (!checkLogin()) {
      showLoginModal();
      return;
    }
    // 实际可调用接口提交评论
    alert(`已提交评论：${commentText}`);
    commentInput.value = '';
    // 可在此处更新评论列表
  }
  
  // 点赞功能（toggle 逻辑）
  function likeComment(commentIndex) {
    const likeIcon = document.querySelector(`[onclick="likeComment(${commentIndex})"]`);
    const likeCount = document.getElementById(`likeCount${commentIndex}`);
    const isLiked = likeIcon.getAttribute('data-liked') === 'true';
  
    if (isLiked) {
      // 取消点赞
      likeIcon.classList.remove('liked');
      likeIcon.setAttribute('data-liked', 'false');
      likeCount.textContent = parseInt(likeCount.textContent) - 1;
    } else {
      // 点赞
      likeIcon.classList.add('liked');
      likeIcon.setAttribute('data-liked', 'true');
      likeCount.textContent = parseInt(likeCount.textContent) + 1;
    }
  }


// 关注/取消关注功能（完善登录检查）
function handleFollow() {
    // 先检查登录状态，未登录直接显示登录弹窗
    if (!checkLogin()) {
      showLoginModal();
      return;
    }
    
    const followBtn = document.querySelector('.follow-btn');
    const isFollowed = followBtn.classList.contains('followed');
    
    if (isFollowed) {
      // 取消关注
      followBtn.classList.remove('followed');
      followBtn.textContent = '关注';
      showToast('已取消关注');
    } else {
      // 关注
      followBtn.classList.add('followed');
      followBtn.textContent = '已关注';
      showToast('关注成功');
    }
    
    // 实际项目中这里会调用接口保存关注状态
  }
  