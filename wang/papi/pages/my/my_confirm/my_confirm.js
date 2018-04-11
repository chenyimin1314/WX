// pages/my/my_fans/my_fans.js
import { toLogin, setAddress, alert } from '../../../utils/util.js'
const app = getApp();
Page({
  data: {
    page_num:0,
    fans_list:[]
  },
  // 滚动到顶部
  toTop(){},
  // 滚动到底部
  toBottom(){
    if(this.timer){
      clearTimeout(this.timer)
      return;
    }
    this.timer = setTimeout(()=>{
      wx.showLoading({
        title: '加载中',
      });
      this.setData({
        page_num: Number(this.data.page_num) + 1
      })
      this.fansList({
        user_id: app.globalData.user_id,
        page_num: this.data.page_num
      });
    },400)
  },
  addConfirm(e){
    var obj = e.target.dataset;
    var txt = obj.is_fans==1?"是否取消关注?":"是否添加关注?";
    wx.showModal({
      content: txt,
      cancelColor: "#006bff",
      confirmColor: "#006bff",
      success: res => {
        if (res.confirm) {
          var data = {
            open_id: app.globalData.open_id,
            user_id: obj.user_id,
          }
          var url = "";
          if (obj.is_fans == 1) {
            url = `${app.globalData.baseUrl}/Index/User/cancelFollow`;
          } else {
            url = `${app.globalData.baseUrl}/Index/User/follow`;
          }
          // 请求数据
          this.reqConfirm(data, url, obj.is_fans, obj.index);
        }
      }
    })
  },
  reqConfirm(data, url, is_fans,index){
    wx.request({
      url: url,
      type:"POST",
      data,
      success:res=>{
       if(res.data.status == 1){
         var arr = this.data.fans_list;
         arr.splice(index,1);
         this.setData({ fans_list: arr });
         alert(res.data.msg);
       } else {
         alert(res.data.msg);
       }
      }
    })
  },
  fansList(data){
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/followList`,
      type: "POST",
      data,
      success: res => {
        wx.hideLoading();
        console.log(res, res.data.status,'res.data.status');
        if (res.data.status == 1) {
          console.log(res.data.data)
          var list;
          if (res.data.data.follow_list){
            list =  this.data.fans_list.concat(res.data.data.follow_list)
          }else{
            list = this.data.fans_list;
          }
          this.setData({
            fans_list: list
          });
        } else {
          alert(res.data.msg);
        }
      }
    })
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      duration: 3000,
      mask: true
    })
    this.setData({
      page_num:Number(this.data.page_num)+1
    })
    if (app.globalData.user_id) {
      this.fansList({
        user_id: app.globalData.user_id,
        page_num:this.data.page_num
      });
    } else {
      toLogin(app, res => {
        this.fansList({
          user_id: app.globalData.user_id,
          page_num: this.data.page_num
        });
      })
    }
  },
  
  onShow: function () {
    
  },
})