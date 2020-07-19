var express = require("express");
var ejs = require("ejs");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var _ = require("lodash");
var nodemon = require("nodemon");

var app = express();

mongoose.connect("mongodb://localhost:27017/ItemsDataBase", {useNewUrlParser: true});

var Schema = new mongoose.Schema({
  name: String
});


var items = mongoose.model("items", Schema);


var arrayOfInsertedData = [];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.listen(3000, function(error, suc){
if(!error){
  console.log("Connected");
}
});

// collection.find({}, function(error, data){})
app.get("/", function(req, res){

items.find({}, function(error, datas){

if (error){
  console.log("error while fetch data base");
}else{
arrayOfInsertedData = datas;
if (arrayOfInsertedData.length == 0){
res.render("index", {Data: []});
}else {
res.render("index", {Data: arrayOfInsertedData});
}
}

});
});


// collection.insertOne({},function(error, data){})
app.post("/post", function(req,res){
var insertedData = req.body.addedData;

items.create({name: insertedData}, function(error, sucess){
  if (error){
    console.log("error Occured");
  }

if(sucess){
  console.log("Data is saved");
}

});

// res.render("index", {Data: arrayOfInsertedData});
res.redirect("/");

});

//collection.deleteOne({name: theItem, function(error){}})
app.post("/", function(req,res){

var theItem = req.body.checkBoxName;
// var index = arrayOfInsertedData.indexOf(theItem);
//
// arrayOfInsertedData.splice(index, 1);

items.deleteOne({_id: theItem}, function(error, deleted){

if(error){
  console.log("error while deleteing an item");
}

if(deleted){
  console.log("item is deleted");
}

});

res.redirect("/");

});
