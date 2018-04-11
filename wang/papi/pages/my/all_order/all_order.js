import { toLogin, alert, setUrl } from '../../../utils/util.js'
const app = getApp()
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    isShow: false,
    order_list: [[], [], [], [], []],
    page_arr: [{
      page: 0,
      isLoaded: false,
      name: "全部"
    }, {
      page: 0,
      isLoaded: false,  
      name: "待付款"
    }, {
      page: 0,
      isLoaded: false,
      name: "待发货"
    }, {
      page: 0,
      isLoaded: false,
      name: "待收货"
    }, {
      page: 0,
      isLoaded: false,
      name: "已完成"
    }],

  },
  onShow(){
    if(this.data.isShow){
      this.setData({
        isShow: false,
        order_list: [[], [], [], [], []],
        page_arr: [{
          page: 0,
          isLoaded: false,
          name: "全部"
        }, {
          page: 0,
          isLoaded: false,
          name: "待付款"
        }, {
          page: 0,
          isLoaded: false,
          name: "待发货"
        }, {
          page: 0,
          isLoaded: false,
          name: "待收货"
        }, {
          page: 0,
          isLoaded: false,
          name: "已完成"
        }],
      })
      wx.showLoading({
        title: '加载中',
        duration: 5000,
      })
      this.getOrder_list({
        "open_id": app.globalData.open_id,
        "type": this.data.type,
        "page_num": this.setPage(this.data.type)
      })
    }
  },
  toIndex(){
    wx.switchTab({
      url: '../../index/index',
    })
  },
  toLower(e) {
    var obj = e.target.dataset;
    if (this.timer) {
      clearTimeout(this.timer);
      return;
    }
    if (this.data.page_arr[obj.index].loaded) {
      return;
    }
    console.log(obj);
    this.timer = setTimeout(() => {
      wx.showLoading({
        title: '加载中',
        duration: 5000,
      })
      this.getOrder_list({
        "open_id": app.globalData.open_id,
        "type": this.data.type,
        "page_num": this.setPage(obj.index)
      })
    }, 400)
  },
  getOrder_list(data, cb) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/order_list`,
      data,
      type: "POST",
      success: res => {
        wx.hideLoading();
        if (res.data.status == 1) {
          console.log(res.data.data);
          if (res.data.data.parentOrder && res.data.data.parentOrder.length > 0) {
            var order_list = this.data.order_list;
            order_list[data.type] = order_list[data.type].concat(res.data.data.parentOrder);
            this.setData({
              order_list: order_list,
              isShow: true,
            });
          }
          if (!res.data.data.parentOrder || res.data.data.parentOrder.length < 20) {
            var page_arr = this.data.page_arr;
            page_arr[data.type].loaded = true;
            this.setData({
              page_arr: page_arr,
              isShow: true,
            });
            console.log(this.data.page_arr)
          }
          console.log(this.data.order_list);
          cb && cb(res.data);
          console.log(res.data)
        }

      }
    })
  },
  bindChange: function (e) {
    var that = this;
    var index = e.detail.current;
    that.setData({ currentTab: index });
    console.log(index, this.data.page_arr[index]);
    this.setData({
      type: index
    })
    if (this.data.page_arr[index].page == 0) {
      wx.showLoading({
        title: '加载中',
        duration: 5000,
      })
      this.getOrder_list({
        "open_id": app.globalData.open_id,
        "type": this.data.type,
        "page_num": this.setPage(index)
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      var index = e.target.dataset.current;
      var arr = this.data.tag_list;
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  onLoad: function (options) {
    // var options = {
    //   type: "0"
    // }
    console.log(options);
    wx.showLoading({
      title: '加载中',
      duration: 5000,
      mask: true
    })
    if (this.data.currentTab != options.type) {
      var index = options.type;
      this.setData({
        currentTab: options.type
      })
    }
    this.setData(options);
    if (app.globalData.open_id) {
      this.getOrder_list({
        "open_id": app.globalData.open_id,
        "type": this.data.type,
        "page_num": this.setPage(this.data.type)
      })
    } else {
      toLogin(app, () => {
        this.getOrder_list({
          "open_id": app.globalData.open_id,
          "type": this.data.type,
          "page_num": this.setPage(this.data.type)
        })
      })
    }
  },
  setPage(i) {
    var a = this.data.page_arr;
    console.log(a[i], i)
    a[i].page = Number(a[i].page) + 1;
    this.setData({
      page_arr: a
    });
    return a[i].page;
  },
  toDetail(e) {
    var obj = e.target.dataset;
    console.log(obj);
    var order = this.data.order_list[obj.index][obj.idx];
    var product = order.product[obj.pidx];
    console.log(order, product);
    var data = {
      shop_id: order.shop_id,
      product_id: product.product_id
    }
    if (product.user_id) {
      data.user_id = product.user_id;
    }
    console.log(data);
    var url = setUrl('../../index/shop_detail/shop_detail', data);
    wx.navigateTo({
      url: url,
    })
  },
  // 订单详情
  order_detail(e){
    var obj = e.target.dataset;
    var shop_p_id = this.data.order_list[obj.index][obj.idx].shop_p_id;
    var state = this.data.order_list[obj.index][obj.idx].state;
    var netred_name = this.data.order_list[obj.index][obj.idx].state;
    var data = {
      shop_p_id,
      netred_name,
      state
    }
    wx.navigateTo({
      url: setUrl('order_detail/order_detail',data),
    })
  },
  // 删除订单
  delete(e){
    wx.showModal({
      content: "是否删除当前订单",
      cancelColor: "#ff3b2f",
      confirmColor: "#ff3b2f",
      success: res => {
        var obj = e.target.dataset;
        var shop_p_id = this.data.order_list[obj.index][obj.idx].shop_p_id;
        if (res.confirm) {
          var data = {
            open_id: app.globalData.open_id,
            shop_p_id,
          }
          wx.request({
            url: `${app.globalData.baseUrl}/Index/User/cancel`,
            type: "POST",
            data: data,
            success: res => {
              wx.hideLoading();
              if (res.data.status == 1) {
                var order_list = this.data.order_list;
                order_list[obj.index].splice(obj.idx,1)
                this.setData({
                  order_list
                })
              } else {
                alert("删除订单失败");
              }
            }
          })
        }
      }
    })

  },
  // 确认收货
  confirm(e) {
    wx.showModal({
      content: "是否确认收货",
      cancelColor: "#ff3b2f",
      confirmColor: "#ff3b2f",
      success: res => {
        var obj = e.target.dataset;
        var shop_p_id = this.data.order_list[obj.index][obj.idx].shop_p_id;
        if (res.confirm) {
          var data = {
            open_id: app.globalData.open_id,
            shop_p_id,
          }
          wx.request({
            url: `${app.globalData.baseUrl}/Index/User/confirm`,
            type: "POST",
            data:data,
            success: res => {
              wx.hideLoading();
              if (res.data.status == 1) {
                var order_list = this.data.order_list;
                order_list[obj.index][obj.idx].state = 3;
                var tempArr = order_list[obj.index].splice(obj.idx,1);
                console.log(tempArr)
                order_list[Number(obj.index) + 1].shift(tempArr[0]);
                this.setData({
                  order_list
                })
              }else{
                alert("确认收货失败");
              }
            }
          })
        }
      }
    })

  },
  // 立即支付
  pay(e) {
    var obj = e.target.dataset;
    var shop_p_id = this.data.order_list[obj.index][obj.idx].shop_p_id;
    wx.showLoading({
      title: '加载中',
      duration: 5000,
      mask: true,
    })
    wx.request({
      url: `${app.globalData.baseUrl}/Index/Order/confimOrderList`,
      type: "POST",
      data: {
        open_id: app.globalData.open_id,
        shop_p_id: shop_p_id
      },
      success: res => {
        wx.hideLoading();
        if (res.data.status == 1) {
          var data1 = {
            p_id: res.data.data.p_id,
            money: res.data.data.price,
            appid: 'wxc69a602a0f01f540',
            openid: app.globalData.open_id,
          }
          console.log('支付参数', data1);
          wx.request({
            url: `https://www.hukesoft.com/RedNet/wechatAPPsign.php`,
            type: 'POST',
            data: data1,
            success: res => {
              if (res.data.status == 1) {
                console.log(res.data.data)
                wx.requestPayment({
                  'timeStamp': res.data.data.timeStamp + "",
                  'nonceStr': res.data.data.nonceStr,
                  'package': res.data.data.package,
                  'signType': 'MD5',
                  'paySign': res.data.data.sign,
                  'success': res => {
                    var order_list = this.data.order_list;
                    order_list[obj.index][obj.idx].state = 1;
                    this.setData({
                      order_list
                    })
                    wx.showToast({
                      title: '成功',
                      icon: 'success',
                      duration: 500,
                      success: function () {
                        wx.navigateBack({
                          delta: 2,
                        })
                      }
                    })
                    console.log(res);
                  },
                  'fail': res => {
                    console.log(res);
                    alert("支付失败");
                  },
                  'complete': res => {
                    if (res.errMsg == "requestPayment:cancel") {
                      alert("已取消支付");
                      setTimeout(function () {
                        wx.navigateBack({
                          delta: 1,
                        })
                      }, 400)
                    }
                    wx.hideLoading();
                  }
                })
              } else if (res.data.status == 0) {
                alert("库存不足");
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1,
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1,
                    })
                  }, 400);
                }, 400)
              } else {
                alert("参数错误");
                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1,
                  })
                }, 400)
              }
            }
          })
        } else {
          alert("请求错误")
        }
      }
    })
  }
})