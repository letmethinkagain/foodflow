// 模拟数据
const mockData = {
  history: [
    {
      id: 1,
      img: "../img/food_big1.png",
      title: "广式牛杂牛肋条煲",
      desc: "牛肋条泡血水；撕去金钱肚内部筋膜，用面粉清洗表面杂质，加白醋和盐搓洗干净；将牛肋条和金钱肚焯水后，把金钱肚剪至合适大小……",
    },
    { id: 2, img: "recipe2.jpg", title: "食谱2", desc: "做法步骤2..." },
    // 可继续添加更多
  ],
  favorites: [
    {
      id: 1,
      img: "../img/food_big1.png",
      title: "广式牛杂牛肋条煲",
      desc: "牛肋条泡血水；撕去金钱肚内部筋膜，用面粉清洗表面杂质，加白醋和盐搓洗干净；将牛肋条和金钱肚焯水后，把金钱肚剪至合适大小……",
    },
    { id: 2, img: "recipe4.jpg", title: "收藏食谱2", desc: "做法步骤2..." },
    // 可继续添加更多
  ],
  cart: [
    {
      id: 1,
      img: "../img/随园食单40_6.jpg",
      title: "随园食单",
      author: "袁枚",
      price: "40.6元",
    },
    {
      id: 2,
      img: "book2.jpg",
      title: "食谱书2",
      author: "作者B",
      price: "39.9元",
    },
    // 可继续添加更多
  ],
  recipes: [
    { id: 1, img: "../img/carousel1.png", title: "开水炖蛋" },
    { id: 2, img: "../img/carousel2.png", title: "灌汤包" },
    { id: 3, img: "../img/carousel3.png", title: "肉酱面" },
    { id: 4, img: "../img/carousel4.png", title: "三文鱼波奇碗" },
    // 可继续添加更多
  ],
};

// 获取元素
const funcItems = document.querySelectorAll(".func-item");
const contentDisplay = document.getElementById("contentDisplay");

// 绑定点击事件
funcItems.forEach((button) => {
  button.addEventListener("click", () => {
    const type = button.getAttribute("data-type");
    renderContent(type);
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

    data.forEach((item) => {
      const itemElem = document.createElement("div");
      itemElem.classList.add("item", "cart-item"); // 关键：加上 cart-item 类名

      // 1. 图片
      const img = document.createElement("img");
      img.src = `../img/${item.img}`;
      img.alt = item.title;
      img.classList.add("item-img");

      // 2. 文字内容区域：书名 + 作者/价格
      const info = document.createElement("div");
      info.classList.add("item-info");

      // 2.1 书名
      const title = document.createElement("div");
      title.classList.add("item-title");
      title.textContent = item.title;

      // 2.2 作者 + 价格
      const desc = document.createElement("div");
      desc.classList.add("item-desc");
      desc.innerHTML = `
            <span class="author">${item.author}</span>
            <span class="price">${item.price}</span>
          `;

      // 组装文字区域
      info.appendChild(title);
      info.appendChild(desc);

      // 组装单项
      itemElem.appendChild(img);
      itemElem.appendChild(info);
      list.appendChild(itemElem);
    });

    contentDisplay.appendChild(list);
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

// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", function () {
  // 1. 找到“历史记录”对应的图标（根据 data-type 定位）
  const historyIcon = document.querySelector(
    '.func-item[data-type="history"] i'
  );

  // 2. 如果找到图标，手动添加 active 类名（触发灰色背景）
  if (historyIcon) {
    historyIcon.classList.add("active");

    // 3. 同时自动触发历史记录的内容渲染（如果需要默认显示内容）
    renderContent("history");
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
