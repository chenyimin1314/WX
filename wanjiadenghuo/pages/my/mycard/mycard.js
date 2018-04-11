
const app = getApp();
import { alert, show, hide, toLogin } from '../../../utils/util.js'
Page({  
  data: {
    list:[],
  },  
  getlist(){
    var data ={
      open_id: app.globalData.open_id
    };
    let url = app.globalData.baseUrl + '/Index/User/user_voucher'
    console.log(url)
    wx.request({
      url ,
      method:"GET",
      data,
      success:res=>{
        console.log(res);
        if (res.data.data.user_voucher){
          this.setData({
            list: app.setTime(res.data.data.user_voucher,"terminate_at")
          })
          console.log(this.data.list)
        }        
        hide();
      }
    })
  },
  onLoad: function (options) {
    show('加载中');
    console.log(app.globalData)
    if (!app.globalData.open_id){
      toLogin(app,res=>{
        this.getlist();
      });
    }else{
      this.getlist();      
    }
  },
  onReady: function () {

  },
  onShow: function () {
  
  },
  onHide: function () {
  
  },
  onUnload: function () {
  
  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})