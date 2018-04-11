$.baseUrl = 'https://www.hukesoft.com/RedNet/index.php';
if(location.href.indexOf('hukesoft')>-1){
	$.dataType = "json"
}else{
	$.dataType = "jsonp"
}
$(function() {
	console.log($.cookie('head_image_url'));
	var headUrl = localStorage.getItem("head_image_url");

	$(".user_heard").attr("src", headUrl);
	$(".user_name").html(localStorage.getItem("name"));
	var mechant = false;
	console.log(identify,'identify');
	var identify = localStorage.getItem('identity');
	if(identify == 2){
		$('.myStores').hide();
	}
	$(".top_msg_right_box").show();
	$(".main_content").css("height", $(window).height() - 80);
	var obj = {
		"index": "代言管理",
		"represent": "代言管理",
		"account_survey": "我的账户",
		"capital_details": "我的账户",
		"account_space": "我的账户",
		"account_set": "我的账户",
		"data_count": "数据统计",
		"user_manage": "用户管理",
		"imgDetail": "我的宣传",
		"advertisingVideo":"我的宣传",
		"myPrevue": "预告视频",
		"marketing": "营销工具",
		"shops_manage": "旗下主播",
		"issuseTicket": "票券管理",
		"ticketAc": "票券管理",
		"ticketUse": "票券管理",
		"my_msg":"我的消息",
		"shop_identification": "我的商铺",
		"store_manage": "我的商铺",
		"add_commodity": "我的商铺",
		"commodity_mananger": "我的商铺",
		"statistics": "我的商铺",
		"order": "订单管理",
		"detail": "商铺财务管理",
		"apply": "商铺财务管理",
		"withdraw": "商铺财务管理",
	};
	//设置左边的内容
	(function() {
		var a = location.pathname.split('/');
		a = a[a.length - 1].split('.')[0];
		var txt = obj[a];
		var length = $('.top_msg_right_left').size();
		var el = null;
		if(length >= 1) {
			el = $('.top_msg_right_left');
			el.empty();
		} else {
			el = $("<div/>", {
				"class": "top_msg_right_left"
			});
		}
		var content = '<div>我的位置</div><div>&gt;</div><div>' + txt + '</div>';
		el.html(content);
		$('.top_msg_right_box').append(el);
	})();
	//其他展开的时候兄弟点收起
	$(".main_content_left>ul>li").on('click', function() {
		$(".main_content_left>ul>ul").height(0);
		$(this).siblings('li').find('.arrow>img').attr('src', '../img/arrow_right.png')
	});
	/*滑动效果*/
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
	});
	//具有下滑的li滑动
	$(".main_content_left>ul>ul>li").hover(function() {
		$(this).find("span").addClass("whiteColor");
		$(this).addClass("bg_color");
		$(this).find(".blue_line_2").css("display", "block");
		$(this).find('img').attr('src', '../img/dot_.png');
	}, function() {
		if(!$(this).hasClass("li_flag")) {
			$(this).find("span").removeClass("whiteColor");
			$(this).removeClass("bg_color");
			$(this).find(".blue_line_2").css("display", "none");
			$(this).find('img').attr('src', '../img/dot.png');
		}
	});
	//点击代言管理
	$('.represent').on('click',function () {
		var $this = $('.my_represent');
		if($this.height() == 0) {
			$(this).find('.arrow>img').attr('src', '../img/arrow_down.png');
			$this.height(120)
		} else {
			$(this).find('.arrow>img').attr('src', '../img/arrow_right.png');
			$this.height(0)
		}
	})
	//点击我的店铺
	$(".myStores").on('click', function() {
		var $this = $('.my_myStores');
		if($this.height() == 0) {
			$(this).find('.arrow>img').attr('src', '../img/arrow_down.png');
			$this.height(240)
		} else {
			$(this).find('.arrow>img').attr('src', '../img/arrow_right.png');
			$this.height(0)
		}
	});
	var represent = ['index.html', 'represent.html'];
	$('.my_represent>li').on('click', function() {
		var index_ = $(this).index();
		location.href = '../html/' + represent[index_];
	});
	//我的店铺管理页面
	var storeUrl = ['add_commodity.html',
		'commodity_mananger.html','statistics.html',
		'store_manage.html'
	];
	$(".my_myStores>li").on('click', function() {
		var index_ = $(this).index();
		location.href = '../html/' + storeUrl[index_];
	});
	//点击
	var moneyArr = ['detail', 'apply', 'withdraw'];
	$(".myMoney").on('click', function() {
		if($(".my_myMoney").height() == 0) {
			$(this).find('.arrow>img').attr('src', '../img/arrow_down.png');
			$(".my_myMoney").height(180);
		} else {
			$(this).find('.arrow>img').attr('src', '../img/arrow_right.png');
			$(".my_myMoney").height(0);
		}
	});
	$(".my_myMoney").on('click', 'li', function() {
		var index = $(this).index();
		location.href = '../html/' + moneyArr[index] + '.html';
	});

	//左边导航
	$(".main_content_left>ul>li").on('click', function() {
		var index = $(this).index();
		console.log(index)
		if(index == "0") {
			// window.location.href = "../html/index.html";
		} else if(index == "4") {
			window.location.href = "../html/order.html";
		}
	});
	//注销
	$(".cancel_btn").click(function() {
		window.location.href = "../login/login.html";

		$.ajax({
			url: $.baseUrl + "/Backuser/User/write_off",
			type: 'POST',
			dataType: $.dataType,
			async: false,
			data: '',
			success: function(data) {
				console.log(data);
				localStorage.removeItem("head_image_url");
				localStorage.removeItem("name");
				localStorage.removeItem("user_id");
				localStorage.removeItem("identity");
			}
		})
	})
});
Date.prototype.addDay = function(num) {
	this.setDate(this.getDate() + num);
	return this
};
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
//将图片转化成base64位
function readImage(files, cb) {
	if(!/\/(?:jpeg|jpg|png)/i.test(files[0].type)) return alert('请上传正确的图片文件');
	if(files[0].size > 3* 1024 * 1024) return alert('请上传小于3M的图片');
	var render = new FileReader();
	render.onload = function() {
		cb && cb(this.result);
	}
	render.readAsDataURL(files[0]);
}

//读取视频
function readVideo(files, cb) {
	if(!/\/(?:mp4|ogg|avi)/i.test(files[0].type)) return alert('只支持mp4/flv/avi格式');
	// if(files[0].size > 200*1024) return alert('请上传小于200k的图片');
	var render = new FileReader();
	render.onload = function() {
		cb && cb(this.result);
	}
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

			}else {
				myAlert(res.msg);
			}
		}
	})
}