// pages/index/subscribe/subscribe.js
const reg = /^1[3578]\d{9}$/;
import { toLogin, confirm, setUrl, alert, ajax, show, hide } from '../../../utils/util.js';
const app = getApp();
Page({
  data: {
    "about_at": app.getToday(),//预约时间
    "remarks": "",
    "name": "",
    "phone": "",
    "name_two": "",
    "phone_two": "",
    "about_time":"08:00",
  },
  onLoad: function (options) {

  },
  bindDateChange(e) {
    console.log(e.detail.value);
    this.setData({
      about_at: e.detail.value
    })
  },
  bindTimeChange(e){
    this.setData({
      about_time: e.detail.value
    })
  },
  getValue(e) {
    console.log(e);
    var obj = {};
    obj[e.target.id] = e.detail.value;
    this.setData(obj)
  },
  submit() {
    var d = new Date().setHours(8, 0, 0, 0);
    var a = new Date(this.data.about_at);
    console.log(d)
    if ((a - d) <= 0) {
      alert("请提前一天预约");
      return;
    } else if (this.data.name == "") {
      alert('请填写联系人名称');
      return;
    } else if (this.data.phone == "") {
      alert('请填写联系电话');
      return;
    }
    var obj = {};
    obj.open_id = app.globalData.open_id;
    obj.address = {};
    obj.address = {
      "start_address": app.globalData.carAddress.start.address,
      "end_address": app.globalData.carAddress.end.address, //结束地址
      "distance": app.globalData.distance.distance, //总距离
      "about_at": this.data.about_at + " " + this.data.about_time + ":00",//预约时间
      "remarks": this.data.remarks,
      "name": this.data.name,
      "phone": this.data.phone,
      "name_two": this.data.name_two,
      "phone_two": this.data.phone_two,
    }

    obj.pricelist = app.globalData.pricelist;
    obj.product = [];
    obj.floor_order = [];
    obj.trip_order = [];
    // 汽车
    var arr = app.globalData.car_list;
    for (var i in arr) {
      if (arr[i].selected) {
        obj.product.push({
          product_id: arr[i].product_id,
          num: arr[i].count,
          price: arr[i].car_price * arr[i].count
        });
      }
    }
    // 楼层
    var arr = app.globalData.floor_list;
    for (var i in arr) {
      if (i == 0) {
        obj.floor_order.push({
          type1: 2,
          type2: arr[i].type == 0 ? 1 : 2,
          layer: arr[i].count
        })
      } else if (i == 1) {
        obj.floor_order.push({
          type1: 1,
          type2: arr[i].type == 0 ? 1 : 2,
          layer: arr[i].count
        })
      }
    }
    // 远距离搬运
    var arr = app.globalData.trip_list;
    for (var i in arr) {
      console.log(arr[i]);
      if (i == 0) {
        obj.trip_order.push({
          type: 2,
          distance: arr[i].name
        })
      } else if (i == 1) {
        obj.trip_order.push({
          type: 1,
          distance: arr[i].name
        })
      }
    }
    // 拆装
    arr = app.globalData.list[0];
    for(var i in arr){
      if (arr[i].selected) {
        obj.product.push({
          product_id: arr[i].product_id,
          num: arr[i].count,
          price: arr[i].price * arr[i].count
        });
      }
    }
    //大件
    arr = app.globalData.list[1];
    for (var i in arr) {
      if (arr[i].selected) {
        obj.product.push({
          product_id: arr[i].product_id,
          num: arr[i].count,
          price: arr[i].price * arr[i].count
        });
      }
    }
    // 特殊时段
    arr = app.globalData.list[3];
    for (var i in arr) {
      if (arr[i].selected) {
        obj.product.push({
          product_id: arr[i].product_id,
          num: arr[i].name,
          price: arr[i].price
        });
      }
    }
    console.log(obj);
    var order = {};
    order.order = obj;
    console.log(order)
    show();
    ajax('/Index/User/add_order', order,res=>{
      hide();
      alert(res.msg,"",()=>{
        console.log(res.data)
        app.globalData.subscribe_success = res.data;
        wx.navigateTo({
          url: 'subscribe_success/subscribe_success',
        })
      });
    })
  },

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})