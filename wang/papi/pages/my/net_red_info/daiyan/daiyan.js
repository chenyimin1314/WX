// pages/my/net_red_info/net_red_info.js

const app = getApp();
import { toLogin, alert, setUrl } from '../../../../utils/util.js'
Page({
  data: {
    camera: [],
    info: {},
    isShow: false,
    isMine: false,
    arr:[],
  },
  // 获取个人信息
  getInfo(data) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/red_net_info`,
      data,
      type: "POST",
      success: res => {
        wx.hideLoading();
        if (res.data.status == 1) {
          console.log(res.data.data)
          var arr = this.data.arr;
          if (res.data.data.user_info.user_product && res.data.data.user_info.user_product.length > 0 ){
            var a = res.data.data.user_info.user_product;
            var b = [];//用来保存三张图片
            var d = [];//d为图片二位数组
            for(var i = 0;i<a.length;i++){
              b.push(a[i]);
              if(i % 5 == 4){
                d.push(b);
                b = [];
              }
            }
            d.push(b);//最后的一次未进入求余数的if判断
            console.log(d);
            arr = d;
          }else{
            arr = [];
          }
          console.log(arr);
          this.setData({
            arr,
            isShow:true
          })
        } else {
          alert(res.data.msg)
        }
      }
    })
  },
  toDetail(e) {
    var obj = e.target.dataset;
    obj.user_id = this.data.user_id;
    wx.navigateTo({
      url: setUrl("../../../index/shop_detail/shop_detail", obj),
    })
  },
  setMine(options) {
    console.log(options)
    if (options.user_id) {
      this.setData({
        user_id: options.user_id,
        isMine: false,
      })
    } else {
      this.setData({
        user_id: app.globalData.user_id,
        isMine: true,
      })
    }
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      duration:5000,
    });
    console.log(options)
    if (app.globalData.open_id) {
      // 判断user_id是否存在
      this.setMine(options);
      this.getInfo({
        open_id: app.globalData.open_id,
        user_id: this.data.user_id
      });
    } else {
      toLogin(app, () => {
        this.setMine(options);
        this.getInfo({
          open_id: app.globalData.open_id,
          user_id: this.data.user_id
        });
      })
    }
  },
  
  onReady: function () {

  },
  onShow: function () {

  }
})