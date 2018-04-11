// pages/my/subscribe/pay/pay.js
const app = getApp();
import { alert, show, hide, toLogin, setUrl, ajax, confirm } from '../../../../utils/util.js'
Page({
  data: {
    list: [{
      pay_type: 1,
      name: "现场支付",
      selected: 1,
      src: "../../../../images/pay_1.png"
    }, {
      pay_type: 2,
      name: "在线支付",
      selected: 0,
      src: "../../../../images/pay_2.png"
    }],
    coupon: [],
    currentIndex: 0,
    showMoney: false,
    couponIndex: -1,
    money: "",
    paySign:null,
  },
  chooseType(e) {
    var obj = e.target.dataset;
    var arr = this.data.list;
    for (var i in arr) {
      if (i == obj.index) {
        arr[i].selected = 1;
      } else {
        arr[i].selected = 0;
      }
    }
    console.log(arr);
    this.setData({
      list: arr,
      currentIndex: obj.index
    });
  },
  useCoupon(e) {
    var obj = e.target.dataset;
    console.log(obj);
    var arr = this.data.coupon;
    for (var i in arr) {
      if (i == obj.index) {
        if (arr[i].selected) {
          arr[i].selected = 0;
          this.setData({
            couponIndex: -1,
          })
        } else {
          arr[i].selected = 1;
          this.setData({
            couponIndex: obj.index,
          })
        }
      } else {
        arr[i].selected = 0;
      }
    }
    console.log(arr);
    this.setData({
      coupon: arr,
    });
  },
  getCoupon() {
    var data = {
      order_id: this.data.order_id,
      money: this.data.money,
      open_id: app.globalData.open_id,
    }
    console.log(data);
    ajax('/Index/User/user_voucher', data, res => {
      console.log('coupon', res)
      this.setData({
        coupon: res.data.user_voucher
      })
    }, "GET")
  },
  myconfirm() {
    if (this.data.currentIndex == 0) {
      confirm("现场支付", "费用已经给现场负责人", () => {
        var data = {
          order_id: this.data.order_id,
          open_id: app.globalData.open_id,
        }
        ajax('/Index/User/payment_order', data, res => {
          show("确认成功", res => {
            wx.navigateBack({
              delta: 1
            })
          }, "success", 1500)
        }, "GET")

      })
    } else if (this.data.currentIndex == 1) {
      this.setData({
        showMoney: true
      })
    }
  },
  getInput(e) {
    var obj = {};
    obj[e.target.id] = e.detail.value;
    console.log(obj)
    this.setData(obj);
  },
  pay() {
    show("确认支付中");
    var data = {};
    if (this.data.couponIndex > -1) {
      console.log(this.data.couponIndex);
      data.user_voucher_id = this.data.coupon[this.data.couponIndex].id;
    }
    data.open_id = app.globalData.open_id;
    data.order_id = this.data.order_id;
    console.log(data);
    if(!this.data.paySign){
      wx.request({
        url: `https://www.hukesoft.com/HouseMoving/wechatAPPsign.php`,
        type: 'GET',
        data: data,
        success: res => {
          if (res.data.status == 1) {
            this.setData({
              paySign: res.data.datas
            })
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
                      delta: 1,
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
                if (res.errMsg == "requestPayment:cancel") {
                  alert("已取消支付");
                }
                console.log(res);
              }
            })
          } else {
            alert("参数错误");
          }
        }
      })
    }else{
      wx.request({
        url: `https://www.hukesoft.com/HouseMoving/wechatAPPsign.php`,
        type: 'GET',
        data: data,
        success: res => {
          if (res.data.status == 1) {
            this.setData({
              paySign: res.data.datas
            })
            console.log(res.data.data)
            wx.requestPayment({
              'timeStamp': this.data.paySign + "",
              'nonceStr': this.data.paySign.nonceStr,
              'package': this.data.paySign.package,
              'signType': 'MD5',
              'paySign': this.data.paySign.sign,
              'success': res => {
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 500,
                  success: function () {
                    wx.navigateBack({
                      delta: 1,
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
                if (res.errMsg == "requestPayment:cancel") {
                  alert("已取消支付");
                }
                console.log(res);
              }
            })
          } else {
            alert("参数错误");
          }
        }
      })
    }


  },
  cancel(e) {
    if (e.target.dataset.index == 'cancel') {
      this.setData({
        showMoney: false
      })
    }
  },
  onLoad: function (options) {
    console.log(options)
    this.setData(options);
    this.getCoupon();
  },
  onReady: function () {

  }
})