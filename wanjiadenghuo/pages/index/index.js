//index.js
import { toLogin } from '../../utils/util.js'
const app = getApp();
//获取应用实例
Page({
  data:{
    isShow:false,
    codeText:"获取验证码"
  },
  getPhone(e) {
    this.setData({
      phone: e.detail.value
    });
  },
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
        success: function (res) {
          console.log(res);
          if (res.data.status == 1) {
            console.log(res.data);
          }
        }
      })
      this.setData({
        'time': 59,
        codeText: "60秒后重发",
        code: ""

      });
      this.timer = setInterval(this.setCode, 1000);
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
            showCancel: false
          })
          that.setData({
            isShow:false,
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
  },
  onLoad(){
    var that = this;
    if(app.globalData.user_id){
     
    }else{
    }
  },
  goTo(e){
    console.log(e.target)
  },
  
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) { }
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '同意授权',
        success: function (res) {
          console.log(res)
        }
      })
    }
  }  
})