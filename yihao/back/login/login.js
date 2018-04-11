$.baseUrl = 'https://www.hukesoft.com/RedNet/index.php';
console.log(location.href);
if (location.href.indexOf('hukesoft') > -1) {
	$.dataType = "json"
} else {
	$.dataType = "jsonp"
}
$(function () {
	//定义全局URL头
	var url_data = "https://www.hukesoft.com/RedNet/index.php";
	//获取验证码
	var str = 'rednet'.MD5(32);
	console.log(str);
	var get_code = function (phone_flag) {
		console.log(phone_flag);
		$.ajax({
			url: url_data + "/Backuser/User/login_validate",
			type: 'POST',
			dataType: $.dataType,
			data: {
				'phone': phone_flag,
				content:str
			},
			success: function (data) {
				if (data.status == "1") {

				} else {
					window.wxc.xcConfirm(data.msg, wxc.xcConfirm.typeEnum.info)
				}
			}
		})
	}
	var nums = 30;
	var clock = '';
	$(".getCode").click(function () {
		if ($(this).html().trim() == "获取验证码") {
			$(".input_box_2 input").val("");
			var getPhone = $(".user_phone_flag").val();
			if (!(/^1[34578]\d{9}$/.test(getPhone))) {
				console.log(!(/^1[34578]\d{9}$/.test(getPhone)));
				var txt = "手机号码有误，请重填";
				window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
				return false;
			}
			get_code(getPhone);
			$(this).html(nums + '秒后重新获取');
			clock = setInterval(doLoop, 1000);
		}
	})
	var doLoop = function () {
		nums--;
		if (nums > 0) {
			$(".getCode").html(nums + '秒后重新获取');
		} else {
			clearInterval(clock); //清除js定时器
			$(".getCode").html("获取验证码");
			nums = 30; //重置时间
		}
	}
	//手机号登录
	var phone_login = function (phone_flag, code_flag) {
		$.ajax({
			url: url_data + "/Backuser/User/login",
			type: 'POST',
			dataType: $.dataType,
			data: {
				'phone': phone_flag,
				'code': code_flag
			},
			success: function (data) {
				console.log(data, "data");
				if (data.status == "1") {
					localStorage.setItem('name', data.data.user_info.name)
					localStorage.setItem('head_image_url', data.data.user_info.head_image_url)
					localStorage.setItem('user_id', data.data.user_info.id)
					localStorage.setItem('identity', data.data.user_info.identity);
					window.location.href = "../html/index.html";
				} else {
					var txt = data.msg;
					window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
				}
			}
		})
	}
	$(".login_btn").click(function () {
		var phone_flag = $(".user_phone_flag").val();
		var code_flag = $(".input_box_2>input").val();

		if (phone_flag == "") {
			myAlert("请输入手机号")
			return;
		} else if (code_flag == "") {
			myAlert("请输入验证码");
			return;
		}
		phone_login(phone_flag, code_flag);
	})
	$(window).on('keypress', function (e) {
		if (e.key == 'Enter') {
			var phone_flag = $(".user_phone_flag").val();
			var code_flag = $(".input_box_2>input").val();
			phone_login(phone_flag, code_flag);
		}
	})
})

function myAlert(txt, el) {
	wxc.xcConfirm(txt, wxc.xcConfirm.typeEnum.info, {
		onOk: function() {
			if(el) {
				el.focus();
			}
		}
	});
}