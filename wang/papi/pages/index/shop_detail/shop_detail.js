import { toLogin, alert, addshopping, setUrl } from '../../../utils/util.js'
const app = getApp();
Page({
  data: {
    num: 1,
    isPopver1: false,
    isShow: false,
    noShop:false,
    imgList: [
      'http://211.149.149.112/TravelLive2/TravelLive/img/shop/product_img/305-picture0-afhjkmryzGHNRST0.jpg',
      'http://211.149.149.112/TravelLive2/TravelLive/img/shop/product_img/305-picture0-afhjkmryzGHNRST0.jpg',
      'http://211.149.149.112/TravelLive2/TravelLive/img/shop/product_img/305-picture0-afhjkmryzGHNRST0.jpg',
      'http://211.149.149.112/TravelLive2/TravelLive/img/shop/product_img/305-picture0-afhjkmryzGHNRST0.jpg',
      'http://211.149.149.112/TravelLive2/TravelLive/img/shop/product_img/305-picture0-afhjkmryzGHNRST0.jpg',
      'http://211.149.149.112/TravelLive2/TravelLive/img/shop/product_img/305-picture0-afhjkmryzGHNRST0.jpg',
      'http://211.149.149.112/TravelLive2/TravelLive/img/shop/product_img/305-picture0-afhjkmryzGHNRST0.jpg',
      'http://211.149.149.112/TravelLive2/TravelLive/img/shop/product_img/305-picture0-afhjkmryzGHNRST0.jpg',
      'http://211.149.149.112/TravelLive2/TravelLive/img/shop/product_img/305-picture0-afhjkmryzGHNRST0.jpg',
    ],
    isPopver: false,
  },
  // 显示客服
  callWaiter() {
    this.setData({
      isPopver1: true,
    })
  },
  contact_phone() {
    wx.showModal({
      title: '提示',
      content: '是否拨打客服电话400-8393-882',
      cancelColor: "#777",
      confirmColor: '#ff3b2f',
      success: res => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '400-8393-882',
          })
        }
      }
    })
  },
  close_concat() {
    this.setData({
      isPopver1: false,
    })
  },
  onLoad: function (options) {
    // this.setData(options);
    console.log(options);
    if(options.a){
      options.shop_id = a;
      options.product_id = b;
      options.user_id = c;
    }
    // options = { user_id: "1131", shop_id: "100001", product_id: "305" };
    var data = options;
    console.log(data);
    this.setData(options);
    wx.showLoading({
      title: '加载中',
      duration: 5000,
      mask: true,
    })
    if (app.globalData.open_id) {
      var data = {
        open_id: app.globalData.open_id,
        product_id: this.data.product_id,
      }
      if(options.user_id){
        data.user_id = options.user_id;
      }
      this.get_One_produce(data)
    } else {
      toLogin(app, res => {
        var data = {
          open_id: app.globalData.open_id,
          product_id: this.data.product_id,
        }
        if (options.user_id) {
          data.user_id = options.user_id;
        }
        this.get_One_produce(data)
      })
    }
  },
  // 获取商品详情
  get_One_produce(data, cb) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/Product/one_product`,
      type: "POST",
      data,
      success: res => {
        wx.hideLoading();
        if (res.data.status == 1) {
          if (!res.data.data.productClothes){
            this.setData({
              noShop:true
            })
          }else{
            var arr = res.data.data.productClothes.specs;
            var arr1 = [];
            for (var i = 0; i < arr.length; i++) {
              arr1.push(this.setObj(arr[i]));
            }
            var list = res.data.data.productClothes.graphic_details
            console.log(list)
            list = list.split(',');
            res.data.data.productClothes.specs = arr1;
            this.setData({
              product: res.data.data.productClothes,
              current: res.data.data.productClothes.specs[0],
              imgList: list,
              isShow: true,
              noShop:false,
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
  // 关闭弹窗
  close(e) {
    if (e.target.dataset.index == 1) {
      this.setData({
        isPopver: false,
        num: 1,
      })
    }
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
      product_id: this.data.product_id,
      product_classfy_id: this.data.current.product_classfy_id,
      number: this.data.num,
      open_id: app.globalData.open_id,
      shop_id:this.data.shop_id
    }
    if (this.data.user_id) {
      data.user_id = this.data.user_id;
    }
    var current = this.data.current.num ? this.data.current.num:0;
    if (Number(data.number) > Number(current)) {
      return alert("购买数量不得大于库存");
    }
    console.log(data,'data');
    app.globalData.tempOrder = data;
    var url = `../confirm_order/confirm_order`
    wx.navigateTo({
      url: url,
    })
  },
  // 
  choose(e) {
    var obj = e.target.dataset;
    this.setData({
      current: this.data.product.specs[obj.index]
    })
  },
  // 加入购物车
  addshopping(e) {
    var data = {
      product_id: this.data.product_id,
      product_classfy_id: this.data.current.product_classfy_id,
      number: this.data.num,
      open_id: app.globalData.open_id,
      shop_id: this.data.shop_id,
    }
    if (this.data.user_id) {
      data.user_id = this.data.user_id
    }
    var current = this.data.current.num ? this.data.current.num:0;
    if (Number(data.number) > Number(current)){
      return alert("购买数量不得大于库存");
    }
    console.log(data);
    addshopping(data, (res) => {
      alert(res.msg);
      this.setData({
        isPopver: false,
      })
    })
  },
  toPurchase(e) {
    this.setData({
      isPopver: true,
    })
  },
  checkPurchase(){
    wx.switchTab({
      url: '../../purchase/purchase',
    })
  },
  // 图片预览
  preview(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.imgList // 需要预览的图片http链接列表
    })
  },
  onShow: function () {
    if (this.data.isPopver) {
      this.setData({ isPopver: false })
    }
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
  onShareAppMessage: function () {
    // 分享商品详情
    var data = {
      shop_id: this.data.shop_id,
      product_id: this.data.product_id,
    };
    if (this.data.user_id){
      data.user_id = this.data.user_id;
    }
    // alert(setUrl('pages/index/shop_detail/shop_detail',data))
    return {
      title: '商品详情',
      path: setUrl('pages/index/shop_detail/shop_detail', data)
    }
  }
})