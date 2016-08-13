var http=require("http");
var express=require("express");
var app=express();
var server=http.createServer(app);
var io=require("socket.io").listen(server);
var users=[];
app.use("/",express.static(__dirname+"/xpanpan9"));
server.listen(3030);
io.on("connection",function(socket){
	socket.on("login",function(name){
		
		socket.userIndex=users.length;//进入前users的的length
		socket.name=name;
		users.push(name);
		socket.emit("loginsuccess");
		io.sockets.emit("system",name,users.length,"login");
		console.log(socket.name);
		socket.on("disconnect",function(){
			users.splice(socket.userIndex,1);
			socket.broadcast.emit("system",name,users.length,"logout");
		});
		
	});
	socket.on("postMsg",function(msg){
		socket.broadcast.emit("newMsg",socket.name,msg);			
	});
	socket.on("img",function(imgData){
		socket.broadcast.emit("newPic",socket.name,imgData);
	})
	
});
