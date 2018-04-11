const app = getApp();
import { confirm, alert, show, hide, ajax } from '../../../../utils/util.js';
var QQMapWX = require('../../../lib/qqmap-wx-jssdk.min.js');
var mapSdk = new QQMapWX({
  key: 'OI7BZ-EGOWU-H5YVZ-4HLVW-MDUUQ-ZCFGJ' // 必填
});
Page({
  data: {
    list: [],
    carAddress: {
      start: {},
      end: {}
    }, distance: {
      distance: 0,
      money: 0,
      count:0,
    }
  },
  // 修改数量
  add(e) {
    var obj = e.target.dataset;
    var arr = this.data.list;
    arr[obj.index].count = arr[obj.index].count ? arr[obj.index].count : 0;
    arr[obj.index].count++;
    this.setData({
      list: arr
    }) 
    this.getMoney(); 
  },
  reduce(e) {
    var obj = e.target.dataset;
    var arr = this.data.list;
    arr[obj.index].count = arr[obj.index].count ? arr[obj.index].count : 0;
    if (arr[obj.index].count >= 1) {
      arr[obj.index].count--;
    }
    this.setData({
      list: arr
    })
    this.getMoney();
  },
  setInput(e) {
    var obj = e.target.dataset;
    var arr = this.data.list;
    console.log(obj.index)
    if(e.detail.value*1 >= 0){
      arr[obj.index].count = e.detail.value * 1;
      this.setData({
        list: arr
      })
    }    
    if (arr[obj.index].count > 0) {
      this.getMoney();
    }
  },
  // 选择车
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
    this.getMoney();
  },
  // 选择地点
  choosePlace(e) {
    var obj = e.target.dataset;
    console.log(obj);
    wx.chooseLocation({
      success: res => {
        if (!res.address || !res.name) {
          alert('未选择地址');
        } else {
          var carAddress = this.data.carAddress;
          carAddress[obj.id].name = res.name;
          carAddress[obj.id].latitude = res.latitude;
          carAddress[obj.id].longitude = res.longitude;
          carAddress[obj.id].address = res.address;
          console.log(carAddress);
          // 起终点同时存在时访问
          if (carAddress.start.longitude && carAddress.end.longitude) {
            var url = `https://restapi.amap.com/v3/direction/driving?origin=${carAddress.start.longitude},${carAddress.start.latitude}&destination=${carAddress.end.longitude},${carAddress.end.latitude}&extensions=all&output=json&key=50b0843d96197bd1e8ce4532bcf1ab37`
            wx.request({
              url: url,
              method: "GET",
              success: res => {
                console.log(Math.round(res.data.route.paths[0].distance/1000));
                var distance = this.data.distance;
                distance.distance = Math.round(res.data.route.paths[0].distance/1000); 
                this.setData({
                  distance
                });
                this.getMoney();            
              }
            })
          }
          this.setData({
            carAddress
          })
        }

        console.log(res);
      },
    })
  },
  getMoney(d) {
    var distance = this.data.distance;
    d = distance.distance;
    var arr = this.data.list;
    console.log(arr, '列表');
    var count = 0;
    var money = 0;
    for (var i in arr) {
      arr[i].count = arr[i].count ? arr[i].count : 0;
      if (arr[i].selected) {
        arr[i].price = arr[i].count * arr[i].car_price;
        count += arr[i].count;
        money += arr[i].price;
      } else {
        arr[i].price = 0;
      }
    };
    console.log(arr, count);
    this.setData({
      list: arr
    })
    if (d <= (arr[0].distance1 * 1)) {
      distance.money = money;
    } else if (d <= (arr[0].distance2 * 1) && d > (arr[0].distance1 * 1)) {
      // 第一段 小于300公里 按10块不打折
      var onePrice = (d - arr[0].distance1) * arr[0].price1;
      distance.money += count * onePrice;
    } else if (d <= (arr[0].distance3 * 1) && d > (arr[0].distance1 * 2)) {
      //超过300小于500，10公里以内不多加收费
      var onePrice = (arr[0].distance2 - arr[0].distance1) * arr[0].price1
        + (d - arr[0].distance2) * arr[0].price2;
      distance.money += count * onePrice;
    } else {
      var onePrice = (arr[0].distance2 - arr[0].distance1) * arr[0].price1
        + (arr[0].distance3 - arr[0].distance2) * arr[0].price2
        + (d - arr[0].distance3) * arr[0].price3;
      distance.money += count * onePrice;
    }
    app.globalData.starting_price = distance.money;
    distance.count = count;
    console.log(distance);
    this.setData({
      distance,
    })

  },
  cancel(){
    wx.navigateBack({
      delta:1
    })
  },
  save(){
    var arr = this.data.list;
    var flag = false;
    for(var i in arr){
      if(arr[i].selected && arr[i].count > 0){
        flag = true;
      }
    }
    if(!flag){
     return  alert('请至少选择一辆车');
    }
    if(!this.data.carAddress.start.address){
      return alert("请选择开始地址");
    } else if (!this.data.carAddress.end.address){
      return alert("请选择结束地址");
    }
    app.globalData.distance = this.data.distance;
    app.globalData.car_list = this.data.list;
    app.globalData.carAddress = this.data.carAddress;
    app.globalData.pricelist.starting_price = this.data.distance.money
    // 由于数量变换，需要对数据进行更新;
    var arr1 = app.globalData.floorlist;
    var arr1_total = 0;
    for (var i in arr1) {
      arr1[i].price = arr1[i].onePrice * this.data.distance.count;
      arr1_total += arr1[i].price;
    }
    app.globalData.floorlist = arr1;
    // 更新价格
    app.globalData.pricelist.floor_price = arr1_total;
    app.globalData.pricelist.sum_price = app.getTotal(app.globalData.pricelist);
    show('保存成功',res=>{
      wx.navigateBack({
        delta:1
      })
    },'success',1500);
  },
  onShow: function () {
   
  },
  onLoad: function () {
    this.setData({
      list: app.globalData.car_list,
      distance: app.globalData.distance,
      carAddress: app.globalData.carAddress,
    })
    console.log(this.data.list);
  }
})