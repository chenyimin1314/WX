import { toLogin, alert, setUrl } from '../../../../utils/util.js'
const app = getApp()
Page({
  data: {
    isShow: false,
    audit_info: [],
    loaded:false,
    page_num:0,
    audit_info:[],
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
  // 获取提现记录
  get_user_profit(data) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/user_wallet_audit_info`,
      data,
      type: "POST",
      success: res => {
        wx.hideLoading();
        if (res.data.status == 1) {
          var audit_info = this.data.audit_info;
          if (res.data.data.audit_info && res.data.data.audit_info.length > 0) {
            audit_info = audit_info.concat(this.setDate(res.data.data.audit_info))
          }
          if (!res.data.data.audit_info || res.data.data.audit_info.length < 20){
            this.setData({
              loaded:true,
            })
          }
          this.setData({
            audit_info: audit_info,
            isShow:true
          })
        }
      }
    })
  },
  setDate(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].create_time = arr[i].create_time.substr(0, 10);
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

  },
  apply(){
    wx.navigateTo({
      url: 'apply/apply',
    })
  }
})