// pages/index/confirm_order/confirm_order.js
require
import { toLogin, alert, addshopping, setAddress } from '../../../utils/util.js'
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
  back() {
    this.setData({
      showAddress: false
    })
  },
  confirm(data) {
    wx.hideLoading();
    wx.request({
      url: `${app.globalData.baseUrl}/Index/Order/fromShoppingCart`,
      type: "POST",
      data,
      success: res => {
        if (res.data.status == 1) {
          this.setData({
            isShow: true,
            shop: res.data.data.shop,
            sum_price: res.data.data.sum_price
          });
          console.log(res.data.data.userAddress)
          if (res.data.data.userAddress && res.data.data.userAddress.length > 0) {
            this.setData({
              addressList: setAddress(res.data.data.userAddress),
              address: res.data.data.userAddress[0],
              address_id: res.data.data.userAddress[0].address_id,
            })
          } else {
            this.setData({
              addressList: [],
              address_id: "",
              showAdd: true
            })
          }
        } else {
          alert("获取数据失败");
        }
      }
    })

  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
      duration: 3000,
      mask: true
    });
    if (app.globalData.open_id) {
      this.confirm({
        open_id: app.globalData.open_id,
      });
    } else {
      toLogin(app, res => {
        this.confirm({
          open_id: app.globalData.open_id,
        });
      })
    }
  },
  onShow: function () {
    if (this.data.isShow) {
      this.setData({
        showAdd:false,
        addressList:null,
        address: null,
        address_id: "",
      })
      this.confirm({
        open_id: app.globalData.open_id,
      });
    }
  },
  pay() {
    if (this.data.address_id == "") {
      alert("请选择收货地址");
      return;
    }
    wx.showLoading({
      title: '支付中',
      duration: 10000,
      mask: true,
    });
    var data = {
      open_id: app.globalData.open_id,
      address_id: this.data.address_id
    }
    wx.request({
      url: `${app.globalData.baseUrl}/Index/Order/confimFromShoppingCart`,
      type: "POST",
      data,
      success: res => {
        console.log(res.data);
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
                    if (res.errMsg == "requestPayment:cancel") {
                      alert("已取消支付");
                      setTimeout(function () {
                        wx.navigateBack({
                          delta: 1,
                        })
                      }, 400)
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
        } else if (res.data.status == 2) {
          alert("库存不足,下单失败");
        }
      }
    })


  }
})
