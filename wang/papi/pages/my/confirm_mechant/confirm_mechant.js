// pages/my/confirm_netred/confirm_netred.js
import { toLogin, alert } from '../../../utils/util.js'

var reg = /^1[3,5,7,8]\d{9}$/
const app = getApp();
Page({
  data: {
    checkImgList:[],
    files: [],
    shop_name: "",
    admin_name:"",
    admin_phone:"",
    address:"",
    category:"",
    isShow:false,
    shop_describe: "",
    live_type: "",
    list: [
      {
        isSelected: 1,
        name: "红蓝宝石/贵重宝石",
      }, {
        isSelected: 0,
        name: "钻石",
      }, {
        isSelected: 0,
        name: "天然珍珠",
      }, {
        isSelected: 0,
        name: "翡翠",
      }
    ],
    length:0,
    selectIndex: 0,
  },
  getIntro(e) { 
    var id = e.target.id;
    this.setData({
      shop_describe:e.detail.value,
      length: e.detail.value.length
    })
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
  
  getInput(e) {
    var id = e.target.id;
    var obj = {};
    obj[id] = e.detail.value;
    this.setData(obj);
  },
  // 提交判断
  submit(e) {
    var data = {};
    data.shop_name = this.data.shop_name;
    data.admin_name = this.data.admin_name;
    data.admin_phone = this.data.admin_phone;
    data.shop_describe = this.data.shop_describe;
    var obj = this.data.list[this.data.selectIndex];
    data.category = obj.name;
    data.address = this.data.address;
    data.open_id = app.globalData.open_id;
    if (data.shop_name == "") {
      return alert("请输入店铺名称");
    } else if (data.admin_name == "") {
      return alert("请输入管理员姓名");
    } else if (data.admin_phone == "") {
      return alert("请输入手机号");
    } else if (!reg.test(data.admin_phone)) {
      return alert("手机号格式不正确");
    }else if (data.shop_describe == "") {
      return alert("请输入店铺简介");
    } else if (this.data.files.length < 1) {
      return alert("请上传营业执照照片");
    }else if (data.address == "") {
      return alert("请输入注册地址");
    }
    console.log(data)
    wx.showLoading({
      title: '正在提交审核',
      duration: 100000,
      mask:true
    });
    var picArr = this.data.files;
    console.log(picArr);
    this.uploadimg({
      url: `${app.globalData.baseUrl}/Index/User/upload_img`,
      path: picArr,
      open_id: app.globalData.open_id,
    }, arr => {
      console.log(arr);
      data.shop_img = arr;
      this.apply(data,()=>{
        //提交成功跳转到成功页面
        wx.navigateTo({
          url: 'submit_success/submit_success',
        })
      });
    })
  },
  // 提交审核
  apply(data,cb) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/apply_shop`,
      type: "POST",
      data,
      success: res => {
        wx.hideLoading();
        console.log(res.data.status, 'res.data.status',);
        if (res.data.status == 1) {
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
      url: `${app.globalData.baseUrl}/Index/User/apply_shop_info`,
      type: "POST",
      data,
      success: res => {
        wx.hideLoading();
        if (res.data.status == 1) {
          console.log(res.data.data.apply_shop_info);
          
          var arr = res.data.data.apply_shop_info.shop_info_img;
          var arr1 = [];
          for (var i in arr){
            arr1.push(arr[i].img_path);
          }
          this.setData({
            isShow: true,
            info: res.data.data.apply_shop_info,
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
    this.setData(options);
    if (this.data.is_shop != 'null'){
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