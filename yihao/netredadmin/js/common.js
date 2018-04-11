$.baseUrl = 'https://www.hukesoft.com/RedNet/index.php';
if(location.href.indexOf('hukesoft') > -1) {
	$.dataType = "json"
} else {
	$.dataType = "jsonp"
}
$.setPopover = {
	init: function () {
		var div = $('<div>', {'class': 'loading'}).css({
			"position": "absolute",
			"width": "100%",
			"height": "100%",
			"left": 0,
			"top": 0,
			"display": "none",
			"background":"rgba(0,0,0,.2)"
		});
		var div1 = $('<div>').css({
			"position": "absolute",
			"width": "100px",
			"height": "100px",
			"left": "50%",
			"top": "50%",
			"transform": "translate(-50%,-50%)",
			"border-radius": "50%",
			"border": "5px solid #ddd",
			"border-top-color": "transparent"
		});
		div.append(div1);
		$('body').append(div);
	},
	show: function () {
		$('body>.loading').show().children().addClass('rotate');
	},
	hide: function () {
		$('body>.loading').hide().children().removeClass('rotate');
	}
};
$(function() {
	//功能点：注销
	var write_off = function() {
		$.ajax({
			url: $.baseUrl + "/Back/User/write_off",
			type: 'POST',
			dataType: $.dataType,
			async: false,
			data: '',
			success: function(data) {
				window.location.href = "../login/login.html";
			}
		})
	};
	$('.cancel_btn').on('click',function () {
		write_off();
	});
	//设置顶部的消息
	$('.store_confirm').on('click', function() {
		$('.store_confirm_detail').show();
	});
	if(localStorage.getItem('userInfo')){
		var obj = JSON.parse(localStorage.getItem('userInfo'));
		console.log(obj);
		$(".user_heard").attr("src", obj.head_image_url);
		$(".user_name").html(obj.name);
		$(".top_msg_right_box").show();
	}
	//其他展开的时候兄弟点收起
	$(".main_content_left>ul>li").on('click', function() {
		$(".main_content_left>ul>ul").height(0);
		$(this).siblings('li').find('.arrow>img').attr('src', '../img/arrow_right.png')
	});
	$(".main_content").css("height", $(window).height() - 80);
	//点击用户管理
	$(".user_apply").click(function() {
		if($(".user_apply_list").height() == 0) {
			$(".arrow>img").attr("src", "../img/arrow_right.png");
			$(".user_apply .arrow>img").attr("src","../img/arrow_down.png");
			$(".user_apply_list").height(120);
		} else {
			console.log('arrow_right')
			$(".user_apply .arrow>img").attr("src", "../img/arrow_right.png");
			$(".user_apply_list").height(0);
		}
	});
	//点击商铺财务管理
	$(".money_manager").click(function() {
		if($(".money_manager_detail").css("height") == "0px") {
			$(".arrow>img").attr("src", "../img/arrow_right.png");
			$(".money_manager .arrow>img").attr("src", "../img/arrow_down.png");
			$(".money_manager_detail").css("height", "240").siblings('ul').height(0);
		} else {
			$(".money_manager .arrow>img").attr("src", "../img/arrow_right.png");
			$(".money_manager_detail").css("height", "0px");
		}

	})
	var applyList = ['shop_confirm','netred_confirm'];
	$(".user_apply_list").on('click','li',function() {
		var index = $(this).index();
		location.href = '../html/' + applyList[index] + '.html'
	});
	//点击基本设置
	$(".baseSet").on('click',function() {
		if($(".my_account_3").css("height") == "0px") {
			$(".arrow>img").attr("src", "../img/arrow_right.png");
			$(".baseSet .arrow>img").attr("src", "../img/arrow_down.png");
			$(".my_account_3").css("height", "180").siblings('ul').height(0);
		} else {
			$(".baseSet .arrow>img").attr("src", "../img/arrow_right.png");
			$(".my_account_3").css("height", "0px");
		}
	});
	var baseSetArr = ['account_set','label','banner'];
	$('.my_account_3').on('click','li',function () {
		var index = $(this).index();
		location.href = '../html/' + baseSetArr[index] + '.html'
	});
	//左边二级列表滑动
	$(".main_content_left>ul>li").hover(function() {
		var index = $(".main_content_left>ul>li").index($(this)) + 1;
		$(this).children("img").attr("src", "../img/img" + index + ".png");
		$(this).children("span").addClass("white_color");
		$(this).addClass("bg_color");
		$(this).find(".blue_line_").css("display", "block");

	}, function() {
		var index = $(".main_content_left>ul>li").index($(this)) + 1;
		if(!$(this).hasClass("li_flag")) {
			$(this).children("img").attr("src", "../img/img" + index + "_.png");
			$(this).children("span").removeClass("white_color");
			$(this).removeClass("bg_color");
		}
		$(this).find(".blue_line_").css("display", "none");
	})

	$(".main_content_left>ul>ul>li").hover(function() {
		$(this).find("span").addClass("whiteColor");
		$(this).addClass("bg_color");
		$(this).children('img').attr('src', '../img/dot_.png');
		$(this).find(".blue_line_2").css("display", "block");
	}, function() {
		if(!$(this).hasClass("li_flag")) {
			$(this).find("span").removeClass("whiteColor");
			$(this).children('img').attr('src', '../img/dot.png');
			$(this).removeClass("bg_color");
			$(this).find(".blue_line_2").css("display", "none");
		}
	});
	//财务管理
	var moneyArr = ['money_confirm', 'money_record', 'money_set', 'money_count'];
	$('.money_manager_detail').on('click', 'li', function() {
		var index = $(this).index();
		location.href = '../html/' + moneyArr[index] + '.html';
	});

	//左边导航
	$(".main_content_left>ul>li").click(function() {
		var index = $(this).index();
		if(index == "0") {
			window.location.href = "../html/platform.html";
		} else if(index == "5") {
			// window.location.href = "../html/shop_confirm.html";
		}
	})

})

function readImage(files, cb) {
	if(!/\/(?:jpeg|jpg|png)/i.test(files[0].type)) return alert('请上传正确的图片文件');
	if(files[0].size > 3* 1024 * 1024) return alert('请上传小于3M的图片');
	var render = new FileReader();
	render.onload = function() {
		cb && cb(this.result);
	};
	render.readAsDataURL(files[0]);
}
//获取文件地址显示预览
function getObjectURL(file) {
	var url = null;
	if(window.createObjectURL != undefined) { // basic
		url = window.createObjectURL(file);
	} else if(window.URL != undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file);
	} else if(window.webkitURL != undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file);
	}
	return url;
};
function toLogin() {
	window.wxc.xcConfirm('请重新登录', wxc.xcConfirm.typeEnum.info, {
		onOk: function() {
			location.href = "../login/login.html"
		}
	})
}
//点击按钮进行对数据进行判断有没有输入
function myAlert(txt, el) {
	wxc.xcConfirm(txt, wxc.xcConfirm.typeEnum.info, {
		onOk: function() {
			if(el) {
				el.focus();
			}
		}
	});
}
Date.prototype.addDay = function(num) {
	this.setDate(this.getDate() + num);
	return this
};
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
function getDate(d, params) {
	var  year = d.getFullYear();
	var  month = (d.getMonth() + 1) > 9 ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1));
	var day = d.getDate() > 9 ? d.getDate() : ('0' + d.getDate());
	var hour = d.getHours() > 9 ? d.getHours() : '0' + d.getHours();
	var minute = d.getMinutes() > 9 ? d.getMinutes() : '0' + d.getMinutes();
	var seconds = d.getSeconds() > 9 ? d.getSeconds() : '0' + d.getSeconds();
	if (params === 'time') return '' + year + month + day + hour + minute + seconds;//'20170717141010'
	if (params === 'date') return year + '-' + month + '-' + day;//'2017-07-17'
}
//请求数据
//请求数据函数  url,data,cb,
function ajax(url,data,cb) {
	$.ajax({
		url:url,
		data:data,
		dataType:$.dataType,
		success:function (res) {
			if(res.status == 1){
				cb && cb(res)
			}else if(res.status == 3){
				toLogin()
			}else {
				myAlert(res.msg);
			}
		}
	})
}