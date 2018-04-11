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


	//收入详情和统计列表直接的切换
	function show(a) {
		if (a == 1) {
			$('#content').show()
			$('#get-detail').hide();
		} else if (a == 2) {
			$('#content').hide()
			$('#get-detail').show();
		}
	}

	//收入详情
	$('#table').on('click','.detail',function () {
        $('#tbody1').empty();
		show(2);
		var shop_id = $(this).data('shop_id');
		$('#get-detail').data('shop_id',shop_id);
		getApplyList1(getparams1())
	});
	//关闭详情
	$('#close').on('click', function () {
		show(1);
	})
	//选择方式
	//搜索关键字
	$('#searchKeyword').on('click', function () {
		getApplyList(getparams());
	});

	$('#shop_keyword').on('input propertychange', function () {
		if (this.value == "") {
			getApplyList(getparams());
		}
	});
	//获取参数
	function getparams() {
		var data = {};
		if ($('#shop_keyword').val()) {
			data.name = $('#shop_keyword').val();
		}
		return data;
	};

	//获取列表
	function getApplyList(data) {
		$.ajax({
			url: $.baseUrl + '/Back/Index/finance_info',
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
					$('#pager').empty();
					$('#pager').createPage({
						pageCount: res.data.pageCount,
						current: page_num,
						backFn: function (e) {
							var para = getparams();
							para.page_num = e;
							getApplyList(para);
						}
					});
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
		$('#tbody').empty();
		if (data.finance_info) {
			$.each(data.finance_info, function (i, val) {
				var tr = $('<tr>').data('info', val);
				var td0 = $('<td>').text(val.shop_name);
				var td1 = $('<td>').text(val.admin_name);
				var td2 = $('<td>').text(val.admin_phone);
				var td3 = $('<td>').text(val.sum_money);
				var td4 = $('<td>').text(val.money);
				var td5 = $('<td>').text(val.paied_money);
				var td6 = $('<td>').text(val.unpaied_money);
				var span = $('<span>',{class:"detail btn explain"}).data("shop_id",val.shop_id).text('收入详情');
				td6.append(span);
				if (val.state == 1) {
					txt = '已提现';
				} else {
					txt = "已驳回";
				}
				tr.append(td0).append(td1).append(td2).append(td3).append(td4)
				.append(td5).append(td6);
				$('#tbody').append(tr);
			})
		} else {
			$('#tbody').empty().append('<tr><td colspan="7">暂无数据</td></tr>');
		}
	}
	/*------------------------------------------------- ----收入详情---------------------------------------------*/

	$('#chooseList1').on('click', 'li a', function () {
		var type = $(this).data('type');
		console.log(type);
		$('#chooseListValue1').data('type', type).val($(this).text());
		getApplyList1(getparams1());
	});
	//搜索关键字
	$('#searchKeyword1').on('click', function () {
		getApplyList1(getparams1());
	});
	$('#shop_keyword1').on('input propertychange', function () {
		if (this.value == "") {
			getApplyList1(getparams1());
		}
	});
	//搜索日期
	$('#search_date1').on('click', function () {
		getApplyList1(getparams1());
	});
	//获取参数
	function getparams1() {
		var data = {};
		var type = $('#chooseListValue1').data('type');
		if ($('#shop_keyword1').val()) {
			data.name = $('#shop_keyword1').val();
		}
		var shop_id = $('#get-detail').data('shop_id');
		data.shop_id = shop_id;
		if (type > -1) {
			data.type = type;
		}
		data.start_time = $('#dropdownMenu1').val() + ' 00:00:00';
		data.end_time = $('#dropdownMenu2').val() + ' 23:59:59';
		console.log(data,'paras1');
		return data;
	};
	//获取列表
	function getApplyList1(data) {
		$.ajax({
			url: $.baseUrl + '/Back/Index/income_details',
			type: 'POST',
			data: data,
			dataType: $.dataType,
			success: function (res) {
				if (res.status == 1) {
					setData1(res.data);
					var page_num;
					if (data.page_num) {
						page_num = data.page_num;
					} else {
						page_num = 1;
					}
					$('#pager1').empty();
					$('#pager1').createPage({
						pageCount: res.data.pageCount,
						current: page_num,
						backFn: function (e) {
							var para = getparams1();
							para.page_num = e;
							getApplyList1(para);
						}
					});
				} else if (res.status == 3) {
					toLogin();
				} else {
					myAlert('操作数据失败');
				}
			}
		})
	}
	//设置信息
	function setData1(data) {
		console.log(data, 'setData data');
		if (data.income_details) {
			$('#tbody1').empty();
			$.each(data.income_details, function (i, val) {
				console.log(val)
				var tr = $('<tr>').data('info', val);
				var td0 = $('<td>').text(val.tpoa_id);
				var td1 = $('<td>').text(val.product_name);
				var td2 = $('<td>').text(val.name);
				var td3 = $('<td>').text(val.number);
				var td4 = $('<td>').text(val.price);
				//增加邮费
				var td7 = $('<td>').text(val.postage);
				var td5 = $('<td>').text(val.created_at);
				var txt = ""
				switch (Number(val.state)){
					case 1:txt = "待发货"
						break;
					case 2:txt = "已发货";
						break;
					case 3:txt = "已完成"
						break;
					case 4:txt = "退款中"
					break;
					case 5:txt = "已退款"
						break;
					case 6:txt = "待消费"
						break;
					case 7:txt = "退款驳回"
						break;
				}
				var td6 = $('<td>').text(txt);
				if (val.state == 1) {
					txt = '已提现';
				} else {
					txt = "已驳回";
				}
				tr.append(td0).append(td1).append(td2).append(td3).append(td4).append(td7)
				.append(td5).append(td6);
				$('#tbody1').append(tr);
			})
		} else {
			$('#tbody1').empty().append('<tr><td colspan="8">暂无数据</td></tr>');
		}
	}
});
