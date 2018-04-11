//app.js
var arr = [];
App({
  uploadimg(data, cb) {
    var that = this,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'fileData',//这里根据自己的实际情况改
      formData: {
        open_id: data.open_id
      },
      success: (res) => {
        success++;
        var obj = JSON.parse(res.data);
        console.log(obj)
        if (obj.status == 1) {
          arr.push(obj.data.img_path);
        }
        console.log(i);
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        fail++;
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        i++;
        if (i == data.path.length) {   //当图片传完时，停止调用 
          console.log(cb, "cb", typeof cb);
          cb && cb(arr, i);
          arr = [];
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else {//若图片还没有传完，则继续调用函数
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data, cb);
        }
      }
    });
  },
  setTime(arr,key){
    for(var i in arr){
      arr[i][key] = arr[i][key].substr(0,10);
    }
    return arr;
  },
  getToday(d) {
    d = d ? d : new Date();
    let y = d.getFullYear();
    let m = d.getMonth() * 1 + 1;
    let to = d.getDate();
    return ([y, m, to]).map(function (n) {
      n = n.toString()
      console.log(n, n[1])
      return n[1] ? n : '0' + n
    }).join('-')
  },
  // "pricelist": {
  //   "starting_price": 0,//(搬运价)
  //   "floor_price": 0,//楼层价
  //   "mileage_price": 0,//距离价
  //   "min_price": 0,//拆装价
  //   "max_price": 0,//大件价
  //   "parts_price": 0,//特殊时段价
  //   "sum_price": 0//总价
  // },

  getTotal(a) {
    a.sum_price = a.starting_price * 1 + a.floor_price * 1 + a.mileage_price * 1 + a.min_price * 1 + a.max_price + a.parts_price;
    return a.sum_price;
  },
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

  },
  reset() {
    this.globalData.list = [[], [], [], []];
    this.globalData.car_list = [];
    this.globalData.floor_list = [];
    this.globalData.trip_list = [];
    this.globalData.carAddress = [];
    this.globalData.distance = {
      distance: 0,
      money: 0,
      count: 0,
    }
    this.globalData.carAddress = {
      start: {},
      end: {}
    };
    this.globalData.pricelist = {
      "starting_price": 0,//(搬运价)
      "floor_price": 0,//楼层价
      "mileage_price": 0,//距离价
      "min_price": 0,//拆装价
      "max_price": 0,//大件价
      "parts_price": 0,//特殊时段价
      "sum_price": 0//总价
    }
  },
  globalData: {
    userInfo: null,
    isLogin: false,
    baseUrl: 'https://www.hukesoft.com/HouseMoving/index.php',
    isBindphone: false,
    // open_id: 'o29fr0Nrkt8wArN3ZaK4wcLJZdCA',
    list: [[], [], [], []],
    car_list: [],
    floor_list: [],
    trip_list: [],
    // 车型选择计算
    distance: {
      distance: 0,
      money: 0,
      count: 0,
    }, carAddress: {
      start: {},
      end: {}
    },
    "pricelist": {
      "starting_price": 0,//(搬运价)
      "floor_price": 0,//楼层价
      "mileage_price": 0,//距离价
      "min_price": 0,//拆装价
      "max_price": 0,//大件价
      "parts_price": 0,//特殊时段价
      "sum_price": 0//总价
    },
    subscribe_success: "",
    message: "",
    //

  }
})