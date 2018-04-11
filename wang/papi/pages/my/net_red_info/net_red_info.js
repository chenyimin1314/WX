// pages/my/net_red_info/net_red_info.js

const app = getApp();
import { toLogin, alert, setUrl } from '../../../utils/util.js'
Page({
  data: {
    camera: [],
    info: {},
    isShow: false,
    isMine: false
  },
  // 获取个人信息
  getInfo(data) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/red_net_info`,
      data,
      type: "POST",
      success: res => {
        wx.hideLoading();
        console.log(res.data)
        if (res.data.status == 1) {
          this.setData({
            info: res.data.data.user_info,
            isShow:true
          })
        } else {
          alert(res.data.msg)
        }
      }
    })
  },
  confirm(e) {
    var obj = e.target.dataset;
    if (obj.is_fans == 1) {
      return;
    }
    var txt = obj.is_fans == 1 ? "是否取消关注?" : "是否添加关注?";
    wx.showModal({
      content: txt,
      cancelColor: "#006bff",
      confirmColor: "#006bff",
      success: res => {
        if (res.confirm) {
          var data = {
            open_id: app.globalData.open_id,
            user_id: this.data.user_id,
          }
          var url = "";
          if (obj.is_fans == 1) {
            url = `${app.globalData.baseUrl}/Index/User/cancelFollow`;
          } else {
            url = `${app.globalData.baseUrl}/Index/User/follow`;
          }
          // 请求数据
          this.reqConfirm(data, url, obj.is_fans, obj.index);
        }
      }
    })
  },
  reqConfirm(data, url, is_fans, index) {
    wx.request({
      url: url,
      type: "POST",
      data,
      success: res => {
        console.log(res.data)
        if (res.data.status == 1) {
          var info = this.data.info;
          if (is_fans == 1) {
            info.is_fans = 0;
          } else {
            info.is_fans = 1;
          }
          this.setData({ info: info });
          alert(res.data.msg)
        } else {
          alert(res.data.msg)
        }
      }
    })
  },
  setMine(options) {
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
  edit() {
    wx.navigateTo({
      url: setUrl('edit/edit',{
        name: this.data.info.name,
        sign: this.data.info.sign,
      }),
    })
  },
  toCarema(){
    wx.navigateTo({
      url: setUrl('camera/camera',{user_id:this.data.user_id}),
    })
  },
  toDetail(e){
    var obj = e.target.dataset;
    obj.user_id = this.data.user_id;
    wx.navigateTo({
      url: setUrl("../../index/shop_detail/shop_detail",obj),
    })
  },
  toDaiyan(){
    var obj = {};
    obj.user_id = this.data.user_id;
    wx.navigateTo({
      url: setUrl("daiyan/daiyan", obj),
    })
  },
  onReady: function () {

  },
  onShow: function () {
    if(this.data.isShow){
      this.setData({
        camera: [],
        info: {},
        isShow: false,
      })
      this.getInfo({
        open_id: app.globalData.open_id,
        user_id: this.data.user_id
      });
    }
  }
})