// pages/index/assessment/assessment.js
import { toLogin, confirm, setUrl, alert, ajax, show, hide } from '../../../../utils/util.js';
var M = require('../../../../utils/md5.js');
const app = getApp();
Page({
  data: {
    baojia: {},
    isShow: false,
    codeText: "获取验证码",
    busy: false,
    list:[[],[],[],[],[]]
  },
  call() {
    confirm('', '是否拨打400-700-8942', res => {
      wx.makePhoneCall({
        phoneNumber: '400-700-8942',
      })
    })
  },
  toUrl(e) {
   
  },
  getList(data) {
    data = data ? data : {};
    ajax(`/Index/User/order_details_price`, data, res => {
        var arr = res.data.product;
        var list = this.data.list;
        for (var i in arr) {
          switch (arr[i].type) {
            case 1: list[0].push(arr[i]); break;
            case 2: list[1].push(arr[i]); break;
            case 3: list[2].push(arr[i]); break;
            case 4: list[3].push(arr[i]); break;
            case 5: list[4].push(arr[i]); break;
          }
        }
        console.log(list);
        this.setData({
          list,
          car_list: app.globalData.car_list,
          floor_list: res.data.floor_order,
          trip_list: res.data.trip_order,
          address: res.data.address,
          pricelist: res.data.pricelist
        })
     
    },"GET")
  },
  
  onLoad: function (options) {
    // options.order_id = '1000043'
    this.setData(options)
    this.getList({
      open_id:app.globalData.open_id,
      order_id: this.data.order_id
    });
  }
 
})