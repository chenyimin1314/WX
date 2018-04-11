import { toLogin, alert, setUrl } from '../../../utils/util.js'
const app = getApp();
Page({
  data: {
    isShow: false,
    show_date:false,
    winWidth: 0,
    winHeight: 0,
    start_time:"",
    end_time: "",
    // tab切换 
    currentTab: 0,
    isFirst: true,
    user_rsement_list_arr: [],
    page_arr: [],
  },

  onLoad: function (options) {
    // app.globalData.open_id = 'o29fr0Nrkt8wArN3ZaK4wcLJZdCA';
    wx.showLoading({
      title: '加载中',
      duration:5000,
      mask:true,
    })
    if (app.globalData.open_id){
      this.getList({
        open_id: app.globalData.open_id,
        page_num: 1,
        index: 0,
      });
    }else{
      toLogin(app,()=>{
        this.getList({
          open_id: app.globalData.open_id,
          page_num: 1,
          index: 0,
        });
      })
    }
    
  },
  onShow: function () {

  },
  // 获取代言列表
  getList(data, cb) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/user_rsement`,
      method: "GET",
      data,
      success: res => {
        wx.hideLoading();
        if (res.data.status == 1) {
          if (this.data.isFirst) {
            res.data.data.tag_list[0].page_num = 1;
            this.setData({
              page_arr: res.data.data.tag_list,
              isFirst:false,
            })
          }
          var page_arr = this.data.page_arr;
          if (res.data.data.user_rsement_list){
            page_arr[data.index].list = page_arr[data.index].list ? page_arr[data.index].list.concat(res.data.data.user_rsement_list) : res.data.data.user_rsement_list;
          }else{
            page_arr[data.index].list = [];
          }
          if (!res.data.data.user_rsement_list || res.data.data.user_rsement_list.length < 20 ){
            page_arr[data.index].loaded = true;
          }
          // 对数组进行页数的增加
          page_arr[data.index].page_num = page_arr[data.index].page_num ? (Number(page_arr[data.index].page_num) + 1):2;
          this.setData({
            page_arr,
            isShow:true,
          })
          console.log(this.data.page_arr)
        } else {
          alert("获取列表失败")
        }
      }
    })
  },
  
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
    var index = e.detail.current;
    var page_arr = this.data.page_arr;
    console.log(page_arr);
    if (!page_arr[index].page_num) {
      wx.showLoading({
        title: '加载中',
        mask:true,
        duration:5000,
      })
      this.getList({
        open_id: app.globalData.open_id,
        page_num: 1,
        index: index,
        tag_id: page_arr[index].tag_id,
      });
    }
  },
  // 滚动到底部
  toLower(e){
    var o = e.target.dataset;
    var page_arr = this.data.page_arr;
    console.log(o);
    if (page_arr[o.index].loaded){
      return;
    }else{
      this.getList({
        open_id: app.globalData.open_id,
        page_num: page_arr[o.index].page_num,
        index: index,
        tag_id: page_arr[o.index].tag_id,
      });
    }

  },

  // 选择日期
  bindDateChange: function (e) {
    var obj = e.target.dataset;
    var obj_temp = {};
    obj_temp[obj.index] = e.detail.value;
    this.setData(obj_temp)
  },
  //跳转到商品详情
  toDetail(e){
    var obj = e.target.dataset;
    var page_obj = this.data.page_arr[obj.index].list[obj.key];
    var data = {
      shop_id:page_obj.shop_id,
      product_id: page_obj.product_id,
    }
    wx.navigateTo({
      url: setUrl('../../index/shop_detail/shop_detail',data),
    })
  },
  // 确定代言
  confirm(e){
    let start_time = this.data.start_time;
    let end_time = this.data.end_time;
    var s = new Date(start_time).getTime();
    var e = new Date(end_time).getTime();
    console.log(start_time, end_time)
    if (start_time == ""){
      alert("请选择代言开始时间");
      return;
    } else if (end_time == ""){
      alert("请选择代言结束时间");
      return
    } else if ((e - s) < 86400000 ) {
       alert("结束时间不得小于开始时间");
       return
    }
    wx.showLoading({
      title: '申请中',
      duation:5000,
      mask:true,
    });
    var data = {
      shop_id: this.data.current.shop_id,
      product_id:this.data.current.product_id,
      open_id:app.globalData.open_id,
      start_time,
      end_time,
    }
    console.log(data);
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/rsement`,
      method:"GET",
      data,
      success:res=>{
        wx.hideLoading();
        if(res.data.status == 1){
          var o = this.data.currentIndex;
          var page_arr = this.data.page_arr;
          page_arr[o.index].list[o.key].state = 0;
          this.setData({
            page_arr,
          })
          wx.hideLoading();
          this.setData({
            show_date:false
          })
          alert("申请成功");
        }else{
          alert("申请失败");
        }
        
      }
    })
  },
  // 取消代言
  cancal_daiyan(e){
    console.log(e);
    var obj = e.target.dataset;
    var current = this.data.page_arr[obj.index].list[obj.key];
    var page_arr = this.data.page_arr;
    wx.showModal({
      title: '提示',
      content: '是否取消代言',
      cancelColor:"#ff3b2f",
      confirmColor:"#ff3b2f",
      success:res=>{
        if(res.confirm){
          var  data = {
            open_id:app.globalData.open_id,
            product_id: current.product_id,
          }
          wx.request({
            url: `${app.globalData.baseUrl}/Index/User/confirm_apply_rsement`,
            method:"GET",
            data,
            success:res=>{
              if(res.data.status == 1){
                page_arr[obj.index].list[obj.key].state = null;
                this.setData({
                  page_arr
                })
                alert("取消代言成功");
              }else{
                alert("取消代言失败");
              }
            }
          })
        }
      }
    })
  },
  showDate(e){
    let obj = e.target.dataset;
    console.log(obj);
    this.setData({
      start_time:"",
      end_time:"",
      show_date:true,
      currentIndex:obj,
      current:this.data.page_arr[obj.index].list[obj.key],
    });
    console.log(this.data.current);
  },
  close(e){
    if(e.target.dataset.index == 1){
      this.setData({
        show_date:false,
      })
    }
  },
  
  
  // 点击tab切换
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
})