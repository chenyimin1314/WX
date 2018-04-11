$(function () {
  //功能点：观看直播总用户
  var all_manag_data = {};
  var all_manag_page = "0";
  var all_manag_fun = function () {
	$.ajax({
	  url: $.baseUrl + "/TravelLive/index.php/Backuser/Account/all_manag",
	  type: 'POST',
	  dataType: $.dataType,
	  async: false,
	  data: all_manag_data,
	  success: function (data) {
	  	var tempData = JSON.parse(JSON.stringify(all_manag_data));
	  	console.log(data,'userData');
		if (data.status == "1") {
			var obj = all_manag_data = {};
			if($(".user_manage_top_right>input").is(':checked') == true){
				obj.condition = 1;
			}else{
				obj.condition = "";
			}
			//分页
			$(".page_1").remove();
			var page_1 = $("<div class='page page_1'></div>");
			$(".user_manage_content").append(page_1);
			var tcdPageCode = $("<div class='tcdPageCode'></div>");
			page_1.append(tcdPageCode);
			$(".page_1 .tcdPageCode").createPage({
				pageCount: data.data.pageCount,
				current: tempData.page_num?tempData.page_num:1,
				backFn: function (p) {
					console.log(p,'页码');
					obj["page_num"] = p;
					console.log(obj,'传入的数据');
					all_manag_fun(obj);
				}
			});
		  if ($(".user_manage_content_list>ul").length != "0") {
			$(".user_manage_content_list>ul").remove();
		  }
		  all_manag_page = data.data.pageCount;
		  if (all_manag_data.condition == "") {
			if (data.data.all_user_num != null) {
			  $(".all_person").html(data.data.all_user_num);
			} else {
			  $(".all_person").html("0");
			}
		  } else {
		  }
		  var manag_list = data.data.manag_list;
		  if (manag_list != null) {
			for (var i = 0; i < manag_list.length; i++) {
			  var ul_div = $("<ul></ul>");
			  $(".user_manage_content_list").append(ul_div);
			  var li_1 = $("<li></li>");
			  li_1.html(manag_list[i].name?manag_list[i].name:"游客");
			  ul_div.append(li_1);
			  var li_2 = $("<li></li>");
			  li_2.html(manag_list[i].phone?manag_list[i].phone:"无");
			  ul_div.append(li_2);
			  var li_3 = $("<li></li>");
			  li_3.html(manag_list[i].city);
			  ul_div.append(li_3);
			  var li_4 = $("<li></li>");
			  li_4.html((manag_list[i].all_time / 60).toFixed(2));
			  ul_div.append(li_4);
			  var li_5 = $("<li></li>");
			  li_5.html(manag_list[i].create_at);
			  ul_div.append(li_5);

			  var li_6 = $("<li></li>");
			  li_6.html(manag_list[i].start_time);
			  ul_div.append(li_6);

			  var li_7 = $("<li></li>");
			  li_7.html(manag_list[i].char_num?manag_list[i].char_num:0);
			  ul_div.append(li_7);

			  var li_8 = $("<li></li>");
			  li_8.html(manag_list[i].forwarding?manag_list[i].forwarding:0);
			  ul_div.append(li_8);

			  var li_9 = $("<li></li>");
			  li_9.html("手机");
			  ul_div.append(li_9);

			  var li_10 = $("<li></li>");
			  if (manag_list[i].source == "1") {
				li_10.html("Android");
			  } else if (manag_list[i].source == "2") {
				li_10.html("iOS");
			  } else if (manag_list[i].source == "3") {
				li_10.html("微信");
			  }
			  ul_div.append(li_10);
			}

		  }
		}
	  }
	})
  };
  all_manag_data.condition = "";
  all_manag_fun(all_manag_data);
  $(".user_manage_top_right>input").change(function () {
	if ($(".user_manage_top_right>input").is(':checked') == true) {
		all_manag_data.condition = 1;
	} else {
		all_manag_data.condition = "";
	}
	all_manag_fun(all_manag_data);
  });
})
