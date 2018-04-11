$(function(){
	//功能点：用户审核列表
	var pageNum = "1";
	var all_pageCount_1 = "0";
	var audit_list = function(pageNum){
		$.ajax({  
		    url:$.baseUrl + "/TravelLive/index.php/Backuser/Account/mount_to_business_list", 
		   	type:'POST',
		    dataType:$.dataType,
		    async: false,   
		    data:{
		    	'page_num':pageNum
		    },
		    success:function(data){
		    	if(data.status == "1"){
		    		if($(".audit_content_list_details>ul").length != "0"){
		    			$(".audit_content_list_details>ul").remove();
		    		}
		    		all_pageCount_1 = data.data.pageCount;
		    		var mount_to_business_list= data.data.mount_to_business_list;
		    		if(mount_to_business_list != null){
			    		for(var i=0; i<mount_to_business_list.length;i++){
			    			var ul_div = $("<ul class='ul_div'></ul>");
			    			$(".audit_content_list_details").append(ul_div);
			    			//保存ID
			    			var id_save = $("<div class='save_id'></div>");
			    			id_save.html(mount_to_business_list[i].user_id);
			    			ul_div.append(id_save);
			    			var li_1 = $("<li></li>");
			    			li_1.html(mount_to_business_list[i].name);
			    			ul_div.append(li_1);
			    			
			    			var li_1_ = $("<li></li>");
			    			ul_div.append(li_1_);
			    			
			    			var img_header = $("<img class='img_header'/>");
			    			img_header.attr("src",mount_to_business_list[i].head_image_url);
			    			li_1_.append(img_header);
			    			
			    			var li_2 = $("<li></li>");			    			
			    			li_2.html(mount_to_business_list[i].phone);			    			
			    			ul_div.append(li_2);
			    			
			    			var li_3 = $("<li></li>");
			    			li_3.html(mount_to_business_list[i].sex);
			    			ul_div.append(li_3);
			    					    			
			    			var li_4 = $("<li></li>");			    		
			    			li_4.html(mount_to_business_list[i].level);
			    			ul_div.append(li_4);
			    			
			    			var li_5 = $("<li></li>");			    		
			    			li_5.html(mount_to_business_list[i].fans);
			    			ul_div.append(li_5);
			    			
			    			var li_6 = $("<li></li>");			    		
			    			li_6.html(mount_to_business_list[i].follow);
			    			ul_div.append(li_6);
			    			
			    			var li_7 = $("<li></li>");			    		
			    			li_7.html(mount_to_business_list[i].age);
			    			ul_div.append(li_7);
			    			
			    			var li_8 = $("<li></li>");			    		
			    			li_8.html(mount_to_business_list[i].local_city);
			    			ul_div.append(li_8);
			    			
			    			var li_9 = $("<li></li>");			    		
			    			li_9.html(mount_to_business_list[i].create_at);
			    			ul_div.append(li_9);
			    			
			    			var li_10 = $("<li class='audit_option'></li>");	
			    			if(mount_to_business_list[i].state == "0"){
			    				var a_1 = $("<a></a>");
			    				a_1.html("通过");
			    				li_10.append(a_1);
			    				
			    				var a_2 = $("<a></a>");
			    				a_2.html("不通过");
			    				li_10.append(a_2);
			    			}else if(mount_to_business_list[i].state == "1"){
			    				li_10.html("通过");
			    			}else if(mount_to_business_list[i].state == "2"){
			    				li_10.html("不通过");
			    			}	
			    			ul_div.append(li_10);
			    			
			    			var li_11 = $("<li></li>");			    		
			    			ul_div.append(li_11);
			    			
			    			var li_11_a = $("<a class='unbind'></a>");
			    			
			    			if(mount_to_business_list[i].state == "1"){
			    				li_11_a.html("解绑");
			    			}else{
			    				li_11_a.html("未绑定");
			    			}
			    			
			    			li_11.append(li_11_a);
			    			
			    		}
			    		
			    		//功能点：申请挂载审核
			    		
			    		$(".audit_option>a").click(function(){
			    			var audit_data = {};
			    			var index_value = $(this).index() + 1;
			    			audit_data.user_id = $(this).parents(".ul_div").find(".save_id").html();
			    			audit_data.state = index_value;
			    			console.log(audit_data);
			    			
			    			if($(this).index() == "0"){
			    				var txt=  "审核通过该主播？";
			    			}else {
			    				var txt=  "审核不通过该主播？";
			    			}
			    			
						    window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm,{
						        onOk:function(){
						        	$.ajax({  
									    url:$.baseUrl + "/TravelLive/index.php/Backuser/Account/mount_to_business_audit", 
									   	type:'POST',
									    dataType:$.dataType,
									    async: false,   
									    data:audit_data,
									    success:function(data){
									    	console.log(data);
									    	if(data.status == "1"){
									    		console.log(data.msg);
									    		audit_list(pageNum);
									    	}
									    }
									})
						        }
						    });

			    		})

			    		//解绑
			    		$(".unbind").click(function(){
			    			var user_id = $(this).parents(".ul_div").find(".save_id").html();
			    			
			    			if($(this).html().trim() == "解绑"){
			    				var txt=  "确定解绑该主播？";
				    			window.wxc.xcConfirm(txt, window.wxc.xcConfirm.typeEnum.confirm,{
							        onOk:function(){
							        	$.ajax({  
										    url:$.baseUrl + "/TravelLive/index.php/Backuser/Account/cancel", 
										   	type:'POST',
										    dataType:$.dataType,
										    async: false,   
										    data:{
										    	'user_id':user_id
										    },
										    success:function(data){
										    	console.log(data);
										    	if(data.status == "1"){
										    		console.log(data.msg);
										    		audit_list(pageNum);
										    	}
										    }
										})
							        }
							    });
			    			}else{
			    				
			    			}
			    			
			    			
			    		})
			    		
		    		}
		    		
		    		 
		    	}
		    }
		})    
	}
	audit_list(pageNum);
	
	 //分页
	$(".tcdPageCode").createPage({
		
        pageCount:all_pageCount_1,
        current:1,
        backFn:function(p){
   			pageNum = p;
   			audit_list(pageNum);
            
        }
    });
   
	
	
	
	
	
	 
	 
	
 
    
   
    
    
   
    
   
})






















