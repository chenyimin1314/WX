$(function () {
	ajax($.baseUrl + '/Back/Index/sys_proportion',null,function (res) {
		console.log(res);
		$('.flex').eq(0).find('.form-control').val(res.data.proportion_list[1].proportion * 100 + '%').data(res.data.proportion_list[1]);
		$('.flex').eq(1).find('.form-control').val(res.data.proportion_list[0].proportion * 100 + '%').data(res.data.proportion_list[0]);
	})
});
var reg = /^\d{1,3}%$/;
$('.flex').on('click','.btn-group',function () {
	var data = $(this).siblings('.form-control').data();
	var val =$(this).siblings('.form-control').val();
	console.log(reg.test(val));
	if(!reg.test(val)){
		return myAlert("佣金比例格式输入错误");
	};
	if( parseInt(val) > 100){
		return myAlert("佣金比例不得大于一百");
	}
	data.proportion = parseInt(val)/100;
	console.log(data);
	ajax($.baseUrl + '/Back/Index/edit_proportion',data,function (res) {
		myAlert('佣金比例设置成功');
	})
});
