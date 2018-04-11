// pages/my/myprofit/myprofit.js
const app = getApp();
import { ajax, alert, show, hide, toLogin } from '../../../utils/util.js'
Page({
  data: {
    inputShowed: false,
    keyword: "",
    startDate: "",
    showFilter: false,
    isShow: false,
    winWidth: 0,
    winHeight: 0,
    placeholoder:"搜索微信昵称",
    // tab切换 
    operate: {
      "sum_cooperation_num": "0",//总合作次数
      "cooperation_num": "0",//有效合作次数
      "recommender_num": "0"// 分享次数
    },
    urls: ['/Index/User/recommender_list', '/Index/User/sum_cooperation', '/Index/User/sum_cooperation'],
    page_num: 1,
    pageCount: 1,
    currentTab: 0,
    loaded: false,
    noDate: false,
    list: [[], [], []],
  },
  onLoad: function (options) {
    this.getOrder();
    this.getList();
  },
  getOrder() {
    ajax('/Index/User/ally_info', { open_id: app.globalData.open_id }, res => {
      console.log(res.data)
      this.setData({
        operate: res.data
      })
    }, "GET")
  },
  getList(cb) {
    var data = {
      open_id: app.globalData.open_id,
      page_num: this.data.page_num,
    }
    if (this.data.keyword) {
      data.name = this.data.keyword;
    }
    if (this.data.startDate) {
      data.start_time = this.data.startDate;
    }
    if (this.data.endDate) {
      data.end_time = this.data.endDate + " 23:59:59";
    }
    let url = this.data.urls[this.data.currentTab];
    if (this.data.currentTab == 1) {
      data.type = 1;
    } else if (this.data.currentTab == 2) {
      data.type = 2;
    }
    ajax(url, data, res => {
      cb&&cb(res);
      if (res.status == 1) {
        if (this.data.page_num >= res.data.pageCount) {
          this.setData({
            loaded: true,
          })
        }
        if (res.data.pageCount > 0) {
          var list = this.data.list;
          console.log(res.data, '数据')
          if (this.data.currentTab == 0) {
            list[0] = list[0].concat(res.data.recommender_list)
          } else if (this.data.currentTab == 1) {
            list[1] = list[1].concat(res.data.cooperation_list)
          } else {
            list[2] = list[2].concat(res.data.cooperation_list)
          }
          this.setData({
            list
          });
        } else {
          this.setData({
            noDate: true,
          })
        }
        this.setData({
          page_num: this.data.page_num * 1 + 1,
        })
      }
    }, 'GET')
  },
  loadlist() {
    if (!this.data.loaded) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
        return;
      }
      show('加载中');
      this.timer = setTimeout(() => {
        this.getList();
      }, 200)
    }
  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
    var txt = e.detail.current == 1 ?"搜索微信昵称":"搜索微信昵称";
    
    this.setData({
      page_num: 1,
      pageCount: 1,
      list: [[], [], []],
      loaded: false,
      noData: false,
      placeholoder: txt     
    })
    this.getList();
  },
  // 点击tab切换 
  swichNav: function (e) {
    console.log(1)
    var that = this;
    console.log(this.data.currentTab, e.target.dataset.current)
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },

  onReady: function () {

  },
  bindDateChange: function (e) {
    console.log(e);
    var key = e.target.dataset.key
    console.log('日期', e.detail.value)
    var obj = {};
    obj[key] = e.detail.value;
    this.setData(obj)
  },
  reset() {
    this.setData({
      startDate: "",
      endDate: ""
    })
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },

  inputTyping: function (e) {
    this.setData({
      keyword: e.detail.value
    });
  },
  hideInput: function () {
    this.setData({
      page_num: 1,
      pageCount: 1,
      list: [[], [], []],
      loaded: false,
      noData: false,
    })
    this.getList(res => {
      this.setData({
        inputShowed: false
      });
    });
   
  },
  showInput() {
    this.setData({
      inputShowed: true
    });
  },
  filter() {
    console.log(this.data.showFilter)
    if (this.data.showFilter) {
      this.setData({
        showFilter: false
      })
    } else {
      this.setData({
        showFilter: true
      })
    }
  },
  hideFilter(e) {
    if (e.target.dataset.index == 1) {
      this.setData({
        showFilter: false
      })
    }
  },
  filterSuccess() {
    if (this.data.startDate > this.data.endDate) {
      alert("开始日期不得大于结束日期");
      return;
    }
    this.setData({
      showFilter: false,
      list: [[],[],[]],
      page_num: 1,
      pageCount: 1,
      loaded: false,
      noData: false,
    })
    show('加载中');
    this.getList();
  },
  searchFn() {

  },
})