var http=require("http");
var express=require("express");
var fs=require("fs");
var url=require("url");
var querystring=require("querystring");
var MongoClient=require("mongodb").MongoClient;
var DB_CONN_STR="mongodb://localhost:27017/panpan";
//var app=express();
var file=__dirname+"/ajax1.html";
var server=http.createServer();
//var io=require("socket.io").listen(server);
var users=[];

//app.use("/",express.static(__dirname+"/xpanpan9"));
server.listen(3000);
server.on("request",function(req,res){
	var urlStr=url.parse(req.url);
	
	switch(urlStr.pathname){
		case "/user":
			var str='';
			req.on("data",function(chunk){
				str+=chunk;
			});
			req.on("end",function(){
				var strSub=querystring.parse(str);
				function findFn(db,callback){
					var whereStr={"name":strSub.user};
					var collection=db.collection("user");
					collection.find(whereStr).sort({"pass":1}).toArray(function(err,result){
						if(err){
							console.log(err);
						}
						callback(result);
					});
				};
				MongoClient.connect(DB_CONN_STR,function(err,db){
					if(err){
						console.log(err);
						return;
					};
					findFn(db,function(result){
						res.writeHead(200,'',{"content-type":"text/plain;charset=utf-8","Access-Control-Allow-Origin":"*"});
						if(result.length==0){
							res.end("true");
						}else{
							res.end("false");
						}
						
						db.close();
					});
				});
			});
			break;
		case "/reg":
			var str='';
			req.on("data",function(chunk){
				str+=chunk;
			});
			req.on("end",function(){
				var strSub=querystring.parse(str);
				function insertFn(db,callback){
					var insertStr={"name":strSub.user,"pass":strSub.pass,"email":strSub.email};
					var collection=db.collection("user");
					collection.insert(insertStr,function(err,result){
						if(err){
							console.log(err);
						}
						callback(result);
					});
				};
				MongoClient.connect(DB_CONN_STR,function(err,db){
					if(err){
						console.log(err);
						return;
					};
					insertFn(db,function(result){
						console.log(result);
						res.writeHead(200,'',{"content-type":"text/plain;charset=utf-8","Access-Control-Allow-Origin":"*"});
						res.end("1");
						db.close();
					});
				});
							
				
				res.writeHead(200,'',{"content-type":"text/plain;charset=utf-8","Access-Control-Allow-Origin":"*"});
				res.end("1");
			});
			break;
		case "/login":
			var str='';
			req.on("data",function(chunk){
				str+=chunk;
			});
			req.on("end",function(){
				var strSub=querystring.parse(str);
				function findFn(db,callback){
					var whereStr={"name":strSub.user,"pass":strSub.pass};
					var collection=db.collection("user");
					collection.find(whereStr).sort({"pass":1}).toArray(function(err,result){
						if(err){
							console.log(err);
						}
						callback(result);
					});
				};
				MongoClient.connect(DB_CONN_STR,function(err,db){
					if(err){
						console.log(err);
						return;
					};
					findFn(db,function(result){
						console.log(result.length);
						res.writeHead(200,'',{"content-type":"text/plain;charset=utf-8","Access-Control-Allow-Origin":"*"});
						if(result.length>=1){
							res.end("true");
						}else{
							res.end("false");
						};
						db.close();
					});
				});
			});
			break;
		default:
			res.writeHead(200,'',{"content-type":"text/html;charset=utf-8","Access-Control-Allow-Origin":"*"});
			res.end("错误");
			break;
		
	};
	
	
	
});
function readfileFn(file,res){
	fs.readFile(file,function(err,data){
		res.writeHead(200,'',{"content-type":"text/html;charset=utf-8","Access-Control-Allow-Origin":"*"});
		res.write("<h1>nihao</h1>");
		res.end(data);
		
	});
	
};