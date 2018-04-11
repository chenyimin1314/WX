$(function () {
  $('#apply').on('click', function () {
      showPopover(1);
	console.log($("#radio-group input:checked").val());
	var data = {};
	var a = {
	  a: $('#account').val(),
	  b: $('#apply_number').val(),
	  c: $("#radio-group input:checked").val()
	};
	var money = parseInt(a.b);
	var money1 = parseInt($('#amount-money').text());
	if(a.a == ""){
		myAlert('请输入提现账号', $('#account'));
		return showPopover();
	}else if(a.b == ""){
        myAlert('请输入金额', $('#account'));
        return showPopover();
	}else if(money > money1){
		myAlert("提现金额必须小于总金额");
		return showPopover();
	}
	data.money = money;
    data.type  = a.c;// 1：微信，2：支付宝
   data.account = a.a;// 提现账号
	  console.log(data);
   apply(data);
  });
  function apply(data) {
       $('#account').val('');
       $('#apply_number').val('');
       $("#radio-group input:checked").val('');
	  $.ajax({
		  url:$.baseUrl + '/Backuser/User/shop_profit_audit',
		  type:"post",
		  dataType:$.dataType,
		  data:data,
		  success:function (res) {
			  if(res.status == 1){
				  console.log(res);
				  myAlert("申请提现已提交成功");
                  getInfo();
			  }else{
			  	if(res.status == 3){
					toLogin();
				}else if(res.status == 0){
			  		myAlert(res.msg);
				}
			  }
              showPopover();
          }
	  })
  }
	//申请提现显示弹窗
	function  showPopover(flag) {
		//显示遮罩层
		if(flag){
            $('.my_popover').show().children().addClass('rotate');
         //关闭遮罩层
		}else{
            $('.my_popover').hide().children().remove('rotate');
		}
    }
	function getInfo() {
        $.ajax({
            url:$.baseUrl + '/Backuser/User/shop_profit',
            type:"post",
            dataType:$.dataType,
            success:function (res) {
                if(res.status == 1){
                    console.log(res);
                   	var money = res.data.money?res.data.money:0;
                    $('#amount-money').text(money);
                }else{
                    if(res.status == 3 ){
                        toLogin();
                    }else{
                        myAlert('获取总金额失败');
                    }
                }
            }
        })
    }
    getInfo();
});