// pages/index/mechant/mechant.js
//index.js
//获取应用实例
import { toLogin, alert, addshopping, setUrl } from '../../../utils/util.js'
const app = getApp()
Page({
  data: {
    isPopver: false,
    list: [],
    page_num: 0,
    isShow: false,
    product: {},
    current: {},
    num: 1,
    info: {
      product_user: [],
    },
    intro: false,
    loaded: false,
  },
  toDetail(e) {
    var data = {};
    data.product_id = e.target.dataset.id;
    data.shop_id = this.data.info.shop_id;
    var url = setUrl('../shop_detail/shop_detail', data);
    wx.navigateTo({
      url: url,
    })
    console.log(data);
  },
  // 获取单个网红https://www.hukesoft.com/RedNet/index.php/Index/Product/one_product
  get_One_produce(data, cb) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/Product/one_product`,
      type: "POST",
      data,
      success: res => {
        wx.hideLoading();
        if (res.data.status == 1) {
          if (res.data.data.productClothes){
            var arr = res.data.data.productClothes.specs;
            var arr1 = [];
            for (var i = 0; i < arr.length; i++) {
              arr1.push(this.setObj(arr[i]));
            }
            res.data.data.productClothes.specs = arr1;
            this.setData({
              product: res.data.data.productClothes,
              current: res.data.data.productClothes.specs[0]
            })
            cb && cb();
            console.log(this.data.product, this.data.current, 'current')
          }
          
        } else {
          alert(res.data.msg);
        }
      }
    })
  },
  toPurchase(e) {
    var id = e.target.dataset.id;
    this.setData({
      current_product_id: id
    })
    this.get_One_produce({
      open_id: app.globalData.open_id,
      product_id: id
    }, () => {
      this.setData({
        isPopver: true,
      })
    })
  },
  getNum(e) {
    var obj = e.target.dataset;
    var amount = this.data.current.num;
    var value = Number(e.detail.value);
    var num = this.data.num;
    if (value > amount) {
      this.setData({ num: this.data.num })
      alert('输入数量不得大于库存');
    } else if (value < 1) {
      this.setData({ num: this.data.num })
      alert('最少选择一件');
    } else {
      this.setData({
        num: e.detail.value
      })
    }
  },
  setNum(e) {
    var obj = e.target.dataset;
    var num = Number(this.data.num);
    var amount = this.data.current.num;
    if (obj.index == 0) {
      var num1 = --num;
      if (num1 < 1) {
        this.setData({ num: this.data.num })
        alert('最少选择一件');
      } else {
        this.setData({ num: num1 })
      }
    } else if (obj.index == 1) {
      var num1 = ++num;
      if (num1 > amount) {
        this.setData({ num: this.data.num })
        alert('输入数量不得大于库存');
      } else {
        this.setData({ num: num1 })
      }
    }
  },
  // 关闭弹窗
  close(e) {
    if (e.target.dataset.index == 1) {
      this.setData({
        isPopver: false,
        num: 1,
      })
    }
  },
  closeIno(e) {
    if (e.target.dataset.index == 1) {
      this.setData({
        intro: false,
      })
    }
  },
  showIntro() {
    this.setData({
      intro: true,
    })
  },
  // 下单
  confirm(e) {
    console.log(this.data.info, 'info')
    var data = {
      product_id: this.data.current_product_id,
      product_classfy_id: this.data.current.product_classfy_id,
      number: this.data.num,
      shop_id: this.data.info.shop_id,
    }
    var current = this.data.current.num ? this.data.current.num : 0;
    if (Number(data.number) > Number(current)) {
      alert("下单数量不得大于库存");
      return;
    }
    app.globalData.tempOrder = data;
    var url = `../confirm_order/confirm_order`
    wx.navigateTo({
      url: url,
    })
  },
  // 加入购物车
  addshopping(e) {
    var data = {
      product_id: this.data.current_product_id,
      product_classfy_id: this.data.current.product_classfy_id,
      number: this.data.num,
      open_id: app.globalData.open_id,
      shop_id: this.data.info.shop_id,
    }
    var current = this.data.current.num ? this.data.current.num : 0;
    if (Number(data.number) > Number(current)) {
      alert("下单数量不得大于库存");
      return;
    }
    addshopping(data, (res) => {
      alert(res.msg);
      this.setData({
        isPopver: false,
      })
    })
  },
  addConfirm(e) {
    var obj = e.target.dataset;
    var txt = obj.is_fans == 1 ? "是否取消关注?" : "是否添加关注?";
    wx.showModal({
      content: txt,
      cancelColor: "#006bff",
      confirmColor: "#006bff",
      success: res => {
        if (res.confirm) {
          var data = {
            open_id: app.globalData.open_id,
            user_id: this.data.user_id,
          }
          var url = "";
          if (this.data.info.is_fans == 1) {
            url = `${app.globalData.baseUrl}/Index/User/cancelFollow`;
          } else {
            url = `${app.globalData.baseUrl}/Index/User/follow`;
          }
          // 请求数据
          this.reqConfirm(data, url, this.data.info.is_fans, obj.index);
        }
      }
    })
  },
  reqConfirm(data, url, is_fans, index) {
    wx.request({
      url: url,
      type: "POST",
      data,
      success: res => {
        if (res.data.status == 1) {
          var info = this.data.info;
          if (is_fans == 1) {
            info.is_fans = 0;
          } else {
            info.is_fans = 1;
          }
          this.setData({ info: info });
          alert(res.data.msg)
        } else {
          alert(res.data.msg)
        }
      }
    })
  },

  // 拨打商家电话
  call(e) {
    wx.showModal({
      title: '提示',
      content: '是否拨打商家电话' + e.target.dataset.phone,
      cancelColor: "#777",
      confirmColor: '#ff3b2f',
      success: res => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '88888888',
          })
        }
      }
    })
  },
  // 购物车选择
  choose(e) {
    var obj = e.target.dataset;
    this.setData({
      current: this.data.product.specs[obj.index]
    })
  },
  // 修改数据
  setObj(obj) {
    var obj_copy = {};
    obj_copy.num = obj.num;
    var count = 0;
    for (var i in obj) {
      ++count;
      if (count == 1) {
        obj_copy.name = i;
        obj_copy = Object.assign({}, obj_copy, obj[i])
      } else if (count == 2) {
        obj_copy.num = obj[i];
      }
      return obj_copy;
    }
  },
  onLoad: function (options) {

    this.setData(options);
    wx.showLoading({
      title: '加载中',
      duration: 5000,
      mask: true,
    })
    if (app.globalData.open_id) {
      this.getMechant({
        user_id: this.data.user_id,
        open_id: app.globalData.open_id,
        page_num: Number(this.data.page_num) + 1,
      });
    } else {
      toLogin(app, res => {
        this.getMechant({
          user_id: this.data.user_id,
          open_id: app.globalData.open_id,
          page_num: Number(this.data.page_num) + 1,
        });
      })
    }
  },
  toLower() {
    if (this.timer) {
      clearTimeout(this.timer);
      return;
    }
    this.timer = setTimeout(() => {
      wx.showLoading({
        title: '加载中',
        duration: 5000,
        mask: true
      })
      this.setData({
        page_num: Number(this.data.page_num) + 1,
      })
      this.getMechant({
        open_id: app.globalData.open_id,
        user_id: this.data.user_id,
        page_num: Number(this.data.page_num)
      })
    }, 400)
  },
  getMechant(data) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/Product/user_shop`,
      type: "POST",
      data,
      success: res => {
        wx.hideLoading();
        if (res.data.status == 1) {
          var arr = this.data.info.product_user;
          var info = res.data.data.shop_info;
          info.product_user = arr.concat(res.data.data.shop_info.product_user)
          this.setData({
            info: info,
            isShow: true
          })
          this.get_One_produce({
            open_id: app.globalData.open_id,
            product_id: 305,
          })
          if (res.data.data.shop_info && res.data.data.shop_info.shop_name) {
            wx.setNavigationBarTitle({
              title: res.data.data.shop_info.shop_name,
            });
          }

          if (!res.data.data.shop_info || res.data.data.shop_info.length < 20) {
            this.setData({ loaded: true })
          }
        } else {
          alert(res.data.msg);
        }
      }
    })
  },
  onReady: function () {

  },
  onShareAppMessage: function () {
    // 分享商品详情
    return {
      title: '商家主页',
      path: setUrl('pages/index/mechant/mechant', {
        user_id: this.data.user_id,
      })
    }
  }
})