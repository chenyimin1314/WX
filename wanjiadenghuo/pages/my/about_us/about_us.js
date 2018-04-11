// pages/my/about_us/about_us.js
Page({

  data: {

  },
  call(e) {
    wx.showModal({
      title: '提示',
      content: '是否联系客服',
      confirmColor: "#ff5151",
      success: res => {
        console.log(111)
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: e.target.dataset.phone,
          })
        }
      }
    })
  },
  onLoad: function (options) {

  },

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})