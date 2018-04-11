$(function () {
	var arr = ['netred_confirm','shop_confirm','money_confirm','money_set','netred_confirm','shop_confirm','money_record'];
	$('.row').on('click','.flex_row',function () {
		var index = $(this).index();
		location.href = '../html/' + arr[index] + '.html'
	})
	//获取概览数据
	ajax($.baseUrl + '/Back/Index/index_top',{},function (res) {
		console.log(res.data);
		var r = res.data.index_top;
		$('.row .flex_row').eq(0).find('.num').text(r.sum_audit_red_net?r.sum_audit_red_net:0);
		$('.row .flex_row').eq(1).find('.num').text(r.sum_audit_shop?r.sum_audit_shop:0);
		var num = parseInt(r.sum_shop_profit?r.sum_shop_profit:0) + parseInt(r.sum_red_net_profit?r.sum_red_net_profit:0);
		$('.row .flex_row').eq(2).find('.num').text(num);
		$('.row .flex_row').eq(4).find('.num').text(r.sum_red_net?r.sum_red_net:0);
		$('.row .flex_row').eq(5).find('.num').text(r.sum_shop?r.sum_shop:0);
		$('.row .flex_row').eq(6).find('.num').text(r.sum_profit?r.sum_profit:0);
	});
});