// 返回上一界面
function goBack() {
    window.history.back();
  }
  
  // 搜索订单（示例，实际结合接口）
  function searchOrder() {
    const inputVal = document.querySelector('.search-box input').value;
    alert(`模拟搜索订单，关键词：${inputVal}`);
    // 实际可调用接口请求数据并渲染
  }
  
  // 显示更多操作选项
  function showMoreOptions(elem) {
    const moreOptions = elem.nextElementSibling;
    moreOptions.style.display = moreOptions.style.display === 'none' ? 'block' : 'none';
  }
  
  // 查看评价（示例）
  function viewComment() {
    alert('查看评价功能，实际可跳转对应页面');
  }
  
  // 删除订单（示例，注意需处理数据及交互确认等）
  function deleteOrder() {
    if (confirm('确定删除该订单？')) {
      alert('模拟删除订单成功');
      // 实际可调用接口删除订单并更新列表
    }
  }
  
  // 查看物流（示例）
  function viewLogistics() {
    alert('查看物流功能，实际可跳转物流信息页面');
  }
  
  // 再买一单（示例）
  function buyAgain() {
    alert('再买一单功能，实际可加入购物车或重新下单');
  }