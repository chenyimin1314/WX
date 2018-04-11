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
	function getparams(){
		var keyword = $('').val();
	}
	//保存商家列表
    var mechant = $('#table thead tr').clone(true);
	var netRed = '<tr><th>订单号</th><th>商品名称</th><th>商品编号</th><th>买家</th><th>网红昵称</th><th>金额（元）</th><th>收益（元）</th><th>交易日期</th><th>订单状态</th></tr>'
    //获取收支列表
    function getshoplist(params) {
	    var url = '';
	    var type = $('#mechant').data('type');
	    //0是商家 1是网红
	    if(type == 0){
            url = $.baseUrl + "/Backuser/User/money_detailed"
        }else{
	        url =  $.baseUrl + '/Backuser/User/rednet_money_detailed';
        }
        $.ajax({
            type: "post",
            url: url,
            data: params,
            dataType: $.dataType,
            success: function (res) {
                if (res.status == 1) {
                    setData(res.data);
                    if ($("#pager").length >= 1) {
                        $("#pager").empty();
                        page_num = params.page_num ? params.page_num : 1;
                        $('#pager').createPage({
                            pageCount: res.data.pageCount,
                            current: page_num,
                            backFn: function (e) {
                                var mparams = getListPara();
                                mparams.page_num = e;
                                getshoplist(mparams);
                            }
                        })
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
    $('#mechant_type').on('click','a',function () {
       var type = $(this).data('type');
       $('#mechant').data('type',type).val($(this).text());
		getshoplist(getListPara());
	});
    function setData(data) {
        $('#table thead').empty();
        $('#tbody').empty();
        if($('#mechant').data('type') == 0){
			$('#table thead').append(mechant);
			if (data.sale_des_list == null) {
				$("#tbody").empty().append('<tr><td colspan="7">未查询到数据</td></tr>');
				return ;
			};
			$.each(data.sale_des_list, function (i, val) {
				var tr = $('<tr/>').data('info', JSON.stringify(val));
				var td0 = $('<td>').text(val.order_id);
				var td1 = $('<td>').text(val.product_name);
				var td2 = $('<td>').text(val.user_name);
				var td3 = $('<td>').text(val.sum_price);
				var td4 = $('<td>').text(val.created_at);
				var txt = '';
				switch (Number(val.state)){
					case 0: txt = '待付款';break;
					case 1: txt = '待发货';break;
					case 2: txt = '已发货';break;
					case 3: txt = '已完成';break;
					case 4: txt = '退款中';break;
					case 5: txt = '已退款';break;
					case 6: txt = '待消费';break;
					case 7: txt = '退款驳回';break;
					default:
						console.log('其他状态，请检查');
						break;
				}
				var td5 = $('<td>').text(txt);
				var source = val.user_type == 1?"网红":"商家";
				var td6 = $("<td>").text("来源于" + source);
				tr.append(td0).append(td1).append(td2).append(td3).append(td4).append(td5).append(td6);
				$('#tbody').append(tr);
			});
        }else{
			//网红收支详情
			$('#table thead').append(netRed);
            $('#table thead tr').html();
			if (data.redent_money == null) {
				$("#tbody").empty().append('<tr><td colspan="9">未查询到数据</td></tr>');
				return ;
			};
			$.each(data.redent_money, function (i, val) {
				var tr = $('<tr/>').data('info', JSON.stringify(val));
				var td0 = $('<td>').text(val.order_id);
				var td1 = $('<td>').text(val.name);
				var td2 = $('<td>').text(val.product_id);
				var td3 = $('<td>').text(val.user_name);
				var td4 = $('<td>').text(val.rednet_name);
				var td5 = $('<td>').text(val.price);
				var td6 = $('<td>').text(val.rednet_profit);
				var td7 = $('<td>').text(val.created_at);
				var txt = '';
				switch (Number(val.state)){
                    case 0:txt = '待付款';break;
					case 1: txt = '待发货';break;
					case 2: txt = '已发货';break;
					case 3: txt = '已完成';break;
					case 4: txt = '退款中';break;
					case 5: txt = '已退款';break;
					case 6: txt = '待消费';break;
					case 7: txt = '退款驳回';break;
					default:
						console.log('其他状态，请检查');
						break;
				}
				var td8 = $('<td>').text(txt);
				tr.append(td0).append(td1).append(td2).append(td3).append(td4).append(td5).append(td6).append(td7).append(td8);
				$('#tbody').append(tr);
			});
        }


    }
    //获取参数
    function getListPara() {
        var obj = {};
        if ($('#keyword_list').val()) obj.order_id = $('#keyword_list').val();
        if ($('#dropdownMenu1').val()) obj.start_time = $('#dropdownMenu1').val() + ' 00:00:00';
        if ($('#dropdownMenu2').val()) obj.end_time = $('#dropdownMenu2').val() + ' 23:59:59';
        var type = $('#list_type').data('type');
        if (type > -1) obj.type = type;
        return obj;
    }
    $('#list_type').on('click','li a',function () {
        var type = $(this).data('type');
       	$('#list_type').data('type',type);
        $('#list_type_value').val($(this).text());
       	console.log(type);
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
});