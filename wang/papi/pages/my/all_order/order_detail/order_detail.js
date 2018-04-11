// pages/my/all_order/order_detail/order_detail.js
import { toLogin, alert, setUrl, setAddress } from '../../../../utils/util.js'
const app = getApp()
Page({
  data: {
    isShow: false,
  },
  onLoad: function (options) {
    // options = {
    //   shop_p_id: 1194,
    //   state: 0,
    // }
    this.setData(options);
    var options = options;
    this.setData({
      options
    })
    wx.showLoading({
      title: '加载中',
      duration: 5000,
      mask: true,
    })
    if (app.globalData.open_id) {
      options.open_id = app.globalData.open_id;
      this.getOrder(options);
    } else {
      toLogin(app, () => {
        options.open_id = app.globalData.open_id;
        this.getOrder(options);
      })
    }
  },
  // 获取单个订单
  getOrder(data, cb) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/order_details`,
      type: "POST",
      data,
      success: res => {
        wx.hideLoading();
        if (res.data.status == 1) {
          cb && cb();
          this.setData({
            address: setAddress(res.data.data.userAddress)[0],
            shop: res.data.data.parentOrder,
            state_info: res.data.data.state_info,
            isShow: true,
          })
        }
      }
    })
  },

  // 删除订单
  delete(e) {
    wx.showModal({
      content: "是否删除当前订单",
      cancelColor: "#ff3b2f",
      confirmColor: "#ff3b2f",
      success: res => {
        var obj = e.target.dataset;
        var shop_p_id = this.data.order_list[obj.index][obj.idx].shop_p_id;
        if (res.confirm) {
          var data = {
            open_id: app.globalData.open_id,
            shop_p_id,
          }
          wx.request({
            url: `${app.globalData.baseUrl}/Index/User/cancel`,
            type: "POST",
            data: data,
            success: res => {
              wx.hideLoading();
              if (res.data.status == 1) {
                var shop = this.data.shop;
                shop[0].splice(obj.idx, 1);
                this.setData({
                  shop
                })
                wx.navigateBack({
                  delta:1
                })
              } else {
                alert("删除订单失败");
              }
            }
          })
        }
      }
    })
  },
  // 取消订单
  cancel(){
    var shop = this.data.shop;
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/cancel`,
      type:"POST",
      data:{
        open_id:app.globalData.open_id,
        shop_p_id: shop[0].shop_p_id,
      },
      success:res=>{
        if(res.data.status == 1){
          alert("取消订单成功","",()=>{
            console.log(111)
            wx.navigateBack({
              delta:1
            })
          })
        }else{
          alert("取消订单失败")
        }
      }

    })
  },
  // 确认收货
  confirm(e) {
    wx.showModal({
      content: "是否确认收货",
      cancelColor: "#ff3b2f",
      confirmColor: "#ff3b2f",
      success: res => {
        var shop_p_id = this.data.shop[0].shop_p_id;
        if (res.confirm) {
          var data = {
            open_id: app.globalData.open_id,
            shop_p_id,
          }
          wx.request({
            url: `${app.globalData.baseUrl}/Index/User/confirm`,
            type: "POST",
            data: data,
            success: res => {
              wx.hideLoading();
              if (res.data.status == 1) {
                var shop = this.data.shop;
                shop[0].state = 3;
                this.setData({
                  shop
                })
              } else {
                alert("确认收货失败");
              }
            }
          })
        }
      }
    })

  },
  delete(e) {
    wx.showModal({
      content: "是否删除当前订单",
      cancelColor: "#ff3b2f",
      confirmColor: "#ff3b2f",
      success: res => {
        var shop = this.data.shop;
        if (res.confirm) {
          var data = {
            open_id: app.globalData.open_id,
            shop_p_id: shop[0].shop_p_id,
          }
          wx.request({
            url: `${app.globalData.baseUrl}/Index/User/cancel`,
            type: "POST",
            data: data,
            success: res => {
              wx.hideLoading();
              if (res.data.status == 1) {
               alert("删除订单成功");
               wx.showModal({
                 content: '是否返回订单页面',
                 cancelColor: "#ff3b2f",
                 confirmColor: "#ff3b2f",
                 success: s => {
                  if(s.confirm){
                    wx.navigateBack({
                      delta:1
                    })
                  }
                 }
               })
              
              } else {
                alert("删除订单失败");
              }
            }
          })
        }
      }
    })

  },
  // 立即支付
  pay(e) {
    var shop_p_id = this.data.shop[0].shop_p_id;
    wx.showLoading({
      title: '加载中',
      duration: 5000,
      mask: true,
    })
    wx.request({
      url: `${app.globalData.baseUrl}/Index/Order/confimOrderList`,
      type: "POST",
      data: {
        open_id: app.globalData.open_id,
        shop_p_id: shop_p_id
      },
      success: res => {
        wx.hideLoading();
        if (res.data.status == 1) {
          var data1 = {
            p_id: res.data.data.p_id,
            money: res.data.data.price,
            appid: 'wxc69a602a0f01f540',
            openid: app.globalData.open_id,
          }
          console.log('支付参数', data1);
          wx.request({
            url: `https://www.hukesoft.com/RedNet/wechatAPPsign.php`,
            type: 'POST',
            data: data1,
            success: res => {
              if (res.data.status == 1) {
                console.log(res.data.data)
                wx.requestPayment({
                  'timeStamp': res.data.data.timeStamp + "",
                  'nonceStr': res.data.data.nonceStr,
                  'package': res.data.data.package,
                  'signType': 'MD5',
                  'paySign': res.data.data.sign,
                  'success': res => {
                    var shop = this.data.shop;
                    shop.state = 1;
                    this.setData({
                      shop
                    })
                    wx.showToast({
                      title: '成功',
                      icon: 'success',
                      duration: 500,
                      success: function () {

                      }
                    })
                    console.log(res);
                  },
                  'fail': res => {
                    console.log(res);
                    alert("支付失败");
                  },
                  'complete': res => {
                    if (res.errMsg == "requestPayment:cancel") {
                      alert("已取消支付");
                    }
                    wx.hideLoading();
                  }
                })
              } else if (res.data.status == 0) {
                alert("库存不足");
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1,
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1,
                    })
                  }, 400);
                }, 400)
              } else {
                alert("参数错误");
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1,
                  })
                }, 400)
              }
            }
          })
        } else {
          alert("请求错误")
        }
      }
    })
  }
})