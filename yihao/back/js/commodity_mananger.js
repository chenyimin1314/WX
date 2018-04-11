$(function () {
	//添加和编辑商品部分
	var state,type_id;
	//显示隐藏编辑器
	function showEdit(e) {
		if (e == 1) {
			$('#edit_detail').show();
			$('#list').hide();
			$('#netList').hide();
		}else if(e == 2){
			$('#edit_detail').hide();
			$('#list').hide();
			$('#netList').show();
		} else {
			$('#edit_detail').hide()
			$('#netList').hide();
			$('#list').show();
		}
	}
	//查看详情禁用输入，编辑启用输入
	function setDisable(e) {
		if (e) {
			$('#edit_detail h1 span').text('商品详情');
			$('#edit_detail input').each(function () {
				$(this).prop('disabled',true);
			});
			$('#add-commodity,.upload-add,.imgBox label,.send').hide()
			$('#edit_detail input span').prop('disabled', 'disabled');
			$('#imgBox').empty();
			$('#sale-size tr:not(.first)').remove();
			$('.img-box').empty();
		} else {
			$('#edit_detail h1 span').text('商品修改');
			$('#edit_detail input').removeAttr('disabled');
			$('#add-commodity,.upload-add,.imgBox label,.send').show();
			$('#imgBox').empty();
			$('#sale-size tr:not(.first)').remove();
			$('#labels input[type=radio]').prop('disabled',true);
			$('.img-box').empty();
		}
	}

	getTaglist();
	//设置商品详情
	function setInfo(params,flag) {
		$.ajax({
			type: "post",
			url: $.baseUrl + "/Backuser/User/detail",
			dataType: $.dataType,
			data: {
				product_id: params
			},
			success: function (res) {
				console.log(res);
				if (res.status == 1) {
					setShopData(res.data,flag);
				} else if (res.status == 3) {
					toLogin();
				}
			}
		});
	}
	//操作dom对象
	var obj = {};
	function setShopData(data,flag) {
		var product = data.product;
		state = product.state;
		type_id = product.type_id;
		console.log(type_id);
		$("#shop-name").val(product.name);
		$("#price").val(product.price);
		$("#shop-description").val(product.description);
		$("#place").val(product.position);
		$("#postage").val(product.postage);
		if(state == 1){
			show(1);
		}else{
			show(2);
		}
		$('#labels input:radio').each(function () {
			var temp = $(this).val();
			if(temp == type_id){
				$(this).prop('checked',true);
			}
		})
		console.log(state,'state');
		if(state == 1) {
			$("#dropdownMenu1").val(product.start_valid_period.substr(0,10));
			$("#dropdownMenu2").val(product.end_valid_period.substr(0,10));
			$("#use_description").val(product.use_condition);
			$("#place").val(product.position);
			$('.others input:radio').each(function () {
				if(this.value == product.voucher_type){
					$(this).prop('checked',true);
				}
			});
		} else {
			product.postage = $("#postage").val();
		}
		product.state = state;
		$("#count").val(product.number);
		// editor.txt.html(product.graphic_details);
		$('#editDetail').empty();
		console.log(product.graphic_details);
		var arr_detail = product.graphic_details.split(',');
		for(var i = 0;i<arr_detail.length;i++){
			var img = $('<img>',{src:arr_detail[i]});
			$('#editDetail').append(img);
		}
		$.each(product.picture,function (i,val) {
			var img = $('<img>',{src:val.img_path,"data-product_img_id":val.product_img_id,class:"image"});
			var label = $('<label>');
			var input = $('<input>',{type:'file',accept:"image/png,image/jpg,image/jpeg",class:'uploadImg'});
			label.append(input);
			label.append(img);
			$("#imgBox").append(label);
		});
		var product_condition1 = product.product_condition1;
		$.each(product_condition1,function (i,val) {
			var tr = $('<tr>',{'data-class_id':val.class_id});
			var td0 = $('<td>');
			var td1 = $('<td>');
			var td2 = $('<td>');
			var td3 = $('<td>');
			var input0 = $('<input>',{class:'shopname',val:val.condition1});
			var input1 = $('<input>',{class:'price',val:val.price,maxLength:9});
			var input2 = $('<input>',{class:'number',val:val.number,maxLength:9});

			var img = $('<img>',{src:val.picture,class:'image'});
			var label = $('<label>');
			var input = $('<input>',{type:'file',accept:"image/png,image/jpg,image/jpeg",class:'uploadImg'});
			label.append(input);
			label.append(img);
			td0.append(input0);
			td1.append(input1);
			td2.append(input2);
			td3.append(label);
			tr.append(td0).append(td1).append(td2).append(td3);
			$('#sale-size tbody').append(tr);
		});
		if(!flag){
			$('#sale-size tbody input').prop('disabled',true);
		}else{
			$('#sale-size tbody input').prop('disabled',false);
		}
	}
	//关闭
	$('.back').click(function () {
		showEdit(0);
	});
	//详情
	$('#tbody').on('click', '.detail', function () {
		showEdit(1);
		setDisable(1);
		var obj = JSON.parse($(this).parents('tr').data('info'));
		setInfo(obj.product_id);
	});
	//
	$('#tbody').on('click', '.edit', function () {
		showEdit(1);
		setDisable();
		$('#labels radio').prop('disabled',true);
		var obj = JSON.parse($(this).parents('tr').data('info'));
		$('#edit_detail').data('product_id',obj.product_id);
		setInfo(obj.product_id,'true');
	});
	//搜索网红
	$('#netSearch').on('click',function () {
		var data = {};
		data.product_id = $('#tbody').data('product_id');
		data.page = 1;
		console.log($('#netName').val())
		if($('#netName').val()){
			data.name = $('#netName').val();
		}
		getlist(data);
	});
	//显示网红页面
	$('#tbody').on('click','.present',function () {
		var page_num = 1;
		var obj = JSON.parse($(this).parents('tr').data('info'));
		var data = {
			product_id:obj.product_id,
			page_num:page_num,
		};
		if($('#netName').val()){
			data.name = $('#netName').val();
		}
		$('#tbody1').data('product_id',obj.product_id);
		getlist(data);
		showEdit(2);
	});
	function getlist(data) {
		ajax($.baseUrl + '/Backuser/User/rednet_list',data,function (res) {
			setNetData(res.data.rednet_list);
			var el = $('#pager1').parent();
			$('#pager1').remove();
			var pager1 = $('<div>',{"id":"pager1","class":"tcdPageCode"});
			pager1.createPage({
				pageCount: res.data.pageCount,
				current: data.page_num ? data.page_num : 1,
				backFn: function (e) {
					data.name.page_num = e;
					if($('#netName').val()){
						data.name = $('#netName').val();
					}else{
						delete data.name
					}
					getlist(data);
				}
			});
			el.append(pager1);
		});
	}
	$('#tbody1').on('click','.present',function () {
		var obj = JSON.parse($(this).parents('tr').data('info'));
		var index = $(this).parents('tr').index();
		$('#tbody1').data('user_id',obj.user_id);
		$('#tbody1').data('index',index);
		$('.popover_net').show();
	});
	$('#present').click(function () {
		var data = {};
		data.start_time = $('#start_date').val();
		data.end_time = $('#end_date').val();
		var s = new Date(data.start_time).getTime();
		var e = new Date(data.end_time).getTime();
		console.log(s,e,e<s)
		if(e < s){
			return myAlert("结束时间不得小于开始时间");
		}
		data.user_id = $('#tbody1').data('user_id');
		data.product_id = $('#tbody1').data('product_id');
		var index = $('#tbody1').data('index');
		ajax($.baseUrl+ '/Backuser/User/rednet_represent',data,function (res) {
			console.log(res);
			$('#tbody1 tr').eq(index).find('.present').removeClass('present btn-default').addClass('noOperate').text('代言审核中');
			var btn = $('<button>',{class:'btn btn-danger cancel'}).text("取消代言");
			$('#tbody1 tr').eq(index).children('td:last').append(btn);
			$('.popover_net').hide();
			myAlert('申请成功');
		});
		console.log(data);
	});
	//设置网红列表
	function setNetData(data) {
		$('#tbody1').empty();
		console.log(data);
		if(data && data.length > 0 ){
			$.each(data,function (i,v) {
				var tr = $('<tr/>').data('info', JSON.stringify(v));
				var td0 = $('<td>');
				var img = $('<img>',{class:'header_net',src:v.head_image_url})
				td0.append(img);
				var td1 = $('<td>').text(v.name);
				var td2 = $('<td>').text(v.fans?v.fans:0);
				var td3 = $('<td>').text(v.platform?v.platform:'无');
				var td4 = $('<td>').text(v.sum_price?v.sum_price:'0');
				var td5 = $('<td>').text(v.create_time?v.create_time:'无');
				var td6 = $('<td>').text(v.sum_product?v.sum_product:'0');
				if(v.represent_state == 1){
					var btn = $('<button>',{class:"btn noOperate"}).text("代言中")
				}else if(v.represent_state == 0){
					var btn = $('<button>',{class:"btn noOperate"}).text("代言审核中");
					var btn1 = $('<button>',{class:'btn btn-danger cancel'}).text("取消代言");
				}else if(v.represent_state ==-1){
					var btn = $('<button>',{class:"btn btn-default present"}).text("代言")
				}
				var td7 = $('<td>').append(btn);
				if(v.represent_state == 0){
					td7.append(btn1);
				}
				tr.append(td0).append(td1).append(td2).append(td3).append(td4).append(td5)
				.append(td6).append(td7);
				$('#tbody1').append(tr);
			});

		}else{
			var tr = "<tr><td colspan='8'>暂无数据</td></tr>"
			$('#tbody1').append(tr);
		}
	};
	//取消代言
	$('#tbody1').on('click','.cancel',function () {
		var that = $(this);
		var el = $(this).parents('tr');
		var obj  = JSON.parse(decodeURIComponent(el.data('info')));
		wxc.xcConfirm("是否取消申请代言",wxc.xcConfirm.typeEnum.confirm,{
			onOk:function () {
				var data = {
					product_id:$('#tbody1').data('product_id'),
					user_id:obj.user_id
				}
				ajax($.baseUrl + '/Backuser/User/cancel_represent',data,function () {
					var parent = that.parent();
					that.remove();
					var btn = $('<button>',{class:'btn btn-default present'}).text('代言');
					console.log(parent);
					parent.empty().append(btn);
					myAlert("取消成功");
				})
			}
		})
	});
	//刪除商品
	$('#tbody').on('click', '.delete', function () {
		var that = $(this);
		var product_id = JSON.parse($(this).parents('tr').data('info')).product_id;
		window.wxc.xcConfirm("是否删除当前商品", window.wxc.xcConfirm.typeEnum.confirm, {
			onOk: function () {
				$.ajax({
					type: "post",
					url: $.baseUrl + "/Backuser/User/delProduct",
					dataType: $.dataType,
					data: {
						product_id: product_id
					},
					success: function (res) {
						that.parents('tr').hide();
						myAlert('刪除成功');
					}
				});
			}
		})
	})
	//上下架
	$('#tbody').on('click', '.drop,.putaway', function () {
		var that = $(this);
		var pro_type = $(this).data('pro_type');
		if (pro_type == 1) {
			txt = "是否下架"
		} else {
			txt = "是否上架"
		}
		var obj = JSON.parse($(this).parents('tr').data('info'));
		var product_id = obj.product_id;
		var data = {
			product_id: product_id
		};
		if (pro_type == 0) {
			data.type = 1;
		} else {
			data.type = 0;
		}
		window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm, {
			onOk: function () {
				$.ajax({
					type: "post",
					url: $.baseUrl + "/Backuser/User/up_and_down",
					dataType: $.dataType,
					data: data,
					success: function (res) {
						flag = true;
						if (res.status == 1) {
							if (pro_type == 0) {
								that.parents('tr').children('td').eq(7).text('销售中');
								that.text('下架').removeClass('putaway').addClass('danger').data('pro_type', 1)
								myAlert("上架成功");
							} else {
								that.parents('tr').children('td').eq(7).text('已下架');
								that.text('上架').removeClass('danger').addClass('putaway').data('pro_type', 0);
								myAlert("下架成功");
							}
						}
					}
				});
			}
		});
	});
	//店长推荐与取消
	var flag = true;
	$('#tbody').on('click', '.recommend span', function () {
		if (flag) {
			flag = false;
			var that = $(this);
			var is_recommend = $(this).data('is_recommend');
			var obj = JSON.parse($(this).parents('tr').data('info'));
			var product_id = obj.product_id;
			var data = {
				product_id: product_id
			};
			if (is_recommend == 0) {
				data.type = 1;
			} else {
				data.type = 0;
			}
			$.ajax({
				type: "post",
				url: $.baseUrl + "/Backuser/User/recomProduct",
				dataType: $.dataType,
				data: data,
				success: function (res) {
					flag = true;
					if (res.status == 1) {
						if (is_recommend == 0) {
							that.parents('tr').children('td').eq(0).addClass('hot');
							that.text('取消推荐').removeClass('default').addClass('danger').data('is_recommend', 1)
							myAlert("添加推荐成功");
						} else {
							that.parents('tr').children('td').eq(0).removeClass('hot');
							that.text('添加推荐').removeClass('danger').addClass('default').data('is_recommend', 0);
							myAlert("取消推荐成功");
						}
					}
				}
			});
		}
	})

	//获取商品列表
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

	getshoplist();

	//设置商品列表
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
			});
			var td9 = $('<td>', {
				class: 'operate'
			});
			//是否是推荐商品
			if (val.is_recommend) {
				td0.addClass('hot');
				td8.append($('<span>', {
					'class': 'btn danger'
				}).text('取消推荐').data("is_recommend", val.is_recommend));
			} else {
				td0.removeClass('hot');
				td8.append($('<span>', {
					'class': 'btn default'
				}).text('店长推荐').data("is_recommend", val.is_recommend))
			}
			if (val.pro_type) {
				var btn3 = $('<span>', {
					class: "btn drop"
				}).text('下架').data('pro_type', val.pro_type);
				td7.text("销售中");
			} else {
				var btn3 = $('<span>', {
					class: "btn putaway"
				}).text('上架').data('pro_type', val.pro_type)
				td7.text("已下架");
			}
			var btn1 = $('<span>', {
				class: "btn detail"
			}).text('详情');
			var btn2 = $('<span>', {
				class: "btn edit"
			}).text('编辑');
			var btn4 = $('<span>', {
				class: "btn delete"
			}).text('删除');
			var btn5 = $('<span>', {
				class: "btn present"
			}).text('代言');
			td9.append(btn1).append(btn2).append(btn3).append(btn4).append(btn5);
			tr.append(td0).append(td1).append(td2).append(td3).append(td4).append(td5).append(td6)
			.append(td7).append(td8).append(td9);
			$('#tbody').append(tr);
		});
	}

	$('#search').on('click', function () {
		var name = $('#keyword').val();
		getshoplist(1, name);
	});
	$('#keyword').on('input propertychange', function () {
		if (this.value.trim() == '') {
			getshoplist();
		}
	});

	$("#dropdownMenu1,#dropdownMenu2").jcDate({
		Class: "", //为input注入自定义的class类（默认为空）
		Default: "today", //设置默认日期（默认为当天）
		Event: "click", //设置触发控件的事件，默认为click
		Speed: 100, //设置控件弹窗的速度，默认100（单位ms）
		Left: 0, //设置控件left，默认0
		Top: 22, //设置控件top，默认22
		Format: "-", //设置控件日期样式,默认"-",效果例如：XXXX-XX-XX
		DoubleNum: true, //设置控件日期月日格式，默认true,例如：true：2015-05-01 false：2015-5-1
		Timeout: 100, //设置鼠标离开日期弹窗，消失时间，默认100（单位ms）
	});
	$("#start_date,#end_date").jcDate({
		Class: "", //为input注入自定义的class类（默认为空）
		Default: "today", //设置默认日期（默认为当天）
		Event: "click", //设置触发控件的事件，默认为click
		Speed: 100, //设置控件弹窗的速度，默认100（单位ms）
		Left: 0, //设置控件left，默认0
		Top: 34, //设置控件top，默认22
		Format: "-", //设置控件日期样式,默认"-",效果例如：XXXX-XX-XX
		DoubleNum: true, //设置控件日期月日格式，默认true,例如：true：2015-05-01 false：2015-5-1
		Timeout: 100, //设置鼠标离开日期弹窗，消失时间，默认100（单位ms）
	});

	//获取商标模式
	function getTaglist() {
		$.ajax({
			type: "post",
			dataType: $.dataType,
			url: $.baseUrl + "/Backuser/User/tag_list",
			success: function (data) {
				if (data.status == 1) {
					var d = data.data.tag_list;
					$('#labels').empty();
					$.each(d, function (i, val) {
						var label = $('<label/>', {
							class: 'my-label'
						});
						label.data('type_id', val.type_id);
						var input = $('<input/>', {
							'class': 'radio',
							type: 'radio',
							name: "shop_type",
							'data-state':val.state,
						}).val(val.type_id);
						var span1 = $('<span/>', {
							class: 'radio_span'
						});
						var span2 = $('<span/>').text(val.name);
						label.append(input).append(span1).append(span2);
						$('#labels').append(label);
					});

					show(1);
				} else if (data.status == 3) {
					toLogin();
				}
			}
		});
	}

	$('.popover_net').on('click',function () {
		$(this).hide();
	});
	$('.popover_box').on('click',function (e) {
		e.stopPropagation();
	});
	//添加商品销售规格的表格数据
	function addshop(d) {
		var tr = document.createElement('tr');
		$(tr).data('mData', d);
		var count = 0;
		for (var i in d) {
			count++;
			var className = "";
			switch (count) {
				case 1:
					className = 'shopname';
					break;
				case 2:
					className = 'price';
					break;
				case 3:
					className = 'count';
					break;
				case 4:
					className = 'image';
					break;
				default:
					;
			}
			if (count == 4) {
				var input = document.createElement('img');
				input.src = d[i];
			} else {
				var input = document.createElement('input');
				input.type = 'text';
				if (count != 1) {
					input.maxLength = '9';
				}
				input.value = d[i];
			}
			input.className = className;
			var td = document.createElement('td');
			td.appendChild(input);
			tr.appendChild(td);
		}
		return tr;
	}

	//上传商品图片
	$('#uploadDetail').on('change', function () {
		if ($('#imgBox img').length >= 5) {
			return alert('最多上传5张图片');
		}
		readImage(this.files, function (src) {
			var img = $('<img/>');
			img.attr("src", src);
			$('#imgBox').append(img);
			if ($('#imgBox img').length > 3) {
				$('#imgBox').width($('#imgBox img').length * 130);
			}
		})
		this.value = '';
	});
	//删除商品图片
	// $('#imgBox').on('click', 'lable', function () {
	// 	$(this).remove();
	// })
	//上传banner
	$('#imgBox').on('change','.uploadImg',function () {
		var that = this;
		readImage(this.files,function (src) {
			$(that).siblings('img').attr('src',src);
		}); 
	});
	//修改销售规格图片
	$('.shop_table_1').on('change','.uploadImg',function () {
		var that = this;
		readImage(this.files,function (src) {
			$(that).siblings('img').attr('src',src);
		});
	});
	//上传商品销售规格图片
	$('#upload-shop-image').on('change', function () {
		readImage(this.files, function (src) {
			if ($('.img-box img').length >= 1) {
				$('.img-box img').attr("src", src)
			} else {
				var img = $('<img/>');
				img.attr("src", src);
				$('.img-box').append(img);
				this.value = '';
			}
		})
	});

	function show(a) {
		if (a == 1) {
			$('#shop_description').text('商品描述：');
			$('.calendar').show();
			$('.others').show();
			$('.place').show();
			$('.use_description').show();
			$(".postage").hide();
		} else {
			$('#shops_description').text('商品描述：');
			$('.calendar').hide();
			$('.others').hide();
			$('.place').hide();
			$('.use_description').hide();
			$(".postage").show();
		}
	}
	//监听选择框状态的改变
	$('#labels').on('change', 'input:radio[name=shop_type]', function () {
		type_id = parseInt($(this).val());
		state = parseInt($(this).data('state'));
		$('.main_content_right input[type=text]').val('');
		$('#editDetail').empty();
		$('#imgBox').empty();
		$('#sale-size tr:not(.first)').remove();
		$('.img-box').empty();
		$('#sale-size').hide();
		switch (type_id) {
			case 1:
				show(1);
				break;
			default:
				show();
				break;
		}
	});

	//检查输入
	function checkinput() {
		var shopname = $('#shop-name').val();
		var brand = $('#brand').val();
		var place = $('#place').val();
		var description = $("#shop-description").val();
		var postage = $("#postage").val();
		//判断是否输入商品名称
		if (shopname == "") {
			myAlert("请输入商品名称", $("#shop-name"));
			return 1;
		}
		//判断是否输入商品描述
		if (description == "") {
			myAlert("请输入商品描述", $("#shop-description"));
			return 1;
		}
		if (state == 1) {
			var use_description = $("#use_description").val();
			if (place == "") {
				myAlert('请输入消费地址', $('#place'));
				return 1;
			} else if (use_description == "") {
				myAlert('请输入使用说明', $('#use_description'));
				return 1;
			}
		}
		if (postage == "" && state != 1) {
			myAlert("请输入邮费");
			return 1;
		}
		//判断是否输入价格区间
		var price = $('#price').val();
		if (price == "") {
			if (state == 1) {
				myAlert("请输入价格区间", $('#price'));
			} else {
				myAlert("请输入价格", $('#price'));
			}
			return 1;
		}
		var recount = $('#count').val();
		if (recount == '') {
			myAlert('请输入总库存', $('#count'));
		}
		//判断是选择日期
		if ($('.calendar').is(':visible')) {
			if ($('.others input:radio[name="shop-type"]:checked').val() == null) {
				myAlert("请选择是否可退");
				return 1;
			}
			var startDate = $('#dropdownMenu1').val();
			var a = $('#dropdownMenu1').val();
			startDate = new Date(startDate);
			var endDate = $('#dropdownMenu2').val();
			var b = $('#dropdownMenu2').val();
			endDate = new Date(endDate);
			var today = new Date();
			var letter = (startDate - today) / 1000 / 3600 / 24;
			if (letter < -1) {
				myAlert("请选择正确的开始时间");
				return 1;
			}
			var letter2 = (endDate - startDate) / 1000 / 3600 / 24;
			if (letter2 <= 0.1) {
				myAlert("请选择正确的有效时间");
				return 1;
			}
			if(a== "" || b == ""){
				myAlert('请输入日期');
			}
		}
		//是否上传商品图片
		if ($('#imgBox img').size() == 0) {
			myAlert('请上传至少一张，最多五张图片，限制在200k以内');
			return 1;
		}
	}
	$('#editDetail').on('dblclick','img',function () {
		$(this).remove();
	});
	function checkinput1() {
		//判断是否输入商品分类名
		var shoptypename = $('#shoptypename').val();
		shoptypename = shoptypename ? shoptypename.trim() : "";
		if (shoptypename == "") {
			myAlert("请输入商品分类名", $('#shoptypename'));
			return 1;
		} else if ($('.img-box img').length == 0) {
			wxc.xcConfirm('请选择商品分类图片', wxc.xcConfirm.typeEnum.info);
			return 1;
		}
	}

	$('.imgBox').on('click', '.btn', function () {
		if ($('.imgBox img').size() >= 5) {
			myAlert("最多上传5张");
			$('#uploadDetail').prop('disabled', 'disabled');
			return;
		} else {
			$('#uploadDetail').removeAttr('disabled');
		}
	})
	//限制值能输入数字
	$('#sale-size').on('input propertychange', '.price', function () {
		$(this).val($(this).val().replace(/^[^\d]$/g, ""));
	});

	//限库存能输入数字
	$('#sale-size').on('input propertychange', '.count', function () {
		$(this).val($(this).val().replace(/[^\d]$/g, ""));
	});
	//点击添加商品按钮添加商品
	$('#add-commodity').on('click', function () {
		if (checkinput()) return;
		if (checkinput1()) return;
		var obj = {};
		$('#sale-size').show();
		obj.s1_shopname = $('#shoptypename').val().trim();
		obj.s2_price = "";
		obj.s3_count = "";
		obj.s4_img = $('.img-box img').attr('src');
		var tr = addshop(obj);
		$('#sale-size tbody').append(tr);
		$('.img-box').empty();
		$('#shoptypename').val("");
	});

	/*获取添加商品的数据*/
	function getData() {
		var obj = {};
		var product = {};
		product.product_id = $('#edit_detail').data('product_id');
		product.name = $("#shop-name").val();
		product.price = $("#price").val();
		product.description = $("#shop-description").val();
		product.position = $("#place").val();
		product.type_id = type_id;
		if (state == 1) {
			product.start_time = $("#dropdownMenu1").val();
			product.end_time = $("#dropdownMenu2").val();
			product.use_condition = $("#use_description").val();
			product.voucher_type = $('.others input:radio[name="shop-type"]:checked').val();
			product.postage = 0;
			product.position = $("#place").val();
		} else {
			product.postage = $("#postage").val();
		}
		product.state = state;
		product.number = $("#count").val();
		var arr_Detail = [];
		$('#editDetail img').each(function () {
			arr_Detail.push(this.src);
		});
		product.product_details = arr_Detail.join(',');
		product.picture = [];
		$("#imgBox img").each(function () {
			var src = this.src;
			if(src.indexOf('base64')>-1){
				src = src.split(',')[1];
			}
			var obj = {
				product_img_id:$(this).data('product_img_id'),
				picture1:src
			}
			product.picture.push(obj);
		});
		product_condition1 = [];
		$("#sale-size tbody tr").each(function (i) {
			var src='';
			if (i > 0) {
				src = $(this).find('.image').attr("src");
				if(src.indexOf('base64')>-1){
					src = $(this).find('.image').attr("src").split(',')[1];
				}else{
					src = $(this).find('.image').attr("src");
				}
				product_condition1.push({
					class_id:$(this).data('class_id'),
					condition1: $(this).find('.shopname').val(),
					price: $(this).find('.price').val(),
					number: $(this).find('.number').val(),
					picture: src
				})
			}
		})
		obj.product = product;
		obj.product_condition1 = product_condition1;
		return obj;
	}
	/*上传图文详情照片*/
	$('#uploadDetailImg').on('change',function () {
		var formData = new FormData();
		var file = this.files[0];
		formData.append('file',file);
		console.log('change')
		$.ajax({
			url:$.baseUrl + '/Backuser/User/upload_img',
			type: 'POST',
			cache: false,
			dataType:"json",
			data:formData,
			processData: false,
			contentType: false,
			success:function (res) {
				if(res.status == 1){
					var src = res.data.img_path;
					var img = $('<img>',{src:src});
					$('#editDetail').append(img);
				}else if(res.status == 3){
					toLogin();
				}else{
					myAlert(res.msg)
				}
			}
		})
	});
	/*修改宝贝*/
	$('#send').on('click', function () {
		if (checkinput()) {
			return;
		}
		var remain = 0;
		$("#sale-size .number").each(function () {
			remain += parseInt(this.value);
		});
		var totalCount = parseInt($('#count').val());
		if (!(totalCount == remain)){
			return myAlert('总库存与分类库存不匹配，请检查库存');
		}
		if ($('#sale-size tr').size() < 2) {
			return myAlert('请至少输入一个添加一个产品分类');
		} else {
			var a = 0;
			$('#sale-size tr').each(function () {
				if ($(this).find('.price').val() == "") {
					myAlert("请完善价格信息");
					a = 1;
				} else if ($(this).find('.count').val() == "") {
					myAlert("请完善库存信息");
					a = 1;
				}
			});
			if (a == 1) return;
		}
		if($('#editDetail img').length == 0){
			return myAlert('请上传商品详情图片');
		}
		var data = getData();
		console.log(data);
		window.wxc.xcConfirm("是否修改商品？", window.wxc.xcConfirm.typeEnum.confirm, {
			onOk: function () {
				$('.my_popover').show();
				$.ajax({
					type: "post",
					url: $.baseUrl + "/TravelLive/index.php/Backuser/Index/edit_product",
					dataType: $.dataType,
					data: JSON.stringify(data),
					success: function (res) {
						$('.my_popover').hide();
						console.log(res)
						if (res.status == 1) {
							console.log(res);
							myAlert("修改商品成功");
							setTimeout(function () {
								window.location.reload(true);
							}, 1000);
						} else if(res.status == 3){
							toLogin();
						}else {
							$('.my_popover').hide();
							myAlert("修改商品失败");
						}
					},
					error: function (res) {
						$('.my_popover').hide();
						console.log(res, 'error_info');
					}
				});
			}
		});
	});
});