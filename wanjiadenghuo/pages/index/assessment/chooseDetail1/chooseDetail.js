const app = getApp();
import { confirm,alert, show, hide, ajax } from '../../../../utils/util.js'
Page({
  data: {
    list: [],
    currentIndex: 0,
    floorType0: [
      {
        name: "电梯"
      },
      {
        name: "楼梯"
      }
    ],
    floorType1: [
      {
        name: "电梯"
      },
      {
        name: "楼梯"
      }
    ],
    totalPrice:"",
  },
  setIndex(e) {
    var obj = e.target.dataset;
    this.setData({
      currentIndex: obj.index
    })
  },
  setType(e){
    var obj = e.target.dataset;
    var list = this.data.list;
    console.log(obj.index);
    list[0].type1 = obj.index;
    this.setData({
      currentType: obj.index,
      list,
    })
    this.getMoney();
  },
  setType1(e) {
    var obj = e.target.dataset;
    console.log(obj.index);
    var list = this.data.list;
    list[1].type1 = obj.index;
    this.setData({
      currentType1: obj.index,
      list,
    })
    this.getMoney();
  },
  getInput (e) {
    var obj = e.target.dataset;
    var arr = this.data.list;
    console.log(arr);
    arr[obj.index].count = parseInt(e.detail.value);
    this.setData({
      list:arr
    })
    this.getMoney();
  },
  getMoney(){
    var count = app.globalData.distance.count;
    var arr = this.data.list;
    var totalPrice = 0;
    for(var i in arr){
      if(arr[i].type1 == 0){
        arr[i].price = 0;
      } else if (arr[i].type1 == 1){
        if (arr[i].count < arr[i].layer){
          arr[i].price = 0;
        }else{
          console.log(arr[i].count)
          arr[i].onePrice = (arr[i].count - 2) * arr[i].layer_price;
          arr[i].price = (arr[i].count - 2) * arr[i].layer_price * count;
        }
      }
      totalPrice += arr[i].price;
    }
    console.log(arr,'价格');
    this.setData({
      list:arr,
      totalPrice
    })
  },
  chooseShop(e) {
    var obj = e.target.dataset;
    var arr = this.data.list;
    for (var i in arr) {
      if (obj.index == i) {
        if (arr[i].selected) {
          arr[i].selected = false;
        } else {
          arr[i].selected = true;
        }
      }
    }
    this.setData({
      list: arr
    })
    console.log(arr);
  },
  cancel() {
    wx.navigateBack({
      delta: 1
    })
  },
  save() {
    var arr = this.data.list;
    var flag = false;
    for (var i in arr) {
      if (arr[i].count > 0 && arr[i].type>-1) {
        flag = true;
      }
    }
   
    app.globalData.floor_list = this.data.list;
    app.globalData.pricelist.floor_price = this.data.totalPrice;
    app.globalData.pricelist.sum_price = app.getTotal(app.globalData.pricelist);
    show('保存成功', res => {
      wx.navigateBack({
        delta: 1
      })
    }, 'success', 1500);
  },
  onLoad: function (options) {
    this.setData({
      list: app.globalData.floor_list,
      totalPrice: app.globalData.pricelist.floor_price
    })
    console.log(this.data.list)
  }
})