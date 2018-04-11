import { toLogin, alert, setUrl } from '../../../../utils/util.js'
var M = require('../../../../utils/md5.js');
const app = getApp()
Page({
  data: {
    isShow: false,
    showPopver: false,
    loaded: false,
    isVerify: false,
    code:"",
    account:"",
    money:"",
    page_num: 0,
    type: 1,
    codeText: '获取验证码',
    isShowApply: true,
    apply_type: [{
      type: 1,
      name: "微信",
      isSelected: true,
      icon: "wechatpay.png"
    }, {
      type: 2,
      name: "微信",
      isSelected: false,
      icon: "alipay.png"
    }]
  },

  getCode() {
    if (this.data.codeText == "获取验证码") {
      var str = 'rednet';
      str = M.MD5(32, str);
      var data = {
        phone: this.data.phone,
        content: str
      }
      //获取验证码
      wx.request({
        url: app.globalData.baseUrl + "/Index/User/wallet_audit_validate",
        data: {
          phone: this.data.phone,
          content: str
        },
        method: "GET",
        success: function (res) {
          console.log(res);
          if (res.data.status == 1) {
            console.log(res.data);
          }
        }
      })
      this.setData({
        'time': 59,
        codeText: "60秒后重发",
        code: ""

      });
      this.timer = setInterval(this.setCode, 1000);
    }
  },
  // 设置获取验证码文字
  setCode() {
    var txt = this.data.time + '秒后重发';
    this.setData({
      time: parseInt(this.data.time) - 1,
      codeText: txt
    })
    if (this.data.time == 0) {
      this.setData({
        time: 60,
        codeText: "获取验证码"
      })
      clearInterval(this.timer);
    }
  },
  getValue(e){
    var obj = {};
    obj[e.target.id] = e.detail.value;
    this.setData(obj); 
  },
  // 验证通过再次点击提现
  confirm_first(){
    if(this.data.account == ""){
      alert("请输入账号");
      return;
    } else if (this.data.money == ""){
      alert("请输入提现金额");
      return;
    } else if (Number(this.data.money)<10) {
      alert("提现金额需大于10元");
      return;
    } else if (Number(this.data.money) > this.data.user_profit.money){
      alert("提现金额不得大于剩余总金额");
      return;
    }
    if (this.data.isVerify){
      var data = {
        account:this.data.account,
        money:this.data.money,
        open_id:app.globalData.open_id,
        type:this.data.type
      };
      this.apply(data, () => {
        var user_profit = this.data.user_profit;
        user_profit.money = user_profit.money - this.data.money;
        this.setData({
          isVerify: true,
          user_profit,
          showPopver: false,
        })
      })
      console.log(data);
    }else{
      this.setData({
        showPopver: true,
      })
    }
  },
  confirm_second(){
    if(this.data.code==""){
      alert("请输入验证码");
    }else{
      var data = {
        phone:this.data.phone,
        code:this.data.code,
      }
      wx.request({
        url: `${app.globalData.baseUrl}/Index/User/wallet_audit_validate_code`,
        data,
        type: "POST",
        success: res => {
          this.setData({
            code:""
          })
          if (res.data.status == 1) {
            var data1 = {
              account: this.data.account,
              open_id:app.globalData.open_id,
              money:this.data.money,
              type: this.data.type
            }
            this.apply(data1,()=>{
              var user_profit = this.data.user_profit;
              user_profit.money = user_profit.money - this.data.money;
              this.setData({
                isVerify:true,
                user_profit, 
                showPopver: false,
              })
            })
          } else {
            alert(res.data.msg);
          }
        }
      })
    }
  },
  // 关闭弹窗
  close(e){
    if(e.target.dataset.type == 1){
      this.setData({
        showPopver: false,
      })
    }
  },
  apply(data, cb) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/user_wallet_audit`,
      data,
      type: "POST",
      success: res => {
        if (res.data.status == 1) {
          cb && cb(data);
          alert("提现申请已提交");
        } else {
          alert("申请提现失败");
        }
      }
    })
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      duration: 5000,
      mask: true
    })
    console.log(app.globalData)
    if (app.globalData.open_id) {
      this.setData({
        phone: app.globalData.phone
      })
      this.get_user_profit({
        "open_id": app.globalData.open_id,
        "page_num": 0
      })
    } else {
      toLogin(app, () => {
        this.setData({
          phone: app.globalData.phone
        })
        this.get_user_profit({
          "open_id": app.globalData.open_id,
          "page_num": 0,
        })
      })
    }
  },
  chooseType(e) {
    var index = e.target.dataset.index;
    var apply_type = this.data.apply_type;
    for (let i = 0; i < apply_type.length; i++) {
      if (index == i) {
        apply_type[i].isSelected = true;
        this.setData({
          type: apply_type[i].type
        })
      } else {
        apply_type[i].isSelected = false;
      }
    }
    this.setData({
      apply_type
    })
  },
  // 获取收益
  get_user_profit(data) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/user_profit`,
      data,
      type: "POST",
      success: res => {
        wx.hideLoading();
        if (res.data.status == 1) {
          this.setData({
            user_profit: res.data.data.user_profit,
            isShow: true
          })
        }
      }
    })
  },
  setDate(arr) {
    for (let i = 0; i < arr.length; i++) {
      arr[i].created_at = arr[i].created_at.substr(0, 10);
    }
    return arr;
  },
  // 上拉加载
  toLower() {
    // 加载完成
    if (this.data.loaded) {
      return;
    }
    wx.showLoading({
      title: '加载中',
      duration: 5000,
      mask: true,
    })
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.setData({
        page_num: Number(this.data.page_num) + 1
      })
      this.get_user_profit({
        "open_id": app.globalData.open_id,
        "page_num": this.data.page_num
      })
    }, 400)
  },
  onShow: function () {
    if(this.data.isShow){
      this.setData({
        isShow: false,
        showPopver: false,
        loaded: false,
        isVerify: false,
        code: "",
        account: "",
        money: "",
        page_num: 0,
      })
      this.get_user_profit({
        "open_id": app.globalData.open_id,
        "page_num": this.data.page_num
      })
    }
  }
})