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
		search_keyword = $("#content .tab-pane").eq(index).find('.search_keyword').val();
		if (search_keyword) {
			obj.order_id = search_keyword;
		}
		return obj;
	};

	function getDate(data, index) {
		console.log(data,index)
		$.ajax({
			url: $.baseUrl + '/Backuser/User/order_list',
			dataType: $.dataType,
			type: 'post',
			data: data,
			success: function (res) {
				if (res.status == 1) {
					setList(res.data, index);
					var el = $('#pager' + index);
					var parent = el.parent();
					var id = el.attr('id');
					var pager = $('<div>',{"id":id,"class":"tcdPageCode"});
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
		index = parseInt(index);
		var el = $('#tbody' + index);
		if (!data.order_list) {
			var a = $('#table' + index + ' tr:eq(0) th').size();
			el.empty();
			el.append('<tr><td colspan="' + a + '">暂无数据</td></tr>');
			return
		}
		switch (index) {
			case 0:
				el.empty();
				$.each(data.order_list, function (i, val) {
					var tr = $('<tr>').data('info', JSON.stringify(val));
					var td0 = $('<td>').text(val.order_id);
					var td1 = $('<td>').text(val.price);
					var td2 = $('<td>').text(val.sum_num);
					var td3 = $('<td>').text(val.user_name);
					var td4 = $('<td>').text(val.price);
					var td5 = $('<td>').text(val.created_at);
					var td6 = $('<td>');
					var span = $('<span>', {class: 'btn detail'}).text('订单详情').data('order_id', val.order_id);
					td6.append(span);
					tr.append(td0).append(td1).append(td2).append(td3).append(td4).append(td5).append(td6);
					el.append(tr);
				});
				break;
			case 1:
				el.empty();
				$.each(data.order_list, function (i, val) {
					var tr = $('<tr>').data('info', JSON.stringify(val));
					var td0 = $('<td>').text(val.order_id);
					var td1 = $('<td>').text(val.price);
					var td2 = $('<td>').text(val.sum_num);
					var td3 = $('<td>').text(val.user_name);
					var td4 = $('<td>').text(val.price);
					var td5 = $('<td>');
					var span = $('<span>', {class: 'btn detail'}).text('订单详情').data('order_id', val.order_id);
					td5.append(span);
					var td6 = $('<td>', {class: 'operate'});
					var span1 = $('<span>', {class: 'btn confirm'}).text('确认发货').data('order_id', val.order_id);
					td6.append(span1);
					tr.append(td0).append(td1).append(td2).append(td3).append(td4).append(td5).append(td6);
					el.append(tr);
				});
				break;
			case 3:
				el.empty();
				$.each(data.order_list, function (i, val) {
					var tr = $('<tr>').data('info', JSON.stringify(val));
					var td0 = $('<td>').text(val.order_id);
					var td1 = $('<td>').text(val.price);
					var td2 = $('<td>').text(val.sum_num);
					var td3 = $('<td>').text(val.user_name);
					// var td4 = $('<td>').text(val.phone);
					// var td5 = $('<td>').text(val.content)
					var td7 = $('<td>').text(val.price);
					var td8 = $('<td>');
					var span = $('<span>', {class: 'btn detail'}).text('订单详情').data('order_id', val.order_id);
					td8.append(span);
					var td9 = $('<td>', {class: 'operate'});
					if(val.state == 4){
                        var span1 = $('<span>', {class: 'btn danger'}).text('驳回').data('order_id', val.order_id);
                        var span2 = $('<span>', {class: 'btn confirm'}).text('同意退款').data('order_id', val.order_id);
                        td9.append(span1).append(span2);
					}else if(val.state == 5){
                        var span2 = $('<span>', {class: 'btn conpelete'}).text('已退款').data('order_id', val.order_id);
                        td9.append(span2);
					}else if(val.state == 7){
                        var span2 = $('<span>', {class: 'btn conpelete'}).text('已驳回').data('order_id', val.order_id);
                        td9.append(span2);
					}
					//.append(td4).append(td5).append(td9);
					tr.append(td0).append(td1).append(td2).append(td3).append(td7).append(td8)
					el.append(tr);
				});
				break;
			default:
				el.empty();
				$.each(data.order_list, function (i, val) {
					var tr = $('<tr>').data('info', JSON.stringify(val));
					var td0 = $('<td>').text(val.order_id);
					var td1 = $('<td>').text(val.price);
					var td2 = $('<td>').text(val.sum_num);
					var td3 = $('<td>').text(val.user_name);
					var td4 = $('<td>').text(val.price);
					var td6 = $('<td>');
					var span = $('<span>', {class: 'btn detail'}).text('订单详情').data('order_id', val.order_id);
					td6.append(span);
					tr.append(td0).append(td1).append(td2).append(td3).append(td4).append(td6);
					el.append(tr);
				});
				break;
		}
	}

	//待发货
	function sendgoods(data) {
		$.ajax({
			url: $.baseUrl + '/Backuser/User/deliver_goods',
			dataType: $.dataType,
			type: "post",
			data: data,
			success: function (res) {
				if (res.status == 1) {
					$('.popver').hide();
					myAlert('发货成功');
					getDate(getparams(1), 1);
				} else if (res == 3) {
					toLogin();
				} else {
					console.log('error send goods', res);
					myAlert('发货失败');
				}
			}
		})
	}

	$('#wait-send').on('click', 'tr .confirm', function () {
		$('#wait-send').data('order_id', $(this).data('order_id'));
		$('.popver').show();
	});
	$('.popver .confirm').on('click', function () {
		var company = $('#inputEmail3').val() ? $('#inputEmail3').val() : $('#companyButton').text();
		var number = $('#inputPassword3').val();
		var order_id = $('#wait-send').data('order_id');
		if (company == '') {
			return myAlert('请选择物流公司');
		} else if (number == '') {
			return myAlert('请输入物流编号');
		}
		var msg = {
			company: company,
			order_number: number,
			order_id: order_id
		};
		sendgoods(msg);
		/*发货*/
		clearMsg();
	});
	//取消发送
	$('.popver .cancel').on('click', function () {
		$('.popver').hide();
		clearMsg();
	});
	$('#content').on('click', '.search_button', function () {
		var index = $(this).parents('.tab-pane').index();
		var type = $('.nav-tabs li').eq(index).children('a').data('type');
		var data = null;
		getDate(getparams(index), index);
	});
	$('#content').on('input propertychange', '.search_keyword', function () {
		if (this.value == "") {
			var index = $(this).parents('.tab-pane').index();
			var type = $('.nav-tabs li').eq(index).children('a').data('type');
			var data = null;
			if (index == 3) {
				var index1 = $(this).parents('.refund').index();
				//搜索卡券退款
				if (index1 == 1) {
					getCardList(getCardpara());
				} else if (index1 == 2) {
					getDate(getparams(index), index);
				}
			} else {
				getDate(getparams(index), index);
			}
		}
	});
	//已发货
	$('#pager2').createPage({
		pageCount: 1,
		current: 1,
		backFn: function (e) {
			this.current = e;
			this.pageCount = 10;
		}
	});
	//退款
	//显示已执行退款操作
	function showOperate(el,type) {
		if(type == 1){
			el.parent().enpty().append($('<span>',{class:"btn btn-compelete"}).text('已退款'));
		}else{
            el.parent().enpty().append($('<span>',{class:"btn btn-compelete"}).text('已驳回'));
		}
    }
	/*商品退款*/
	$('#tbody3').on('click', '.danger', function () {
		var order_id = $(this).data('order_id');
		wxc.xcConfirm('是否驳回退款', wxc.xcConfirm.typeEnum.confirm, {
			onOk: function () {
				refund({order_id: order_id, type: 2});
			}
		});
	});
	$('#tbody3').on('click', '.confirm', function () {
		var order_id = $(this).data('order_id');
		wxc.xcConfirm('是同意退款', wxc.xcConfirm.typeEnum.confirm, {
			onOk: function () {
				refund({order_id: order_id, type: 1});
			}
		});
	});

	function refund(data) {
		$.ajax({
			url: $.baseUrl + '/Backuser/Index/order_refund',
			type: 'post',
			dataType: $.dataType,
			data: data,
			success: function (res) {
				if (res.status == 1) {
					if (data.type == 1) {
                        showOperate(1);
						myAlert('已同意退款');
					} else if (data.type == 2) {
                        showOperate();
						myAlert('已驳回退款');
					}
				} else if (status == 3) {
					toLogin()
				} else {
					myAlert('操作失败');
				}
			}
		})
	}
	/*卡券退款*/
	$('#tbody6').on('click', '.danger', function () {
		var voucher_id = $(this).data('voucher_id');
		wxc.xcConfirm('是否驳回退款', wxc.xcConfirm.typeEnum.confirm, {
			onOk: function () {
				refund1({voucher_id: voucher_id, type: 2});
			}
		});
	});
	$('#tbody6').on('click', '.confirm', function () {
		var voucher_id = $(this).data('voucher_id');
		wxc.xcConfirm('是同意退款', wxc.xcConfirm.typeEnum.confirm, {
			onOk: function () {
				refund1({voucher_id: voucher_id, type: 1});
			}
		});
	});

	function refund1(data) {
		$.ajax({
			url: $.baseUrl + '/Backuser/Index/order_refund_voucher',
			type: 'post',
			dataType: $.dataType,
			data: data,
			success: function (res) {
				if (res.status == 1) {
					if (data.type == 1) {
						myAlert('已同意退款');
						showOperate(1)
					} else if (data.type == 2) {
                        showOperate();
                        myAlert('已驳回退款');
					}
				} else if (status == 3) {
					toLogin()
				} else {
                    myAlert('操作失败');
				}
			}
		})
	}

	//卡券和web切换
	$('.droplist>select').on('input propertychange', function () {
		if (this.value == '卡券退款') {
			$('#card').show();
			$('#shop').hide();
		} else {
			$('#card').hide();
			$('#shop').show();
		}
	});

	function getCardList(data) {
		$.ajax({
			url: $.baseUrl + '/Backuser/Index/refund_voucher',
			dataType: $.dataType,
			type: 'post',
			data: data,
			success: function (res) {
				if (res.status == 1) {
					setList(res.data);
					var el = $('#pager6');
					var parent = el.parent();
					var pager = $('<div>',{"id":"pager6","class":"tcdPageCode"});
					setcardList(res.data);
					el.remove();
					var page_num = data.page_num ? data.page_num : 1;
					pager.createPage({
						pageCount: res.data.pageCount,
						current: page_num,
						backFn: function (e) {
							var mparams = getCardpara();
							mparams.page_num = e;
							getCardList(mparams, index);
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

	// getCardList(getCardpara())

	function getCardpara() {
		var obj = {};
		var keyword = $('#card .form-control search_keyword').val();
		if (keyword) {
			obj.voucher_id = keyword;
		}
		return obj;
	}

	function setcardList(data) {
		var el = $('#tbody6');
		if (!data.refund_voucher_list) {
			var a = $('#table6 tr:eq(0) th').size();
			el.empty();
			el.append('<tr><td colspan="' + a + '">暂无数据</td></tr>');
			return
		}
		el.empty();
		$.each(data.refund_voucher_list, function (i, val) {
			var tr = $('<tr>').data('info', JSON.stringify(val));
			var td0 = $('<td>').text(val.voucher_id);
			var td1 = $('<td>').text(val.price);
			var td2 = $('<td>').text(val.num);
			var td3 = $('<td>').text(val.user_name);
			var td4 = $('<td>').text(val.phone);
			var td5 = $('<td>').text(val.content)
			var td7 = $('<td>').text(val.price);
			var td8 = $('<td>');
			var td8 = $('<td>', {class: 'operate'});
			if(val.state == 3){
                var span1 = $('<span>', {class: 'btn danger'}).text('驳回').data('voucher_id', val.voucher_id);
                var span2 = $('<span>', {class: 'btn confirm'}).text('同意退款').data('voucher_id', val.voucher_id);
                td8.append(span1).append(span2);
			}else if(val.state ==4){
                var span2 = $('<span>', {class: 'btn compelete'}).text('已退款').data('voucher_id', val.voucher_id);
                td8.append(span2);
			}else if(val.state == 5){
                var span2 = $('<span>', {class: 'btn compelete'}).text('已驳回').data('voucher_id', val.voucher_id);
                td8.append(span2);
			}
			tr.append(td0).append(td1).append(td2).append(td3).append(td4).append(td5).append(td7).append(td8);
			el.append(tr);
		});
	}

	//成功的订单
	//关闭的订单
	function clearMsg() {
		$('#companyButton').text('');
		$('#inputEmail3').val("");
		$('#inputPassword3').val("");
	}

	$('#company').on('click', 'li', function () {
		var txt = $(this).text();
		if (txt == "其他快递") {
			$('#other-company').show();
		} else {
			$('#other-company').hide();
		}
		$('#companyButton').text(txt);
	})
	//从订单详情返回页面
	$('#back').on('click', function () {
		$('#detail').hide();
		$('#content').show();
	});
	/*--------------------------------------订单详情--------------------------------------------*/
	//点击查看订单详情
	$('.tab-content').off('click').on('click', '.detail', function () {
		$('#content').hide();
		$('.iconArr').empty();
		$('#detail').show();
		var index = $(this).parents('.tab-pane').index();
		var order_id = $(this).data('order_id');
		var data = {
			'order_id': order_id
		};
		$.ajax({
			url: $.baseUrl + '/Backuser/User/order_des',
			dataType: $.dataType,
			type: 'post',
			data: data,
			success: function (res) {
				if (res.status == 1) {
					setDetailInfo(res.data, index);
				}
			}
		})
	});

	function setDetailInfo(data, index) {
		index = parseInt(index);
		var n = data.order_des;
		var src = '../img/icon-active-center.png';
		var src1 = '../img/icon-active-end.png';
		var div = $('<div>', {'class': 'last'});
		var title = $('<div>', {'class': 'title'});
		var img = $('<img>', {'class':'img','src': '../img/icon-active-end.png'});
		var time = $('<div>', {'class': 'time'});
		n.created_at = n.created_at?n.created_at:"";
		n.pay_at = n.pay_at?n.pay_at:"";
		n.send_at = n.send_at?n.send_at:"";
		n.Receive_at = n.Receive_at?n.Receive_at:"";
		switch (index) {
			case 0:
				title.text('拍下商品')
				time.text(n.created_at);
				div.append(title).append(title).append(img).append(time);
				$('.iconArr').prepend(div);
				break;
			case 1:
                title.text('拍下商品');
                img.attr('src',src);
                time.text(n.created_at);
                div.append(title).append(img).append(time).removeClass('last');
                $('.iconArr').prepend(div);
                var div1 = div.clone(true);
                div1.addClass('last');
                div1.children('.title').text('款到账');
                div1.children('.time').text(n.pay_at);
                div1.children('.img').attr("src",src1);
                $('.iconArr').append(div1);
				break;
			case 2:
				title.text('拍下商品');
				img.attr('src',src);
				time.text(n.created_at);
				div.append(title).append(img).append(time).removeClass('last');
				$('.iconArr').prepend(div);
				var div1 = div.clone(true);
				div1.children('.title').text('款到账');
				div1.children('.time').text(n.pay_at);
				div1.children('.img').attr("src",src);
				div1.removeClass('last')
				$('.iconArr').append(div1);
                var div2 = div.clone(true);
                div2.addClass('last');
                div2.children('.title').text('已发货');
                div2.children('.time').text(n.send_at);
                div2.children('.img').attr("src",src1);
                $('.iconArr').append(div2);
				break;
			case 3:
                title.text('拍下商品');
                img.attr('src',src);
                time.text(n.created_at);
                div.append(title).append(img).append(time).removeClass('last');
                $('.iconArr').prepend(div);
                var div1 = div.clone(true);
                div1.children('.title').text('款到账');
                div1.children('.time').text(n.pay_at);
                div1.children('.img').attr("src",src);
                div1.removeClass('last');
                $('.iconArr').append(div1);
                var div3 = div.clone(true);
                div3.children('.title').text('已发货');
                div3.children('.time').text(n.send_at);
                div3.children('.img').attr("src",src);
                div3.removeClass('last');
                $('.iconArr').append(div3);
                var div4 = div.clone(true);
                div4.addClass('last');
                div4.children('.title').text('已收货');
                div4.children('.time').text(n.Receive_at);
                div4.children('.img').attr("src",src1);
                div4.removeClass('div4');
                $('.iconArr').append(div4);
				break;
			// case 4:
			// 	break;
			case 5:
				title.text('拍下商品');
				time.text(n.created_at);
				div.append(title).append(title).append(img).append(time);
				$('.iconArr').prepend(div);
				break;
				break;
			default:
                title.text('拍下商品');
                img.attr('src',src);
                time.text(n.created_at);
                div.append(title).append(img).append(time).removeClass('last');
                $('.iconArr').prepend(div);
                var div1 = div.clone(true);
                div1.children('.title').text('款到账');
                div1.children('.time').text(n.pay_at);
                div1.children('.img').attr("src",src);
                div1.removeClass('last');
                $('.iconArr').append(div1);
                var div3 = div.clone(true);
                div3.children('.title').text('已发货');
                div3.children('.time').text(n.send_at);
                div3.children('.img').attr("src",src);
                div3.removeClass('last');
                $('.iconArr').append(div3);
                var div4 = div.clone(true);
                div4.addClass('last');
                div4.children('.title').text('已收货');
                div4.children('.time').text(n.Receive_at);
                div4.children('.img').attr("src",src1);
                div4.removeClass('div4');
                $('.iconArr').append(div4);
                break;
		}
		setDetail(n);
	}

	function setDetail(d) {
		if (typeof d == 'object') {
			$('.order_message .order_id').text(d.id);
			$('.order_message .order_address').text(d.address.replace('-',""));
			$('.order_message .order_contact').text(d.contacts_name);
			$('.order_message .order_phone').text(d.phone);
			if (d.company){
				$('.order_message .order_company').text(d.company).parent().show();
			}else{
				$('.order_message .order_company').parent().hide();
			}
			if (d.order_number) {
				$('.order_message .Logistics_number').text(d.order_number).parent().show();
			}else {
				$('.order_message .Logistics_number').parent().hide();
			}
			$('.order_message .Logistics_number').text(d.order_number);
			$('.order_message .store_name').text(d.shop_name);
			$('#detail_body').empty();
			$.each(d.product, function (i, val) {
				var tr = $('<tr>');
				var td0 = $('<td>').text(val.product_name);
				var td1 = $('<td>').text(val.number);
				var td2 = $('<td>').text(val.price);
				var td3 = $('<td>').text(val.rednet_name?"来源于" + val.rednet_name:"来源于商家");
				tr.append(td0).append(td1).append(td2).append(td3);
				$('#detail_body').append(tr);
			})
		}
	}
})