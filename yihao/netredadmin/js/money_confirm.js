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
	//分页
	$('#pager').createPage({
		pageCount: 1,
		current: 1,
		backFn: function (e) {
			this.current = e;
			this.pageCount = 10;
			console.log(this, e);
		}
	})


	//选择方式
	$('#list_type').on('click', 'li a', function () {
		var type = $(this).data('type');
		console.log(type)
		$('#list_type_value').data('type', type).val($(this).text());
		console.log()
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

	//获取参数
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
	};
	console.log($('#list_type_value').length)
	//获取列表
	function getApplyList(data) {
		var typeObj = $('#list_type_value').data();
		console.log(typeObj)
		if(typeObj.type == 0){
			var url =  $.baseUrl + '/Back/Index/shop_audit_list';
		}else {
			var url = $.baseUrl + '/Back/Index/rednet_audit_list';
		};
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
		console.log(data, 'setData data');
		if($('#list_type_value').data('type') == 0){
			$('#table thead th').eq(0).text("店铺名称");
		}else{
			$('#table thead th').eq(0).text("网红昵称");
		}
		if (data.profit_audit_list) {
			$('#tbody').empty();
			$.each(data.profit_audit_list, function (i, val) {
				console.log(i, val);
				var tr = $('<tr>').data('info', val);
				var td0 = $('<td>').text(val.shop_name);
				$('#list_type_value').data('type') == 0?(td0.text(val.shop_name)):(td0.text(val.name));
				var td1 = $('<td>').text(val.phone);
				var td2 = $('<td>').text(val.type);
				var td3 = $('<td>').text(val.account);
				var td4 = $('<td>').text(val.create_time);
				var td5 = $('<td>').text();
				var td6 = $('<td>').text(val.paied_money);
				// var a = Number(val.proportion) * 100 + "%"
				// var td7 = $('<td>').text(a);
				var td8 = $('<td>').text(val.unpaied_money);
				var td9 = $('<td>', {'class': 'operate'});
				var span1 = $('<button>', {class: 'btn btn-danger'}).text('驳回');
				var span2 = $('<button>', {class: 'btn btn-primary'}).text('确认');
				td9.append(span1).append(span2);
				tr.append(td0).append(td1).append(td2).append(td3).append(td4)
				.append(td5).append(td6).append(td8).append(td9);
				$('#tbody').append(tr);
			})
		} else {
			$('#tbody').empty().append('<tr><td colspan="9">暂无数据</td></tr>')
		}
	}

	$('#tbody').on('click', '.btn-primary', function () {
		var obj = $(this).parents('tr').data('info');
		var data = {
			id: obj.id,
			type: 1
		};
		var that = $(this);
		wxc.xcConfirm('是否确认退款', wxc.xcConfirm.typeEnum.confirm, {
			onOk: function () {
				apply(data, that);
			}
		})
	});
	$('#tbody').on('click', '.btn-danger', function () {
		var obj = $(this).parents('tr').data('info');
		var data = {
			id: obj.id,
			type: 2
		};
		var that = $(this);
		wxc.xcConfirm('是否驳回退款', wxc.xcConfirm.typeEnum.confirm, {
			onOk: function () {
				apply(data, that);
			}
		})
	});

	//提现和驳回
	function apply(data, el) {
		url = $('#list_type_value').data('type') == 0?($.baseUrl + '/Back/Index/shop_audit'):($.baseUrl + '/Back/Index/rednet_audit');
		$.ajax({
			url: url,
			type: 'post',
			dataType: $.dataType,
			data: data,
			success: function (res) {
				if (res.status == 1) {
					console.log(data)
					if (data.type == 1) {
						myAlert("确认成功");
						// el.removeClass('btn-primary').text('已确认').siblings().hide();
					} else {
						myAlert("驳回成功");
						// el.removeClass('btn-danger').text('已驳回').siblings().hide();
					}
					el.parents('tr').remove();
				} else if (res.status == 3) {
					toLogin()
				} else {
					myAlert("请求数据失败");
				}
			}
		})
	}

})