$(function () {
	$(".marketing_tool>ul>li>img").click(function () {
		$(".main_content_right").hide();
		$(".marketingToolMsg").show();
	});

	$(".marketingToolMsg_title>img").click(function () {
		$(".main_content_right").show();
		$(".marketingToolMsg").hide();
	});


	//功能点：删除转盘

	var del_turntable = function (turntable_id, this_value) {
		$.ajax({
			url: $.baseUrl + "/TravelLive/index.php/Backuser/Account/del_turntable",
			type: 'POST',
			dataType: $.dataType,
			async: false,
			data: {
				'turntable_id': turntable_id
			},
			success: function (data) {
				console.log(data);
				if (data.status == "1") {
					this_value.remove();
					console.log(data.msg);
				}
			}
		})
	}

//	var getBase64Image =function(img) {
//      var canvas = document.createElement("canvas");
//      canvas.width = img.width;
//      canvas.height = img.height;
//      var ctx = canvas.getContext("2d");
//      ctx.drawImage(img, 0, 0, img.width, img.height);
//      var dataURL = canvas.toDataURL("image/png");
//      console.log("ss");
//      return dataURL;
//      
////      return dataURL.replace("data:image/jpg;base64,", "");
//     
//  }

	//券下拉列表
	var titck_drop_down_list_fun = function (this_select) {
		$.ajax({
			url: $.baseUrl + "/TravelLive/index.php/Backuser/Account/titck_drop_down_list",
			type: 'POST',
			dataType: $.dataType,
			async: false,
			data: '',
			success: function (data) {
				console.log(data);
				if (data.status == "1") {
					var titck_drop_down_list = data.data.titck_drop_down_list;
					if (titck_drop_down_list != null) {
//		    			var select_flag_div = $(".select_flag");
//		    			if($(".select_flag>option").length != "0"){
//		    				$(".select_flag>option").remove();
//		    			}
						for (var i = 0; i < titck_drop_down_list.length; i++) {
							var option_div = $("<option></option>");
							if (titck_drop_down_list[i].type == "1") {
								option_div.html("抵用券:" + titck_drop_down_list[i].title + "元");
							} else {
								option_div.html("兑换券:" + titck_drop_down_list[i].title);
							}
							option_div.attr("value", titck_drop_down_list[i].ticket_id + "-" + titck_drop_down_list[i].type);
							this_select.append(option_div);
						}

//		    			select_flag_div.change(function(){
//		    				console.log($(this).val());
//		    			})

					}
				}
			}
		})
	};

	//功能点：转盘信息列表
	var turntable_list_fun = function () {
		$.ajax({
			url: $.baseUrl + "/TravelLive/index.php/Backuser/Account/turntable_list",
			type: 'POST',
			dataType: $.dataType,
			async: false,
			data: '',
			success: function (data) {
				console.log(data,'转盘消息列表');
				if (data.status == "1") {
					var turntable_list_data = data.data.turntable_list;
					if ($(".awardSet_list .awardSet_list_ul").length != "0") {
						$(".awardSet_list .awardSet_list_ul").remove();
					}
					if (turntable_list_data != null) {
						for (var c = 0; c < turntable_list_data.length; c++) {

							var awardSet_list_ul = $("<ul class='awardSet_list_ul'></ul>");
							$(".awardSet_list").append(awardSet_list_ul);

							var close_img = $("<img class='closeImg'/>");
							close_img.attr("src", "../images/delete.png");
							awardSet_list_ul.append(close_img);


							//保存转盘ID
							var turntable_id_div = $("<div class='turntable_id_div'></div>");
							turntable_id_div.html(turntable_list_data[c].turntable_id);
							awardSet_list_ul.append(turntable_id_div);


							var img_base64 = $("<div class='img_base64'></div>");
							img_base64.html("");
							awardSet_list_ul.append(img_base64);

							var uploadImg = $("<li class='uploadImg'></li>");
							awardSet_list_ul.append(uploadImg);

							var img_div = $("<div id='img'></div>");
							uploadImg.append(img_div);

							var uploading_img = $("<img class='uploading_img' src='../images/camera.png'/>");
							img_div.append(uploading_img);

							var span_div = $("<span></span>");
							span_div.html("请上传PNG格式图片");
							img_div.append(span_div);

							var input_div = $("<input type='file' class='awardPic'/>");
							uploadImg.append(input_div);

							img_div[0].innerHTML = '<img src="' + turntable_list_data[c].img + '" alt=""/>';

//							var img_flag = document.createElement('img');
//							img_flag.src = turntable_list_data[c].img;
//							img.onload =function() { 
//				                var data = getBase64Image(img_flag); 
//				                console.log(data); 
//				            }
//							getBase64Image(img_flag[0]);

//							var position_flag_ = data.indexOf(";base64,");
//							console.log(position_flag_);
//							var img_base64_1_ = data.substring(position_flag_+8);	
//							console.log(img_base64_1_);

//							img_base64.html(img_base64_1_);
//							console.log(img_base64.html())

							var li_2 = $("<li></li>");
							awardSet_list_ul.append(li_2);

							var select_div = $("<select class='select_flag'></select>");
							li_2.append(select_div);

							titck_drop_down_list_fun(select_div);

							var my_option = $("<option></option>");
							if (turntable_list_data[c].type == "1") {
								my_option.html("抵用券:" + turntable_list_data[c].title + "元");
							} else {
								my_option.html("兑换券:" + turntable_list_data[c].title);
							}
							my_option.attr("value", turntable_list_data[c].ticket_id + "-" + turntable_list_data[c].type);
							select_div.prepend(my_option);
							select_div[0].options[0].selected = true;
//							for(var p=0; p<select_div[0].options.length; p++){  
//								console.log(select_div[0].options[p].value.split("-")[0]);
//						        if(select_div[0].options[p].value.split("-")[0] == turntable_list_data[c].ticket_id){  
//						            select_div[0].options[p].selected = true;  
//						            
//						        }  
//						    }

							var input_3 = $("<input class='input_3' type='text' placeholder='奖品名称'/>");
							input_3.val(turntable_list_data[c].name);
							li_2.append(input_3);

							var probability_div = $("<div class='probability_div'></div>");
							li_2.append(probability_div);

							var input_4 = $("<input class='input_4' type='text' placeholder='抽中概率'/>");
							input_4.val(turntable_list_data[c].probability);
							probability_div.append(input_4);

							var span_probability = $("<span></span>");
							span_probability.html("%");
							probability_div.append(span_probability);


						}

						$(".closeImg").click(function () {
							var this_turntable_id = $(this).parents(".awardSet_list_ul").find(".turntable_id_div").html();
							del_turntable(this_turntable_id, $(this).parents(".awardSet_list_ul"));
						})

						$(".timeInput>input").val(data.data.minute);

					}
				} else if (data.status == "3") {
					console.log("sss");
					var txt = "请重新登录！";
					window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm, {
						onOk: function () {
							window.location.href = "../login/login.html";
						}
					});
				}
			}
		})
	}
	turntable_list_fun();

	$(".awardPic").click(function () {
		var self = $(this);
		var inp = $(this)[0];
		var img = $(this).parents(".uploadImg").find('#img')[0];
		if (typeof(FileReader) === 'undefined') {
			result.innerHTML = "抱歉，你的浏览器不支持 FileReader，请使用现代浏览器操作！";
			inp.setAttribute('disabled', 'disabled');
		} else {
			inp.addEventListener('change', readFile, false);
		}

		function readFile() {
			var file = this.files[0];
			//这里我们判断下类型如果不是图片就返回 去掉就可以上传任意文件 
			if (!/image\/\w+/.test(file.type)) {
				alert("请确保文件为图像类型");
				return false;
			}
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function (e) {

				img.innerHTML = '<img src="' + this.result + '" alt=""/>';


				var position_flag = this.result.indexOf(";base64,");

				var img_base64_1 = this.result.substring(position_flag + 8);


				self.parents(".awardSet_list_ul").find(".img_base64").html(img_base64_1);

			}
		}
	})

	//新增转盘信息
	$(".add_marketing>img").click(function () {

		var awardSet_list_ul = $("<ul class='awardSet_list_ul newAddData'></ul>");
		$(".awardSet_list").append(awardSet_list_ul);

		var img_base64 = $("<div class='img_base64'></div>");
		img_base64.html("");
		awardSet_list_ul.append(img_base64);

		var uploadImg = $("<li class='uploadImg'></li>");
		awardSet_list_ul.append(uploadImg);

		var img_div = $("<div id='img'></div>");
		uploadImg.append(img_div);

		var uploading_img = $("<img class='uploading_img' src='../images/camera.png'/>");
		img_div.append(uploading_img);

		var span_div = $("<span></span>");
		span_div.html("请上传PNG格式图片");
		img_div.append(span_div);

		var input_div = $("<input type='file' class='awardPic'/>");
		uploadImg.append(input_div);

		var li_2 = $("<li></li>");
		awardSet_list_ul.append(li_2);

		var select_div = $("<select class='select_flag'></select>");
		li_2.append(select_div);

		var input_3 = $("<input class='input_3' type='text' placeholder='奖品名称'/>");
		li_2.append(input_3);

		var probability_div = $("<div class='probability_div'></div>");
		li_2.append(probability_div);

		var input_4 = $("<input class='input_4' type='text' placeholder='抽中概率'/>");
		probability_div.append(input_4);

		var span_probability = $("<span></span>");
		span_probability.html("%");
		probability_div.append(span_probability);

		input_div.click(function () {
			var self = $(this);
			var inp = $(this)[0];
			var img = $(this).parents(".uploadImg").find('#img')[0];
			if (typeof(FileReader) === 'undefined') {
				result.innerHTML = "抱歉，你的浏览器不支持 FileReader，请使用现代浏览器操作！";
				inp.setAttribute('disabled', 'disabled');
			} else {
				inp.addEventListener('change', readFile, false);
			}

			function readFile() {
				var file = this.files[0];
				//这里我们判断下类型如果不是图片就返回 去掉就可以上传任意文件 
				if (!/image\/\w+/.test(file.type)) {
					alert("请确保文件为图像类型");
					return false;
				}
				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = function (e) {

					img.innerHTML = '<img src="' + this.result + '" alt=""/>';

					var position_flag = this.result.indexOf(";base64,");

					var img_base64_1 = this.result.substring(position_flag + 8);

					self.parents(".awardSet_list_ul").find(".img_base64").html(img_base64_1);

				}
			}
		})


		titck_drop_down_list_fun(select_div);


	})
	//功能点：更新转盘信息
	var new_turntable_data = {};
	var new_turntable_fun = function (new_turntable_data) {
		$(".shade_box").show();
		$(".loader_pic").show();
		$.ajax({
			url: $.baseUrl + "/TravelLive/index.php/Backuser/Account/new_turntable",
			type: 'POST',
			dataType: $.dataType,
			async: true,
			data: new_turntable_data,
			success: function (data) {
				console.log(data);
				if (data.status == "1") {
					$(".shade_box").hide();
					$(".loader_pic").hide();
					var txt = "抽奖工具设置成功！";
					window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
					console.log(data.msg);
				}
			}
		})
	}

	//点击保存

	$(".awardSetSave").click(function () {
		// if ($(".timeInput input").val() == "") {
		// 	var txt = "请完善转盘信息！";
		// 	window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
		// 	return;
		// }
		var new_turntable_array = [];
		for (var h = 0; h < $(".awardSet_list>.awardSet_list_ul").length; h++) {
			//判断是否信息填写完整
			if ($(".awardSet_list>.awardSet_list_ul").eq(h).find(".input_3").val() == "") {
				var txt = "请完善转盘信息！";
				window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
				return;
			}
			if ($(".awardSet_list>.awardSet_list_ul").eq(h).find(".input_4").val() == "") {
				var txt = "请完善转盘信息！";
				window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
				return;
			}
			var new_turntable_object = {};
			if ($(".awardSet_list>.awardSet_list_ul").eq(h).hasClass("newAddData")) {

				if ($(".awardSet_list>.awardSet_list_ul").eq(h).find(".img_base64").html() == "") {
					var txt = "请完善转盘信息！";
					window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.info);
					return;
				}

				new_turntable_object.ticket_id = $(".awardSet_list>.awardSet_list_ul").eq(h).find(".select_flag").val().split("-")[0];
				new_turntable_object.img = $(".awardSet_list>.awardSet_list_ul").eq(h).find(".img_base64").html();
				new_turntable_object.type = $(".awardSet_list>.awardSet_list_ul").eq(h).find(".select_flag").val().split("-")[1];
				new_turntable_object.name = $(".awardSet_list>.awardSet_list_ul").eq(h).find(".input_3").val();
				new_turntable_object.probability = $(".awardSet_list>.awardSet_list_ul").eq(h).find(".input_4").val();
				new_turntable_array.push(new_turntable_object);
			} else {
				new_turntable_object.turntable_id = $(".awardSet_list>.awardSet_list_ul").eq(h).find(".turntable_id_div").html();
				new_turntable_object.ticket_id = $(".awardSet_list>.awardSet_list_ul").eq(h).find(".select_flag").val().split("-")[0];
				if ($(".awardSet_list>.awardSet_list_ul").eq(h).find(".img_base64").html() == "") {

				} else {
					new_turntable_object.img = $(".awardSet_list>.awardSet_list_ul").eq(h).find(".img_base64").html();
				}
//				console.log(new_turntable_object.img);
				new_turntable_object.type = $(".awardSet_list>.awardSet_list_ul").eq(h).find(".select_flag").val().split("-")[1];
				new_turntable_object.name = $(".awardSet_list>.awardSet_list_ul").eq(h).find(".input_3").val();
				new_turntable_object.probability = $(".awardSet_list>.awardSet_list_ul").eq(h).find(".input_4").val();
				new_turntable_array.push(new_turntable_object);
			}
		}

		new_turntable_data.turntable = new_turntable_array;
		// new_turntable_data.minute = $(".timeInput input").val();
		console.log(new_turntable_data);
		var txt = "确定保存该转盘信息设置？";
		window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm, {
			onOk: function () {
				new_turntable_fun(JSON.stringify(new_turntable_data));
			}
		});
	})
})
















