// pages/index/city_transport/city_transport.js
const app = getApp()
var QQMapWX = require('../../lib/qqmap-wx-jssdk.min.js');
import { toLogin } from '../../../utils/util.js'
// 实例化API核心类
var mapSdk = new QQMapWX({
  key: 'OI7BZ-EGOWU-H5YVZ-4HLVW-MDUUQ-ZCFGJ' // 必填
});
Page({
  data: {
    checkboxItems: [
      { name: '4.2米货车', value: '1', price: 400, count: 1, checked: true },
      { name: '依维柯', value: '0', price: 300, count: 1 }
    ],
    smallthings: [
      { name: '床', value: '1', price: 100, checked: true, count: 1, unit: "张" },
      { name: '推拉门衣柜/书柜', value: '0', price: 300, count: 1, unit: "个" }
    ],
    feeArr: [{
      name: "起步价",
      price: "0"
    }, {
      name: "里程费用",
      price: "0"
    }, {
      name: "小件价(拆装)",
      price: "0"
    }, {
      name: "大件价",
      price: "0"
    }, {
      name: "配件",
      price: "0"
    }, {
      name: "总计",
      price: "0"
    }],
    isShow:false, 
    place: {
      start: {
        address: "点击选择起点...",
        name:"",
        latitude:"",
        longitude:""
      },
      end: {
        address: "点击选择终点...",
        name: "",
        latitude: "",
        longitude: ""
      }
    },
    floor_type: [{
      name: "电梯",
      style: "background:#fff;color:#ff5155;border-color:#ff5155"
    }, {
      name: "楼梯"
    }],
    stratumIndex: 0,
    diatance: [{
      name: "低于30m",
      style: "background:#fff;color:#ff5155;border-color:#ff5155"
    }, {
      name: "30m-50m"
    }, {
      name: "50m-100m"
    }, {
      name: "地下室进或出"
    }],
    displacement: 0
  },
  
  submitInfo(){
    if (app.globalData.isBindphone){
      var order = {};
      var product = []
      var arr = this.data.checkBoxItems;
      arr = arr.concat(this.data.smallthings).concat(this.data.bigthings).concat(this.data.parts);
      for (var i = 0; i < arr;i++){
        if(arr[i].checked){
          product.push({
            product_id:arr[i].product_id,
            num:arr[i].count,
            price:arr[i].price
          })
        }
      }

    }else{

    }
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)

    var items = this.data.special;
    for (var i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value == e.detail.value
    }

    this.setData({
      special: items
    });
    this.setPrice();
  },
  setvalue(e) {
    var obj = e.target.dataset;
    var arr = [];
    console.log(obj);
    switch (Number(obj.type)) {
      case 0: arr = this.data.checkboxItems; break;
      case 1: arr = this.data.smallthings; break;
      case 2: arr = this.data.bigthings; break;
      case 3: arr = this.data.parts; break;
      case 4: arr = this.data.special; break;
    }
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      if (i == obj.index) {
        if (obj.add == 1) {
          console.log(1)
          if (arr[i].count < 99) {
            arr[i].count = Number(arr[i].count) + 1;
          }
        } else if (obj.add == -1) {
          console.log(-1)
          if (arr[i].count > 0) {
            arr[i].count = Number(arr[i].count) - 1;
          }
        }
        if (arr[i].count > 0) {
          arr[i].style = "background:#ff5155";
        } else {
          arr[i].style = "";
        }
      }
    }
    console.log(arr);
    switch (Number(obj.type)) {
      case 0: this.setData({
        checkboxItems: arr
      }); break;
      case 1: this.setData({
        smallthings: arr
      }); break;
      case 2: this.setData({
        bigthings: arr
      }); break;
      case 3: this.setData({
        parts: arr
      }); break;
      case 4: this.setData({
        special: arr
      }); break;
    }
    this.setPrice();
  },
  // input修改数字
  
  blur1(){
    // 组织冒泡防止警告
  },
  blur(e) {
    console.log(111);
    var obj = e.target.dataset;
    var value = e.detail.value;
    var arr = [];
    console.log(obj);
    switch (Number(obj.type)) {
      case 0: arr = this.data.checkboxItems; break;
      case 1: arr = this.data.smallthings; break;
      case 2: arr = this.data.bigthings; break;
      case 3: arr = this.data.parts; break;
      case 4: arr = this.data.special; break;
    }
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      if (i == obj.index) {
        arr[i].count = value;
        if (arr[i].count > 0) {
          arr[i].style = "background:#ff5155";
        } else {
          arr[i].style = "";
        }
      }
    }
    console.log(arr);
    switch (Number(obj.type)) {
      case 0: this.setData({
        checkboxItems: arr
      }); break;
      case 1: this.setData({
        smallthings: arr
      }); break;
      case 2: this.setData({
        bigthings: arr
      }); break;
      case 3: this.setData({
        parts: arr
      }); break;
      case 4: this.setData({
        special: arr
      }); break;
    }
    this.setPrice();
  },


  //选择楼层
  chooseStratum(e) {
    this.setData({
      stratumIndex: e.detail.value,
      floor: (parseInt(e.detail.value) + 1)
    });
    this.setPrice();
    console.log(this.data.floor)
  },
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var values = e.detail.value;
    var obj = e.target.dataset;
    var arr = [];
    switch (Number(obj.index)) {
      case 0: arr = this.data.checkboxItems; break;
      case 1: arr = this.data.smallthings; break;
      case 2: arr = this.data.bigthings; break;
      case 3: arr = this.data.parts; break;
      case 4: arr = this.data.special; break;
    }
    for (var i = 0, lenI = arr.length; i < lenI; ++i) {
      arr[i].checked = false;
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (arr[i].value == values[j]) {
          arr[i].checked = true;
          break;
        }
      }
    }
    switch (Number(obj.index)) {
      case 0: this.setData({
        checkboxItems: arr
      }); break;
      case 1: this.setData({
        smallthings: arr
      }); break;
      case 2: this.setData({
        bigthings: arr
      }); break;
      case 3: this.setData({
        parts: arr
      }); break;
      case 4: this.setData({
        special: arr
      }); break;
    }
    this.setPrice();
  },

  chooseplace(e) {
    console.log(e.target);
    var key = e.target.dataset.id;
    console.log("key",key);
    var obj = this.data.place || {};
    wx.chooseLocation({
      success: res => {
        console.log(res);
        obj[key].name = res.name;
        obj[key].address = res.address;
        obj[key].latitude = res.latitude;
        obj[key].longitude = res.longitude;
        console.log(obj)
        this.setData({
          place: obj
        });
        console.log(obj.start.latitude, obj.end.latitude, obj.start.latitude && obj.end.latitude)
        // console.log('from', {
        //   latitude: obj.start.latitude,
        //   longitude: obj.start.longitude
        // }, "to", {
        //     latitude: obj.end.latitude,
        //     longitude: obj.end.longitude
        //   })
        if (obj.start.latitude && obj.end.latitude) {
          mapSdk.calculateDistance({
            mode: "driving",
            from: {
              latitude: obj.start.latitude,
              longitude: obj.start.longitude
            },
            to: [{
              latitude: obj.end.latitude,
              longitude: obj.end.longitude
            }],
            success: res => {
              console.log(res);
              if (res.message == 'query ok') {
                this.setData({
                  displacement: (res.result.elements[0].distance / 1000).toFixed(2)
                })
                this.setPrice();
              }

            },
            fail: function (res) {
              console.log(res);
            },
            complete: function (res) {
              console.log(res);
            }
          });
        }
      },
    });
  },
  // 选择远距离
  choose_floor_type(e) {
    var obj = e.target.dataset;
    console.log(obj)
    var arr = [];
    if (obj.type == 1) {
      arr = this.data.floor_type;
    } else if (obj.type == 3) {
      arr = this.data.diatance;
    }
    let l = arr.length
    for (let i = 0; i < l; i++) {
      if (i == obj.index) {
        arr[i].style = "background:#fff;color:#ff5155;border-color:#ff5155"
      } else {
        arr[i].style = "";
      }
    }
    if (obj.type == 1) {
      this.setData({
        floor_type: arr
      })
    } else if (obj.type == 3) {
      this.setData({
        diatance: arr
      })
    }
    this.setPrice();

  },
  // 设置价格
  setPrice() {
    let arr = this.data.checkboxItems;
    let len = arr.length;
    let sum = 0;
    let arr_res = this.data.feeArr;
    // 计算起步价
    var carNum = 0;
    for (var i = 0; i < len; ++i) {
      if (arr[i].checked == true) {
        sum += arr[i].count * arr[i].price;
        carNum += Number(arr[i].count);
      }
    }
    var displacement = this.data.displacement
    if (displacement > 500){
        sum = sum + Math.ceil((displacement - 500)/10) * 10 * 0.8 + 200/10*10*0.9 + 290/10 * 10;
    } else if (displacement > 300){
      sum = sum + Math.ceil((displacement - 300) / 10) * 10 * 0.9 +  290 / 10 * 10;
    } else if (displacement <= 300 && displacement>10 ){
      sum = sum + Math.ceil((displacement-10) / 10);
    }
    console.log(sum, typeof sum);
    arr_res[0].price = sum;
    //计算搬运费
    sum = 0;
    arr = this.data.floor_type;
    var floorIndex = Number(this.data.stratumIndex)+1;
    console.log(floorIndex,"floorIndex")
    console.log(arr[0].style)
    if(arr[0].style){
      sum += 0;
    }else{
      if (floorIndex>2){
        console.log(floorIndex)
      }
      sum += (floorIndex-2)*30*carNum;
    }
    console.log(sum)
    arr = this.data.diatance;
    for(var i = 0;i<arr.length;i++){
      if(arr[i].style){
        switch(i){
          case 0:sum +=30*carNum;break;
          case 1: sum += 50 * carNum; break;
          case 2: sum += 100 * carNum; break;
          case 3: sum += 100 * carNum; break;
          default:console.log(arr[i]);
        }
      }
    }
    arr_res[1].price = sum;

    // 计算小件
    arr = this.data.smallthings;
    len = arr.length;
    sum = 0;
    for (var i = 0; i < len; ++i) {
      if (arr[i].checked = true) {
        sum += arr[i].count * arr[i].price;
      }
    }
    arr_res[2].price = sum;
    // 计算大件
    var floor = this.data.floor_type;
    arr = this.data.bigthings;
    len = arr.length;
    sum = 0;
    for (var i = 0; i < len; ++i) {
      if (arr[i].checked = true) {
        if(arr[i].name == "钢琴"){
          if (floor[0].style){
            
          }
        }else{
          sum += arr[i].count * arr[i].price;
        }
      }
    }
    arr_res[3].price = sum;
    console.log("大件",sum)
    // 计算配件
    arr = this.data.parts;
    len = arr.length;
    sum = 0;
    for (var i = 0; i < len; ++i) {
      if (arr[i].checked = true) {
        sum += arr[i].count * arr[i].price;
      }
    }
    arr_res[4].price = sum;
    //特殊时段价格计算
    sum = 0;
    console.log(this.data.feeArr)
    arr = this.data.feeArr;
    len = arr.length -2;
    console.log(len)
    for(var i = 0;i<len;i++){
      sum += arr[i].price;
      console.log(arr[i].price);
    }
    console.log("总价格",sum);
    var arr1 = this.data.special;
    if (arr1[1].checked){
      sum = sum * 1.3;
    } else if (arr1[2].checked){
      sum = sum * 2;
    }
    console.log(sum)
    arr_res[5].price = sum;
    // 设置价格
    this.setData({ feeArr: arr_res });
  },

  onLoad: function (options) {
    this.getInfo();
    var arr = [];
    for (var i = 1; i < 100; i++) {
      arr.push(i + '层');
    }
    this.setData({ stratum: arr });
  },
  getInfo() {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/get_product`,
      type: "POST",
      success: res => {
        console.log(res.data);
        if (res.data.status == 1) {
          var resArr = res.data.data.product_list || [];
          console.log(resArr)
          let l = resArr.length;
          var arr0 = [],
            arr1 = [],
            arr2 = [],
            arr3 = [],
            arr4 = []
          console.log(l);
          for (let i = 0; i < l; i++) {
            switch (resArr[i].type) {
              case 1:
                arr0.push({
                  value: i,
                  count: 0,
                  price: resArr[i].price,
                  product_id: resArr[i].product_id,
                  company: resArr[i].company,
                  name: resArr[i].name
                })
                break;
              case 2:
                arr1.push({
                  value: i,
                  count: 0,
                  price: resArr[i].price,
                  product_id: resArr[i].product_id,
                  company: resArr[i].company,
                  name: resArr[i].name
                })
                break;
              case 3:
                arr2.push({
                  value: i,
                  count: 0,
                  price: resArr[i].price,
                  product_id: resArr[i].product_id,
                  company: resArr[i].company,
                  name: resArr[i].name
                })
                break;
              case 4:
                arr3.push({
                  value: i,
                  count: 0,
                  price: resArr[i].price,
                  product_id: resArr[i].product_id,
                  company: resArr[i].company,
                  name: resArr[i].name
                })
                break;
              case 5:
                arr4.push({
                  value: i,
                  count: 0,
                  price: resArr[i].price,
                  product_id: resArr[i].product_id,
                  company: resArr[i].company,
                  name: resArr[i].name
                })
                break;
            }
          }
          arr4.unshift({
            checked:true,
            name:"正常时间出车",
            price:"0",
            value: 36,
            count: 0,
          })
            this.setData({
              smallthings: arr0,
              bigthings: arr1,
              parts: arr2,
              checkboxItems: arr3,
              special: arr4
            })
        }
      }
    })
  }
})