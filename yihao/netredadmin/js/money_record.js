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
	$('#chooseList').on('click', 'li a', function () {
		var type = $(this).data('type');
		console.log(type);
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

	//获取参数
	function getparams() {
		var data = {};
		var type = $('#chooseListValue').data('type');
		if ($('#shop_keyword').val()) {
			data.name = $('#shop_keyword').val();
		}
		console.log(type,'type')
		if (type > -1) {
			data.type = type;
		}
		data.start_time = $('#dropdownMenu1').val() + ' 00:00:00';
		data.end_time = $('#dropdownMenu2').val() + ' 23:59:59';
		return data;
	};
	$('#lise_type').on('click','a',function () {
		$('#list_type_value').val($(this).text()).data('type',$(this).data('type'));
		getApplyList(getparams());
	});
	//获取列表
	function getApplyList(data) {
		if($('#list_type_value').data('type') == 0){
			var url = $.baseUrl + '/Back/Index/shop_profit_audit_info'
		}else{
			var url = $.baseUrl + '/Back/Index/rednet_profit_audit_info'
		}
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
		$('#table thead tr').eq(0).show().siblings().hide();
		$('#shop_keyword').attr('placeholder','请输入店铺名称');
		if($('#list_type_value').data('type') == 0){
			if (data.audit_info) {
				$('#tbody').empty();
				$.each(data.audit_info, function (i, val) {
					console.log(i, val);
					var tr = $('<tr>').data('info', val);
					var td0 = $('<td>').text(val.shop_name);
					var td1 = $('<td>').text(val.phone);
					var td2 = $('<td>').text(val.type);
					var td3 = $('<td>').text(val.account);
					var td4 = $('<td>').text(val.paied_money);
					var td6 = $('<td>').text(val.unpaied_money);
					var txt = '';
					if(val.state == 1){
						txt = '已提现';
					}else {
						txt = "已驳回";
					}
					var td7 = $('<td>').text(txt);
					var td8 = $('<td>').text(val.audit_time);
					tr.append(td0).append(td1).append(td2).append(td3).append(td4)
					.append(td6).append(td7).append(td8);
					$('#tbody').append(tr);
				})
			} else {
				$('#tbody').empty().append('<tr><td colspan="8">暂无数据</td></tr>')
			}
		}else{
			$('#table thead tr').eq(1).show().siblings().hide();
			$('#shop_keyword').attr('placeholder','请输入网红昵称');
			if (data.profit_audit_list) {
				$('#tbody').empty();
				$.each(data.profit_audit_list, function (i, val) {
					console.log(i, val);
					var tr = $('<tr>').data('info', val);
					var td0 = $('<td>').text(val.name);
					var td1 = $('<td>').text(val.phone);
					var td2 = $('<td>').text(val.type);
					var td3 = $('<td>').text(val.account);
					var td4 = $('<td>').text(val.paied_money);
					var td6 = $('<td>').text(val.unpaied_money);
					var txt = '';
					if(val.state == 1){
						txt = '已提现';
					}else {
						txt = "已驳回";
					}
					var td7 = $('<td>').text(txt);
					var td8 = $('<td>').text(val.audit_time);
					tr.append(td0).append(td1).append(td2).append(td3).append(td4)
					.append(td6).append(td7).append(td8);
					$('#tbody').append(tr);
				})
			} else {
				$('#tbody').empty().append('<tr><td colspan="8">暂无数据</td></tr>')
			}
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
		$.ajax({
			url: $.baseUrl + '/TravelLive/index.php/Backadmin/Index/profit_audit',
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