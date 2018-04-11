// pages/my/user_address/user_address.jsco
import { toLogin, setAddress,alert} from '../../../utils/util.js'
const app = getApp();
Page({
  data: {
    addressList:[],
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      duration:3000,
      mask:true
    })
    if (app.globalData.open_id) {
      this.getAddress(app.globalData.open_id);
    } else {
      toLogin(app, res => {
        this.getAddress(app.globalData.open_id);
      })
    }
  },
  // 设置默认
  setDefault(e){
    var obj = e.target.dataset;
    wx.showModal({
      content: '是否设置为默认地址',
      cancelColor: "#006bff",
      confirmColor: "#006bff",
      success: res => {
        if (res.confirm) {
          var data = {
            address_id: obj.address_id
          }
          if (app.globalData.open_id) {
            data.open_id = app.globalData.open_id;
            this.reqSetDefault(data, obj.index);
          } else {
            toLogin(app, function () {
              data.open_id = app.globalData.open_id;
              this.reqSetDefault(data, obj.index);
            })
          }
        }
      }
    })
  },
  // 删除收货地址
  deleteAddress(e){
    wx.showModal({
      content: '是否删除当前收货地址',
      cancelColor:"#006bff",
      confirmColor:"#006bff",
      success:res=>{
        if(res.confirm){
          var obj = e.target.dataset;
          var data = {
            address_id:obj.address_id
          }
          if(app.globalData.open_id){
            data.open_id = app.globalData.open_id;
            this.reqDel(data,obj.index);
          }else{
            toLogin(app,function(){
              data.open_id = app.globalData.open_id;
              this.reqDel(data,obj.index);
            })
          }
        }
      }
    })
  },
  // 请求数据
  reqSetDefault(data, index) {
    console.log(index)
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/default_user_address`,
      type: "POST",
      data,
      success: res => {
        if (res.data.status == 1) {
          var arr = this.data.addressList;
          for(var i=0;i<arr.length;i++){
            if(index == i){
              arr[i].type = 1;
            }else{
              arr[i].type = 0;
            }
          }
          this.setData({
            addressList: arr
          })
        } else {
          alert(res.data.msg);
        }
      }
    })
  },
  // 请求数据
  reqDel(data,index){
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/del_user_address`,
      type:"POST",
      data,
      success:res=>{
        if(res.data.status == 1){
          console.log(res.data);
          var arr = this.data.addressList;
          arr.splice(index,1);
          this.setData({
            addressList:arr
          })
          alert('删除成功')
        }else{
          alert(res.data.msg);
        }
      }
    })
  },
  // 跳转到编辑页面
  toEdit(e){
    var obj = e.target.dataset
    wx.navigateTo({
      url: 'change_user_address/change_user_address?address_id=' + obj.address_id
    })
  },
  getAddress(open_id){
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/user_address`,
      type:"POST",
      data: { open_id},
      success:res=>{
        wx.hideLoading();
        if(res.data.status == 1){
          console.log(setAddress(res.data.data.user_address));
          this.setData({
            addressList: setAddress(res.data.data.user_address)
          })
        }
      }
    })
  },
  onReady: function () {
  
  },
  onShow:function(){
   if(app.globalData.open_id){
     this.getAddress(app.globalData.open_id);
   }
  }
})