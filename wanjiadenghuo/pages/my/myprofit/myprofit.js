const app = getApp();
import { alert, ajax, show, hide, toLogin } from '../../../utils/util.js'
Page({
  data: {
    inputShowed: false,
    keyword: "",
    startDate: "",
    endDate: "",
    showFilter: false,
    pageNo: 1,
    pageCount: 1,
    list: [],
    loaded: false,
    noData: false,
    info: null,
  },
  getProfit() {
    var data = { open_id: app.globalData.open_id };
    data.page_num = this.data.pageNo;
    if (this.data.keyword) {
      data.content = this.data.keyword;
    }
    if (this.data.startDate) {
      data.start_time = this.data.startDate;
    }
    if (this.data.endDate) {
      data.endDate = this.data.endDate + ' 23:59:59';
    }
    console.log(data);
    ajax('/Index/User/user_profit', data, res => {
      this.timer = null;
      console.log(res.data.pageCount, "页码")
      this.setData({
        pageCount: res.data.pageCount
      })
      if (res.data.pageCount > 0) {
        var list = this.data.list;
        if (res.data.profit_info && res.data.profit_info.length > 0) {
          list = list.concat(res.data.profit_info);
        }
        if (this.data.pageNo >= res.data.pageCount) {
          this.setData({
            loaded: true,
          })
        }
        this.setData({
          info: res.data,
          list,
          pageNo: this.data.pageNo * 1 + 1,
        })
      } else {
        this.setData({
          info: res.data,
          noData: true,
        })
      }
      console.log(res);
    }, 'GET')
  },
  onShow() {
    if (this.data.info) {
      this.setData({
        inputShowed: false,
        keyword: "",
        startDate: "",
        endDate: "",
        showFilter: false,
        pageNo: 1,
        pageCount: 1,
        list: [],
        loaded: false,
        noData: false,
        info: null,
      })
      this.getProfit();
    }
  },
  loadedTop() {
    console.log(this.data.loaded)
    
    if (!this.data.loaded) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
        return;
      }
      show('加载中')
      this.timer = setTimeout(res => {
        this.getProfit()
      }, 200)
    }
  },
  onLoad: function (options) {
    if (app.globalData.open_id) {
      this.getProfit();
    } else {
      toLogin(app, res => {
        this.getProfit();
      })
    }
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
      showFilter: false,
      list: [],
      pageNo: 1,
      pageCount: 1,
      loaded: false,
      noData: false,
    })
    show('加载中');
    this.getProfit();
  },
  showInput() {
    this.setData({
      inputShowed: true
    });
  },
  filter() {
    console.log(11)
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
      list: [],
      pageNo: 1,
      pageCount: 1,
      loaded: false,
      noData: false,
    })
    show('加载中');
    this.getProfit();
    this.setData({
      showFilter: false
    })
  },
  searchFn() {

  },

})