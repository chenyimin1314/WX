const app = getApp();
app.globalData.subscribe_success = {
  "voucher_name": "20满200元使用",
  "price": 20,
  "full_price": 200,
  "terminate_at": "2017-11-18"
};
Page({
  data: {
    info: app.globalData.subscribe_success,
    isShow: true,
  },
  onLoad: function (options) {

  },
  close(){
    this.setData({
      isShow:false,
    })
  },
  back(){
    // 重置数据
    app.reset();
    wx.navigateBack({
      delta:4
    })
  },

})