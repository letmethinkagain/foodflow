// 返回上一界面
function goBack() {
    window.history.back();
}

// 从localStorage获取当前登录用户信息
function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

// 检查用户是否登录，如果未登录则跳转
async function checkLoginAndLoadOrders() {
  const user = getCurrentUser();
  if (!user) {
    // 保存当前页面地址，登录后返回
    localStorage.setItem('redirectAfterLogin', window.location.href);
    alert('请先登录查看订单');
    window.location.href = 'login.html';
    return false;
  }
  return user;
}
  
// 搜索订单
function searchOrder() {
  const inputVal = document.querySelector('.search-box input').value.trim();
  if (!inputVal) {
    alert('请输入搜索关键词');
    return;
  }
  
  // 实际项目中应该调用后端搜索接口
  const orderItems = document.querySelectorAll('.order-item');
  let found = false;
  
  orderItems.forEach(item => {
    const recipeName = item.querySelector('.recipe-name').textContent.toLowerCase();
    const isMatch = recipeName.includes(inputVal.toLowerCase());
    
    item.style.display = isMatch ? 'flex' : 'none';
    if (isMatch) found = true;
  });
  
  const searchTip = document.getElementById('searchTip');
  if (found) {
    searchTip.textContent = `找到包含"${inputVal}"的订单`;
    searchTip.style.color = '#333';
  } else {
    searchTip.textContent = `未找到包含"${inputVal}"的订单`;
    searchTip.style.color = '#ff4d4f';
  }
  
  searchTip.style.display = 'block';
  // 3秒后隐藏提示
  setTimeout(() => {
    searchTip.style.display = 'none';
  }, 3000);
}

// 显示更多操作选项
function showMoreOptions(elem) {
  const moreOptions = elem.nextElementSibling;
  // 点击其他地方关闭下拉菜单
  document.addEventListener('click', function closeMenu(e) {
    e.stopPropagation(); // 阻止事件扩散
    if (!elem.contains(e.target) && !moreOptions.contains(e.target)) {
      moreOptions.style.display = 'none';
      document.removeEventListener('click', closeMenu);
    }
  });
  // 切换显示状态
  moreOptions.style.display = moreOptions.style.display === 'none' ? 'block' : 'none';
}

// 查看评价（示例）
function viewComment(orderId) {
  alert(`查看订单 ${orderId} 的评价功能开发中`);
  // 实际项目中可以跳转到评价详情页
  // window.location.href = `comment.html?orderId=${orderId}`;
}

// 删除订单
async function deleteOrder(orderId,event) {
  // 新增：阻止事件传播和默认行为
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  const user = getCurrentUser();
  if (!user) return;
  
  if (!confirm('确定要删除该订单吗？删除后不可恢复')) {
    return;
  }
  
  try {
    const response = await fetch('http://localhost:3000/api/orders', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: user.id,
        order_id: orderId
      })
    });
    
    const data = await response.json();
    if (data.code === 200) {
      // 从DOM中移除订单元素
      const orderElement = document.querySelector(`.order-item[data-id="${orderId}"]`);
      if (orderElement) {
        orderElement.remove();
        
        // 检查是否还有订单
        const remainingOrders = document.querySelectorAll('.order-item');
        if (remainingOrders.length === 0) {
          document.querySelector('.order-list').innerHTML = 
            '<p class="no-orders">暂无订单记录</p>';
        }
      }
      alert('订单删除成功');
    } else {
      alert(`删除失败：${data.msg}`);
    }
  } catch (error) {
    console.error('删除订单失败:', error);
    alert('删除订单失败，请重试');
  }
}

// 查看物流
function viewLogistics(orderId) {
  alert(`查看订单 ${orderId} 的物流信息功能开发中`);
  // 实际项目中可以跳转到物流详情页
  // window.location.href = `logistics.html?orderId=${orderId}`;
}

// 再买一单 - 将商品重新加入购物车
async function buyAgain(recipeId) {
  const user = getCurrentUser();
  if (!user) return;
  
  try {
    const response = await fetch('http://localhost:3000/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: user.id,
        recipe_id: recipeId
      })
    });
    
    const data = await response.json();
    if (data.code === 200) {
      // 仅提示，不强制跳转（避免刷新）
      alert('商品已重新加入购物车');
    } else {
      alert(`添加失败：${data.msg}`);
    }
  } catch (error) {
    console.error('再买一单失败:', error);
    alert('操作失败，请重试');
  }
}

// 切换订单标签
function switchOrderTab(tabIndex) {
  const tabs = document.querySelectorAll('.order-tab li');
  tabs.forEach((tab, index) => {
    if (index === tabIndex) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  // 在实际项目中，这里可以根据标签筛选不同状态的订单
  // 简单实现：重新加载当前状态的订单
  loadOrders();
}

// 从后端加载订单数据并渲染
async function loadOrders() {
  const user = await checkLoginAndLoadOrders();
  if (!user) return;
  
  // 显示加载状态
  const orderList = document.querySelector('.order-list');
  orderList.innerHTML = '<div class="loading">加载订单中...</div>';
  
  try {
    const response = await fetch(`http://localhost:3000/api/orders?user_id=${user.id}`);
    const data = await response.json();
    
    if (data.code !== 200) {
      orderList.innerHTML = `<p class="error-message">${data.msg}</p>`;
      return;
    }
    
    const orders = data.data;
    
    if (orders.length === 0) {
      orderList.innerHTML = '<p class="no-orders">暂无订单记录</p>';
      return;
    }
    
    // 渲染订单列表
    orderList.innerHTML = '';
    orders.forEach(order => {
      const orderItem = document.createElement('article');
      orderItem.className = 'order-item';
      orderItem.dataset.id = order.id;
      
      // 格式化时间显示
      const orderTime = new Date(order.order_time);

      // 关键修改：将UTC时间转换为北京时间（+8小时）
      const utcTime = orderTime.getTime();
      const beijingTime = new Date(utcTime + 8 * 60 * 60 * 1000); // 增加8小时时差

      const formattedTime = `${beijingTime.getFullYear()}-${
        (beijingTime.getMonth() + 1).toString().padStart(2, '0')
      }-${
        beijingTime.getDate().toString().padStart(2, '0')
      } ${
        beijingTime.getHours().toString().padStart(2, '0')
      }:${
        beijingTime.getMinutes().toString().padStart(2, '0')
      }`;
      
      // 计算总价
      const totalPrice = (order.price * order.quantity).toFixed(2);
      
      orderItem.innerHTML = `
        <div class="order-img">
          <img src="../img/${order.img}" alt="${order.title}" />
        </div>
        <div class="order-info">
          <h3 class="recipe-name">${order.title}</h3>
          <p class="author-name">${order.author || '未知作者'}</p>
          <p class="price">¥${order.price.toFixed(2)} <span class="count">×${order.quantity}</span></p>
          <p class="real-price">实付¥${totalPrice}</p>
          <p class="order-time">下单时间：${formattedTime}</p>
        </div>
        <div class="order-more" onclick="showMoreOptions(this)">更多</div>
        <div class="more-options" style="display: none">
          <button onclick="viewComment(${order.id})">查看评价</button>
          <button onclick="deleteOrder(${order.id})">删除订单</button>
        </div>
        <div class="order-ops">
          <button onclick="viewLogistics(${order.id})">查看物流</button>
          <button onclick="buyAgain(${order.recipe_id})">再买一单</button>
        </div>
      `;
      
      orderList.appendChild(orderItem);
    });
    
  } catch (error) {
    console.error('加载订单失败:', error);
    orderList.innerHTML = '<p class="error-message">加载订单失败，请刷新页面重试</p>';
  }
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
  // 绑定订单标签点击事件
  const tabs = document.querySelectorAll('.order-tab li');
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => switchOrderTab(index));
  });
  
  // 绑定搜索框回车事件
  document.querySelector('.search-box input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      searchOrder();
    }
  });
  
  // 加载订单数据
  loadOrders();
});