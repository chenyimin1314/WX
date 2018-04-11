const app = getApp();
var M = require('../../utils/md5.js');
import { toLogin, alert } from '../../utils/util.js'
Page({
  data: {
    showBindPhone: false,
    isShow: false,
    phone: '',
    codeText: '获取验证码',
    code: '',
    info: {
      identity: 0
    }
  },
  // 查看个人信息
  checkInfo(e) {
    console.log(e.target)
    var obj = e.target.dataset;
    if (obj.index == 2) {
      wx.navigateTo({
        url: 'net_red_info/net_red_info',
      })
    }
  },
  toConfircheckInfo(e) {
    var obj = e.target.dataset;
    this.setData(obj)
    this.toOthers(obj);
    // 商家认证

  },
  toOthers(obj) {
    if (obj.index == 1) {
      if (typeof (obj.is_red_net) == "number") {
        return;
      } else {
        if (app.globalData.isBindphone) {
          wx.navigateTo({
            url: 'confirm_mechant/confirm_mechant?identity=' + obj.identity + "&is_shop=" + obj.is_shop + '&is_red_net=' + obj.is_red_net,
          })
        } else {
          this.setData({
            showBindPhone: true
          })
        }
      }
    } else if (obj.index == 2) {
      if (typeof (obj.is_shop) == "number") {
        return;
      } else {
        if (app.globalData.isBindphone) {
          wx.navigateTo({
            url: 'confirm_netred/confirm_netred?identity=' + obj.identity + "&is_shop=" + obj.is_shop + '&is_red_net=' + obj.is_red_net,
          })
        } else {
          this.setData({
            showBindPhone: true
          })
        }
      }
    } else if (obj.index == 3) {
      wx.navigateTo({
        url: 'represent/represent'
      })
    } else if (obj.index == 4) {
      wx.navigateTo({
        url: 'represent_manager/represent_manager'
      })
    }
  },
  // 获取用户信息
  getUserInfo(user_id) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/user_info`,
      data: { user_id },
      type: "POST",
      success: res => {
        wx.hideLoading();
        if (res.data.status == 1) {
          console.log(app.globalData);
          app.globalData.header_url = res.data.data.user_info.head_image_url;
          app.globalData.user_name = res.data.data.user_info.name;
          this.setData({
            info: res.data.data.user_info,
            isShow: true,
          })
        } else {
          alert(res.data.msg)
        }
      }
    })
  },
  // 设置获取验证码文字
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
  },
  // 获取输入的手机号
  getPhone(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  // 获取输入的验证码
  getCofirm(e) {
    this.setData({
      code: e.detail.value
    });
  },
  // 获取验证码函数
  getCode() {
    var reg_phone = /^1[34578]\d{9}$/ //手机号正则
    console.log(reg_phone.test(this.data.phone));
    if (this.data.codeText == "获取验证码") {
      console.log(this.data.phone, 'this.data.phone')
      if (!reg_phone.test(this.data.phone)) {
        return wx.showModal({
          title: '手机号输入错误',
          showCancel: false
        });
      }
      var str = 'rednet';
      str = M.MD5(32, str);
      var data = {
        phone: this.data.phone,
        content: str
      }
      //获取验证码
      var that = this;
      wx.request({
        url: app.globalData.baseUrl + "/Index/User/validate",
        data: {
          phone: this.data.phone,
          content: str
        },

        method: "GET",
        success: function (res) {
          console.log(res);
          if (res.data.status == 1) {
            console.log(res.data);
            that.setData({
              'time': 59,
              codeText: "60秒后重发",
              code: ""
            });
            that.timer = setInterval(that.setCode, 1000);
          } else {
            alert(res.data.msg);
          }
        }
      })

    }
  },
  cancelBind() {
    this.setData({
      showBindPhone: false,
    })
  },
  // 绑定手机号
  bindwechat() {
    var reg = /^1[34578]\d{9}$/ //手机号正则
    var that = this;
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
    
    // 绑定手机号
    wx.request({
      url: app.globalData.baseUrl + '/Index/User/binding_phone',
      data: data,
      type: "GET",
      success: function (res) {
        if (res.data.status == 1) {
          app.globalData.isBindphone = true;
          app.globalData.phone = data.phone;
          that.setData({
            showBindPhone: false,
          })
          if (that.data.index == 1) {
            wx.navigateTo({
              url: 'confirm_mechant/confirm_mechant?identity=' + that.data.identity + "&is_shop=" + that.data.is_shop + '&is_red_net=' + that.data.is_red_net,
            })
          } else if (that.data.index == 2) {
            wx.navigateTo({
              url: 'confirm_netred/confirm_netred?identity=' + that.data.identity + "&is_shop=" + that.data.is_shop + '&is_red_net=' + that.data.is_red_net,
            })
          }
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
  onLoad: function (options) {
    // app.globalData.isBindphone = false;
    wx.showLoading({
      title: '加载中',
      duration: 3000,
      mask: true
    })
    if (app.globalData.user_id) {
      this.getUserInfo(app.globalData.user_id);
    } else {
      toLogin(app, res => {
        this.getUserInfo(app.globalData.user_id);
      })
    }
  },
  onShow() {
    if (app.globalData.user_id) {
      this.getUserInfo(app.globalData.user_id);
      
    }
  },
})