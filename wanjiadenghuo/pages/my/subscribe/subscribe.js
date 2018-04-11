const app = getApp();
import { alert, show, hide, toLogin, setUrl, ajax } from '../../../utils/util.js'
Page({
  data: {
    reason: ["我不想搬了", "价格不合适", "已找其它搬家", "只是了解搬家费用", "其它"],
    order_list: [],
    pageCount: 1,
    pageNum: 1,
    noData: false,
    loaded: false,
  },
  getList(data, cb) {
    data.pageNum = this.data.pageNum;
    ajax('/Index/User/order_list', data, res => {
      if (res.data.pageCount > 0) {
        var order_list = this.data.order_list;
        order_list = order_list.concat(res.data.order_list);
        if (this.data.pageNum * 1 == res.data.pageCount) {
          this.setData({
            loaded: true,
          })
        }
        cb && cb();
        this.setData({
          order_list: order_list,
          pageNum: this.data.pageNum * 1 + 1,
        })

      } else {
        this.setData({
          noData: true,
        })
      }
      console.log(res);
    }, 'GET')
  },
  onLoad: function (options) {
    this.setData(options)
    show();
    if (!app.globalData.open_id) {
      toLogin(app, res => {
        this.getList({
          open_id: app.globalData.open_id
        });
      });
    } else {
      this.getList({
        open_id: app.globalData.open_id
      });
    }
  },
  cancel(e) {
    var obj = e.target.dataset;
    console.log(obj)
    wx.showActionSheet({
      itemList: this.data.reason,
      success: res => {
        console.log(res.tapIndex)
        console.log(this.data.reason[res.tapIndex]);
        if (res.tapIndex>-1){
          var data = {
            open_id: app.globalData.open_id,
            order_id: obj.order_id,
            content: this.data.reason[res.tapIndex],
          }
          ajax('/Index/User/cancel_order', data, res => {
            var order_list = this.data.order_list;
            order_list[obj.index].state = -1;
            this.setData({
              order_list
            })
            alert("取消成功");
          }, 'GET')
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  toDetail(e){
    wx.navigateTo({
      url: setUrl('../order_detail/order_detail', {
        order_id: e.target.dataset.order_id
      }),
    })
  },
  payNow(e) {
    wx.navigateTo({
      url: setUrl('pay/pay', {
        order_id: e.target.dataset.order_id,
        money:e.target.dataset.money
      }),
    })
  },
  onReady: function () {

  },
  onShow: function () {
    if(this.data.order_list.length>0){
      this.setData({
        pageCount: 1,
        pageNum: 1,
        noData: false,
        loaded: false,
        order_list:[],
      })
      this.getList({
        open_id: app.globalData.open_id
      }, res => {
        this.setData({
          order_list: [],
        });
        show('已刷新', res => { }, 'success', 1500)
        wx.stopPullDownRefresh();
      });
    }
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {
    this.setData({
      order_list: [],
      pageCount: 1,
      pageNum: 1,
      noData: false,
      loaded: false,
    })
    show('加载中');
    this.getList({
      open_id: app.globalData.open_id
    }, res => {
      this.setData({
        order_list: [],
      });
      show('已刷新', res => { }, 'success', 1500)
      wx.stopPullDownRefresh();
    });

  },
  toCommet(e) {
    var obj = e.target.dataset;
    console.log(obj)
    wx.navigateTo({
      url: setUrl('../order_detail/maluation/maluation', { order_id: obj.order_id }),
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.loaded) {
      show('加载中')
      this.getList({
        open_id: app.globalData.open_id
      });
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})