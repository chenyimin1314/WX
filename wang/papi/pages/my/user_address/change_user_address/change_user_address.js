import { alert, toLogin } from '../../../../utils/util.js'
const model = require('../model/model.js');
const app = getApp();
const reg = /^1[3,5,7,8]\d{9}$/;
var item = {};
Page({
  data: {
    name: "",
    phone: "",
    detail: "",
    address:"所在地区",
    item: {
      show: false
    }
  },
  // 获取输入
  getInput(e) {
    var obj = {};
    obj[e.target.id] = e.detail.value;
    this.setData(obj);
  },
  addAddress() {
    if (this.data.name == "") {
      return alert("请输入姓名！");
    } else if (this.data.phone == "") {
      return alert("请输入手机号！");
    } else if (!reg.test(this.data.phone)) {
      return alert("请输入正确的手机号");
    } else if (this.data.address == "所在地区") {
      return alert("请选择所在地址");
    } else if (this.data.detail == "") {
      return alert("请输入详细地址");
    }
    wx.showLoading({
      title: '添加中',
      duration: 3000
    })
    var data = {
      name: this.data.name,
      phone: this.data.phone,
      address: this.data.address + '-' + this.data.detail,
      address_id: this.data.address_id
    }
    if (app.globalData.open_id) {
      data.open_id = app.globalData.open_id;
      this.addAddressFn(data);
    } else {
      toLogin(app, () => {
        console.log(app.globalData)
        data.open_id = app.globalData.open_id;
        console.log(data)
        this.addAddressFn(data);
      })
    }
  },
  addAddressFn(data) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/edit_user_address`,
      data,
      type: 'POST',
      success: res => {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.status == 1) {
          alert('修改成功', '', function () {
            wx.navigateBack({
              delta: 1
            });
          });

        } else {
          alert(res.data.msg);
        }
      }
    })
  },
  //获取单个数据
  getOneAddress(data) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/one_user_address`,
      type: "POST",
      data,
      success: res => {
        wx.hideLoading();
        if (res.data.status == 1) {
          console.log(res.data.data.address);
          var obj = res.data.data.address;
          if(obj.address.indexOf('-')>-1){
            var address = obj.address.split('-')[0];
            var detail = obj.address.split('-')[1];
          }else{
            var address = obj.address.split(/县|区/)[0];
            var detail = obj.address.split(/县|区/)[1];
          }
          console.log(address,detail);
          this.setData({
            name: obj.contacts_name,
            phone: obj.phone,
            detail:detail,
            address: address,
          })
        } else {
          alert(res.data.msg);
        }
      }
    })
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      duration:3000
    })
    console.log(options)
    this.setData(options);
    if(app.globalData.open_id){
      this.getOneAddress({
        open_id: app.globalData.open_id,
        address_id: options.address_id
      })
    }else{
      toLogin(app,()=>{
        this.getOneAddress({
          open_id: app.globalData.open_id,
          address_id: options.address_id
        })
      })
    }
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