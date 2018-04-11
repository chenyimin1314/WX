// pages/index/confirm_order/confirm_order.js
require 
import { toLogin, alert, addshopping, setAddress, confirm } from '../../../utils/util.js'
const app = getApp();
Page({
  data: {
    showAdd: false,
    isShow: false,
    showAddress: false,
  },
  chooseAddress(e) {
    var obj = e.target.dataset;
    if (obj.type == 0) {
      this.setData({
        showAddress: true
      })
    } else {
      this.setData({
        showAddress: false,
        address: this.data.addressList[obj.index],
        address_id: this.data.addressList[obj.index].address_id,
      });
    }
  },
  confirm(data) {
    confirm(data, res => {
      wx.hideLoading();
      this.setData({
        isShow: true,
        shop: res.shop,
        sum_price: res.sum_price
      });
      if (res.userAddress && res.userAddress.length > 0) {
        this.setData({
          addressList: setAddress(res.userAddress),
          address: res.userAddress[0],
          address_id: res.userAddress[0].address_id,
          showAdd: false
        })
      } else {
        this.setData({
          addressList: [],
          address_id: "",
          showAdd: true
        })
      }
     
    })
  },
  back(){
    this.setData({
      showAddress: false
    })
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
      duration: 3000,
      mask: true
    });
    // app.globalData.tempOrder = { product_id: 305, product_classfy_id: 8138, number: 1 };
    console.log(app.globalData.tempOrder)
    var data = app.globalData.tempOrder;
    if (app.globalData.open_id) {
      // this.getAddress(app.globalData.open_id);
      data.open_id = app.globalData.open_id
      this.confirm(data);
    } else {
      toLogin(app, res => {
        // this.getAddress(app.globalData.open_id);
        data.open_id = app.globalData.open_id
        this.confirm(data);
      })
    }
  },
  onShow: function () {
    if (this.data.isShow) {
      this.setData({
        addressList: null,
        address: null,
        address_id: "",
      })
      var data = app.globalData.tempOrder;
      data.open_id = app.globalData.open_id
      this.confirm(data);
    }
  },
  pay() {
    if(this.data.address_id == ""){
      alert("请选择地址");
      return;
    }
    wx.showLoading({
      title: '支付中',
      duration:10000,
      mask:true,
    });
    console.log(app.globalData.user_id);
    console.log(app.globalData.tempOrder);
    var data = {
      open_id: app.globalData.open_id,
      shop_id: app.globalData.tempOrder.shop_id,
      product_id: app.globalData.tempOrder.product_id,
      product_classfy_id: app.globalData.tempOrder.product_classfy_id,
      number: app.globalData.tempOrder.number,
      address_id: this.data.address_id
    }
    if (app.globalData.tempOrder.user_id){
      data.rednet_user_id = app.globalData.tempOrder.user_id
    }
    console.log(data);
    wx.request({
      url: `${app.globalData.baseUrl}/Index/Order/confimFromDetail`,
      type: "POST",
      data,
      success: res => {
        console.log(res.data);
        if (res.data.status == 1) {
          var data1 = {
            p_id: res.data.data.p_id,
            money: res.data.data.price,
            appid: 'wxc69a602a0f01f540',
            openid:app.globalData.open_id,
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
                    wx.showToast({
                      title: '成功',
                      icon: 'success',
                      duration: 500,
                      success: function () {
                        wx.navigateBack({
                          delta: 2,
                        })
                      }
                    })
                    console.log(res);
                  },
                  'fail': res => {
                    console.log(res);
                    alert("支付失败");
                  },
                  'complete': res => {
                    wx.hideLoading();
                    if (res.errMsg == "requestPayment:cancel"){
                      alert("已取消支付");
                      setTimeout(function () {
                        wx.navigateBack({
                          delta: 1,
                        })
                      }, 400)
                    }
                    console.log(res);
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
        }else if(res.data.status == 2){
          alert("库存不足,下单失败");
        }
      }
    })
  }
})
