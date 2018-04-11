// pages/my/myprofit/myprofit.js
const app = getApp();
import { alert, show, hide, toLogin,ajax } from '../../../../utils/util.js'
Page({
  data: {
    inputShowed: false,
    keyword: "",
    startDate: "",
    endDate:"",
    showFilter: false,
    list:[],
    page_num:1,
    pageCount:1,
    loaded:false,
    noData:false,
  },
  onLoad: function (options) {
    show('加载中');
    this.getlist();
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
  loadedlist(){    
    if(!this.data.loaded){      
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
        return
      }
      show('加载中');
      this.timer = setTimeout(() => {
        this.getlist();
      }, 200)
    }
  },
  getlist(cb){    
    var data = {
      open_id:app.globalData.open_id,
      page_num:this.data.page_num,
    }
    if (this.data.startDate) data.start_time = this.data.startDate;
    if (this.data.endDate) data.end_time = this.data.endDate + ' 23:59:59';
    if (this.data.keyword) data.keyword = this.data.keyword;
    ajax('/Index/User/user_profit_audit',data,res=>{
      cb&&cb(res);
      this.timer = null;
      if (res.data.pageCount > 0){
        var list = this.data.list;
        console.log(res)
        if (this.data.page_num >= res.data.pageCount*1){
          this.setData({
            loaded:true
          })
        }
        console.log(res.data)
        list = list.concat(res.data.profit_audit);
        console.log(list, res.data.profit_audit);
        this.setData({
          list,
          page_num:this.data.page_num*1 + 1
        });
      }else{
        this.setData({
          list:[],
          pageCount:res.pageCount
        })
      }
    },"GET")
  },
  inputTyping: function (e) {
    this.setData({
      keyword: e.detail.value
    });
  },
  hideInput: function () {
    console.log(this.data.startDate, this.data.endDate, this.data.startDate > this.data.endDate);
    if (this.data.startDate > this.data.endDate) {
      alert("开始日期不得大于结束日期");
      return;
    }
    this.setData({
      showFilter: false,
      list: [],
      page_num: 1,
      pageCount: 1,
      loaded: false,
      noData: false,
    })
    show('加载中');
    this.getlist();
    this.setData({
      inputShowed: false
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
    console.log(this.data.startDate, this.data.endDate, this.data.startDate > this.data.endDate);
    if (this.data.startDate > this.data.endDate) {
      alert("开始日期不得大于结束日期");
      return;
    }
    this.setData({
      showFilter: false,
      list: [],
      page_num: 1,
      pageCount: 1,
      loaded: false,
      noData: false,
    })
    show('加载中');
    this.getlist();
  },
  searchFn() {
    
  },
  onShow: function () {

  },
  
})