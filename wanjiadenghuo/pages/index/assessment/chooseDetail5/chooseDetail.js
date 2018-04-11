const app = getApp();
import { confirm, show, hide, ajax } from '../../../../utils/util.js'
Page({
  data: {
    list: [],
    totalPrice:0,
  },
  add(e) {
    var obj = e.target.dataset;
    var arr = this.data.list;
    arr[obj.index].count = arr[obj.index].count ? arr[obj.index].count:0;
    arr[obj.index].count++;
    console.log(arr[obj.index],'-------');
    this.setData({
      list: arr
    })
    console.log(this.data.list)
    this.getMoney();
  },
  reduce(e) {
    var obj = e.target.dataset;
    var arr = this.data.list;
    arr[obj.index].count = arr[obj.index].count ? arr[obj.index].count : 0;
    if(arr[obj.index].count >= 1){
      arr[obj.index].count--;
    }
    this.setData({
      list: arr
    })
    this.getMoney();
  },
  setInput(e){
    var obj = e.target.dataset;
    var arr = this.data.list;
    arr[obj.index].count = arr[obj.index].count ? arr[obj.index].count : 0;
    arr[obj.index].count = e.detail.value;
    this.setData({
      list: arr
    })
    this.getMoney();
  },
  chooseShop(e){
    var obj = e.target.dataset;
    var arr = this.data.list;
    for(var i in arr){
      if(obj.index == i){
        arr[i].selected = true;
      }else{
        arr[i].selected = false;
      }
    }
    this.setData({
      list:arr
    })
    this.getMoney();
    console.log(arr);
  },
  getMoney(){
    var list  = this.data.list;
    var totalPrice = 0;
    for(var i in list){
      if(list[i].selected){
        console.log(app.globalData.pricelist.starting_price,'参数数据');
        totalPrice = app.globalData.pricelist.starting_price * list[i].price;
        console.log(app.globalData.pricelist.starting_price * list[i].price)
        
      }
    }
    console.log(totalPrice,'totalPrice');
    this.setData({
      list,
      totalPrice,
    })
  },
  cancel() {
    wx.navigateBack({
      delta: 1
    })
  },
  save() {
    var arr = this.data.list;
    app.globalData.list[3] = this.data.list;
    app.globalData.pricelist.parts_price = this.data.totalPrice;
    app.globalData.pricelist.sum_price = app.getTotal(app.globalData.pricelist);
    show('保存成功', res => {
      wx.navigateBack({
        delta: 1
      })
    }, 'success', 1500);
  },
  onLoad: function (options) {
    console.log(app.globalData.pricelist)
    this.setData({
      list: app.globalData.list[3],
      totalPrice: app.globalData.pricelist.parts_price,
    })
    console.log(this.data.list)
  }
})