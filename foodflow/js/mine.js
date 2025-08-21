// 获取所有功能按钮的图标元素
const funcIcons = document.querySelectorAll(".func-item i");

// 添加 logout 函数
function logout() {
  localStorage.removeItem('currentUser');
  // 可以添加跳转到首页或其他逻辑
  window.location.href = 'index.html';
}

// 模拟数据
const mockData = {
  history: [
    {
      id: 1,
      img: "../img/food_big1.png",
      title: "广式牛杂牛肋条煲",
      desc: "牛肋条泡血水；撕去金钱肚内部筋膜，用面粉清洗表面杂质，加白醋和盐搓洗干净；将牛肋条和金钱肚焯水后，把金钱肚剪至合适大小……",
    },
    {
      id: 2,
      img: "../img/food_big1.png",
      title: "广式牛杂牛肋条煲",
      desc: "牛肋条泡血水；撕去金钱肚内部筋膜，用面粉清洗表面杂质，加白醋和盐搓洗干净；将牛肋条和金钱肚焯水后，把金钱肚剪至合适大小……",
    },
    {
      id: 3,
      img: "../img/food_big1.png",
      title: "广式牛杂牛肋条煲",
      desc: "牛肋条泡血水；撕去金钱肚内部筋膜，用面粉清洗表面杂质，加白醋和盐搓洗干净；将牛肋条和金钱肚焯水后，把金钱肚剪至合适大小……",
    },
    // 可继续添加更多
  ],
  favorites: [
    {
      id: 1,
      img: "../img/food_big1.png",
      title: "广式牛杂牛肋条煲",
      desc: "牛肋条泡血水；撕去金钱肚内部筋膜，用面粉清洗表面杂质，加白醋和盐搓洗干净；将牛肋条和金钱肚焯水后，把金钱肚剪至合适大小……",
    },
    {
      id: 2,
      img: "../img/food_big1.png",
      title: "广式牛杂牛肋条煲",
      desc: "牛肋条泡血水；撕去金钱肚内部筋膜，用面粉清洗表面杂质，加白醋和盐搓洗干净；将牛肋条和金钱肚焯水后，把金钱肚剪至合适大小……",
    },
    {
      id: 3,
      img: "../img/food_big1.png",
      title: "广式牛杂牛肋条煲",
      desc: "牛肋条泡血水；撕去金钱肚内部筋膜，用面粉清洗表面杂质，加白醋和盐搓洗干净；将牛肋条和金钱肚焯水后，把金钱肚剪至合适大小……",
    },
    // 可继续添加更多
  ],
  cart: [
    {
      id: 1,
      img: "../img/随园食单40_6.jpg",
      title: "随园食单",
      author: "袁枚",
      price: "40.6",
    },
    {
      id: 2,
      img: "../img/随园食单40_6.jpg",
      title: "随园食单",
      author: "袁枚",
      price: "40.6",
    },
    {
      id: 3,
      img: "../img/随园食单40_6.jpg",
      title: "随园食单",
      author: "袁枚",
      price: "40.6",
    },
    // 可继续添加更多
  ],
  recipes: [
    { id: 1, img: "../img/carousel1.png", title: "开水炖蛋" },
    { id: 2, img: "../img/carousel2.png", title: "灌汤包" },
    { id: 3, img: "../img/carousel3.png", title: "肉酱面" },
    { id: 4, img: "../img/carousel4.png", title: "三文鱼波奇碗" },
    { id: 5, img: "../img/carousel1.png", title: "开水炖蛋" },
    { id: 6, img: "../img/carousel2.png", title: "灌汤包" },
    { id: 7, img: "../img/carousel3.png", title: "肉酱面" },
    { id: 8, img: "../img/carousel4.png", title: "三文鱼波奇碗" },
    // 可继续添加更多
  ],
};

// 获取当前登录用户信息
function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
}

// 页面跳转辅助函数
function jumpTo(url) {
  window.location.href = url;
}

// 获取元素
const funcItems = document.querySelectorAll(".func-item");
const contentDisplay = document.getElementById("contentDisplay");

// 新增：登录状态判断函数
function checkLogin() {
  const user = getCurrentUser();
  return !!user; // 返回布尔值
}



// 修改：绑定点击事件（增加登录判断）
funcItems.forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.getAttribute("data-type");
    const isLoggedIn = checkLogin();
    
    // 未登录状态处理
    if (!isLoggedIn) {
      const prompts = {
        'history': '请先登录查看历史记录',
        'favorites': '请先登录查看我的收藏',
        'cart': '请先登录查看购物车',
        'recipes': '请先登录查看我的食谱'
      };
      contentDisplay.innerHTML = `<p class="login-prompt">${prompts[type] || '请先登录以使用该功能'}</p>`;
      
      // 重置按钮状态
      funcIcons.forEach(icon => icon.classList.remove("active"));
      return;
    }
    
    // 已登录状态：正常渲染
    renderContent(type);
    
    // 激活当前按钮图标
    funcIcons.forEach(icon => icon.classList.remove("active"));
    button.querySelector('i').classList.add("active");
  });
});

// 渲染内容函数（异步版本，支持购物车数据加载）
async function renderContent(type) {
  contentDisplay.innerHTML = "";
  const user = getCurrentUser();
  
  // 显示加载状态
  contentDisplay.innerHTML = '<div class="loading">加载中...</div>';

  if (type === "history" || type === "favorites") {
    // 历史记录和收藏夹的渲染（保持原样）
    const mockData = {
      history: [
        { id: 1, img: "food_big1.png", title: "广式牛杂牛肋条煲", desc: "牛肋条泡血水；撕去金钱肚内部筋膜..." },
        { id: 2, img: "food_big1.png", title: "广式牛杂牛肋条煲", desc: "牛肋条泡血水；撕去金钱肚内部筋膜..." },
        { id: 3, img: "food_big1.png", title: "广式牛杂牛肋条煲", desc: "牛肋条泡血水；撕去金钱肚内部筋膜..." }
      ],
      favorites: [
        { id: 1, img: "food_big1.png", title: "广式牛杂牛肋条煲", desc: "牛肋条泡血水；撕去金钱肚内部筋膜..." },
        { id: 2, img: "food_big1.png", title: "广式牛杂牛肋条煲", desc: "牛肋条泡血水；撕去金钱肚内部筋膜..." }
      ]
    };

    const data = mockData[type];
    const list = document.createElement("div");
    list.classList.add("item-list");

    data.forEach((item) => {
      const itemElem = document.createElement("div");
      itemElem.classList.add("item");

      const img = document.createElement("img");
      img.src = `../img/${item.img}`;
      img.alt = item.title;
      img.classList.add("item-img");

      const info = document.createElement("div");
      info.classList.add("item-info");

      const title = document.createElement("div");
      title.classList.add("item-title");
      title.textContent = item.title;

      const desc = document.createElement("div");
      desc.classList.add("item-desc");
      desc.textContent = item.desc;

      info.appendChild(title);
      info.appendChild(desc);
      itemElem.appendChild(img);
      itemElem.appendChild(info);
      list.appendChild(itemElem);
    });

    contentDisplay.innerHTML = "";
    contentDisplay.appendChild(list);
  } 
  else if (type === "cart") {
    // 购物车渲染（核心功能）
    if (!user) {
      contentDisplay.innerHTML = '<p class="login-prompt">请先登录</p>';
      return;
    }

    try {
      // 从后端获取购物车数据
      const res = await fetch(`http://localhost:3000/api/cart?user_id=${user.id}`);
      const data = await res.json();
      
      if (data.code !== 200) {
        contentDisplay.innerHTML = `<p class="login-prompt">${data.msg}</p>`;
        return;
      }
      
      const cartData = data.data; // 购物车数据：[{recipe_id, title, price, quantity, ...}, ...]
      
      // 如果购物车为空
      if (cartData.length === 0) {
        contentDisplay.innerHTML = '<p class="empty-cart">购物车是空的，去添加商品吧～</p>';
        return;
      }

      const list = document.createElement("div");
      list.classList.add("item-list");

      // 给每个商品添加checked属性（用于选中计算）
      cartData.forEach(item => {
        item.checked = false;
      });

      cartData.forEach(item => {
        // 创建商品元素
        const itemElem = document.createElement("div");
        itemElem.classList.add("item", "cart-item");
        itemElem.dataset.id = item.recipe_id;

        // 选择复选框
        const checkBox = document.createElement('input');
        checkBox.type = 'checkbox';
        checkBox.classList.add('cart-checkbox');
        checkBox.addEventListener('change', () => {
          item.checked = checkBox.checked;
          calculateTotal(cartData);
        });

        // 删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button'; // 明确指定按钮类型
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = '<i class="fa fa-times"></i>';
        deleteBtn.title = '删除商品';
        deleteBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!confirm('确定删除该商品吗？')) return;
          
          try {
            const res = await fetch('http://localhost:3000/api/cart', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                user_id: user.id, 
                recipe_id: item.recipe_id 
              })
            });
            
            const data = await res.json();
            if (data.code === 200) {
              // 从DOM中移除
              itemElem.remove();
              // 从数据中移除
              const index = cartData.findIndex(c => c.recipe_id === item.recipe_id);
              if (index !== -1) {
                cartData.splice(index, 1);
                calculateTotal(cartData);
              }
              // 如果购物车为空，显示空状态
              if (cartData.length === 0) {
                contentDisplay.innerHTML = '<p class="empty-cart">购物车是空的，去添加商品吧～</p>';
              }
            } else {
              alert(data.msg);
            }
          } catch (err) {
            console.error('删除失败', err);
            alert('删除失败，请重试');
          }
        });

        // 商品图片
        const img = document.createElement("img");
        img.src = `../img/${item.img}`;
        img.alt = item.title;
        img.classList.add("item-img");

        // 商品信息（标题、作者、价格、数量）
        const info = document.createElement("div");
        info.classList.add("item-info");

        const title = document.createElement("div");
        title.classList.add("item-title");
        title.textContent = item.title;

        const desc = document.createElement("div");
        desc.classList.add("item-desc");
        
        // 价格显示
        const priceSpan = document.createElement('span');
        priceSpan.classList.add('price');
        priceSpan.innerHTML = `<i class="yuan">¥</i>${item.price.toFixed(2)}`;

        // 数量调整控件
        const quantityWrapper = document.createElement('div');
        quantityWrapper.classList.add('quantity-wrapper');

        const minusBtn = document.createElement('button');
        minusBtn.type = 'button';
        minusBtn.classList.add('quantity-btn');
        minusBtn.textContent = '-';
        minusBtn.addEventListener('click', async (e) => {
          e.preventDefault(); // 新增：阻止默认行为
          e.stopPropagation(); // 新增：阻止事件冒泡
          const newQty = item.quantity - 1;
          if (newQty < 1) return;
          await updateQuantity(item.recipe_id, newQty);
          item.quantity = newQty;
          quantityInput.value = newQty;
          if (item.checked) calculateTotal(cartData);
        });

        const quantityInput = document.createElement('input');
        quantityInput.classList.add('quantity-input');
        quantityInput.type = 'number';
        quantityInput.value = item.quantity;
        quantityInput.min = 1; // 限制最小为1
        quantityInput.addEventListener('input', async (e) => {
          e.preventDefault();
          e.stopPropagation();
          let newQty = parseInt(e.target.value) || 1;
          newQty = Math.max(1, newQty); // 确保数量不小于1
          await updateQuantity(item.recipe_id, newQty);
          item.quantity = newQty;
          e.target.value = newQty;
          if (item.checked) calculateTotal(cartData);
        });

        const plusBtn = document.createElement('button');
        plusBtn.type = 'button';
        plusBtn.classList.add('quantity-btn');
        plusBtn.textContent = '+';
        plusBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation();
          const newQty = item.quantity + 1;
          await updateQuantity(item.recipe_id, newQty);
          item.quantity = newQty;
          quantityInput.value = newQty;
          if (item.checked) calculateTotal(cartData);
        });

        // 更新数量的辅助函数
        async function updateQuantity(recipeId, quantity) {
          try {
            const res = await fetch('http://localhost:3000/api/cart/update', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                user_id: user.id, 
                recipe_id: recipeId, 
                quantity 
              })
            });
            const data = await res.json();
            if (data.code !== 200) alert(data.msg);
          } catch (err) {
            console.error('更新数量失败', err);
            alert('更新失败，请重试');
          }
        }

        // 组装数量控件
        quantityWrapper.append(minusBtn, quantityInput, plusBtn);
        
        // 右侧容器（数量 + 价格）
        const rightContainer = document.createElement('span');
        rightContainer.style.display = 'flex';
        rightContainer.style.alignItems = 'center';
        rightContainer.style.gap = '0.5rem';
        rightContainer.append(quantityWrapper, priceSpan);
        
        // 组装描述区域（作者 + 右侧容器）
        desc.append(document.createTextNode(item.author || '未知作者'), rightContainer);

        // 组装商品信息
        info.append(title, desc);
        
        // 组装整个商品项
        itemElem.append(checkBox, img, info, deleteBtn);
        list.appendChild(itemElem);
      });

      // 创建结算栏
      const checkoutBar = document.createElement('div');
      checkoutBar.classList.add('checkout-bar');

      // 全选控件
      const selectAllWrapper = document.createElement('div');
      selectAllWrapper.classList.add('select-all-wrapper');
      
      const selectAllInput = document.createElement('input');
      selectAllInput.type = 'checkbox';
      selectAllInput.id = 'selectAll';
      selectAllInput.addEventListener('change', () => {
        toggleSelectAll(cartData, selectAllInput.checked);
      });
      
      const selectAllLabel = document.createElement('label');
      selectAllLabel.setAttribute('for', 'selectAll');
      selectAllLabel.textContent = '全选';
      
      selectAllWrapper.append(selectAllInput, selectAllLabel);

      // 总价和结算按钮
      const totalWrapper = document.createElement('div');
      totalWrapper.classList.add('total-wrapper');
      
      const totalText = document.createElement('span');
      totalText.id = 'totalPrice';
      totalText.textContent = '合计: ¥0';
      
      const checkoutBtn = document.createElement('button');
      checkoutBtn.type = 'button';
      checkoutBtn.classList.add('checkout-btn');
      checkoutBtn.textContent = '结算';
      checkoutBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await checkout(cartData, user.id);
      });
      
      totalWrapper.append(totalText, checkoutBtn);
      checkoutBar.append(selectAllWrapper, totalWrapper);

      // 渲染购物车列表和结算栏
      contentDisplay.innerHTML = "";
      contentDisplay.append(list, checkoutBar);
      
      // 初始化总价计算
      calculateTotal(cartData);

    } catch (err) {
      console.error('获取购物车失败', err);
      contentDisplay.innerHTML = '<p class="error-message">获取购物车失败，请刷新页面重试</p>';
    }
  } 
  else if (type === "recipes") {
    const publishBtn = document.createElement("button");
    publishBtn.textContent = "发布我的食谱";
    publishBtn.classList.add("publish-recipe-btn"); // 可用于添加样式
    publishBtn.addEventListener("click", () => {
      // 点击时显示弹窗示意
      alert("跳转到发布食谱页面");
      // 实际项目中可替换为页面跳转：window.location.href = 'publish-recipe.html';
    });
    // 我的食谱渲染（保持原样）
    const data = [
      { id: 1, img: "carousel1.png", title: "开水炖蛋" },
      { id: 2, img: "carousel2.png", title: "灌汤包" },
      { id: 3, img: "carousel3.png", title: "肉酱面" },
      { id: 4, img: "carousel4.png", title: "三文鱼波奇碗" },
      { id: 5, img: "carousel1.png", title: "开水炖蛋" },
      { id: 6, img: "carousel2.png", title: "灌汤包" }
    ];

    const grid = document.createElement("div");
    grid.classList.add("recipes-grid");

    data.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("recipe-card");

      const img = document.createElement("img");
      img.src = `../img/${item.img}`;
      img.alt = item.title;

      const title = document.createElement("p");
      title.textContent = item.title;

      card.appendChild(img);
      card.appendChild(title);
      grid.appendChild(card);
    });

    contentDisplay.innerHTML = "";
    contentDisplay.appendChild(grid);
    contentDisplay.appendChild(publishBtn); // 先添加发布按钮
  }
}

// 获取购物车数据并渲染
async function renderCart() {
  const user = getCurrentUser();
  if (!user) return;

  try {
    const res = await fetch(`http://localhost:3000/api/cart?user_id=${user.id}`);
    const data = await res.json();

    if (data.code !== 200) {
      contentDisplay.innerHTML = `<p>获取购物车失败：${data.msg}</p>`;
      return;
    }

    const cartItems = data.data;
    if (cartItems.length === 0) {
      contentDisplay.innerHTML = '<p>购物车空空如也</p>';
      return;
    }

    // 动态渲染购物车
    contentDisplay.innerHTML = cartItems.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="../img/${item.img}" alt="${item.title}" />
        <p>${item.title} - ¥${item.price}</p>
        <div class="cart-ops">
          <button class="decrease" data-id="${item.id}">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="increase" data-id="${item.id}">+</button>
          <button class="delete" data-id="${item.id}">删除</button>
        </div>
      </div>
    `).join("");

    // 给加减按钮绑定事件
    document.querySelectorAll(".increase").forEach(btn => {
      btn.addEventListener("click", () => updateCartQuantity(btn.dataset.id, 1));
    });
    document.querySelectorAll(".decrease").forEach(btn => {
      btn.addEventListener("click", () => updateCartQuantity(btn.dataset.id, -1));
    });
    document.querySelectorAll(".delete").forEach(btn => {
      btn.addEventListener("click", () => deleteCartItem(btn.dataset.id));
    });

  } catch (err) {
    console.error(err);
    contentDisplay.innerHTML = '<p>购物车加载失败</p>';
  }
}

// 更新数量
async function updateCartQuantity(itemId, delta) {
  const user = getCurrentUser();
  if (!user) return;
  await fetch("http://localhost:3000/api/cart/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: user.id, cart_id: itemId, delta })
  });
  renderCart(); // 🔑 只刷新购物车部分
}

// 删除商品
async function deleteCartItem(itemId) {
  const user = getCurrentUser();
  if (!user) return;
  await fetch("http://localhost:3000/api/cart/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: user.id, cart_id: itemId })
  });
  renderCart();
}



// 页面加载完成后执行（修改初始化逻辑）
document.addEventListener("DOMContentLoaded", function () {
  console.log('DOMContentLoaded in mine.js'); // 调试日志
  
  // 立即更新用户信息
  updateMyPageUserInfo();

  // 确保DOM完全加载后再执行用户状态检查
  setTimeout(() => {
    const user = getCurrentUser();
    console.log('Delayed check - user:', user); // 调试日志
    
    // 1. 找到“历史记录”对应的图标
    const historyIcon = document.querySelector(
      '.func-item[data-type="history"] i'
    );

    // 2. 已登录状态才初始化内容
    if (user && historyIcon) {
      historyIcon.classList.add("active");
      renderContent("history");
    } else {
      // 未登录状态显示提示
      const contentDisplay = document.getElementById("contentDisplay");
      if (contentDisplay) {
        contentDisplay.innerHTML = '<p class="login-prompt">请先登录以使用更多功能</p>';
      }
    }
  },100);
});



// 给每个图标绑定点击事件
funcIcons.forEach((icon) => {
  icon.addEventListener("click", () => {
    // 点击时切换 active 类名（添加/移除）
    icon.classList.toggle("active");

    // 可选：如果需要“单选”效果（每次只激活一个图标），取消注释以下代码
    funcIcons.forEach((otherIcon) => {
      if (otherIcon !== icon) {
        otherIcon.classList.remove("active");
      }
    });
  });
});


// 数量调整逻辑（完整版本）
function adjustQuantity(item, delta, itemElem, cartData, customValue) {
  // 1. 查找当前操作的商品数据
  const cartItem = cartData.find(c => c.id === item.id);
  if (!cartItem) return;

  // 2. 处理数量变更（区分手动输入和按钮加减）
  let newQuantity;
  if (customValue !== undefined) {
    // 手动输入时的校验
    newQuantity = parseInt(customValue, 10);
    // 防止非数字、负数和0
    newQuantity = isNaN(newQuantity) ? 1 : Math.max(1, newQuantity);
  } else {
    // 按钮加减时的计算
    newQuantity = cartItem.quantity + delta;
    // 确保数量不小于1
    newQuantity = Math.max(1, newQuantity);
  }

  // 3. 更新数据和DOM
  cartItem.quantity = newQuantity;
  const input = itemElem.querySelector('.quantity-input');
  if (input) {
    input.value = newQuantity; // 同步输入框显示
  }

  // 4. 如果商品已选中，实时更新总价
  if (cartItem.checked) {
    calculateTotal(cartData);
  }
}

// 全选逻辑（完整版本）
function toggleSelectAll(cartData, isChecked) {
  // 1. 更新所有商品的选中状态
  cartData.forEach(item => {
    item.checked = isChecked;
  });

  // 2. 同步更新DOM中的复选框
  const checkboxes = document.querySelectorAll('.cart-checkbox');
  checkboxes.forEach((checkbox, index) => {
    // 防止索引越界
    if (index < cartData.length) {
      checkbox.checked = cartData[index].checked;
    }
  });

  // 3. 重新计算总价
  calculateTotal(cartData);
}

// 总价计算逻辑（完整版本）
function calculateTotal(cartData) {
  // 1. 计算所有选中商品的总价
  const total = cartData.reduce((sum, item) => {
    if (item.checked) {
      return sum + (item.price * item.quantity);
    }
    return sum;
  }, 0);

  // 2. 格式化总价为两位小数
  const formattedTotal = total.toFixed(2);

  // 3. 更新DOM显示
  const totalElement = document.getElementById('totalPrice');
  if (totalElement) {
    totalElement.textContent = `合计: ¥${formattedTotal}`;
  }

  // 4. 同步更新全选按钮状态（当所有商品都选中时自动勾选全选）
  const allChecked = cartData.every(item => item.checked);
  const selectAllInput = document.getElementById('selectAll');
  if (selectAllInput) {
    // 避免触发不必要的change事件
    selectAllInput.checked = allChecked;
  }

  return total; // 方便其他地方调用时获取总价
}

// 结算逻辑
async function checkout(cartData, userId) {
  // 筛选选中的商品
  const selectedItems = cartData.filter(item => item.checked);
  if (selectedItems.length === 0) {
    alert('请选择至少一件商品！');
    return;
  }

  try {
    // 调用创建订单API
    const res = await fetch('http://localhost:3000/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        items: selectedItems.map(item => ({
          recipe_id: item.recipe_id,
          quantity: item.quantity
        }))
      })
    });

    const data = await res.json();
    if (data.code === 200) {
      alert('订单创建成功！');
      // 跳转到订单页面
      // window.location.href = 'order.html';
    } else {
      alert(`创建订单失败：${data.msg}`);
    }
  } catch (err) {
    console.error('创建订单失败', err);
    alert('创建订单失败，请重试');
  }
}

// 可选：清空已结算商品的辅助函数
function clearSelectedItems(cartData) {
  // 过滤掉已选中的商品
  const remainingItems = cartData.filter(item => !item.checked);
  
  // 更新购物车数据（如果需要持久化存储，这里可以添加localStorage逻辑）
  // 然后重新渲染购物车
  renderContent('cart');
}


function updateMyPageUserInfo() {
  console.log('updateMyPageUserInfo called'); // 调试日志
  const container = document.getElementById('userInfoContainer');
  if (!container) {
    console.error('userInfoContainer not found');
    return;
  }

  const user = getCurrentUser();
  console.log('Current user:', user); // 调试日志

  // 清除所有可能的事件监听器，避免重复绑定
  const unloggedTip = container.querySelector('#unloggedTip');
  if (unloggedTip) {
    unloggedTip.onclick = null; // 清除旧的事件
    unloggedTip.addEventListener('click', () => {
      localStorage.setItem('redirectAfterLogin', window.location.href);
      jumpTo('login.html');
    });
  }
  
  const logoutBtn = container.querySelector('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.onclick = null; // 清除旧的事件
    logoutBtn.addEventListener('click', logout);
  }

  if (user) {
    console.log('User is logged in'); // 调试日志
    // 已登录：显示头像、用户名、退出按钮
    container.querySelector('.unlogged-avatar').style.display = 'none';
    container.querySelector('.unlogged-text').style.display = 'none';
    container.querySelector('.logged-avatar').style.display = 'block';
    container.querySelector('.logged-text').style.display = 'block';
    container.querySelector('#logoutBtn').style.display = 'block';
    // 设置用户名（若有真实用户名，替换 user.username 即可）
    container.querySelector('#loggedUsername').textContent = user.username || '用户';
    // 退出按钮绑定事件
    // container.querySelector('#logoutBtn').addEventListener('click', () => {
    //   logout();
    //   // 退出后重新更新“我的”页面显示（延迟保证 localStorage 已清除）
    //   setTimeout(updateMyPageUserInfo, 500);
    // });
  } else {
    console.log('User is not logged in'); // 调试日志
    // 未登录：显示默认提示，点击“请先登录”跳转
    container.querySelector('.logged-avatar').style.display = 'none';
    container.querySelector('.logged-text').style.display = 'none';
    container.querySelector('#logoutBtn').style.display = 'none';
    container.querySelector('.unlogged-avatar').style.display = 'block';
    container.querySelector('.unlogged-text').style.display = 'block';
    // 绑定“请先登录”点击事件
    // container.querySelector('#unloggedTip').addEventListener('click', () => {
    //   // 记录当前页面，登录后返回
    //   localStorage.setItem('redirectAfterLogin', window.location.href);
    //   jumpTo('login.html');
    // });
  }

  // 强制重绘，避免浏览器渲染问题
  container.style.display = 'none';
  container.offsetHeight; // 触发重排
  container.style.display = '';
}

// “我的”页面加载时自动执行
window.addEventListener('load', () => {
  updateMyPageUserInfo();
});