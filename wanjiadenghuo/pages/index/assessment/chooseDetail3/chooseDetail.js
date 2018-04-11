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
    if (e.detail.value * 1 >= 0) {
      arr[obj.index].count = e.detail.value * 1;
      this.setData({
        list: arr
      })
    }
    if (arr[obj.index].count > 0) {
      this.getMoney();
    }

    this.getMoney();
  },
  chooseShop(e){
    var obj = e.target.dataset;
    var arr = this.data.list;
    for(var i in arr){
      if(obj.index == i){
        if(arr[i].selected){
          arr[i].selected = false;
        }else{
          arr[i].selected = true;
        }
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
      list[i].count = list[i].count ? list[i].count : 0;
      if(list[i].selected){
        list[i].countPrice = list[i].count * list[i].price; 
        totalPrice += list[i].countPrice; 
      }else{
        list[i].countPrice = 0;
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
    app.globalData.list[0] = this.data.list;
    app.globalData.pricelist.min_price = this.data.totalPrice;
    app.globalData.pricelist.sum_price = app.getTotal(app.globalData.pricelist);
    show('保存成功', res => {
      wx.navigateBack({
        delta: 1
      })
    }, 'success', 1500);
  },
  onLoad: function (options) {
    this.setData({
      list: app.globalData.list[0],
      totalPrice: app.globalData.pricelist.min_price,
      order_type_describe: app.globalData.order_type_describe
    })
    console.log(this.data.list)
  }
})