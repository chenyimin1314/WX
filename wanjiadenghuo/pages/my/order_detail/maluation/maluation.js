// pages/my/order_detail/maluation/maluation.js
const app = getApp();
import { alert, show, hide, toLogin,ajax } from '../../../../utils/util.js'
Page({
  data: {
    serviceList: [{
      name: "服务专业度",
      value: 0
    }, {
      name: "服务态度",
      value: 0
    }, {
      name: "服务效率",
      value: 0
    }],
    content: "",
    testarr: [0, 0, 0, 0, 0]
  },
  setGrade(e) {
    console.log(e);
    var obj = e.target.dataset;
    var arr = this.data.serviceList;
    for (var i = 0; i < arr.length; i++) {
      if (i == obj.index) {
        console.log(i, obj)
        arr[i].value = obj.idx * 1 + 1;
      }
    }
    this.setData({
      serviceList: arr
    })
    console.log(arr)
  },
  getValue(e) {
    var obj = {};
    obj[e.target.id] = e.detail.value;
    this.setData(obj);
  },
  myConfirm() {
    if (this.data.content == "") {
      alert('请输入评语');
      return;
    }
    var a = this.data.serviceList;
    var data = {};
    data.content = this.data.content;
    console.log(a);
    data.major = a[0].value;
    data.attitude = a[1].value;
    data.efficiency = a[2].value;
    data.open_id = app.globalData.open_id;
    data.order_id = this.data.order_id;

    if (data.major == 0) {
      alert("请对服务专业评分");
    } else if (data.attitude == 0) {
      alert("请对服务态度评分");
    } else if (data.efficiency == 0) {
      alert("请对服务效率评分");
    } else {
      ajax('/Index/User/evaluate_order',data,res=>{
        show("评论成功", res => {
          wx.navigateBack({
            delta:1
          })
        }, "success", 1500)
      },"GET")
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(options);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})