var http=require("http");
var express=require("express");
var fs=require("fs");
var url=require("url");
var querystring=require("querystring");
// 映入mongoose
var mongoose = require("mongoose");
DB_URL = 'mongodb://localhost:27017/xpanpanwechart';
mongoose.connect(DB_URL);
mongoose.connection.on('connected', function (err) {  
	if(err){
		console.log(err);
		return;
	}
  console.log('mongo connected');  
}); 
mongoose.connection.on('error',function (err) {    
	console.log('Mongoose error: ' + err);  
}); 
mongoose.connection.on('disconnected', function () {    
    console.log('Mongoose disconnected');  
});

let userNum = new mongoose.Schema({ //table 模式,数据模型
	name:{
		type: String,
		default: "panpan"
	},
	pass:{
		type: String,
		default: "20"
	},
	email: {
		type: String,
		default: "20"
	}
});

let User = mongoose.model('userNummm', userNum);
// userNummms 为collection的名称 查询；db.userNummms.find()

//var app=express();
var file=__dirname+"/ajax1.html";
var server=http.createServer();
//var io=require("socket.io").listen(server);
var users=[];
console.log('wel api')
//app.use("/",express.static(__dirname+"/xpanpan9"));
server.listen(3000);
server.on("request",function(req,res){
	res.setHeader("Access-Control-Allow-Origin", "*"); 
	var urlStr=url.parse(req.url);
	console.log(req.url)
	switch(urlStr.pathname){
		case "/user":
			var str='';
			req.on("data",function(chunk){
				str+=chunk;
			});
			req.on("end",function(){
				var strSub=querystring.parse(str);
				// function findFn(db,callback){
				// 	var whereStr={"name":strSub.user};
				// 	var collection=db.collection("user");
				// 	collection.find(whereStr).sort({"pass":1}).toArray(function(err,result){
				// 		if(err){
				// 			console.log(err);
				// 		}
				// 		callback(result);
				// 	});
				// };
				console.log('eeee')
				var whereStr={"name":strSub.user};
				User.find(whereStr).count().exec((err, ress) => {
					if(err) {
						res.sendStatus(500)
					} else {
						if(ress == 0){
							res.end("true");
						}else{
							res.end("false");
						}
					}
				})
				// MongoClient.connect(DB_CONN_STR,function(err,db){
				// 	if(err){
				// 		console.log(err);
				// 		return;
				// 	};
				// 	console.log('error')
				// 	findFn(db,function(result){
				// 		res.writeHead(200,'',{"content-type":"text/plain;charset=utf-8","Access-Control-Allow-Origin":"*"});
				// 		if(result.length==0){
				// 			res.end("true");
				// 		}else{
				// 			res.end("false");
				// 		}
						
				// 		db.close();
				// 	});
				// });
			});
			break;
		case "/reg":
			var str='';
			req.on("data",function(chunk){
				str+=chunk;
			});
			req.on("end",function(){
				var strSub=querystring.parse(str);
				var insertStr={
					name: strSub.user,
					pass: strSub.pass,
					email: strSub.email
				};
				var user = new User(insertStr)
				user.save((err, ress) => {
					if (err) {
						console.log(err)
						res.sendStatus(500)
					} else {
						console.log('insert it')
						res.writeHead(200,'',{"content-type":"text/plain;charset=utf-8","Access-Control-Allow-Origin":"*"});
						res.end("1");
					}
				})
				// function insertFn(db,callback){
				// 	var insertStr={"name":strSub.user,"pass":strSub.pass,"email":strSub.email};
				// 	var collection=db.collection("user");
				// 	collection.insert(insertStr,function(err,result){
				// 		if(err){
				// 			console.log(err);
				// 		}
				// 		callback(result);
				// 	});
				// };
				// MongoClient.connect(DB_CONN_STR,function(err,db){
				// 	if(err){
				// 		console.log(err);
				// 		return;
				// 	};
				// 	insertFn(db,function(result){
				// 		console.log(result);
				// 		res.writeHead(200,'',{"content-type":"text/plain;charset=utf-8","Access-Control-Allow-Origin":"*"});
				// 		res.end("1");
				// 		db.close();
				// 	});
				// });
			});
			break;
		case "/login":
			var str='';
			req.on("data",function(chunk){
				str+=chunk;
			});
			req.on("end",function(){
				var strSub=querystring.parse(str);
				var whereStr={"name":strSub.user,"pass":strSub.pass};
				User.find(whereStr).count().exec((err, ress) => {
					if (err) {
						console.log(err)
						res.sendStatus(500)
					} else {
						console.log('insert it')
						res.writeHead(200,'',{"content-type":"text/plain;charset=utf-8","Access-Control-Allow-Origin":"*"});
						if(ress > 0){
							res.end("true");
						}else{
							res.end("false");
						}
					}
				})
				// function findFn(db,callback){
				// 	var whereStr={"name":strSub.user,"pass":strSub.pass};
				// 	var collection=db.collection("user");
				// 	collection.find(whereStr).sort({"pass":1}).toArray(function(err,result){
				// 		if(err){
				// 			console.log(err);
				// 		}
				// 		callback(result);
				// 	});
				// };
				// MongoClient.connect(DB_CONN_STR,function(err,db){
				// 	if(err){
				// 		console.log(err);
				// 		return;
				// 	};
				// 	findFn(db,function(result){
				// 		console.log(result.length);
				// 		res.writeHead(200,'',{"content-type":"text/plain;charset=utf-8","Access-Control-Allow-Origin":"*"});
				// 		if(result.length>=1){
				// 			res.end("true");
				// 		}else{
				// 			res.end("false");
				// 		};
				// 		db.close();
				// 	});
				// });
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
