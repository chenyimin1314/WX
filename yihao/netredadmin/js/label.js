$(function () {
	$('#add').on('click', function () {
		var txt = $('#labelValue').val();
		txt = txt ? txt.trim() : "";
		if (txt === "") return wxc.xcConfirm('请输入标签', wxc.xcConfirm.typeEnum.info, {
			onOk: function () {
				$('#labelValue').focus();
			}
		});
		var data = {
			name: txt,
		};
		wxc.xcConfirm('是否增加标签', wxc.xcConfirm.typeEnum.confirm, {
			onOk: function () {
				$.ajax({
					url: $.baseUrl + '/Back/Index/add_tag',
					type: "post",
					data: data,
					dataType: $.dataType,
					success: function (res) {
						if (res.status == 1) {
							myAlert("增加成功");
							taglist();
						} else if (res.status == 3) {
							toLogin();
						} else {
							myAlert("参数错误")
						}
					}
				})
			}
		})
	});

	//获取taglist
	function taglist() {
		$.ajax({
			url: $.baseUrl + '/Back/Index/tag_info',
			type: "POST",
			dataType: $.dataType,
			success: function (data) {
				if (data.status == 1) {
					setlabel(data.data);
				} else if (data.status == 3) {
					toLogin();
				} else {
					myAlert("参数错误");
				}
			}
		})
	}

	taglist();

	function setlabel(data) {
		$('#label_group').empty();
		$.each(data.tag_list, function (i, val) {
			var span = $('<span>').data('info', val);
			span.html(val.name + '<img src="../img/close.png" width="13" height="14">');
			$('#label_group').append(span);
		})
	}

	$('#label_group').on('click', 'span', function () {
		$(this).addClass('active').siblings('span').removeClass('active');
		$('#change_label').show();
		$('#label_text').val($(this).text());
		var id = $(this).data('info').id;
		$('#save').data('id', id).data('index', $(this).index());
	});
	$('#save').on('click', function () {
		var label_text = $('#label_text').val();
		if (label_text == "") {
			return myAlert('请输入标签名', $('#label_text'));
		}
		var that = $(this);
		var data = {
			name: label_text,
			id: that.data('id')
		};
		wxc.xcConfirm('是否修改当前标签', wxc.xcConfirm.typeEnum.confirm, {
			onOk: function () {
				$.ajax({
					url: $.baseUrl + '/Back/Index/edit_tag',
					type: "post",
					data: data,
					dataType: $.dataType,
					success: function (res) {
						if (res.status == 1) {
							myAlert("修改成功");
							$('#label_group span').eq(that.data('index')).html(data.name + '<img src="../img/close.png" width="13" height="14">');
							$('#change_label').hide();
						} else if (res.status == 3) {
							toLogin();
						} else {
							myAlert("参数错误");
						}
					}
				})
			}
		})
	})
	$('#label_group').on('click', 'img', function () {
		var id = $(this).parent('span').data('info').id;
		var that = $(this);
		var data = {
			id: id
		}
		wxc.xcConfirm('是否删除当前标签', wxc.xcConfirm.typeEnum.confirm, {
			onOk: function () {
				$.ajax({
					url: $.baseUrl + '/back/Index/dele_tag',
					type: "post",
					data: data,
					dataType: $.dataType,
					success: function (res) {
						if (res.status == 1) {
							myAlert("删除成功");
							that.parent().remove();
							$('#change_label').hide();
						} else if (res.status == 3) {
							toLogin();
						} else {
							myAlert("该标签有商品存在，不可删除");
						}
					}
				})
			}
		})
	})
});