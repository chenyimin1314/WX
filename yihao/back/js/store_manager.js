function upload(url,file,cb) {
	var formData = new FormData();
	formData.append('file',file);
	$.ajax({
		url:url,
		data: forData,
		dataType: "json",
		cache: false,
		type: "POST",
		processData: false,
		contentType: false,
		success:function (res) {
			if(res.status == 1){
				cb&&cb(res);
			}
		}
	})
}
$('#tempImg0').attr('src',localStorage.getItem('head_image_url'));
$(function () {
	//	上传图片
	$('#uploadImg').on('change',function () {
		var file = this.files[0];
		console.log(file);
		var src = getObjectURL(file);
		console.log(src);
		$('#tempImg0').attr("src",src);
	});
});
function getImg(){
	$.ajax({
		url:$.baseUrl + '/Backuser/User/get_shop_info',
		dataType:$.dataType,
		success:function (res) {
			if(res.status == 1){
				console.log(res.data);
				var s = res.data.shop_info;
				$('#notice').val(s.notice?s.notice:'');
				$('#intro').text(s.shop_describe?s.shop_describe:"");
				$('#phone').val(s.admin_phone?s.admin_phone:"");
				$('#admin_name').val(s.admin_name?s.admin_name:"");
				localStorage.setItem('shop_id',s.shop_id);
			}else{
				toLogin();
			}
		}
	})
}
getImg();
//设置头像
$('#save_head').on('click',function () {
	if($('#tempImg0').attr('src').indexOf('blob') == -1){
		return;
	}
	var formData = new FormData();
	formData.append('file',$('#uploadImg')[0].files[0]);
	$.ajax({
		url:$.baseUrl + '/Backuser/User/edit_head_image',
		type: 'POST',
		cache: false,
		dataType:"json",
		data:formData,
		processData: false,
		contentType: false,
		success:function (res) {
			if(res.status == 1){
				myAlert("设置店铺头像成功");
				localStorage.setItem('head_image_url',res.data.head_image_url)
			}else if(res.status == 3){
				toLogin();
			}else{
				myAlert(res.msg)
			}
		}
	})
});
// 设置公告
$('#save_notice').on('click',function () {
	var notice = $('#notice').val().trim();
	if(notice == ""){
		myAlert("请输入广告语")
	}else{
		$.ajax({
			url:$.baseUrl + '/Backuser/User/edit_notice',
			data:{
				shop_id:localStorage.getItem('shop_id'),
				notice:notice
			},
			dataType:$.dataType,
			success:function (res) {
				if(res.status == 1){
					myAlert("设置成功");
				}else if(res.status == 3){
					toLogin();
				}else{
					myAlert(res.msg);
				}
			}
		})
	}
});
/*
* shop_describe            店铺简介
admin_name               店铺管理员
admin_phone              店铺电话
address                       店铺地址*/
var reg = /^1[3578]\d{9}/;
$('#save_intro').click(function () {
	var data = {};
	data.shop_describe = $('#intro').val();
	data.admin_phone = $('#phone').val();
	data.admin_name = $("#admin_name").val();
	if(data.shop_describe == ""){
		myAlert("请输入店铺介绍")
	}else if(data.admin_phone == ""){
		myAlert("请输入手机号")
	}else if(!reg.test(data.admin_phone)){
		myAlert("请输入正确的手机号");
	}else if(data.admin_name == ""){
		myAlert("请输入姓名");
	}
	console.log(data);
	ajax($.baseUrl + '/Backuser/User/edit_describe',data,(function (res) {
		console.log(res);
		myAlert("修改成功")
	}))
});
