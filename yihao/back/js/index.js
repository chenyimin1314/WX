$(function () {
	$('#search_list').click(function () {
		getshoplist(1,$('#keyword_list').val())
	});
	$('#keyword_list').on('input porpertychange',function () {
		if(this.value == ""){
			getshoplist(1)
		}
	});
	function getshoplist(num, name) {
		var data = {};
		if (num) data.page_num = num;
		if (name) data.name = name;
		$.ajax({
			type: "post",
			url: $.baseUrl + "/Backuser/User/product_list",
			data: data,
			dataType: $.dataType,
			success: function (res) {
				if (res.status == 1) {
					setData(res.data);
					if ($("#pager").length >= 1) {
						if (name) {
							var el = $('#pager').parent();
							$('#pager').remove();
							var pager = $('<div>',{"id":"pager","class":"tcdPageCode"});
							pager.createPage({
								pageCount: res.data.pageCount,
								current: num ? num : 1,
								backFn: function (e) {
									getshoplist(e, $("#keyword").val());
								}
							})
							el.append(pager);
						} else {
							var el = $('#pager').parent();
							$('#pager').remove();
							var pager = $('<div>',{"id":"pager","class":"tcdPageCode"});
							pager.createPage({
								pageCount: res.data.pageCount,
								current: num ? num : 1,
								backFn: function (e) {
									getshoplist(e);
								}
							})
							el.append(pager);
						}
					}
				} else if (res.status == 3) {
					toLogin();
				} else {
					console.log(res);
				}
			}
		});
	}
	function setData(data) {
		$('#tbody').empty();
		if(!data.product_list){
			var tr = $('<tr/>');
			var td = $('<td>',{colspan:10}).text("暂无数据");
			tr.append(td);
			$('#tbody').empty().append(tr);

			return;
		}
		$.each(data.product_list, function (i, val) {
			var tr = $('<tr/>').data('info', JSON.stringify(val));
			var td0 = $('<td>', {
				class: 'name'
			}).text(val.name)
			var td1 = $('<td>', {
				class: 'id'
			}).text(val.product_id);
			var td2 = $('<td>', {
				class: 'type'
			}).text(val.type_name);
			var td3 = $('<td>', {
				class: 'price'
			}).text(val.price);
			var td4 = $('<td>', {
				class: 'inventory'
			}).text(val.number);
			var td5 = $('<td>', {
				class: 'total'
			}).text(val.sales_volume);
			var td6 = $('<td>', {
				class: 'release-time'
			}).text(val.created_at);
			var td7 = $('<td>', {
				class: 'on-sale'
			});
			var td8 = $('<td>', {
				class: 'recommend'
			}).text(val.sum_rsement)
			var td9 = $('<td>', {
				class: 'operate'
			});
			//是否是推荐商品
			if (val.is_rsement) {
				var btn3 = $('<span>', {
					class: "btn btn-danger drop"
				}).text('代言关闭').data('is_rsement', val.is_rsement);
				td7.text("代言开启");
			} else {
				var btn3 = $('<span>', {
					class: "btn btn-default putaway"
				}).text('代言开启').data('is_rsement', val.is_rsement)
				td7.text("代言关闭");
			}
			var btn1 = $('<span>', {
				class: "btn detail"
			}).text('代言详情');
			td9.append(btn1).append(btn3)
			tr.append(td0).append(td1).append(td2).append(td3).append(td4).append(td5).append(td6)
			.append(td7).append(td8).append(td9);
			$('#tbody').append(tr);
		});
	}
	getshoplist();
	$('.back').click(function () {
		show(1);
	});
	//开启关闭代言
	$('#tbody').on('click', '.drop,.putaway', function () {
		var that = $(this);
		var is_rsement = $(this).data('is_rsement');
		if (is_rsement == 1) {
			txt = "是否关闭代言"
		} else {
			txt = "是否开启代言"
		}
		var obj = JSON.parse($(this).parents('tr').data('info'));
		var product_id = obj.product_id;
		var data = {
			product_id: product_id
		};
		if (is_rsement == 0) {
			data.type = 1;
		} else {
			data.type = 2;
		}
		window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm, {
			onOk: function () {
				$.ajax({
					type: "post",
					url: $.baseUrl + "/Backuser/User/open_product",
					dataType: $.dataType,
					data: data,
					success: function (res) {
						flag = true;
						if (res.status == 1) {
							if (is_rsement == 0) {
								that.parents('tr').children('td').eq(7).text('代言开启');
								that.text('代言关闭').removeClass('putaway btn-default').addClass('drop btn-danger').data('is_rsement', 1)
								myAlert("代言开启成功");
							} else {
								that.parents('tr').children('td').eq(7).text('代言关闭');
								that.text('代言开启').removeClass('danger btn-danger').addClass('putaway  btn-default').data('is_rsement', 0);
								myAlert("代言关闭成功");
							}
						}
					}
				});
			}
		});
	});
	//代言详情
	$('#tbody').on('click','.detail',function () {
		show(0);
		var obj = JSON.parse($(this).parents('tr').data('info'));
		console.log(obj)
		$('#tbody').data('product_id',obj.product_id);
		var data = {
			product_id:obj.product_id,
		};
		getlist(data);
	});
	function getlist(data) {
		console.log(data)
		ajax($.baseUrl + '/Backuser/User/rednet_product',data,function (res) {
			setNetData(res.data.rednet_list);
		});
	}
	//设置网红列表
	function setNetData(data) {
		$('#tbody1').empty();
		console.log(data);
		if(data && data.length > 0 ){
			$.each(data,function (i,v) {
				var tr = $('<tr/>').data('info', JSON.stringify(v));
				var td0 = $('<td>');
				var img = $('<img>',{class:'header_net',src:v.head_image_url});
				td0.append(img);
				var td1 = $('<td>').text(v.name);
				var td3 = $('<td>').text(v.start_time?v.start_time:'无');
				var td4 = $('<td>').text(v.end_time?v.end_time:'无');
				var td5 = $('<td>').text(v.user_id?v.user_id:'无');
				tr.append(td0).append(td1).append(td3).append(td4).append(td5)
				$('#tbody1').append(tr);
			});

		}else{
			var tr = "<tr><td colspan='5'>暂无数据</td></tr>"
			$('#tbody1').append(tr);
		}
	};
	/*显示隐藏状态*/
	function show(e) {
		if(e == 1){
			$('#shop_list').show().siblings().hide();
		}else if(e == 0){
			$('#netList').show().siblings().hide();
		}
	}
});