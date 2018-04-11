//app.js
var arr = [];
App({
   uploadimg(data,cb){
    var that= this,
    i=data.i ? data.i : 0,
    success=data.success ? data.success : 0,
    fail=data.fail ? data.fail : 0;
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'fileData',//这里根据自己的实际情况改
      formData: {
        open_id:data.open_id
      },
      success: (res) => {
        success++;
        console.log(res);
        var obj = JSON.parse(res.data);
        if(obj.status == 1){
          arr.push(obj.data.img_path);
        }
        console.log(i);
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
      },
      fail: (res) => {
        fail++;
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        i++;
        if (i == data.path.length) {   //当图片传完时，停止调用 
          console.log(cb,"cb",typeof cb);
          cb&&cb(arr,i); 
          arr = [];      
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
        } else {//若图片还没有传完，则继续调用函数
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data,cb);
        }

      }
    });
  },
  onLaunch: function () {
    
  },
  globalData: {
    userInfo: null,
    isLogin: false,
    baseUrl: 'https://www.hukesoft.com/RedNet/index.php',
    isBindphone: false,
  }
})