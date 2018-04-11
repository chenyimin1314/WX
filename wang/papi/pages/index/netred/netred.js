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
      product_list: [],
    },
    intro: false,
    loaded: false,
  },
  toDetail() {
    // console.log(this.data.user_id, this.data.currentUser.shop_id, this.data.currentUser.product_id);
    var url = `../shop_detail/shop_detail?user_id=${this.data.user_id}&shop_id=${this.data.currentUser.shop_id}&product_id=${this.data.currentUser.product_id}`;
    console.log(url)
    wx.navigateTo({
      url: url,
    })
  },
  checkInfo(e) {
    wx.navigateTo({
      url: setUrl('../../my/net_red_info/net_red_info', {
        user_id: this.data.info.user_id,
      }),
    })
  },
  checkPurchase(){
    wx.switchTab({
      url: '../../purchase/purchase',
    })
  },
  get_One_produce(data, cb) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/Product/one_product`,
      type: "POST",
      data,
      success: res => {
        wx.hideLoading();
        if (res.data.status == 1) {
          var arr = res.data.data.productClothes.specs;
          var arr1 = [];
          for (var i = 0; i < arr.length; i++) {
            arr1.push(this.setObj(arr[i]));
          };
          res.data.data.productClothes.specs = arr1;
          var list = res.data.data.productClothes.product_order;
          console.log('list_order', list)
          var product_outer = [], product_inner = [];
          if (list && list.length > 0) {
            for (var i = 0; i < list.length; i++) {
              var txt = (list[i].name).split('');
              txt[1] = "*"
              if (txt[2]) {
                txt[2] = "*"
              }
              list[i].name = txt.join('');
              list[i].created_at = list[i].created_at.substr(0, 10);
              product_inner.push(list[i]);
              if ((i % 3 == 0) && (i != 0)) {
                product_outer.push(product_inner);
                product_inner = [];
              }
            }
            if (list.length <= 3) {
              product_outer.push(product_inner);
              product_inner = [];
            } else {
              var arr = [];
              arr = product_inner[1];
              for (var i = 1; i < product_inner.length; i++) {
                arr.push(product_inner[i]);
                if (product_inner.length % 3 == 0) {
                  product_outer.push(arr);
                  arr = [];
                }
              }
              product_inner.push(arr);
            }
          } else {
            product_outer.push(product_inner);
          }
          console.log(product_outer);
          this.setData({
            product: res.data.data.productClothes,
            current: res.data.data.productClothes.specs[0],
            product_outer,
          });
          cb && cb();
        } else {
          alert(res.data.msg);
        }
      }
    })
  },
  toPurchase(e) {
    var obj = e.target.dataset;
    this.setData({
      current_product_id: obj.id,
      index: obj.index,
      currentUser: this.data.info.product_list[obj.index],
    });

    this.get_One_produce({
      open_id: app.globalData.open_id,
      product_id: obj.id,
    }, () => {
      // var info = this.data.info;
      // var temp = info.product_list.splice(obj.index,1);
      // console.log(temp, info.product_list);
      // info.product_list.unshift(temp[0]);
      // this.setData({
      //   info,
      // })
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
    var data = {
      product_id: this.data.currentUser.product_id,
      product_classfy_id: this.data.current.product_classfy_id,
      number: this.data.num,
      open_id: app.globalData.open_id,
      shop_id: this.data.currentUser.shop_id,
      user_id: this.data.info.user_id,
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
      product_id: this.data.currentUser.product_id,
      product_classfy_id: this.data.current.product_classfy_id,
      number: this.data.num,
      open_id: app.globalData.open_id,
      shop_id: this.data.currentUser.shop_id,
      rednet_user_id: this.data.info.user_id,
    }
    var current = this.data.current.num ? this.data.current.num:0;
    console.log(Number(data.number), Number(current))
    if (Number(data.number) > Number(current)) {
      alert("下单数量不得大于库存");
      return;
    }
    console.log(data)
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
      current: this.data.product.specs[obj.index],
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
      url: `${app.globalData.baseUrl}/Index/Product/user_product`,
      type: "POST",
      data,
      success: res => {
        wx.hideLoading();
        if (res.data.status == 1) {
          var arr = this.data.info.product_list;
          console.log(arr);
          var info = res.data.data.user_product;
          console.log(info, 'info');
          console.log(res.data.data.user_product.product_list, 'res.data.data.user_product.product_list')
          info.product_list = arr.concat(res.data.data.user_product.product_list);
          this.setData({
            info: info,
            isShow: true,
            currentUser: info.product_list[0]
          })
          this.get_One_produce({
            open_id: app.globalData.open_id,
            product_id: info.product_list[0].product_id,
          })
          if (res.data.data.user_product && res.data.data.user_product.name) {
            wx.setNavigationBarTitle({
              title: res.data.data.user_product.name,
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
      path: setUrl('pages/index/netred/netred', {
        user_id: this.data.user_id,
      })
    }
  }
})