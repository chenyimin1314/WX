$(function(){
	var gogal_admin_id = ""
	$('#submit').on('click',function () {
		var password = $('#inputEmail3').val();
		var newPassword = $('#inputPassword3').val();
		var reNewPassword = $('#inputPassword4').val();
		if(password=="" || newPassword=="" || reNewPassword==""){
			myAlert("密码不能为空");
			return;
		}else if(newPassword != reNewPassword){
			myAlert("新密码与确认密码不一致,请重新输入");
			return;
		}
		$.ajax({
			url:$.baseUrl + '/Back/User/edit_password',
			type:"POST",
			data:{
				old_password:password,
				new_password:newPassword
			},
			dataType:$.dataType,
			success:function (res) {
				if(res.status == 1){
					myAlert("密码修改成功")
				}else if(res.status == 3){
					toLogin();
				}else{
					myAlert(res.msg);
				}
			}
		})
	})
})



















