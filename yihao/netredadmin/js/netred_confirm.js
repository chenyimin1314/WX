$(function () {
	var d = new Date();
	var end = d.addDay(-30);
	end = getDate(end, 'date');
	console.log(end);
	$("#dropdownMenu1").jcDate({
		Default: end,
		Top: 34,       //设置控件top，默认22
	});
	$("#dropdownMenu2").jcDate({
		Top: 34
	});

	function getApplyList(data) {
		var url = $.baseUrl + '/Back/Index/rednet_list';
		$.ajax({
			url: url,
			type: 'POST',
			data: data,
			dataType: $.dataType,
			success: function (res) {
				if (res.status == 1) {
					setData(res.data);
					var page_num;
					if (data.page_num) {
						page_num = data.page_num;
					} else {
						page_num = 1;
					}
					var el = $('#pager').parent();
					$('#pager').remove();
					var pager = $('<div>',{"id":"pager","class":"tcdPageCode"});
					pager.createPage({
						pageCount: res.data.pageCount,
						current: parseInt(page_num),
						backFn: function (e) {
							var para = getparams();
							para.page_num = e;
							getApplyList(para);
						}
					});
					el.append(pager);
				} else if (res.status == 3) {
					toLogin();
				} else {
					myAlert('操作数据失败');
				}
			}
		})
	}

	getApplyList(getparams());

	//设置信息
	function setData(data) {
		var el = $('#tbody')
		if (data.auditor_rednet_list) {
			el.empty();
			$.each(data.auditor_rednet_list, function (i, val) {
				var tr = $('<tr>').data('info', val);
				var td0 = $('<td>').text(val.name);
				var td1 = $('<td>').text(val.create_time);
				var txt = '';
				var td3 = $('<td>');
				switch (Number(val.status)) {
					case 0 :
						txt = '未审核';
						var button = $('<button>', {class: "btn btn-default check"}).text('审核');
						break;
					case 1:
						txt = "已审核";
						var button = $('<button>', {class: "btn btn-default check"}).text('查看审核信息');
						break;
					case 2:
						var button = $('<button>', {class: "btn btn-default check"}).text('查看审核信息');
						txt = "已驳回";
						break;
					case 3:
						txt = "已拉黑";
						var button = $('<button>', {class: "btn btn-default check"}).text('产看审核信息');
						break;
					default:
						break;
				}
				var td2 = $('<td>').text(txt);
				td3.append(button);
				var txt = val.status == 1?"已审核":"未审核";
				var td4 = $('<td>').text(txt);
				tr.append(td0).append(td1).append(td2).append(td3).append(td4)
				el.append(tr);
			})
		} else {
			el.empty().append('<tr><td colspan="5">暂无数据</td></tr>');
		}
	}

	//三个页面的显示隐藏
	function showpage(a) {
		$('.main_content_right>div').eq(a).show().siblings('div').hide();
		$('#change').text('修改');
	}
	function showPopver(e) {
		if (e) {
			$('.my_popover').show().children('div').addClass('rotate')
		} else {
			$('.my_popover').hide()
		}
	}

	var reg = /^1[34578]\d{9}$/; //手机号正则
	$('#verify_account').on('click', function () {
		var value = $('.verify input').val();
		if (value == "" || !reg.test(value)) {
			return myAlert("请输入正确账号");
		}
		verify({phone: value});
	});
	//点击跳到审核详情
	$('#tbody,#tbody1').on('click', '.check', function () {
		console.log($(this).parents('tr'));
		var obj = $(this).parents('tr').data('info');
		if(obj.status == 0){
			$('.buttonGroup').show();
		}else{
			$('.buttonGroup').hide();
		}
		getConfirmInfo({
			user_id: obj.user_id
		});
		showpage(1);
	});
	function getparams() {
		var data = {};
		var type = $('#chooseListValue').data('type');
		if ($('#shop_keyword').val()) {
			data.name = $('#shop_keyword').val();
		}
		if (type > -1) {
			data.type = type;
		}
		data.start_time = $('#dropdownMenu1').val() + ' 00:00:00';
		data.end_time = $('#dropdownMenu2').val() + ' 23:59:59';
		return data;
	}

	//选择方式
	$('#chooseList').on('click', 'li a', function () {
		var type = $(this).data('type');
		$('#chooseListValue').data('type', type).val($(this).text());
		getApplyList(getparams());
	});
	//搜索关键字
	$('#searchKeyword').on('click', function () {
		getApplyList(getparams());
	});
	$('#shop_keyword').on('input propertychange', function () {
		if (this.value == "") {
			getApplyList(getparams());
		}
	});
	//搜索日期
	$('#search_date').on('click', function () {
		getApplyList(getparams());
	});

	function getConfirmInfo(data) {
		var url = $.baseUrl + '/Back/Index/rednet_info'
		$.ajax({
			url: url,
			type: 'POST',
			data: data,
			dataType: $.dataType,
			success: function (res) {
				console.log(res)
				if (res.status == 1) {
					setConfirmInfo(res.data);
				} else if (res.status == 3) {
					toLogin();
				} else {
					myAlert('操作数据失败');
				}
			}
		})
	}

	function setConfirmInfo(data) {
		console.log(data, 'confirm_info');
		var a = data.rednet_info[0];
		$('#shop_name1').val(a.name);
		$('#refuse').data('user_id',a.user_id);
		$('#pass').data('user_id',a.user_id);
		$('#profile').val(a.profile);
		$('#fans').text(a.fans);
		$('#register_time').text(a.platform_time);
		$('#platform_id').val(a.platform_id);
		$('#live_type').val(a.live_type);
		var arr = data.rednet_img;
		$('#id_image,#personal_image').empty();
		for(var i in arr){
			console.log(arr[i]);
			var img = $('<img>',{src:arr[i].img_path}).data(arr[i]);
			if(i < 2){
				$('#id_image').append(img);
			}else{
				$('#personal_image').append(img);
			}
		}
	};

	//通过审核
	$("#pass").on('click', function () {
		var user_id = $(this).data('user_id');
		var data = {
			user_id: user_id,
			type: 1
		}
		wxc.xcConfirm("是否通过审核", wxc.xcConfirm.typeEnum.confirm, {
			onOk: function () {
				apply_refuse(data);
			}
		})
	});
	//驳回请求
	$("#refuse").on('click', function () {
		var user_id = $(this).data('user_id');
		console.log(user_id);
		var data = {
			user_id: user_id,
			type: 2
		}
		wxc.xcConfirm("是否驳回审核", wxc.xcConfirm.typeEnum.confirm, {
			onOk: function () {
				apply_refuse(data);
			}
		});
	});

	function apply_refuse(data) {
		$.ajax({
			url:$.baseUrl + '/Back/Index/auditor_rednet',
			type: 'POST',
			data: data,
			dataType: $.dataType,
			success: function (res) {
				console.log(res);
				if (res.status == 1) {
					if (data.type == 1) {
						myAlert("已通过审核");
					} else if (data.type == 2) {
						myAlert("已驳回审核");
					}
					setTimeout(function () {
						location.reload(true);
					},500)
				} else if (res.status == 3) {
					toLogin();
				} else {
					myAlert('操作数据失败');
				}
			}
		})
	}
	//返回审核列表
	$('#check_info').on('click', 'h1 img', function () {
		showpage(0)
		$('.verify').hide();
	});
	$('.img_type').on('change', 'input', function () {
		var el = $(this).siblings('img');
		var files = this.files;
		readImage(files, function (src) {
			el.attr('src', src);
		});
	});
	$('.imgPopver').click(function () {
		$(this).hide();
	});
	$('.myimgbox').click(function (e) {
		var evt = e || event;
		evt.stopPropagation();
	});
	/*查看图片*/
	$('#id_image,#personal_image').on('click', 'img', function () {
		$('.imgPopver').show();
		setImg(this.src);
	});
	function setImg(src) {
		$('.myimgbox').empty();
		var img = document.createElement('img');
		img.src = src;
		console.log(img.width,img.height)
		if(img.width > img.height){
			$(img).width('100%');
		}else{
			$(img).height('100%');
		}
		$('.myimgbox').append(img);
	}
	//
	/*修改列表*/
	$('#chooseItem').on('click','li a',function () {
		var status = $(this).data('type');
		$('#listStatus').val($(this).text()).data('type',status);
		getApplyList(getparams());
		if(status == 2){
			$('#table').hide();
			$('#table1').show();
		}else{
			$('#table').show();
			$('#table1').hide();
		}
	});

})