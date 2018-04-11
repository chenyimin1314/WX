$.baseUrl = "https://www.hukesoft.com/RedNet/index.php";
console.log(location.href);
if (location.href.indexOf("hukesoft") > -1) {
	$.dataType = "json"
} else {
	$.dataType = "jsonp";
}

$(function () {
	$(".details_login_type>li").eq(0).css("display", "block");
	var n = {}, a = function () {
		$.ajax({
			url: $.baseUrl + "/Back/User/login",
			type: "POST",
			dataType: $.dataType,
			async: !1,
			data: n,
			success: function (n) {
				console.log(n);
				if ("1" == n.status) {
					localStorage.setItem("userInfo", JSON.stringify(n.data))
					window.location.href = "../html/platform.html";
				}
				else {
					var a = n.msg;
					window.wxc.xcConfirm(a, window.wxc.xcConfirm.typeEnum.info)
				}
			}
		})
	};
	$(".login_btn").click(function () {
		var e = $(".user_account>input").val(), i = $(".user_pwd>input").val();
		n.username = e, n.password = i, a()
	}), $(window).on("keypress", function (e) {
		if ("Enter" == e.key) {
			var i = $(".user_account>input").val(), o = $(".user_pwd>input").val();
			n.username = i, n.password = o, a()
		}
	})
});