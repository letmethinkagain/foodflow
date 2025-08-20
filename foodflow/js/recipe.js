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


  // 页面加载完成后检查关注状态
window.addEventListener('load', () => {
  // 检查登录状态
  const currentUser = getCurrentUser();
  const authorId = document.getElementById('authorId').value;
  const followBtn = document.querySelector('.follow-btn');

  if (!currentUser || !authorId) {
      return; // 未登录或无作者ID，不检查
  }

  // 调用接口检查是否已关注
  checkFollowStatus(currentUser.id, authorId)
      .then(isFollowed => {
          // 初始化按钮状态
          if (isFollowed) {
              followBtn.textContent = '已关注';
              followBtn.classList.add('followed');
          } else {
              followBtn.textContent = '关注';
              followBtn.classList.remove('followed');
          }
      });

});

/**
 * 检查当前用户是否已关注目标用户
 * @param {number} followerId - 当前登录用户ID（关注者）
 * @param {number} followingId - 目标用户ID（被关注者）
 * @returns {Promise<boolean>} - 是否已关注的状态
 */
function checkFollowStatus(followerId, followingId) {
  // 1. 获取当前登录用户信息，确保已登录
  const currentUser = getCurrentUser();
  if (!currentUser || !currentUser.id) {
      console.log('未登录或用户信息不完整，默认未关注');
      return Promise.resolve(false);
  }

  // 2. 验证参数有效性（转为数字类型）
  const fId = parseInt(followerId, 10);
  const uId = parseInt(followingId, 10);
  const userId = parseInt(currentUser.id, 10); // 登录用户ID（用于后端验证）

  if (isNaN(fId) || isNaN(uId) || isNaN(userId)) {
      console.error('用户ID格式错误（必须为数字）', {
          followerId,
          followingId,
          currentUserId: currentUser.id
      });
      return Promise.resolve(false);
  }

  // 3. 构建请求URL（包含必要的登录凭证和查询参数）
  const url = new URL('http://localhost:3000/api/checkFollow');
  url.searchParams.append('user_id', userId); // 登录验证用
  url.searchParams.append('follower_id', fId); // 关注者ID
  url.searchParams.append('following_id', uId); // 被关注者ID

  console.log('发起关注状态查询:', url.toString());

  // 4. 发送请求并处理响应
  return fetch(url.toString())
      .then(response => {
          // 处理HTTP层错误（如404、500）
          if (!response.ok) {
              throw new Error(`HTTP错误：状态码 ${response.status}`);
          }
          // 解析JSON响应（防止后端返回非JSON数据）
          return response.json().catch(jsonErr => {
              throw new Error(`响应格式错误：${jsonErr.message}`);
          });
      })
      .then(data => {
          // 处理业务逻辑错误（如code非200）
          if (data.code !== 200) {
              console.warn('查询关注状态失败（业务错误）:', data.msg);
              return false;
          }
          // 返回实际关注状态（确保是布尔值）
          return Boolean(data.data?.isFollowed);
      })
      .catch(error => {
          // 捕获所有异常（网络错误、解析错误等）
          console.error('查询关注状态时发生错误:', error.message);
          return false; // 出错时默认视为未关注
      });
}


  function handleFollow() {
    const currentUser = getCurrentUser();
    const authorId = document.getElementById('authorId').value;
    const followBtn = document.querySelector('.follow-btn');
    
    if (!currentUser) {
      showLoginModal();
      return;
    }
  
    // 强制转换为数字（避免类型问题）
    const followingId = parseInt(authorId);
    if (isNaN(followingId)) {
      showToast('作者ID无效', true);
      return;
    }

    // 禁用按钮防止重复点击
    followBtn.disabled = true;
    followBtn.textContent = '处理中...';
  
    fetch('http://localhost:3000/api/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        user_id: currentUser.id, // 新增：与后端checkLogin中间件的参数名匹配
        follower_id: currentUser.id, 
        following_id: followingId 
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.code === 200) {
        // const followBtn = document.querySelector('.follow-btn');
        // followBtn.textContent = data.msg.includes('关注') ? '已关注' : '关注';
        // followBtn.classList.toggle('followed', data.msg.includes('关注'));
        showToast(data.msg);
        
        // 根据返回消息更新按钮状态
        if (data.msg.includes('关注成功')) {
            followBtn.textContent = '已关注';
            followBtn.classList.add('followed');
        } else if (data.msg.includes('取消关注成功')) {
            followBtn.textContent = '关注';
            followBtn.classList.remove('followed');
        }
      } else {
        showToast(data.msg, true);
      }
    })
    .catch(err => {
      console.error('关注请求错误:', err);
      showToast('网络错误，关注失败', true);
    })
    .finally(() => {
        followBtn.disabled = false;
    });
  }