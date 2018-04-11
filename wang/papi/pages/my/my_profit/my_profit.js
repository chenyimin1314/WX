import { toLogin, alert, setUrl } from '../../../utils/util.js'
const app = getApp()
Page({
  data: {
    isShow: false,
    profit_order: [],
    loaded:false,
    page_num:0,
    apply_type:[{
      type:1,
      name:"微信",
      isSecected:true,
    }, {
      type: 2,
      name: "支付宝",
      isSecected: false,
    }]
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      duration: 5000,
      mask: true
    })
    if (app.globalData.open_id) {
      this.get_user_profit({
        "open_id": app.globalData.open_id,
        "page_num":0
      })
    } else {
      toLogin(app, () => {
        this.get_user_profit({
          "open_id": app.globalData.open_id,
          "page_num": 0,
        })
      })
    }
  },
  // 获取收益
  get_user_profit(data) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/user_profit`,
      data,
      type: "POST",
      success: res => {
        wx.hideLoading();
        if (res.data.status == 1) {
          
          if (res.data.data.user_profit.profit_order && res.data.data.user_profit.profit_order.length > 0) {
            var profit_order = this.data.profit_order;
            profit_order = profit_order.concat(this.setDate(res.data.data.user_profit.profit_order))
          }
          if (!res.data.data.user_profit.profit_order || res.data.data.user_profit.profit_order.length < 20){
            this.setData({
              loaded:true,
            })
          }
          this.setData({
            user_profit: res.data.data.user_profit,
            profit_order,
            isShow:true
          })
        }
      }
    })
  },
  setDate(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].created_at = arr[i].created_at.substr(0, 10);
    }
    return arr;
  },
  // 上拉加载
  toLower() {
    // 加载完成
    if(this.data.loaded){
      return;
    }
    wx.showLoading({
      title: '加载中',
      duration:5000,
      mask:true,
    })
    if(this.timer){
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(()=>{
      this.setData({
        page_num: Number(this.data.page_num) + 1
      })
      this.get_user_profit({
        "open_id": app.globalData.open_id,
        "page_num":this.data.page_num 
      })
    },400)
  },
  onShow: function () {
    if(this.data.isShow){
      this.setData({
        isShow: false,
        profit_order: [],
        loaded: false,
        page_num: 0, 
      });
      this.get_user_profit({
        "open_id": app.globalData.open_id,
        "page_num": 0
      })
    }
  },
  apply(){
    wx.navigateTo({
      url: 'apply/apply',
    })
  }
})