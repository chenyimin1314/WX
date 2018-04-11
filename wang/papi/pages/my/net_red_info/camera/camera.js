// pages/my/net_red_info/net_red_info.js

const app = getApp();
import { toLogin, alert, setUrl } from '../../../../utils/util.js'
Page({
  data: {
    camera: [],
    info: {},
    isShow: false,
    isMine: false,
    arr: [],
  },
  // 获取个人信息
  getInfo(data) {
    wx.request({
      url: `${app.globalData.baseUrl}/Index/User/red_net_info`,
      data,
      type: "POST",
      success: res => {
        wx.hideLoading();
        if (res.data.status == 1) {
          console.log(res.data.data)
          var arr = this.data.arr;
          var c = [];//c用来生成预览图片数组
          if (res.data.data.user_info.user_img && res.data.data.user_info.user_img.length > 0) {
            var a = res.data.data.user_info.user_img;
            var b = [];//用来保存三张图片
            var d = [];//d为图片二位数组
            for (var i = 0; i < a.length; i++) {
              c.push(a[i].img_path);
              b.push(a[i]);
              if (i % 3 == 2) {
                d.push(b);
                b = [];
              }
            }
            d.push(b);//最后的一次未进入求余数的if判断
            console.log(d);
            arr = d;
          } else {
            arr = [];
          }
          console.log(arr);
          this.setData({
            arr,
            c,
            isShow: true
          })
        } else {
          alert(res.data.msg)
        }
      }
    })
  },
  preview(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.c // 需要预览的图片http链接列表
    })
  },
  confirm(e) {
    var obj = e.target.dataset;
    if (obj.is_fans == 1) {
      return;
    }
    var txt = obj.is_fans == 1 ? "是否取消关注?" : "是否添加关注?";
    wx.showModal({
      content: txt,
      cancelColor: "#006bff",
      confirmColor: "#006bff",
      success: res => {
        if (res.confirm) {
          var data = {
            open_id: app.globalData.open_id,
            user_id: this.data.user_id,
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
  reqConfirm(data, url, is_fans, index) {
    wx.request({
      url: url,
      type: "POST",
      data,
      success: res => {
        console.log(res.data)
        if (res.data.status == 1) {
          var info = this.data.info;
          if (is_fans == 1) {
            info.is_fans = 0;
          } else {
            info.is_fans = 1;
          }
          this.setData({ info: info });
          alert(res.data.msg)
        } else {
          alert(res.data.msg)
        }
      }
    })
  },
  // 删除照片
  deleteImg(e) {
    if(this.data.user_id == app.globalData.user_id){
      wx.showModal({
        title: '提示',
        content: '是否删除当前图片',
        cancelColor: "#FF3B2F",
        confirmColor: "#FF3B2F",
        success: r => {
          if (r.confirm) {
            var obj = e.target.dataset;
            var arr = this.data.arr;
            var c = this.data.c;
            var data = {
              open_id: app.globalData.open_id,
              id: arr[obj.index][obj.idx].id,
            };
            wx.request({
              url: `${app.globalData.baseUrl}/Index/User/delete_img`,
              data,
              method: "GET",
              success: (res) => {
                if (res.data.status == 1) {
                  arr[obj.index].splice(obj.idx, 1);
                  var index = Number(obj.index * 3) + Number(obj.idx)
                  c.splice(index, 1);
                  if(c.length == 0){
                    arr[obj.index].length = 0;
                    arr.splice(obj.index,1);
                  }
                  this.setData({
                    arr,
                    c
                  })
                  alert("删除成功");
                } else {
                  alert("删除失败");
                }
              }
            })
          }
        }
      })
    }

  },
  setMine(options) {
    console.log(options)
    if (options.user_id) {
      this.setData({
        user_id: options.user_id,
        isMine: false,
      })
    } else {
      this.setData({
        user_id: app.globalData.user_id,
        isMine: true,
      })
    }
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      duration: 5000,
    });
    console.log(options)
    this.setData({
      selfUser_id:app.globalData.user_id,
    })
    if (app.globalData.open_id) {
      // 判断user_id是否存在
      this.setMine(options);
      this.getInfo({
        open_id: app.globalData.open_id,
        user_id: this.data.user_id
      });
    } else {
      toLogin(app, () => {
        this.setMine(options);
        this.getInfo({
          open_id: app.globalData.open_id,
          user_id: this.data.user_id
        });
      })
    }
  },
  edit() {
    wx.navigateTo({
      url: 'edit/edit',
    })
  },
  toCarema() {
    wx.navigateTo({
      url: 'camera/camera',
    })
  },
  toDetail(e) {
    var obj = e.target.dataset;
    obj.user_id = this.data.user_id;
    wx.navigateTo({
      url: setUrl("../../index/shop_detail/shop_detail", obj),
    })
  },
  onReady: function () {

  },
  onShow: function () {

  }
})