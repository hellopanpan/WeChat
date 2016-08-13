
var MongoClient=require("mongodb").MongoClient;
var DB_CONN_STR="mongodb://localhost:27017/panpan";
/*
var insertData=function(db,callback){
	var data=[{"name":"panan","age":20},{"name":"hdhhd","age":22}];
	var collection=db.collection("user");
	collection.insert(data,function(err,result){
		if(err){
			console.log(err);
		}
		callback(result);
	})
};
*/
MongoClient.connect(DB_CONN_STR,function(err,db){
	if(err){
		console.log(err);
		return;
	};
	updataFn(db,function(result){
		console.log(result);
		db.close();
	});
});
function updataFn(db,callback){
	var whereStr={"name":"hdhhd"};
	var setStr={"age":1110};
	var collection=db.collection("user");
	collection.update(whereStr,{$set:setStr},function(err,result){
		if(err){
			console.log(err);
		}
		callback(result);
	});
}