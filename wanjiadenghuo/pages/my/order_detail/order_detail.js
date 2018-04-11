const app = getApp();
import {alert,show,hide,ajax,setUrl} from '../../../utils/util.js'
Page({
  data: {
    info: {
      "order_id": '',
      "pay_value":"",//估价
      "deal_value": 0,//实际付款
      "create_at": "",//订单生成时间
      "accept_at": null,//订单受理时间
      "payment_at": null,//支付时间
      "state":"", //(0：未受理，1：受理中，2：已受理，3：已完成，4：待支付，5：待评价，6：订单完成)
      "state_pay": "",//(1：线上支付，2：线下支付)
      "about_at": "",//预约时间
      "remarks": "",
      "name": "",
      "phone": "",
      "name_two": null,
      "phone_two": null
    },
    order_id:""
  },
  getInfo(data){    
    ajax('/Index/User/order_details',data,res=>{
      console.log(res);
      if(res.status == 1){
        this.setData({
          info: res.data.order_details
        })
      }
    },"GET")
  },
  onLoad: function (options) {
    this.setData(options)
    this.getInfo({
      order_id:options.order_id,
      open_id:app.globalData.open_id,
    })
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(this.data.order_id){
      this.getInfo({
        order_id: this.data.order_id,
        open_id: app.globalData.open_id,
      })
    }
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