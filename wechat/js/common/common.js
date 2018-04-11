/*获取url参数*/
function getparams(para) {
	var a = para.split("&");
	var c = {};
	$.each(a, function (i, val) {
		var b = val.split("=");
		c[b[0]] = b[1];
	});
	return c;
}
/*var para = location.search.replace("?", "");
	var obj = getparams(para);
*/
$(function () {
	$.config = {
		autoInit: true //no recommend
	}
});
