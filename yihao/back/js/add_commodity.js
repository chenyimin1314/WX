$(function() {
	$("#dropdownMenu1,#dropdownMenu2").jcDate({
		Class: "", //为input注入自定义的class类（默认为空）
		Default: "today", //设置默认日期（默认为当天）
		Event: "click", //设置触发控件的事件，默认为click
		Speed: 100, //设置控件弹窗的速度，默认100（单位ms）
		Left: 0, //设置控件left，默认0
		Top: 33, //设置控件top，默认22
		Format: "-", //设置控件日期样式,默认"-",效果例如：XXXX-XX-XX
		DoubleNum: true, //设置控件日期月日格式，默认true,例如：true：2015-05-01 false：2015-5-1
		Timeout: 100, //设置鼠标离开日期弹窗，消失时间，默认100（单位ms）
		OnChange: function() { //设置input中日期改变，触发事件，默认为function(){}
			console.log('num change');
		}
	})
	//获取商标模式
	var type_id,state;
	function getTaglist() {
		$.ajax({
			type: "post",
			dataType: $.dataType,
			url: $.baseUrl + "/Backuser/User/tag_list",
			success: function(data) {
				if(data.status == 1) {
					var d = data.data.tag_list;
					$('#labels').empty();
					$.each(d, function(i, val) {
						console.log(i, val)
						var label = $('<label/>', {
							class: 'my-label'
						});
						label.data('type_id', val.type_id);
						var input = $('<input/>', {
							'class': 'radio',
							type: 'radio',
							value: val.type_id,
							'data-state':val.state,
							name: "shop_type"
						});
						var span1 = $('<span/>', {
							class: 'radio_span'
						});
						var span2 = $('<span/>').text(val.name);
						label.append(input).append(span1).append(span2);
						$('#labels').append(label);
					});
					$('#labels label:eq(0) input').prop('checked', 'true');
					state = $('#labels label:eq(0) input').data('state');
					type_id = d[0].type_id;
				} else if(data.status == 3) {
					toLogin();
				}else{
					myAlert("获取标签失败");
				}
			}
		});
	}

	getTaglist();
	//添加商品销售规格的表格数据
	function addshop(d) {
		var tr = document.createElement('tr');
		$(tr).data('mData', d);
		var count = 0;
		for(var i in d) {
			count++;
			var className = "";
			switch(count) {
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
			if(count == 4) {
				var input = document.createElement('img');
				input.src = d[i];
			} else {
				var input = document.createElement('input');
				input.type = 'text';
				if(count != 1) {
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
	$('#uploadDetail').on('change', function() {
		if($('#imgBox img').length >= 5) {
			return alert('最多上传5张图片');
		}
		readImage(this.files, function(src) {
			var img = $('<img/>');
			img.attr("src", src);
			$('#imgBox').append(img);
			if($('#imgBox img').length > 3) {
				$('#imgBox').width($('#imgBox img').length * 130);
			}
		})
		this.value = '';
	});
	//删除商品图片
	$('#imgBox').on('dblclick', 'img', function() {
		$(this).remove();
	})
	//上传商品销售规格图片
	$('#upload-shop-image').on('change', function() {
		readImage(this.files, function(src) {
			if($('.img-box img').length >= 1) {
				$('.img-box img').attr("src", src)
			} else {
				var img = $('<img/>');
				img.attr("src", src);
				$('.img-box').append(img);
				this.value = '';
			}
		})
	});
	//监听选择框状态的改变
	$('#labels').on('change', 'input:radio[name=shop_type]', function() {
		state = parseInt($(this).data('state'));
		type_id = parseInt($(this).val());
		$('.main_content_right input[type=text]').val('');
		$('#editDetail').empty();
		$('#imgBox').empty();
		$('#sale-size tr:not(.first)').remove();
		$('.img-box').empty();
		$('#sale-size').hide();
	});
	//检查输入
	function checkinput() {
		var shopname = $('#shop-name').val();
		var brand = $('#brand').val();
		var place = $('#place').val();
		var description = $("#shop-description").val();
		var postage = $("#postage").val();
		//判断是否输入商品名称
		if(shopname == "") {
			myAlert("请输入商品名称", $("#shop-name"));
			return 1;
		}
		//判断是否输入商品描述
		if(description == "") {
			myAlert("请输入商品描述", $("#shop-description"));
			return 1;
		}
		if(state == 1) {
			var use_description = $("#use_description").val();
			if(place == "") {
				myAlert('请输入消费地址', $('#place'));
				return 1;
			} else if(use_description == "") {
				myAlert('请输入使用说明', $('#use_description'));
				return 1;
			}
		}
		if(state != 1 && postage == '') {
			myAlert("请输入邮费");
			return 1;
		}
		//判断是否输入价格区间
		var price = $('#price').val();
		if(price == "") {
			if(state == 1) {
				myAlert("请输入价格区间", $('#price'));
			} else {
				myAlert("请输入价格", $('#price'));
			}
			return 1;
		}
		var recount = $('#count').val();
		if(recount == '') {
			myAlert('请输入总库存', $('#count'));
		}
		//判断是选择日期
		if($('.calendar').is(':visible')) {
			if($('.others input:radio[name="shop-type"]:checked').val() == null) {
				myAlert("请选择是否可退");
				return 1;
			}
			var startDate = $('#dropdownMenu1').val();
			var a = $('#dropdownMenu1').val();
			var b = $('#dropdownMenu2').val();
			startDate = new Date(startDate);
			var endDate = $('#dropdownMenu2').val();
			endDate = new Date(endDate);
			var today = new Date();
			var letter = (startDate - today) / 1000 / 3600 / 24;
			if(letter < -1) {
				myAlert("请选择正确的开始时间");
				return 1;
			}
			var letter2 = (endDate - startDate) / 1000 / 3600 / 24;
			if(letter2 <= 0.1) {
				myAlert("请选择正确的有效时间");
				return 1;
			}
			if(a == '' || b == ''){
				return myAlert('请选择日期');
			}
		}
		//是否上传商品图片
		if($('#imgBox img').size() == 0) {
			myAlert('请上传至少一张，最多五张图片，限制在200k以内');
			return 1;
		}
	}
	$('#editDetail').on('dblclick','img',function () {
		$(this).remove();
	});
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
	function checkinput1() {
		//判断是否输入商品分类名
		var shoptypename = $('#shoptypename').val();
		shoptypename = shoptypename ? shoptypename.trim() : "";
		if(shoptypename == "") {
			myAlert("请输入商品分类名", $('#shoptypename'));
			return 1;
		} else if($('.img-box img').length == 0) {
			wxc.xcConfirm('请选择商品分类图片', wxc.xcConfirm.typeEnum.info);
			return 1;
		}
	}
	$('.imgBox').on('click','.btn',function(){
		if($('.imgBox img').size() >= 5){
			myAlert("最多上传5张");
			$('#uploadDetail').prop('disabled','disabled');
			return;
		}else{
			$('#uploadDetail').removeAttr('disabled');
		}
	})
	//限制值能输入数字
	$('#sale-size').on('input propertychange', '.price', function() {
		$(this).val($(this).val().replace(/^[^\d]$/g, ""));
	});

	//限库存能输入数字
	$('#sale-size').on('input propertychange', '.count', function() {
		$(this).val($(this).val().replace(/[^\d]$/g, ""));
	});
	//点击添加商品按钮添加商品
	$('#add-commodity').on('click', function() {
		if(checkinput()) return;
		if(checkinput1()) return;
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
		product.name = $("#shop-name").val();
		product.price = $("#price").val();
		product.description = $("#shop-description").val();
		product.position = $("#place").val();
		product.type_id = type_id;
		if(state == 1) {
			product.start_time = $("#dropdownMenu1").val();
			product.end_time = $("#dropdownMenu2").val();
			product.use_condition = $("#use_description").val();
			product.voucher_type = $('.others input:radio[name="shop-type"]:checked').val();
			product.position = $("#place").val();
			product.postage = 0;
		} else {
			product.postage = $("#postage").val();
		}
		product.state = state;
		product.number = $("#count").val();
		var detail = [];
		$('#editDetail img').each(function () {
			detail.push($(this).attr('src'));
		});
		product.product_details = detail.join(',');

		product.picture = [];
		$("#imgBox img").each(function() {
			product.picture.push({
				"picture1": this.src.split(',')[1]
			})
		});
		product_condition1 = [];
		$("#sale-size tbody tr").each(function(i) {
			if(i > 0) {
				product_condition1.push({
					name: $(this).find('.shopname').val(),
					price: $(this).find('.price').val(),
					number: $(this).find('.count').val(),
					img: $(this).find('.image').attr("src").split(',')[1]
				})
			}
		});
		obj.product = product;
		obj.product_condition1 = product_condition1;
		return obj;
	}
	/*发布宝贝*/
	$('#send').on('click', function() {
		if(checkinput()) {
			return;
		}
		var remain = 0;
		$("#sale-size .count").each(function() {
			remain += parseInt(this.value);
		})
		var totalCount = parseInt($('#count').val());
		console.log(remain,totalCount,'remain,totalCount',typeof remain,typeof totalCount);
		console.log(totalCount === remain);
		if(!(totalCount == remain)){
			myAlert('总库存与分类库存不匹配，请检查库存');
			return ;
		}
		if($('#sale-size tr').size() < 2) {
			return myAlert('请至少输入一个添加一个产品分类');
		} else {
			var a = 0;
			$('#sale-size tr').each(function() {
				if($(this).find('.price').val() == "") {
					myAlert("请完善价格信息");
					a = 1;
				} else if($(this).find('.count').val() == "") {
					myAlert("请完善库存信息");
					a = 1;
				}
			});
			if(a == 1) return;
		}
		if($('#editDetail img').size() == 0){
			return myAlert('请上传商品详情图片');
		}
		var data = getData();
		console.log(data);
		window.wxc.xcConfirm("是否确认发布商品？", window.wxc.xcConfirm.typeEnum.confirm, {
			onOk: function() {
				$('.my_popover').show();
				$.ajax({
					type: "post",
					url: $.baseUrl + "/Backuser/User/add_product",
					dataType: $.dataType,
					data: JSON.stringify(data),
					success: function(res) {
						$('.my_popover').hide();
						if(res.status == 1) {
							console.log(res);
							myAlert("发布商品成功");
							setTimeout(function() {
								window.location.reload(true);
							}, 1000);
						} else if(res.status == 3){
							toLogin();
						}else{
							$('.my_popover').hide();
							myAlert("发布失败");
						}
					},
					error: function(res) {
						$('.my_popover').hide();
						console.log(res, 'error_info');
					}
				});
			}
		});
	});

});