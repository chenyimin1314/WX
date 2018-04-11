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


	//获取统计列表
	function getshoplist(params) {
		$.ajax({
			type: "post",
			url: $.baseUrl + "/Backuser/User/sale_stati",
			data: params,
			dataType: $.dataType,
			success: function (res) {
				console.log(res);
				if (res.status == 1) {
					setData(res.data);
					if ($("#pager").length >= 1) {
						$("#pager").empty();
						page_num = params.page_num ? params.page_num : 1;
						var el = $('#pager').parent();
						var pager = $('<div>',{"id":"pager","class":"tcdPageCode"});
						pager.createPage({
							pageCount: res.data.pageCount,
							current: page_num,
							backFn: function (e) {
								var mparams = getListPara();
								mparams.page_num = e;
								getshoplist(mparams);
							}
						})
						el.append(pager);
					}
				} else if (res.status == 3) {
					toLogin();
				} else {
					console.log(res);
				}
			}
		});
	}

	getshoplist(getListPara());

	//设置统计列表
	function setData(data) {
		if (data.sale_list == null) {
			$("#tbody").empty().append('<tr><td colspan="6">未查询到数据</td></tr>');
			return ;
		}
		$('#tbody').empty();
		$.each(data.sale_list, function (i, val) {
			var tr = $('<tr/>').data('info', JSON.stringify(val));
			var td0 = $('<td>', {
				class: 'name'
			}).text(val.name)
			var td1 = $('<td>', {
				class: 'id'
			}).text(val.product_id);
			var td2 = $('<td>', {
				class: 'time'
			}).text(val.created_at);
			var txt3 = val.pro_type ? "销售中" : "已下架";
			var td3 = $('<td>', {
				class: 'status'
			}).text(txt3);
			// var td4 = $('<td>', {
			// 	class: 'collect'
			// }).text(val.collection_num);
			// var td5 = $('<td>', {
			// 	class: 'transpond'
			// }).text(val.forward_num);
			var td6 = $('<td>', {
				class: 'total'
			}).text(val.sales_volume);
			var td7 = $('<td>', {
				class: 'total_price'
			}).text(val.sales_money);
			var td8 = $('<td>', {
				class: 'operate'
			});
			// var span = $('<span>', {class: "btn btn-detail"}).text('详情').data('product_id', val.product_id);
			// td8.append(span);
			tr.append(td0).append(td1).append(td2).append(td3).append(td6)
			.append(td7)
			// .append(td8);
			$('#tbody').append(tr);
		});
	}

	function show(e) {
		if (e) {
			$('#statistics').hide();
			$('#statistics_detail').show();
		} else {
			$('#statistics').show();
			$('#statistics_detail').hide();
		}
	}

	$('#close').on('click', function () {
		show();
	});

	//获取参数
	function getListPara() {
		var obj = {};
		if ($('#keyword_list').val()) obj.product_name = $('#keyword_list').val();
		if ($('#dropdownMenu1').val()) obj.start_time = $('#dropdownMenu1').val() + ' 00:00:00';
		if ($('#dropdownMenu2').val()) obj.end_time = $('#dropdownMenu2').val() + ' 23:59:59';
		var pro_type = $('#list_type_value').data('pro_type');
		console.log(pro_type);
		if (pro_type > -1) obj.pro_type = pro_type;
		console.log(obj, 'obj')
		return obj;
	}

	//三个筛选查询按钮
	//选择销售中
	$('#list_type').on('click', 'li a', function () {
		var pro_type = $(this).data('pro_type');
		$('#list_type_value').val($(this).text()).data('pro_type', pro_type);
		getshoplist(getListPara());
	});
	//商品名称查询
	$('#search_list').on('click', function () {
		getshoplist(getListPara());
	});
	//日期查询
	$('#search_list_date').on('click', function () {
		getshoplist(getListPara());
	});
	//回退搜索关键字
	$('#keyword_list').on('input propertychange', function () {
		if (this.value == "") {
			getshoplist(getListPara());
		}
	});
	//点击详情按钮
	$('#tbody').on('click', '.btn-detail', function () {
		var product_id = $(this).data('product_id');
		console.log(product_id, "product_id");
		show(1);
		$('#statistics_detail').data('product_id', product_id);
		getshop_detail(getDetailPara());
	});


	/*---------------------------------------下面為商品詳情的部分----------------------------------------------------*/
	function getDetailPara() {
		var obj = {};
		obj.product_id = $('#statistics_detail').data('product_id');
		if ($('#keyword_detail').val()) obj.product_name = $('#keyword_detail').val();
		if ($('#dropdownMenu3').val()) obj.start_time = $('#dropdownMenu3').val() + ' 00:00:00';
		if ($('#dropdownMenu4').val()) obj.end_time = $('#dropdownMenu4').val() + ' 23:59:59';
		var type = $('#search_detail_value').data('type');
		console.log(type);
		if (type != -1) obj.type = type;
		console.log(obj, 'obj');
		return obj;
	}

	//按订单状态查询
	$('#search_detail_type').on('click', 'li a', function () {
		var type = $(this).data('type');
		$('#search_detail_value').val($(this).text()).data('type', type);
		getshop_detail(getDetailPara());
	});

	//获取统计列表
	function getshop_detail(params) {
		$.ajax({
			type: "post",
			url: $.baseUrl + "/TravelLive/index.php/Backuser/Index/sale_stati_des",
			data: params,
			dataType: $.dataType,
			success: function (res) {
				console.log(res);
				if (res.status == 1) {
					setData_detail(res.data);
					if ($("#pager").length >= 1) {

						var el = $("#pager1").parent();
						var pager = $('<div>',{"id":"pager1","class":"tcdPageCode"});
						var currentPage = params.page_num?params.page_num:1;
						pager.createPage({
							pageCount: res.data.pageCount,
							current: currentPage,
							backFn: function (e) {
								var mpara = getDetailPara();
								mpara.page_num = e;
								getshoplist(mpara);
							}
						});
						el.append(pager);
					}
				} else if (res.status == 3) {
					toLogin();
				} else {
					console.log(res);
				}
			}
		});
	}
	//设置统计列表
	function setData_detail(data) {
		console.log(data, 'resdata')
		if (!data.sale_des_list) {
			return $("#tbody1").empty().append('<tr><td colspan="6">暂无数据</td></tr>');
		}
		$('#tbody1').empty();
		$.each(data.sale_des_list, function (i, val) {
			var tr = $('<tr/>').data('info', JSON.stringify(val));
			var td0 = $('<td>', {
				class: 'id'
			}).text(val.order_id)
			var td1 = $('<td>', {
				class: 'user_name'
			}).text(val.user_name);
			var td2 = $('<td>', {
				class: 'created_at'
			}).text(val.created_at);
			var td3 = $('<td>', {
				class: 'number'
			}).text(val.number);
			var td4 = $('<td>', {
				class: 'price'
			}).text(val.price);
			var txt = '';
			switch (Number(val.state)) {
				case 1:
					txt = "待发货";
					break;
				case 2:
					txt = "已发货";
					break;
				case 3:
					txt = "已完成";
					break;
				case 4:
					txt = "退款中";
					break;
				case 5:
					txt = "已退款";
					break;
				case 6:
					txt = "待消费";
					break;
				case 7:
					txt = "退款驳回";
					break;
			}
			var td5 = $('<td>', {
				class: 'state'
			}).text(txt);
			tr.append(td0).append(td1).append(td2).append(td3).append(td4).append(td5);
			$('#tbody1').append(tr);
		});
	}
})