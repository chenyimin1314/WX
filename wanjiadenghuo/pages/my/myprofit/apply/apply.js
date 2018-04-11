// pages/my/myprofit/apply/apply.js
import {alert,show,hide,toLogin,ajax} from '../../../../utils/util.js'
const app = getApp();
Page({
  data: {
    list:[{
      pay_type:2,
      name:"支付宝",
      selected:0,
      src:"../../../../images/alipay.png"
    },{
      pay_type: 1,
      name: "微信",
      selected: 1,
      src: "../../../../images/wechat.png"
    }],
    currentIndex:"1",
    money:"",
    account:"",
    showApply:false,
  },
  chooseType(e){
    var obj = e.target.dataset;
    var arr = this.data.list;
    console.log(obj)
    for (var i in arr){
      if(i == obj.index){
        arr[i].selected = 1;
      }else{
        arr[i].selected = 0;
      }
    }
    console.log(arr);
    this.setData({
      list:arr
    });
  },
  getInfo(){
    var data = {
      open_id:app.globalData.open_id,
    }
    ajax('/Index/User/user_profit', data, res => {
      this.setData({       
        info: res.data,
      })
      console.log(this.data.info)
    }, 'GET')
  },
  //申请提现
  apply(){
    console.log(1)
    this.setData({
      showApply:true
    })
  },
  getInput(e){
    var obj = {};    
    obj[e.target.dataset.key] = e.detail.value;
    this.setData(obj);
  },
  // 点击确定
  confirm(e){
    if(this.data.account == ""){
      alert('请输入账号');
      return;
    }else if(this.money == ""){
      alert('请输入金额');
      return;
    }else if(this.money < 10 || this.money > 200){
      alert('提现金额不得小于十元，并且不大于剩余总金额');
      return;
    }else{
      show('申请中');
      console.log(this.data.currentIndex)
      var data = {
        open_id:app.globalData.open_id,
        account: this.data.account,
        money: this.data.money,
        type: this.data.list[this.data.currentIndex].pay_type,
      }
      ajax('/Index/User/apply_profit',data,res=>{
        console.log(res);
        if(res.status == 1){
          this.getInfo();
          this.setData({
            currentIndex: "1",
            money: "",
            account: "",
            showApply: false,
          })
          alert("提现成功");
        }
      },'GET')
    }
  },
  cancel(){
    this.setData({
      showApply:false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})