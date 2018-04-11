//
// pages/my/myprofit/apply/apply.js
import { alert, show, hide, toLogin,ajax } from '../../../utils/util.js'
const model = require('../model/model.js');
const app = getApp();
const reg = /^1[3,5,7,8]\d{9}$/;
var item = {};
Page({
  data: {
    name: "",
    phone: "",
    detail: "",
    job:"",
    address: "所在地区",
    item: {
      show: false
    },
    personal: [],
  },
  // 获取输入
  getInput(e) {
    var obj = {};
    obj[e.target.id] = e.detail.value;
    this.setData(obj);
  },
  getConfirm(){
    ajax('/Index/User/id_audit_info',{open_id:app.globalData.open_id},res=>{
      var obj = res.data.id_audit_info;
      console.log(obj);
      var arr = [];
      var resArr = obj.img;
      for (var i in resArr){
        arr.push(resArr[i].img_path);
      }
      this.setData({
        name: obj.name,
        phone: obj.phone,
        address: obj.address.split('-')[0],
        detail:obj.address.split('-')[1],
        phone: obj.phone,
        post: obj.post,
        personal:arr
      })
    },"GET");
  },
  onLoad: function (options) {
    // options.disabled = 0;
    this.setData(options);
    
    if(options.disabled){
      this.getConfirm();
      wx.setNavigationBarTitle({
        title: '审核中',
      })
    }
  },
  cancel() {

  },
  confirm() {
    if(this.data.name == ""){
      alert('请输入姓名');
    }else if(this.data.phone == ""){
      alert('请输入手机号');
    } else if (!reg.test(this.data.phone)){
      alert("请输入正确的手机号")
    }else if(this.data.job == ""){
      alert("请输入岗位");
    } else if (this.data.address == "所在地区"){
      alert('请选择地址')
    }else if (this.data.detail == "") {
      alert("请输入详细地址");
    }else if(this.data.personal.length == 0){
      alert("请上传至少一张图片");
    }else{
      var data = {
        name:this.data.name,
        open_id:app.globalData.open_id,
        phone:this.data.phone,
        post:this.data.job,
        address:`${this.data.address}-${this.data.detail}`
      };
      show('提交中,请稍等',"","",30000);
      this.uploadimg({
        url: `${app.globalData.baseUrl}/Index/User/upload_img`,
        path: this.data.personal,
        open_id: app.globalData.open_id,
      }, arr => {
        data.id_img = arr;
        console.log(arr);
        //上传的数据
        ajax('/Index/User/id_audit',data,res=>{
          console.log(res.status,res,res.data)
          if(res.status == 1){
            alert('提交成功','',a=>{
              wx.navigateBack({
                delta:1
              })
            })
          }
        },"GET")
      })
      console.log(this.data.personal);
      
    }

  },
  previewImage_personal: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.personal // 需要预览的图片http链接列表
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
      count: 5,
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          personal: that.data.personal.concat(res.tempFilePaths)
        });
      }
    })
  },
  uploadimg: function (data, cb) {
    app.uploadimg(data, cb);
    
  },
  onReady: function (e) {
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);
  },
  translate: function (e) {
    model.animationEvents(this, 0, true, 400);
  },
  //隐藏picker-view
  hiddenFloatView: function (e) {
    model.animationEvents(this, 200, false, 400);
  },
  //滑动事件
  bindChange: function (e) {
    model.updateAreaData(this, 1, e);
    item = this.data.item;
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name,
      address: item.provinces[item.value[0]].name + item.citys[item.value[1]].name + item.countys[item.value[2]].name
    });
    console.log(this.data.address);
  },
  nono: function () {

  }
})