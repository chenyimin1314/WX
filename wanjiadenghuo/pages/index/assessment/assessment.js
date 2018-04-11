// pages/index/assessment/assessment.js
import { toLogin, confirm, setUrl, alert, ajax, show, hide } from '../../../utils/util.js';
var M = require('../../../utils/md5.js');
const app = getApp();
Page({
  data: {
    baojia: {},
    isShow: false,
    codeText: "获取验证码",
    busy: false,
  },
  call() {
    confirm('', '是否拨打400-700-8942', res => {
      wx.makePhoneCall({
        phoneNumber: '400-700-8942',
      })
    })
  },

  //一键预约
  toDetail() {
    if(!app.globalData.distance.count){
       alert("请选择车辆");
       return;
    }
    show("请稍等!")
    if (!app.globalData.open_id) {
      toLogin(app, res => {
        console.log(app.globalData.isBindphone)
        if (!app.globalData.isBindphone) {
          hide();
          this.setData({
            isShow: true
          })
        }else{
          wx.navigateTo({
            url: '../subscribe/subscribe',
          })
        }
      })
    } else {
      console.log(this.data.isShow)
      console.log(app.globalData);
      if (!app.globalData.isBindphone) {
        hide();
        this.setData({
          isShow: true
        })
        console.log(this.data.isShow)
      } else {
        wx.navigateTo({
          url: '../subscribe/subscribe',
        })
      }
    }
  },
  toUrl(e) {
    var obj = e.target.dataset;
    var url = setUrl(`chooseDetail${obj.index}/chooseDetail`, { type: obj.index });
    if (obj.index*1 < 1) {
      wx.navigateTo({
        url: url,
      })
    } else {
      if (!app.globalData.distance.count) {
        alert("请先选择车辆")
      } else {
        wx.navigateTo({
          url: url,
        })
      }
    }

  },
  getList(data) {
    data = data ? data : {};
    ajax(`/Index/User/get_product`, data, res => {
      console.log(app.globalData.list);
      if (app.globalData.car_list.length == 0) {
        var arr = res.data.product_list;
        for (var i in arr) {
          switch (arr[i].type) {
            case 1: app.globalData.list[0].push(arr[i]); break;
            case 2: app.globalData.list[1].push(arr[i]); break;
            case 3: app.globalData.list[2].push(arr[i]); break;
            case 4: app.globalData.list[3].push(arr[i]); break;
          }
        }
        app.globalData.car_list = res.data.car_list;
        app.globalData.floor_list = res.data.floor_list;
        app.globalData.trip_list = res.data.trip_list;
        app.globalData.order_type_describe = res.data.order_type_describe;
        this.setData({
          list: app.globalData.list,
          car_list: app.globalData.car_list,
          floor_list: app.globalData.floor_list,
          trip_list: app.globalData.trip_list,
          carAddress: app.globalData.carAddress,
          distance: app.globalData.distance,
          order_type_describe: app.globalData.order_type_describe,
        })
      }
    })
  },
  onShow() {
    this.setData({
      list: app.globalData.list,
      car_list: app.globalData.car_list,
      floor_list: app.globalData.floor_list,
      trip_list: app.globalData.trip_list,
      carAddress: app.globalData.carAddress,
      distance: app.globalData.distance,
      pricelist: app.globalData.pricelist,
      order_type_describe: app.globalData.order_type_describe
    })
    console.log(this.data.pricelist)
  },
  onLoad: function (options) {
    console.log(options);
    this.getList();
    var that = this;
  },
  setCancel() {
    this.setData({
      isShow: false,
    })
  },
  // 获取验证码
  getPhone(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  getCode() {
    var reg_phone = /^1[34578]\d{9}$/ //手机号正则
    console.log(reg_phone.test(this.data.phone));
    if (this.data.codeText == "获取验证码" && !this.data.busy) {
      console.log(this.data.phone, 'this.data.phone')
      if (!reg_phone.test(this.data.phone)) {
        return wx.showModal({
          title: '手机号输入错误',
          showCancel: false
        });
      }
      var str = 'banjia';
      str = M.MD5(32, str);
      var data = {
        phone: this.data.phone,
        content: str
      }
      //获取验证码
      wx.request({
        url: app.globalData.baseUrl + "/Index/User/validate",
        data: {
          phone: this.data.phone,
          content: str
        },
        method: "GET",
        success: res => {
          console.log(res);
          if (res.data.status == 1) {
            console.log(res.data);
            this.setData({
              'time': 59,
              codeText: "60秒后重发",
              code: ""

            });
            this.timer = setInterval(this.setCode, 1000);
          }
        }, complete: res => {
          this.setData({
            busy: false
          })
        }
      })

    }
  },
  bindwechat() {
    var reg = /^1[34578]\d{9}$/ //手机号正则
    if (!reg.test(this.data.phone)) {
      return wx.showModal({
        title: '手机号输入错误',
        showCancel: false
      });
    } else if (this.data.code == "") {
      return wx.showModal({
        title: '请输入验证码',
        showCancel: false
      });
    }
    var data = {
      phone: this.data.phone,
      code: this.data.code,
      user_id: app.globalData.user_id
    };
    var that = this;
    wx.request({
      url: app.globalData.baseUrl + '/Index/User/binding_phone',
      data: data,
      type: "GET",
      success: function (res) {
        console.log(data, res);
        if (res.data.status == 1) {
          app.globalData.isBindphone = true;
          wx.showModal({
            title: '绑定成功',
            showCancel: false,
             success: res => {
              wx.navigateTo({
                url: '../subscribe/subscribe',
              })
            }
          })
          that.setData({
            isShow: false,
          })
        } else {
          console.log(res.data.status, '失败');
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false
          })
        }
      }
    })
  },
  getCofirm(e) {
    this.setData({
      code: e.detail.value
    });
  },
  setCode() {
    var txt = this.data.time + '秒后重发';
    this.setData({
      time: parseInt(this.data.time) - 1,
      codeText: txt
    })
    if (this.data.time == 0) {
      this.setData({
        time: 60,
        codeText: "获取验证码"
      })
      clearInterval(this.timer);
    }
  }
})