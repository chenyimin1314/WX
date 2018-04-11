const app = getApp();
import { confirm, alert, show, hide, ajax } from '../../../../utils/util.js'
Page({
  data: {
    list: [],
    currentIndex: 0,
    floorType0: [
      {
        name: "低于30米"
      },
      {
        name: "30-50米"
      }, {
        name: "50-100米"
      }, {
        name: "100以上"
      }, {
        name: "地下室出入"
      }
    ],
    floorType1: [
      {
        name: "低于30米"
      },
      {
        name: "30-50米"
      }, {
        name: "50-100米"
      }, {
        name: "100以上"
      }, {
        name: "地下室出入"
      }
    ],
    totalPrice: "",
  },
  setIndex(e) {
    var obj = e.target.dataset;
    this.setData({
      currentIndex: obj.index
    })
  },
  setType(e) {
    var obj = e.target.dataset;
    var list = this.data.list;
    console.log(obj.index);
    list[0].type1 = obj.index;
    list[0].name = this.data.floorType0[obj.index].name;
    console.log(list);
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
    list[1].name = this.data.floorType1[obj.index].name;
    this.setData({
      currentType1: obj.index,
      list,
    })
    this.getMoney();
  },
  getInput(e) {
    var obj = e.target.dataset;
    var arr = this.data.list;
    console.log(arr);
    arr[obj.index].count = parseInt(e.detail.value);
    this.setData({
      list: arr
    })
    this.getMoney();
  },
  getMoney() {
    var count = app.globalData.distance.count;
    var arr = this.data.list;
    var totalPrice = 0;
    for (var i in arr) {
      if (arr[i].type1 >= 0) {
        var onePrice = 0;
        console.log('arr[i].type1', arr[i].type1)
        if (arr[i].type1 * 1 >= 0) {
          console.log('+++++', arr[i].type1)
          if ((arr[i].type1 * 1) <= 3) {
            console.log('arr')
            var index = 'price' + (arr[i].type1 * 1 + 1);
            console.log('index', index)
            onePrice = arr[i][index];
          } else if (arr[i].type1 * 1 > 3) {
            onePrice = arr[i].price4;
          } else {
            onePrice = 0;
          }

        } else {
          arr[i].price = 0;
        }
      } else {
        arr[i].price = 0;
      }
      arr[i].onePrice = onePrice;
      console.log('onePrice', onePrice)
      arr[i].price = onePrice * count;
      totalPrice += arr[i].price;
      console.log(totalPrice)
    }
    console.log('totalPrice', totalPrice)
    console.log(arr, '价格');
    this.setData({
      list: arr,
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
    app.globalData.trip_list = this.data.list;
    app.globalData.pricelist.mileage_price = this.data.totalPrice;
    app.globalData.pricelist.sum_price = app.getTotal(app.globalData.pricelist);
    show('保存成功', res => {
      wx.navigateBack({
        delta: 1
      })
    }, 'success', 1500);
  },
  onLoad: function (options) {
    this.setData({
      list: app.globalData.trip_list
    })
    console.log(this.data.list)
  }
})