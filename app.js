var http=require("http");
var express=require("express");
var app=express();
var server=http.createServer(app);
server.listen(3030);
// 静态资源服务器
app.all("*", (req, res, next) => {
	console.log('welcome')
	next()
})
app.use("/",express.static(__dirname+"/xpanpan10"));

