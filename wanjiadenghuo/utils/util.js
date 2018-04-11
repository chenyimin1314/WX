const baseUrl = "https://www.hukesoft.com/HouseMoving/index.php"
function formatTime(time) {
  if (typeof time !== 'number' || time < 0) {
    return time
  }
  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time
  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

function formatLocation(longitude, latitude) {
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }
  console.log(longitude, latitude);

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}
// 弹窗
function alert(content, title, cb) {
  content = content ? (content + '') : "";
  title = title ? title : "";
  wx.showModal({
    title: title,
    mask: true,
    content: content,
    confirmColor: "#ff3b2f",
    showCancel: false,
    success: function () {
      cb && (typeof cb == 'function') && cb();
    }
  })
}
function setAddress(arr) {
  var arr1 = [];
  if (arr && arr.length > 0) {
    for (var i = 0; i < arr.length; i++) {
      var obj = arr[i];
      obj.address = obj.address.replace('-', '');
      arr1.push(obj);
    }
  }
  return arr1;
}
function login(app, cb, recommend_id) {
  if (!app.globalData.isLogin) {
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
              console.log(res.userInfo)
              wx.login({
                success: function (res) {
                  console.log(res);
                  var data = {
                    code: res.code,
                    name: app.globalData.userInfo.nickName,
                    head_image_url: app.globalData.userInfo.avatarUrl
                  };
                  // 推荐人id
                  if (recommend_id){
                    data.recommender = recommend_id;
                  }
                  wx.request({
                    url: `${baseUrl}/Index/User/login`,
                    type: "POST",
                    data,
                    success: function (res) {
                      if (res.data.status == 1) {
                        console.log(res.data.data)
                        app.globalData.isLogin = true;
                        app.globalData.open_id = res.data.data.open_id;
                        app.globalData.identity = res.data.data.identity;
                        app.globalData.user_id = res.data.data.user_id;
                        app.globalData.phone = res.data.data.is_phone;
                        if (res.data.data.is_phone != 2) {
                          app.globalData.isBindphone = true;
                        } else {
                          app.globalData.isBindphone = false;
                        }
                        typeof cb == "function" && cb(res.data);
                      }
                    }
                  })
                },
                fail: function (res) { },
                complete: function (res) { },
              })
              if (app.userInfoReadyCallback) {
                app.userInfoReadyCallback(res)
              }
            }
          })

        } else {
          wx.getUserInfo({
            success: info => {
              app.globalData.userInfo = info.userInfo;
              wx.login({
                success: function (res) {
                  console.log(res);
                  var data = {
                    code: res.code,
                    name: app.globalData.userInfo.nickName,
                    head_image_url: app.globalData.userInfo.avatarUrl
                  };
                  if (recommend_id){
                    data.recommender = recommend_id;
                  }
                  wx.request({
                    url: `${baseUrl}/Index/User/login`,
                    type: "POST",
                    data,
                    success: function (res) {
                      if (res.data.status == 1) {
                        console.log(res.data.data)
                        app.globalData.isLogin = true;
                        app.globalData.open_id = res.data.data.open_id;
                        app.globalData.identity = res.data.data.identity;
                        app.globalData.user_id = res.data.data.user_id;
                        app.globalData.phone = res.data.data.is_phone;
                        if (res.data.data.is_phone != 2) {
                          app.globalData.isBindphone = true;
                        } else {
                          app.globalData.isBindphone = false;
                        }
                        typeof cb == "function" && cb(res.data);
                      }
                    }
                  })
                },
                fail: function (res) { },
                complete: function (res) { },
              })
            }
          })
        }
      }
    })
  }
}
function ajax(url, data, cb, mType) {
  mType = mType ? mType : "POST";
  wx.request({
    url: baseUrl + url,
    data,
    method: mType,
    success: res => {
      cb && cb(res.data);
      if(res.data.status != 1){
        alert(res.data.msg);
      }
    },
    complete: res => {
      hideLoading();
    }
  })
}
// 对象转换成
function setUrl(url, data) {
  if (typeof (url) == 'undefined' || url == null || url == '') {
    return '';
  }
  if (typeof (data) == 'undefined' || data == null || typeof (data) != 'object') {
    return '';
  }
  url += (url.indexOf("?") != -1) ? "" : "?";
  for (var k in data) {
    url += ((url.indexOf("=") != -1) ? "&" : "") + k + "=" + encodeURI(data[k]);
    console.log(url);
  }
  return url;
}
// 直接下单
function confirm(title, content, cb) {
  title = title ? title : "";
  content = content ? content : "";
  wx.showModal({
    title: title,
    content: content,
    confirmColor: "#ff5151",
    success: res => {
      if (res.confirm) {
        cb && cb();
      }
    }
  })
}
//上传图片 url https://www.hukesoft.com/RedNet/index.php/Index/User/upload_img
// 添加购物车
function addshopping(data, cb) {
  wx.request({
    url: `${baseUrl}/Index/User/add_shopping_cart`,
    type: "POST",
    data,
    success: function (res) {
      if (res.data.status == 1) {
        cb && cb(res.data);
      } else {
        alert(res.data.msg);
      }
    }
  })
}

function showLoading(title, cb, icon, time) {
  title = title ? title : "";
  icon = icon ? icon : "loading";
  time = time ? time : 5000;
  wx.showToast({
    title: title,
    icon: icon,
    mask: true,
    duration: time,
    success: res => {
      cb && cb(res);
    }
  })
  setTimeout(function () {
    wx.hideLoading();
  }, 5000)
}
function hideLoading() {
  wx.hideLoading();
}

module.exports = {
  formatTime: formatTime,
  formatLocation: formatLocation,
  toLogin: login,
  alert,
  setAddress,
  confirm,
  addshopping,
  setUrl,
  show: showLoading,
  hide: hideLoading,
  ajax
}
