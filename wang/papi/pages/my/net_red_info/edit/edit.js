// pages/my/confirm_netred/confirm_netred.js
import { toLogin, alert } from '../../../../utils/util.js'
const app = getApp();
Page({
  data: {
    date: '2017-11-01',
    files: [],
    name: "",
    sign: "",
    isShow: false,
    profile: "",
    live_type: "",
    personal: [],
    selectIndex: 0,
  },
  uploadimg: function (data, cb) {
    app.uploadimg(data, cb);
  },
  // 选择图片
  chooseImage: function (e) {
    var that = this;
    if (this.data.files.length >= 1) {
      return;
    }
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  chooseImage_personal: function (e) {
    var that = this;
    if (this.data.personal.length >= 5) {
      return alert("最多上传5张照片");
    }
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          personal: that.data.personal.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage_personal: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.personal // 需要预览的图片http链接列表
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  // 查看图片
  checkImg(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.checkImgList // 需要预览的图片http链接列表
    })
  },
  // 选择
  select(e) {
    var obj = e.target.dataset;
    var arr = this.data.list;
    for (var i = 0; i < arr.length; i++) {
      if (i == obj.index) {
        arr[i].isSelected = 1;
        this.setData({
          selectIndex: i
        })
      } else {
        arr[i].isSelected = 0;
      }
    }
    this.setData({
      list: arr
    })
  },
  // 获取输入
  getInput(e) {
    var id = e.target.id;
    var obj = {};
    obj[id] = e.detail.value;
    this.setData(obj);
  },

  // 提交判断
  submit(e) {
    var data = {};
    data.name = this.data.name;
    data.sign = this.data.sign;
    data.open_id = app.globalData.open_id;
    if (data.name == "") {
      return alert("请输入网红昵称");
    } else if (data.sign == "") {
      return alert("请输入个性签名");
    } else if (this.data.files.length < 1) {
      return alert("请上传封面照片");
    } else if (this.data.personal.length < 1) {
      return alert("请上传至少一张个人照片");
    }
    wx.showLoading({
      title: '正在提交审核',
      duration: 10000
    });
    var picArr = this.data.files.concat(this.data.personal);
    this.uploadimg({
      url: `${app.globalData.baseUrl}/Index/User/upload_img`,
      path: picArr,
      open_id: app.globalData.open_id,
    }, arr => {
      console.log(arr);
      var id_img = [], user_img = [];
      data.head_image_url = arr.slice(0, 1)[0];
      data.user_img = arr.slice(1, arr.length);
      console.log(data);
      this.apply(data, () => {
        
      });
    })
  },
  // 提交个人照片
  apply(data, cb) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/edit_red_net_info`,
      type: "POST",
      data,
      success: res => {
        wx.hideLoading();
        console.log(res.data.status,'res.data.status');
        if (res.data.status == 1) {
          cb && cb();
          alert("保存成功","",function(){
            wx.navigateBack({
              delta:1
            })
          })
        } else {
          alert(res.data.msg);
        }
      }
    })
  },
  //  加载
  onLoad: function (options) {
    if(options.name){
      options.name = decodeURIComponent(options.name);
      options.sign = decodeURIComponent(options.sign);
    }
    this.setData(options);
    if(!app.globalData.open_id){
      toLogin(app, function () {
        wx.hideLoading();
      });
    }

  },

})