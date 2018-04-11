// pages/my/my.js
const app = getApp();
import { alert, show, hide, toLogin, ajax, setUrl,confirm } from '../../utils/util.js'
Page({
  data: {
    hasUserInfo: "",
    isShow: false,
    userInfo: {},
    imgList: [],
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    arr: []
  },
  preview(e) {
    console.log()
    wx.previewImage({
      current: e.target.id, // 当前显示图片的http链接
      urls: this.data.imgList // 需要预览的图片http链接列表
    })
  },
  toUrl() {
    // var userInfo = this.data.userInfo;
    // userInfo.id_state = 1;
    // this.setData({
    //   userInfo
    // })
    if (this.data.userInfo.id_state == null) {
      wx.navigateTo({
        url: 'identity/identity',
      })
    } else if (this.data.userInfo.id_state == 0) {
      wx.navigateTo({
        url: setUrl('identity/identity', { disabled: 1 }),
      })
    } else if (this.data.userInfo.id_state == 1) {
      wx.navigateTo({
        url: 'identity_success/identity_success',
      })
    } else if (this.data.userInfo.id_state == 2) {
      confirm("","是否重新提交审核",res=>{
        wx.navigateTo({
          url: 'identity/identity',
        })
      })
    }

  },
  getUserInfo(cb) {
    ajax('/Index/User/user_info', { open_id: app.globalData.open_id }, res => {
      console.log(res);
      this.setData({
        imgList: [`https://www.hukesoft.com/HouseMoving/index.php/Index/User/user_product_card?user_id={{userInfo.user_id}}`]
      })
      cb && cb(res);
    }, 'GET')
  },
  onShow() {
    // 刷新用户信息
    if (this.data.userInfo.name) {
      this.getUserInfo(res => {
        app.globalData.userInfo = res.data.user_info;
        console.log(res.data.user_info)
        this.setData({
          isShow: true,
          userInfo: app.globalData.userInfo,
          phone: app.globalData.phone
        })
        console.log(this.data.userInfo)
      })
    }
  },
  // 盟友跳转
  toDetail(e){
    var url = e.target.id;
    if(this.data.userInfo.id_state == 1){
      wx.navigateTo({
        url: url,
      })
    }else{
      alert('您不是盟友,暂无权限查看');
    }
  },
  onLoad(options) {
    this.setData(options);
    var recommend_id = options.user_id;
    show()
    if (!app.globalData.open_id) {
      toLogin(app, res => {
        this.getUserInfo(res => {
          app.globalData.userInfo = res.data.user_info;
          console.log(res.data.user_info)
          this.setData({
            isShow: true,
            userInfo: app.globalData.userInfo,
            phone: app.globalData.phone
          })
        })
        hide();
      },recommend_id)

    } else {
      console.log(app.globalData.userInfo)
      this.getUserInfo(res => {
        app.globalData.userInfo = res.data.user_info;
        console.log(res.data.user_info)
        this.setData({
          isShow: true,
          userInfo: app.globalData.userInfo,
          phone: app.globalData.phone
        })
        console.log(this.data.userInfo)
      })
      hide();
    }
  },
})