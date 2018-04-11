
import { toLogin, alert, addshopping, setAddress, confirm } from '../../utils/util.js'
const app = getApp();
Page({
  data: {
    isShow: false,
    shop: [],
    isSelectAll: 'false',
    price: 0,
  },
  selectSuccess(data, cb) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/select_product`,
      type: "POST",
      data,
      success: res => {
        cb && cb(res);
        if (res.data.status == 1) {
          console.log(res);
        } else {
          console.log("失败")
          alert("操作失败");
        }
      }
    })
  },
  // 没有商品跳转到首页
  toIndex(){
    wx.switchTab({
      url: '../index/index',
    })
  },
  selectAll(e) {
    var state;
    if (this.data.isSelectAll == "true") {
      state = 0;
    } else {
      state = 1;
    }
    this.selectSuccess({
      open_id: app.globalData.open_id,
      state,
    }, (res) => {
      var arr = this.data.shop;
      if (res.data.status == 1) {
        if (this.data.isSelectAll == "true") {
          this.setData({
            isSelectAll: "false"
          });
          for (var i = 0; i < arr.length; i++) {
            this.setSelect(i, "false");
          }
        } else {
          this.setData({
            isSelectAll: "true"
          });
          for (var i = 0; i < arr.length; i++) {
            this.setSelect(i, "true");
          }
        }
        this.setData({
          price: this.countPrice()
        })
      }
    })
  },
  // 设置选择列表
  setSelect(index, a) {
    var arr = this.data.shop;
    arr[0].isselected = a;
    for (var i = 0; i < arr[index].product.length; i++) {
      arr[index].product[i].isselected = a;
    }
    this.setData({
      shop: arr,
    })
  },
  // 选择店铺
  selectShop(e) {
    var obj = e.target.dataset;
    var shop = this.data.shop;
    var data = {
      shop_id: shop[obj.index].shop_id,
      open_id: app.globalData.open_id,
    };
    var str = "";
    if (shop[obj.index].isselected == "false") {
      data.state = 1;
      str = "true"
    } else {
      data.state = 0;
      str = "false"
    }
    this.selectSuccess(data, (res) => {
      if (res.data.status == 1) {
        this.setSelect(obj.index, str);
        this.setData({
          price: this.countPrice()
        })
      }
    })
  },
  // 选择单个商品
  selectProduct(e) {
    var obj = e.target.dataset;
    console.log(obj);
    var arr = this.data.shop;
    var data = {
      shopping_cart_id: arr[obj.index].product[obj.idx].shopping_cart_id,
      open_id: app.globalData.open_id,
    }
    this.selectSuccess(data, (res) => {
      if (res.data.status == 1) {
        arr[obj.index].isselected = 'false';
        this.setData({
          isSelectAll: false,
        })
        if (res.data.data.statu == 1) {
          arr[obj.index].product[obj.idx].isselected = "true"
        } else {
          arr[obj.index].product[obj.idx].isselected = "false"
        }
        this.setData({
          shop: arr
        });
        this.setData({
          price: this.countPrice()
        })
      }
    })
  },
  // 获取购物车
  getPurchase(data,cb) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/shopping_cart`,
      type: "POST",
      data,
      success: (res) => {
        wx.hideLoading();
        if (res.data.status == 1) {
          console.log(res.data.data.shop)
          if (res.data.data.shop && res.data.data.shop.length>0){
            this.setData({
              shop: res.data.data.shop,
              isShow: true,
            })
          }else{
            this.setData({
              shop: [],
              isShow: true,
            })
          }
          cb && cb();
          console.log(res.data.data)
        } else {
          alert('参数错误')
        }
      }
    })
  },
  // 计算价格
  countPrice(cb) {
    var sum = 0;
    var arr = this.data.shop;
    var selectAll = true;
    var isSelect = false;
    for (var i = 0; i < arr.length; i++) {
      console.log(1 + "price");
      var selectShop = true,
        arr1 = arr[i].product;
      console.log(arr1);
      for (var j = 0; j < arr1.length; j++) {
        if (arr1[j].isselected == "true") {
          sum += (Number(arr1[j].number)) * (Number(arr1[j].price));
          isSelect = true;
        } else {
          selectShop = false;
          selectAll = false;
          continue;
        }
      }
      if (selectShop) {
        arr[i].isselected = "true"
      } else {
        arr[i].isselected = "false"
      }
    }
    if (selectAll) {
      this.setData({
        isSelectAll: "true",
        shop: arr
      })
      if(arr.length<1){
        this.setData({
          isSelectAll: "false"
        })
      }
    } else {
      this.setData({
        isSelectAll: "false",
        shop: arr
      })
    }
    this.setData({
      price: sum
    })
    cb && cb(isSelect)
    return sum;
  },
  // 购物车更改数量
  //https://www.hukesoft.com/RedNet/index.php/Index/User/update_num
  changeNum(data, cb) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/update_num`,
      type: "POST",
      data,
      success: (res) => {
        if (res.data.status == 1) {
          cb && cb();
        } else if (res.data.status == 0) {
          alert("库存不足");
        } else {
          alert("操作失败");
        }
      }
    })
  },
  getNum(e) {
    var obj = e.target.dataset;
    var shop = this.data.shop;
    var num = Number(e.detail.value);
    var a = JSON.parse(JSON.stringify(shop[obj.index].product[obj.idx]));
    var stock = a.stock
    if (num <= a.stock && num >= 1) {
      this.changeNum({
        open_id: app.globalData.open_id,
        shopping_cart_id: a.shopping_cart_id,
        number: num
      }, () => {
        a.number = num;
        shop[obj.index].product[obj.idx] = a;
        this.setData({
          shop,
        })
      })
    } else {
      this.setData({
        shop,
      })
    }
  },
  setNum(e) {
    var obj = e.target.dataset;
    var shop = this.data.shop;
    var a = JSON.parse(JSON.stringify(shop[obj.index].product[obj.idx]));
    if (obj.type == 0) {
      if (a.number > 1) {
        a.number = Number(a.number) - 1;
        this.changeNum({
          open_id: app.globalData.open_id,
          shopping_cart_id: a.shopping_cart_id,
          number: a.number
        }, () => {
          shop[obj.index].product[obj.idx] = a;
          this.setData({
            shop,
          })
        })
      }
    } else if (obj.type == 1) {
      if (Number(a.number) < Number(a.stock)) {
        a.number = Number(a.number) + 1;
        this.changeNum({
          open_id: app.globalData.open_id,
          shopping_cart_id: a.shopping_cart_id,
          number: a.number
        }, () => {
          shop[obj.index].product[obj.idx] = a;
          this.setData({
            shop: shop
          })
        })
      }
    }
  },
  confirm_purchase() {
    this.countPrice(res => {
      if(res){
        wx.navigateTo({
          url: `confirm_purchase/confirm_purchase`,
        })
      }else{
        alert("最少选择一件商品");
      }
    })
   
  },
  onReady: function () {

  },
  onShow: function () {
    wx.showLoading({
      title: '加载中',
      duration: 5000,
      mask: true,
    })
    if (app.globalData.open_id) {
      this.getPurchase({
        open_id: app.globalData.open_id
      },()=>{
        this.countPrice();
      })
    } else {
      toLogin(app, () => {
        this.getPurchase({
          open_id: app.globalData.open_id
        },()=>{
          this.countPrice();
        })
      })
    }
  },
  delete(e) {
    var obj = e.target.dataset;
    wx.showModal({
      title: '提示',
      content: '是否删除当前商品',
      confirmColor: "#ff3b2f",
      cancelColor: "#ff3b2f",
      success: res => {
        if (res.confirm) {
          var shop = this.data.shop;
          wx.request({
            url: `${app.globalData.baseUrl}/Index/User/delete_product`,
            type: "POST",
            data: {
              open_id: app.globalData.open_id,
              shopping_cart_id: shop[obj.index].product[obj.idx].shopping_cart_id
            },
            success: res => {
              if (res.data.status == 1) {
                shop[obj.index].product.splice(obj.idx, 1);
                this.setData({
                  shop,
                })
                alert("删除成功");
              }
            }
          })
        }
      }
    })
  }
})