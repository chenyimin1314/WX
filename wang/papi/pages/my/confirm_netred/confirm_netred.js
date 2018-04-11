// pages/my/confirm_netred/confirm_netred.js
import { toLogin, alert } from '../../../utils/util.js'
const app = getApp();
Page({
  data: {
    date: '2017-11-01',
    files: [],
    name: "",
    isShow:false,
    profile: "",
    live_type: "",
    personal: [],
    list: [
      {
        isSelected: 1,
        name: "映客",
        platform_id: "",
        fans: "",
        create_time: "",
      }, {
        isSelected: 0,
        name: "一直播",
        fans: "",
        create_time: "",
      }, {
        isSelected: 0,
        name: "淘宝",
        fans: "",
        create_time: "",
      }, {
        isSelected: 0,
        name: "",
        fans: "",
        create_time: "",
      }
    ],
    selectIndex: 0,
  },
  uploadimg: function (data, cb) {
    app.uploadimg(data, cb);
  },
  // 选择图片
  chooseImage: function (e) {
    var that = this;
    if (this.data.files.length >= 2) {
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
    if (this.data.personal.length >= 10) {
      return alert("最多上传10张照片");
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
  checkImg(e){
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
  // 日期改变
  bindDateChange: function (e) {
    var obj = e.target.dataset;
    var arr = this.data.list;
    arr[obj.index].create_time = e.detail.value;
    this.setData({
      list: arr
    })
  },
  getInput(e) {
    var id = e.target.id;
    var obj = {};
    obj[id] = e.detail.value;
    this.setData(obj);
  },
  // 获取列表的输入
  getListPara(e) {
    var id = e.target.id;
    var obj = e.target.dataset;
    var list = this.data.list;
    list[obj.index][id] = e.detail.value;
    this.setData({
      list: list
    })
  },
  // 提交判断
  submit(e) {
    var data = {};
    data.name = this.data.name;
    data.profile = this.data.profile;
    var obj = this.data.list[this.data.selectIndex];
    data.platform = obj.name;
    data.platform_id = obj.platform_id;
    data.fans = obj.fans;
    data.platform_time = obj.create_time;
    data.live_type = this.data.live_type;
    data.open_id = app.globalData.open_id;
    if (data.name == "") {
      return alert("请输入网红昵称");
    } else if (data.profile == "") {
      return alert("请输入个人简介");
    } else if (data.platform == "") {
      return alert("请输入平台");
    } else if (data.platform_id == "") {
      return alert("请输入平台id");
    } else if (data.fans == "") {
      return alert("请输入粉丝量");
    } else if (data.platform_time == "") {
      return alert("请选择时间");
    } else if (data.live_type == "") {
      return alert("请输入擅长直播类型");
    } else if (this.data.files.length < 2) {
      return alert("请上传身份证正反照片");
    } else if (this.data.personal.length < 5) {
      return alert("请上传至少五张个人照");
    }
    wx.showLoading({
      title: '正在提交审核',
      duration: 100000,
      mask:true,
    });
    var picArr = this.data.files.concat(this.data.personal);
    this.uploadimg({
      url: `${app.globalData.baseUrl}/Index/User/upload_img`,
      path: picArr,
      open_id: app.globalData.open_id,
    }, arr => {
      console.log(arr);
      var id_img = [], user_img = [];
      for (var i = 0; i < arr.length; i++) {
        if (i < 2) {
          id_img.push(arr[i])
        } else {
          user_img.push(arr[i]);
        }
        data.id_img = id_img;
        data.user_img = user_img;
      }
      this.apply(data,()=>{
        this.getConfirm({
          user_id: app.globalData.user_id,
          open_id: app.globalData.open_id
        })
        this.setData({
          is_red_net:0
        })
      });
    })
  },
  // 提交审核
  apply(data,cb) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/red_net_audit`,
      type: "POST",
      data,
      success: res => {
        wx.hideLoading();
        console.log(res.data.status, 'res.data.status',);
        if (res.data.status == 1) {
          alert('提交成功');
          this.setData({
            status: 2
          })
          cb&&cb();
        } else {
          alert(res.data.msg);
        }
      }
    })
  },
  // 获取认证信息
  getConfirm(data) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/red_net_audit_info`,
      type: "POST",
      data,
      success: res => {
        wx.hideLoading();
        if (res.data.status == 1) {
          console.log(res.data.data.audit_info);
          
          var arr = res.data.data.audit_info.audit_img;
          var arr1 = [];
          for (var i in arr){
            arr1.push(arr[i].img_path);
          }
          this.setData({
            isShow: true,
            info: res.data.data.audit_info,
            checkImgList: arr1,
          });
          console.log(this.data.files, this.data.checkImgList)
        } else {
          alert(res.data.msg);
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData(options);
    if (this.data.is_red_net != 'null'){
      wx.setNavigationBarTitle({
        title: '审核资料'
      })
    }
    wx.showLoading({
      title: '加载中',
      duration:5000
    })
    if (app.globalData.user_id) {
      this.getConfirm({
        user_id: app.globalData.user_id,
        open_id: app.globalData.open_id
      })
    } else {
      toLogin(app, res => {
        this.getConfirm({
          user_id: app.globalData.user_id,
          open_id: app.globalData.open_id
        })
      })
    }
  },
  call(){
    wx.showModal({
      title: '提示',
      content: '是否拨打客服电话88888888',
      cancelColor:"#777",
      confirmColor:'#ff3b2f',
      success:res=>{
        if(res.confirm){
          wx.makePhoneCall({
            phoneNumber: '88888888',
          })
        }
      }
    })
  }
})