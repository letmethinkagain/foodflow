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

// 渲染内容函数
function renderContent(type) {
  contentDisplay.innerHTML = "";
  const data = mockData[type];

  if (type === "history" || type === "favorites") {
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

    contentDisplay.appendChild(list);
  } else if (type === "cart") {
    const list = document.createElement("div");
    list.classList.add("item-list");

    // 新增：存储购物车数据（用于计算总价）
    const cartData = []; 

    data.forEach((item) => {
      const itemElem = document.createElement("div");
      itemElem.classList.add("item", "cart-item"); // 关键：加上 cart-item 类名
      itemElem.dataset.id = item.id; // 添加数据ID，方便删除时查找

      // 选择按钮
      const checkBox = document.createElement('input');
      checkBox.type = 'checkbox';
      checkBox.classList.add('cart-checkbox');
      checkBox.addEventListener('change', () => {
        const cartItem = cartData.find(c => c.id === item.id);
        if (cartItem) cartItem.checked = checkBox.checked;
        calculateTotal(cartData); // 选中状态变化时重新计算总价
      });

      // 添加删除按钮
      const deleteBtn = document.createElement('button');
      deleteBtn.classList.add('delete-btn');
      deleteBtn.innerHTML = '<i class="fa fa-times"></i>'; // 使用Font Awesome的叉号图标
      deleteBtn.title = '删除商品';
      deleteBtn.addEventListener('click', () => {
        // 从DOM中移除商品元素
        itemElem.remove();
        
        // 从购物车数据中移除
        const index = cartData.findIndex(c => c.id === item.id);
        if (index !== -1) {
          cartData.splice(index, 1);
          calculateTotal(cartData); // 重新计算总价
        }
      });

      // 1. 图片
      const img = document.createElement("img");
      img.src = `../img/${item.img}`;
      img.alt = item.title;
      img.classList.add("item-img");

      // 2. 文字内容区域：书名 + 作者/价格 + 数量调整
      const info = document.createElement("div");
      info.classList.add("item-info");

      // 2.1 书名
      const title = document.createElement("div");
      title.classList.add("item-title");
      title.textContent = item.title;


      // 2.2 作者 + 价格 + 数量调整
      const desc = document.createElement("div");
      desc.classList.add("item-desc");
      // 先构造价格和数量调整的结构
      const priceSpan = document.createElement('span');
      priceSpan.classList.add('price');
      priceSpan.innerHTML = `<i class="yuan">¥</i>${item.price}`;

      const quantityWrapper = document.createElement('div');
      quantityWrapper.classList.add('quantity-wrapper');

      const minusBtn = document.createElement('button');
      minusBtn.classList.add('quantity-btn');
      minusBtn.textContent = '-';
      minusBtn.addEventListener('click', () => adjustQuantity(item, -1, itemElem, cartData));

      const quantityInput = document.createElement('input');
      quantityInput.classList.add('quantity-input');
      quantityInput.type = 'number';
      quantityInput.value = 1; 
      quantityInput.addEventListener('input', (e) => adjustQuantity(item, 0, itemElem, cartData, e.target.value));

      const plusBtn = document.createElement('button');
      plusBtn.classList.add('quantity-btn');
      plusBtn.textContent = '+';
      plusBtn.addEventListener('click', () => adjustQuantity(item, 1, itemElem, cartData));

      quantityWrapper.append(minusBtn, quantityInput, plusBtn);

      // 核心修改：把「数量」和「价格」换位置，并包裹到右侧容器
      const rightContainer = document.createElement('span');
      rightContainer.style.display = 'flex';
      rightContainer.style.alignItems = 'center';
      rightContainer.style.gap = '0.5rem'; // 数量和价格的间距
      
      rightContainer.append(quantityWrapper, priceSpan); // 数量在前，价格在后
      desc.append(document.createTextNode(item.author), rightContainer); // 作者在左，数量价格在右
      
      // 组装文字区域
      info.appendChild(title);
      info.appendChild(desc);

      // 3. 组装单项并存储数据
      itemElem.append(checkBox, img, info, deleteBtn);
      list.append(itemElem);

      // 初始化购物车数据（含价格、数量）
      cartData.push({
        id: item.id,
        price: parseFloat(item.price),
        quantity: 1,
        checked: false, // 默认未选中
        title: item.title, // 关键：加入 title 字段！
      });
      });

      // 4. 新增：结算栏
      const checkoutBar = document.createElement('div');
      checkoutBar.classList.add('checkout-bar');

      const selectAllWrapper = document.createElement('div');
      selectAllWrapper.classList.add('select-all-wrapper');

      const selectAllInput = document.createElement('input');
      selectAllInput.type = 'checkbox';
      selectAllInput.id = 'selectAll';
      selectAllInput.addEventListener('change', () => toggleSelectAll(cartData, selectAllInput.checked));

      const selectAllLabel = document.createElement('label');
      selectAllLabel.setAttribute('for', 'selectAll');
      selectAllLabel.textContent = '全选';

      selectAllWrapper.append(selectAllInput, selectAllLabel);

      const totalWrapper = document.createElement('div');
      totalWrapper.classList.add('total-wrapper');

      const totalText = document.createElement('span');
      totalText.id = 'totalPrice';
      totalText.textContent = `合计: ¥0`;

      const checkoutBtn = document.createElement('button');
      checkoutBtn.classList.add('checkout-btn');
      checkoutBtn.textContent = '结算';
      checkoutBtn.addEventListener('click', () => checkout(cartData));

      totalWrapper.append(totalText, checkoutBtn);
      checkoutBar.append(selectAllWrapper, totalWrapper);

      // 5. 渲染购物车列表 + 结算栏
      contentDisplay.append(list, checkoutBar);

      // 初始化总价计算
      calculateTotal(cartData);
  } else if (type === "recipes") {
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

    contentDisplay.appendChild(grid);
  }
}

// 页面加载完成后执行（修改初始化逻辑）
document.addEventListener("DOMContentLoaded", function () {
  // 初始化用户信息
  updateMyPageUserInfo();
  
  // 检查登录状态
  const isLoggedIn = checkLogin();
  
  // 1. 找到“历史记录”对应的图标
  const historyIcon = document.querySelector(
    '.func-item[data-type="history"] i'
  );

  // 2. 已登录状态才初始化内容
  if (isLoggedIn && historyIcon) {
    historyIcon.classList.add("active");
    renderContent("history");
  } else {
    // 未登录状态显示提示
    contentDisplay.innerHTML = '<p class="login-prompt">请先登录以使用更多功能</p>';
  }
});

// 获取所有功能按钮的图标元素
const funcIcons = document.querySelectorAll(".func-item i");

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

// 结算逻辑（增强版本）
function checkout(cartData) {
  // 1. 筛选选中的商品
  const selectedItems = cartData.filter(item => item.checked);
  if (selectedItems.length === 0) {
    alert('请选择至少一件商品！');
    return;
  }

 // 2. 生成结算信息（关键：用 item.title 获取商品名称）
 const orderDetails = selectedItems.map(item => {
  return `${item.title} x ${item.quantity} 单价: ¥${item.price.toFixed(2)}`;
}).join('\n');

// 3. 计算总计金额
const total = selectedItems.reduce((sum, item) => {
  return sum + (item.price * item.quantity);
}, 0);

  // 4. 显示结算结果
  alert(`结算成功！\n\n${orderDetails}\n\n总计: ¥${total.toFixed(2)}`);
  
  // 5. 可选：清空已结算商品
  // clearSelectedItems(cartData);
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
  const container = document.getElementById('userInfoContainer');

  const user = getCurrentUser();
  if (user) {
    // 已登录：显示头像、用户名、退出按钮
    container.querySelector('.unlogged-avatar').style.display = 'none';
    container.querySelector('.unlogged-text').style.display = 'none';
    container.querySelector('.logged-avatar').style.display = 'block';
    container.querySelector('.logged-text').style.display = 'block';
    container.querySelector('#logoutBtn').style.display = 'block';
    // 设置用户名（若有真实用户名，替换 user.username 即可）
    container.querySelector('#loggedUsername').textContent = user.username;
    // 退出按钮绑定事件
    container.querySelector('#logoutBtn').addEventListener('click', () => {
      logout();
      // 退出后重新更新“我的”页面显示（延迟保证 localStorage 已清除）
      setTimeout(updateMyPageUserInfo, 500);
    });
  } else {
    // 未登录：显示默认提示，点击“请先登录”跳转
    container.querySelector('.logged-avatar').style.display = 'none';
    container.querySelector('.logged-text').style.display = 'none';
    container.querySelector('#logoutBtn').style.display = 'none';
    container.querySelector('.unlogged-avatar').style.display = 'block';
    container.querySelector('.unlogged-text').style.display = 'block';
    // 绑定“请先登录”点击事件
    container.querySelector('#unloggedTip').addEventListener('click', () => {
      // 记录当前页面，登录后返回
      localStorage.setItem('redirectAfterLogin', window.location.href);
      jumpTo('login.html');
    });
  }
}

// “我的”页面加载时自动执行
window.addEventListener('load', () => {
  updateMyPageUserInfo();
});