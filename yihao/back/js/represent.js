$(function () {
	$('#myTab a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});

	//获取参数
	function getparams(index) {
		var type = $('.nav-tabs li').eq(index).children('a').data('type');
		var obj = {};
		obj.type = type;
		var search_keyword;
		if (index == 3) {
			if ($('#card').is(':visible')) {
				search_keyword = $('#card').find('.search_keyword').val();
			} else {
				search_keyword = $('#shop').find('.search_keyword').val();
			}
		} else {
			search_keyword = $(".tab-content .tab-pane").eq(index).find('.search_keyword').val();
		}
		if (search_keyword) {
			obj.order_id = search_keyword;
		}
		return obj;
	};

	function getDate(data, index) {
		$.ajax({
			url: $.baseUrl + '/Backuser/User/represent_process',
			dataType: $.dataType,
			type: 'post',
			data: data,
			success: function (res) {
				if (res.status == 1) {
					setList(res.data, index);
					var el = $('#pager' + index);
					var parent = el.parent();
					var id = el.attr('id');
					var pager = $('<div>', {"id": id, "class": "tcdPageCode"});
					var page_num = data.page_num ? data.page_num : 1;
					el.remove();
					pager.createPage({
						pageCount: parseInt(res.data.pageCount),
						current: parseInt(page_num),
						backFn: function (e) {
							var mparams = getparams(index);
							mparams.page_num = e;
							getDate(mparams, index);
						}
					});
					parent.append(pager);
				} else if (res.status == 3) {
					toLogin();
				} else {
					console.log('get OrderList error', res);
				}
			}
		})
	}

	$('.nav-tabs').on('click', 'a', function () {
		var index = $(this).parent().index();
		var data = getparams(index);
		getDate(data, index);
	});
	getDate(getparams(0), 0);
	//分页
	/*-----------------------------------------渲染数据----------------------------------------------*/
	function setList(data, index) {
		console.log(data, index)
		index = parseInt(index);
		console.log(index, 'lall')
		var el = $('#tbody' + index);
		if (!data.process_list) {
			var a = $('#table' + index + ' tr:eq(0) th').size();
			el.empty();
			el.append('<tr><td colspan="' + a + '">暂无数据</td></tr>');
			return
		}
		switch (index) {
			case 0:
				el.empty();
				$.each(data.process_list, function (i, val) {
					var tr = $('<tr>').data('info', JSON.stringify(val));
					var td0 = $('<td>').text(val.name);
					var td1 = $('<td>').text(val.create_time);
					var td2 = $('<td>').text(val.start_time + '至' + val.end_time);
					var td3 = $('<td>').text(val.product_name);
					var td4 = $('<td>').text(val.product_id);
					var td5 = $('<td>').text("待签约");
					var td6 = $('<td>');
					var btn1 = $('<button>', {class: 'btn btn-default confirm'}).text('确认').data(val);
					var btn2 = $('<button>', {class: 'btn btn-danger refuse'}).text('拒绝').data(val);
					var btn3 = $('<button>', {class: 'btn btn-default detail'}).text('网红详情').data(val);
					td6.append(btn1).append(btn2).append(btn3)
					tr.append(td0).append(td1).append(td2).append(td3).append(td4).append(td5).append(td6);
					el.append(tr);
				});
				break;
			case 1:
				el.empty();
				$.each(data.process_list, function (i, val) {
					var tr = $('<tr>').data('info', JSON.stringify(val));
					var td0 = $('<td>').text(val.name);
					var td1 = $('<td>').text(val.create_time);
					var td2 = $('<td>').text(val.start_time + '至' + val.end_time);
					var td3 = $('<td>').text(val.product_name);
					var td4 = $('<td>').text(val.product_id);
					var td5 = $('<td>').text("已签约");
					var td6 = $('<td>');
					var btn3 = $('<button>', {class: 'btn btn-default detail'}).text('网红详情').data(val);
					td6.append(btn3)
					tr.append(td0).append(td1).append(td2).append(td3).append(td4).append(td5).append(td6);
					el.append(tr);
				});
				break;
			case 2:
				el.empty();
				$.each(data.process_list, function (i, val) {
					var tr = $('<tr>').data('info', JSON.stringify(val));
					var td0 = $('<td>').text(val.name);
					var td1 = $('<td>').text(val.create_time);
					var td2 = $('<td>').text(val.start_time + '至' + val.end_time);
					var td3 = $('<td>').text(val.product_name);
					var td4 = $('<td>').text(val.product_id);
					var td5 = $('<td>').text("已结束");
					var td6 = $('<td>');
					var btn3 = $('<button>', {class: 'btn btn-default detail'}).text('网红详情').data(val);
					td6.append(btn3)
					tr.append(td0).append(td1).append(td2).append(td3).append(td4).append(td5).append(td6);
					el.append(tr);
				});
				break;
			case 3:
				el.empty();
				$.each(data.process_list, function (i, val) {
					var tr = $('<tr>').data('info', JSON.stringify(val));
					var td0 = $('<td>').text(val.name);
					var td1 = $('<td>').text(val.create_time);
					var td2 = $('<td>').text(val.start_time + '至' + val.end_time);
					var td3 = $('<td>').text(val.product_name);
					var td4 = $('<td>').text(val.product_id);
					var td5 = $('<td>').text("已结束");
					var td6 = $('<td>');
					var btn3 = $('<button>', {class: 'btn btn-default detail'}).text('网红详情').data(val);
					td6.append(btn3)
					tr.append(td0).append(td1).append(td2).append(td3).append(td4).append(td5).append(td6);
					el.append(tr);
				});
				break;
				break;
			default:break;
		}
	}
	//同意签约，拒绝签约
	$('.tab-content').on('click', '.confirm', function () {
		var index = $(this).parents('.tab-pane').index();
		var index2 = $(this).parents('tr').index();
		var obj = $(this).data();
		var data = {
			'id': obj.id,
			type:1,
		};
		window.wxc.xcConfirm('是否同意签约',wxc.xcConfirm.typeEnum.confirm,{
			onOk:function () {
				ajax($.baseUrl + '/Backuser/User/auditor_rednet_product',data,function (res) {
					$('#tbody'+ index).children('tr').eq(index2).remove();
					myAlert("已同意签约");
				});
			}
		})
	});
	//拒绝
	$('.tab-content').on('click', '.refuse', function () {
		var index = $(this).parents('.tab-pane').index();
		var index2 = $(this).parents('tr').index();
		var obj = $(this).data();
		var data = {
			'id': obj.id,
			'type':2,
		};
		window.wxc.xcConfirm('是否拒绝签约',wxc.xcConfirm.typeEnum.confirm,{
			onOk:function () {
				ajax($.baseUrl + '/Backuser/User/auditor_rednet_product',data,function (res) {
					$('#tbody'+ index).children('tr').eq(index2).remove();
					myAlert("已拒绝签约");
				});
			}
		})
	});
	//从订单详情返回页面
	$('#back').on('click', function () {
		$('#detail').hide();
		$('#content').show();
	});
	/*--------------------------------------订单详情--------------------------------------------*/
	//点击查看订单详情
	$('.tab-content').on('click', '.detail', function () {
		$('#content').hide();
		$('.iconArr').empty();
		$('#detail').show();
		var index = $(this).parents('.tab-pane').index();
		var obj = $(this).data();
		var data = {
			'user_id': obj.user_id
		};
		ajax($.baseUrl + '/Backuser/User/rednet_info',data,function (res) {
			setDetailInfo(res.data, index);
		});
	});
	//设置网红详情
	function setDetailInfo(data, index) {
		console.log(data.audit_info);
		var a = data.audit_info;
		$('#shop_name1').val(a.name);
		$('#refuse').data('user_id',a.user_id);
		$('#pass').data('user_id',a.user_id);
		$('#profile').val(a.profile);
		$('#fans').text(a.fans);
		$('#register_time').text(a.platform_time);
		$('#platform_id').val(a.platform_id);
		$('#live_type').val(a.live_type);
		var arr = a.audit_img;
		$('#personal_image').empty();
		for(var i in arr){
			console.log(arr[i]);
			var img = $('<img>',{src:arr[i].img_path}).data(arr[i]);
			if(i >= 2){
				$('#personal_image').append(img);
			}
		}
		index = parseInt(index);
	}
	/*查看图片*/
	$('#personal_image').on('click', 'img', function () {
		$('.imgPopver').show();
		setImg(this.src);
	});
	$('.imgPopver').click(function () {
		$(this).hide();
	});

	function setImg(src) {
		$('.myimgbox').empty();
		var img = document.createElement('img');
		img.src = src;
		console.log(img.width,img.height)
		if(img.width > img.height){
			$(img).width('600');
		}else{
			$(img).height('600');
		}
		$('.myimgbox').append(img);
	}
	$('.myimgbox').click(function (e) {
		var evt = e || event;
		evt.stopPropagation();
	});
});