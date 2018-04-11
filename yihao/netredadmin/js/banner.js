
$(function () {
	$("#shop_data_idendify input[type=file]").on('change', function () {
		var that = this;
		var files = this.files;
		var file = files[0];
	});

	function showpover(e) {
		if (e) {
			$('.my_popover').show().children('div').addClass('rotate');
		} else {
			$('.my_popover').hide().children('div').removeClass('rotate')
		}
	}
	var size = 0;
	function getImg() {
		$.ajax({
			url: $.baseUrl + '/Back/Index/get_banner',
			type: 'post',
			dataType: $.dataType,
			success: function (res) {
				if (res.status == 1) {
					setImg(res.data);
				} else if (res.status == 3) {
					toLogin();
				} else {
					myAlert('获取商铺图片失败');
				}
			}
		});
	};
	getImg();
	//uploadImg
	$('#uploadImg').on('change', function () {
		var file = this.files[0];
		var src = getObjectURL(file);
		console.log(src);
		$(this).siblings('img').attr('src', src).addClass('active')
	});
	//监听函数
	var xhrOnProgress = function (fun) {
		xhrOnProgress.onprogress = fun; //绑定监听
		//使用闭包实现监听绑
		return function () {
			//通过$.ajaxSettings.xhr();获得XMLHttpRequest对象
			var xhr = $.ajaxSettings.xhr();
			//判断监听函数是否为函数
			if (typeof xhrOnProgress.onprogress !== 'function')
				return xhr;
			//如果有监听函数并且xhr对象支持绑定时就把监听函数绑定上去
			if (xhrOnProgress.onprogress && xhr.upload) {
				xhr.upload.onprogress = xhrOnProgress.onprogress;
			}
			return xhr;
		}
	};
	//上传视频
	$('#uploadVideo').on('change', function () {
		var fileTemp = this.files[0];
		var formData = new FormData();
		formData.append('file', fileTemp);
		$.ajax({
			url: $.baseUrl + '/Back/Index/upload_banner_video',
			type: "POST",
			data: formData,
			dataType: "JSON",
			processData: false,
			contentType: false,
			timeout: 300 * 1000,
			success: function (res) {
				console.log(res);
				if (res.status == 1) {
					console.log(res.data);
					$('#video').attr('src', res.data.url).show().siblings('img').hide();
					$('.progress0').hide();
				} else if (res.status == 3) {
					toLogin();
				} else {
					myAlert(res.msg)
				}
			},
			xhr: xhrOnProgress(function (e) {
				var percent = Math.round(e.loaded * 100 / e.total) + '%'
				console.log(percent);
				$('.progress0').show();
				$('.progress0').text("上传进度：" + percent);
			})
		})
	});
	//新增
	$('.myButton').on('click', function () {
		var len = $('.shop_image .model').size();
		if(len < 5){
			var formData = new FormData();
			if ($('#upload_img_image').attr('src').indexOf('add') > -1) {
				return myAlert("请上传图片");
			}
			formData.append('file', document.getElementById('uploadImg').files[0]);
			formData.append('video_url', $('#video').attr('src'));
			$.ajax({
				url: $.baseUrl + '/Back/Index/upload_banner',
				type: "POST",
				data: formData,
				dataType: "JSON",
				processData: false,
				contentType: false,
				timeout: 300 * 1000,
				success: function (res) {
					console.log(res);
					if (res.status == 1) {
						var div = $('.model').eq(0).clone(true).show();
						div.find('.img').attr('src', res.data.url).data('id', res.data.id);
						div.find('video').attr('src', $('#video').attr('src')).show().siblings('img').hide();
						$('.shop_image').append(div);
						setDisabled();
						myAlert("新增成功");
					} else if (res.status == 3) {
						toLogin();
					} else {
						myAlert(res.msg);
					}
				}
			})
		}else{
			myAlert("最多上传五张");
		}

	});
	//点击保存修改
	$('.saveChange').on('click',function () {
		var formData = new FormData();
		var obj = $(this).data();
		var el = $(this).parents('.model');
		formData.append('img_url',obj.img_url);
		formData.append('id',obj.id);
		if(el.find('video').attr('src')){
			formData.append('video_url',el.find('video').attr('src'));
		}
		$.ajax({
			url: $.baseUrl + '/Back/Index/edit_banner',
			type: "POST",
			data: formData,
			dataType: "JSON",
			processData: false,
			contentType: false,
			success: function (res) {
				if(res.status == 1){
					myAlert("修改成功");
				}else if(res.status == 3){
					toLogin();
				}else{
					myAlert(res.msg);
				}
			}
		});
	});
	/*修改上传视频*/
	$('.uploadVideo').on('change', function () {
		var file = this.files[0];
		var formData = new FormData();
		formData.append('file', file);
		var el = $(this).parents('.videoUpload');
		$.ajax({
			url: $.baseUrl + '/Back/Index/upload_banner_video',
			type: "POST",
			data: formData,
			dataType: "JSON",
			processData: false,
			contentType: false,
			timeout: 300 * 1000,
			success: function (res) {
				console.log(res);
				if (res.status == 1) {
					console.log(res.data);
					el.find('video').attr('src', res.data.url).show().siblings('img').hide();
					el.find('.progress_user').hide();
				} else if (res.status == 3) {
					toLogin();
				} else {
					myAlert(res.msg)
				}
			},
			xhr: xhrOnProgress(function (e) {
				var percent = Math.round(e.loaded * 100 / e.total) + '%'
				console.log(percent);
				el.find('.progress_user').show().text("上传进度：" + percent);
			})
		})
	});
	//设置图片
	function setImg(data) {
		if (data.banner_list) {
			$.each(data.banner_list, function (i, obj) {
				var div = $('.model').eq(0).clone(true).show();
				div.find('.img').attr('src', obj.banner).data('id', obj.id).addClass('img');
				div.find('.saveChange').data({
					id:obj.id,
					img_url:obj.banner,
				});
				if (obj.link) {
					div.find('.add').hide();
					div.find('.video').attr('src', obj.link).show();
				}
				$('.shop_image').append(div);
			});
			size = data.banner_list.length;
			setDisabled();
		} else {
			// myAlert('设置图片的数据不存在，请重新获取');
		}
	}
	//删除图片
	var flag = true;
	$('.shop_image').on('click', '.close', function (e) {
		e.stopPropagation(true);
		var el = $(this).siblings('label').find('img');
		var id = el.data('id');
		deleteImg({
			id: id
		}, $(this));
	});

	/*delete img*/
	function deleteImg(data, el) {
		$.ajax({
			url: $.baseUrl + '/Back/Index/dele_banner',
			type: 'post',
			dataType: $.dataType,
			data: data,
			success: function (res) {
				if (res.status == 1) {
					myAlert('删除成功');
					el.parents('.model').remove();
					setDisabled();
				} else if (res.status == 3) {
					toLogin();
				} else {
					myAlert(res.msg);
				}
			}
		})
	}
	//设置
	function setDisabled() {
		var len = $('.shop_image').children().size();
		if (len >= 5) {
			$('#uploadImg').prop('disabled', true);
			$('#uploadVideo').prop('disabled', true);
		} else {
			$('#uploadImg').prop('disabled', false);
			$('#uploadVideo').prop('disabled', false);
		}
	}
});