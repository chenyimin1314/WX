mui.init({
	swipeBack: true //启用右滑关闭功能
});
var reg = /^1[3578]\d{9}$/;
var reg_pass = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
$('#phone').on('blur',function(){
	$('.tip').hide();
	if(!reg.test($(this).val())){
		$('.tip').hide();
		$('#phone_tip').text("手机号格式错误").show();
	}
})
$('#password').on('blur',function(){
	$('.tip').hide();
	if(!reg.test($("#phone").val())){
		$('#phone_tip').text("手机号格式错误").show();
	}
	if(!reg_pass.test($(this).val())){
		$('#password_tip').text("密码格式错误").show();
	}
})
$('#code').on('blur',function(){
	$('.tip').hide();
	if(!reg.test($("#phone").val())){
		$('#phone_tip').text("手机号格式错误").show();
	}
	if(!reg_pass.test($('#password').val())){
		$('#password_tip').text("密码格式错误").show();
	}
	if($(this).val() == ""){
		$('#code_tip').text("邀请码不能为空").show();
	}
})
//var mask = mui.createMask();//callback为用户点击蒙版时自动执行的回调；
$('#submit').on('tap',function(){
	$('.tip').hide();
	if(!reg.test($("#phone").val())){
		mui.alert("手机号格式错误");
		return 0;
	}else if(!reg_pass.test($('#password').val())){
		mui.alert("密码格式错误");
		return 0;
	}else if($("#code").val() == ""){
		mui.alert("邀请码不能为空");
		return 0;
		
	}
	var data = {
		phone:$('#phone').val(),
		password:$('#password').val(),
		code:$('#code').val()
	}
	$.ajax({
		type:"PSOT",
		url:"",
		data:data,
		success:function(res){
			console.log(res.data);
		},
		error(){
			
		}
	});
})

