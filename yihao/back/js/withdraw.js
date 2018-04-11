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
    //获取收支列表
    function getshoplist(params) {
        $.ajax({
            type: "post",
            url: $.baseUrl + "/Backuser/User/shop_profit_audit_info",
            data: params,
            dataType: $.dataType,
            success: function (res) {
                console.log(res);
                if (res.status == 1) {
                    setData(res.data);
                    if ($("#pager").length >= 1) {
                        $("#pager").empty();
                        var el = $("#pager").parent();
						var pager = $('<div>',{"id":"pager","class":"tcdPageCode"});
                        page_num = params.page_num ? params.page_num : 1;
						pager.createPage({
                            pageCount: res.data.pageCount,
                            current: page_num,
                            backFn: function (e) {
                            	console.log(e,11111);
                                var mparams = getListPara();
                                mparams.page_num = e;
                                getshoplist(mparams);
                            }
                        });
                        el.append(pager);
                    }
                } else if (res.status == 3) {
                    toLogin();
                } else {
                    console.log(res);
                    $("#tbody").empty().append('<tr><td colspan="7">未查询到数据</td></tr>');
                }
            }
        });
    }
    getshoplist(getListPara());
    //设置统计列表
    function setData(data) {
        console.log(data);
        $('#tbody').empty();
        if (data.audit_info_list == null) {
            $("#tbody").empty().append('<tr><td colspan="7">未查询到数据</td></tr>');
            return 0;
        };
        $.each(data.audit_info_list, function (i, val) {
            var tr = $('<tr/>').data('info', JSON.stringify(val));
            var td0 = $('<td>').text(val.type);
            var td1 = $('<td>').text(val.account);
            var td2 =  $('<td>').text(val.paied_money);
            var proportion = val.proportion?val.proportion*100:0;
            var td3 = $('<td>').text(proportion + "%");
            var td4 = $('<td>').text(val.unpaied_money);
			var txt = "";
			var td5 = $('<td>').text(val.create_time);
			if(val.state == 0){
				txt = "申请中";
			}else if(val.state == 1){
				txt = '申请成功';
			}else if(val.state == 2){
				txt = "申请失败";
			}
			var td6 = $('<td>').text(txt);
            tr.append(td0).append(td1).append(td2).append(td3).append(td4).append(td5).append(td6);
            $('#tbody').append(tr);
        });
    }
    //获取参数
    function getListPara() {
        var obj = {};
        if ($('#dropdownMenu1').val()) obj.start_time = $('#dropdownMenu1').val() + ' 00:00:00';
        if ($('#dropdownMenu2').val()) obj.end_time = $('#dropdownMenu2').val() + ' 23:59:59';
        var type = $('#list_type').data('type');
        if (type > -1) obj.type = type;
        console.log(obj, 'obj');
        return obj;
    }
    $('#list_type').on('click','li a',function () {
        var type = $(this).data('type');
        $('#list_type').data('type',type);
        $('#list_type_value').val($(this).text());
        getshoplist(getListPara());
    });
    //日期查询
    $('#search_list_date').on('click', function () {
        getshoplist(getListPara());
    });
});