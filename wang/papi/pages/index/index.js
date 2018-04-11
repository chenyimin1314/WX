//index.js
//获取应用实例
import { toLogin, alert } from '../../utils/util.js'
const app = getApp()
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    isShow: false,
    banner: [],
    tag_list: [],
    indexData: [],
    page_num: 0,
    show_video:false,
  },
  // 上拉加载
  toLower(e) {
    var index = e.target.dataset.index;
    var tag_list = this.data.tag_list;
    if (this.timer || tag_list[index].success) {
      return;
    }
    this.timer = setTimeout(() => {
      var page_num = Number(tag_list[index].page_num) + 1;
      wx.showLoading({
        title: '加载中',
        mask: true,
        duration: 5000,
      })
      this.getIndexInfo({
        open_id: app.globalData.open_id,
        tag_id: tag_list[index].tag_id,
        page_num,
      })
    }, 400)

  },
  closeVideo(e){
    console.log(e)
    if(e.target.dataset.index == 1){
      this.setData({
        show_video: false,
      })
    }
  },
  
  showVideo(e){
    const obj = e.target.dataset;
    console.log(obj);
    this.setData({
      videoUrl:obj.link,
      show_video:true,
    })
  },

  //获取首页信息
  getIndexInfo(data, index,cb) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/index`,
      type: "POST",
      data,
      success: res => {
        wx.hideLoading();
        if (res.data.status == 1) {
          cb&&cb();
          var arr = this.data.indexData;
          var arr1 = arr[index] ? arr[index] : [];
          if (res.data.data.index_user){
            arr1 = arr1.concat(res.data.data.index_user);
          }
          arr[index] = arr1;
          this.setData({
            banner: res.data.data.banner,
            indexData: arr
          })
          if (this.data.page_num == 0) {
            var tag_list = res.data.data.tag_list;
            tag_list[0].page_num = 1;
            this.setData({
              tag_list: tag_list,
              page_num: 1
            })
          }
          var tag_list = this.data.tag_list;
          // 做数据加载完毕判断
          if (!res.data.data.index_user || res.data.data.index_user.length < 10) {
            tag_list[index].success = true;
            this.setData({
              tag_list: tag_list,
              isShow: true,
            })
          }
        } else {
          alert(res.data.msg)
        }
      }
    })
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中',
      mask: true,
      duration: 5000
    })
    if (app.globalData.open_id) {
      this.getIndexInfo({
        page_num: 1,
        open_id: app.globalData.open_id
      }, 0)
    } else {
      toLogin(app, res => {
        this.getIndexInfo({
          page_num: 1,
          open_id: app.globalData.open_id,
        }, 0)
      });
      
    }

  },
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  /**第一次获取数据 */
  firstData(index) {
    var tag_list = this.data.tag_list;
    if (typeof (tag_list[index].page_num) == 'undefined') {
      tag_list[index].page_num = 1;
      this.setData({
        tag_list: tag_list
      });
      wx.showLoading({
        title: '加载中',
        mask: true,
        duration: 5000
      })
      this.getIndexInfo({
        tag_id: this.data.tag_list[index].tag_id,
        open_id: app.globalData.open_id,
        page_num: 1,
      }, index)
    } else {
      console.log('false');
    }
  },
  /** 
   * 滑动切换tab 
   */
  bindChange: function (e) {
    var that = this;
    var index = e.detail.current;
    that.setData({ currentTab: index });
    var arr = this.data.tag_list;
    this.firstData(index);
  },

  /** 
   * 点击tab切换 
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
  onPullDownRefresh() {
    
    wx.showLoading({
      title: '加载中',
      mask: true,
      duration: 5000
    })
    if (app.globalData.open_id) {
      this.getIndexInfo({
        page_num: 1,
        open_id: app.globalData.open_id
      }, 0,()=>{
        this.setData({
          tag_list: [],
          indexData: [],
          page_num: 0,
          currentTab:0,
        });
        wx.stopPullDownRefresh();
      })
    }
  }, onShareAppMessage: function () {
    return {
      title: '首页',
      path: getCurrentPages().route
    }
  }
})
