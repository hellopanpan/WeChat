$(function(){
	var serverUri = "/wechartserver"
	var serverUri2 = "http://xpanpan.com:3080"
	// var serverUri = "http://localhost:3080" 更换为服务代理
	$("#content").height($(window).height()-100);
	$("#historyMsg").height($(window).height()-260);
	$(window).resize(function(){
		$("#content").height($(window).height()-100);
		$("#historyMsg").height($(window).height()-260);		
	});
	$("#regSubmit").click(function(){
		$("#regForm").submit();
	});
	$("#loginSubmit").click(function(){
		$("#loginForm").submit();
	});
	//socket主体
	var panpan={
		init:function(){
			var that=this;
			// this.socket = io( serverUri, {'transports': ['websocket', 'polling']});
			this.socket=io.connect(serverUri2);
			this.socket.on("connect",function(){
				console.log("is connect");
			})
			var panpanName=$.cookie('user');
			if(panpanName.trim().length!=0){
				this.socket.emit("login",panpanName);
			}else{
				console.log("cookie is invalid");
			};
			
			this.socket.on("loginsuccess",function(){
				document.title="hipanpan|"+$.cookie("user");
			});
			this.socket.on("system",function(name,length,type){
				$("#status").html(length);
				var msg=name+(type=="login"?" joined":" left");
				that.shownewFn('system',msg,'#ffbbbb');
				
			});
			$("#sendBtn").click(function(){
				var msg=$("#messageInput").val();
				if(msg.trim().length!=0){
					that.socket.emit("postMsg",msg);
					that.shownewFn("我",msg,"#fff");
					$("#messageInput").val('');
				}
			});
			this.socket.on('newMsg',function(name,msg){
				that.shownewFn(name,msg,"#10f4fc");
			})
			$("#sendBtn").click(function(){
				if($("#pic").val()){
					var file=$("#pic").get(0).files[0];
					var picArr=["jpg","JPG","jpeg","JPEG","png","PNG","gif","GIF"];
					var flg1=0;
					var flg2=0;
					function checkpicFn(){
						if(file.size/1024<1024){
							flg1=1;
						}else{
							alert("please upload the pic blow 1M!");
						};
						var nameArr=$("#pic").val().split(".");
						var nameStr=nameArr[nameArr.length-1];
						for(var i=0;i<picArr.length;i++){
							if(nameStr==picArr[i]){
								flg2=1;
							}
						};
						if(flg2==0){alert("please upload pic")};
					}
					checkpicFn();
					if((flg1==1)&&(flg2==1)){
						var reader=new FileReader();
						if(!reader){
							that.shownewFn("system","your system is not support fileReader");
						}else{
							reader.onload=function(e){
								$("#pic").val("");
								that.socket.emit("img",e.target.result);
								that.showimgFn("我",e.target.result);
							};
						};
						reader.readAsDataURL(file);	
					};	
				}else{
					
				}
			});
			this.socket.on("newPic",function(user,img){
				that.showimgFn(user,img);
			});
			var flag=0;
			$("#emojiBtn").click(function(){
				if(flag==0){
					$("#emoji").show();
					flag=1;
				}else{
					$("#emoji").hide();
					flag=0;
				}
			});
			this.showemojiFn();
			$("#emoji img").click(function(index){
				$("#messageInput").get(0).focus();
				$("#messageInput").val($("#messageInput").val()+'[emoji'+$(this).index()+']');
			})
			
		},
		shownewFn:function(user,msg,color){
			var date=new Date().toTimeString().substr(0,8);
			msg=this.showEmoji(msg);
			$("#historyMsg").html($("#historyMsg").html()+'<p style="color:'+(color||"#fff")+'">'+user+'<span class="timespan">('+date+')</span>：'+msg+'</p>');
			$("#historyMsg").scrollTop($("#historyMsg").get(0).scrollHeight);
		},
		showimgFn:function(user,img,color){
			var date=new Date().toTimeString().substr(0,8);
			$("#historyMsg").html($("#historyMsg").html()+'<p style="color:'+(color||"#fff")+'">'+user+'<span class="timespan">('+date+')</span><a href="javascript:void(0)">：<img src="'+img+'"></a></p>');
			$("#historyMsg").scrollTop($("#historyMsg").get(0).scrollHeight);
		},
		showemojiFn:function(){
			var str='';
			for(var i=0;i<20;i++){
				str+='<img src="./wechat/img/emoji/'+(i+1)+'.gif">'
			};
			$("#emoji").html(str);
		},
		showEmoji:function(msg){
			var result=msg;
			var reg=/\[emoji\d+\]/;
			var macth='';
			var emojiIndex='';
			while(match=reg.exec(result)){
				emojiIndex=match[0].slice(6,-1);
				result=result.replace(match[0],'<img src="img/emoji/'+emojiIndex+'.GIF">');
			}
			return result;
		},
	};
	function changeTop(){//改变注册和用户名等切换
		if($.cookie("user")){
			$("#btn1").hide();
			$("#btn2").hide();
			$("#btn3").show();
			$("#btn4").show();
			$("#btn3").html('<span class="glyphicon glyphicon-fire"></span>'+$.cookie("user"));
			$("#bg").hide();
			$(".content-1").show();
			panpan.init();
		}else{
			$("#btn3").hide();
			$("#btn4").hide();
			$("#btn1").show();
			$("#btn2").show();
			$("#bg").show();
			$(".content-1").hide();
		};
	};
	changeTop();
	$("#btn4").click(function(){
		$.removeCookie("user");
		changeTop();
		window.location.reload();
	});
	$("#regForm").validate({
		rules:{
			user:{
				required:true,
				minlength:3,
				remote:{
					url: serverUri + "/user",
					type:"POST",
				}
			},
			pass:{
				required:true,
				minlength:4,
			},
			email:{
				required:true,
				email:true,
			},
			
		},
		messages:{
			user:{
				required:"账号不为空",
				minlength:jQuery.format("账号不小于{0}"),
				remote:"账号被占用",
				
			},
			pass:{
				required:"密码不为空",
				minlength:jQuery.format("账号不小于{0}"),
			},
			email:{
				required:"邮箱不为空",
				email:"请输入正确的邮箱格式",
			},
			
		},
		//错误提示
		highlight:function(element,errorClass){
			$(element).closest('.form-group').addClass("has-error");
		},
		unhighlight:function(element,errorClass){
			$(element).closest('.form-group').removeClass("has-error");
		},
		wrapper:"p",
		//提交注册信息表
		submitHandler:function(form){
			$(form).ajaxSubmit({
				url: serverUri + "/reg",
				type:"POST",
				beforeSubmit:function(){
					
				},
				success:function(responseText,statusText){
					if(responseText==1){
						$.cookie("user",$("#regForm").find("input").eq(0).val());
						changeTop();
						console.log($.cookie("user"))	;
						$("#regForm").resetForm();
						$("#reg").modal("hide");
						
					}

				},
			});
		},
		
		
	});
	//登录
	$("#loginForm").validate({
		rules:{
			user:{
				required:true,
				minlength:3,	
			},
			pass:{
				required:true,
				minlength:4,
			},
			
		},
		messages:{
			user:{
				required:"账号不为空",
				minlength:jQuery.format("账号不小于{0}"),
				
			},
			pass:{
				required:"密码不为空",
				minlength:jQuery.format("账号不小于{0}"),
			},
			
		},
		//错误提示
		highlight:function(element,errorClass){
			$(element).closest('.form-group').addClass("has-error");
		},
		unhighlight:function(element,errorClass){
			$(element).closest('.form-group').removeClass("has-error");
		},
		wrapper:"p",
		//提交登录信息表
		submitHandler:function(form){
			$(form).ajaxSubmit({
				url: serverUri+ "/login",
				type: "POST",
				beforeSubmit:function(){
					
				},
				success:function(responseText,statusText){
					if(responseText=="true"){
						console.log("登录成功");
						$.cookie("user",$("#loginForm").find("input").eq(0).val());
						changeTop();	
						$("#loginForm").resetForm();
						$("#login").modal("hide");
						
					}else{
						console.log("登录失败");
					}
					
				},
			});
		},
		

	});
	function connectFn(){
		var hipanpan=new Panpan();
		hipanpan.init();	
	};

	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
});