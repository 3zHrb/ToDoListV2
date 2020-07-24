var express = require("express");
var ejs = require("ejs");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var _ = require("lodash");
var nodemon = require("nodemon");

var app = express();
var arrayOfInsertedData = [];
var currentPara;

// creating a database if it does not exist + connect to interval
// if database alreday exist it will just connect to it
mongoose.connect("mongodb://localhost:27017/ItemsDataBase", {useNewUrlParser: true});

// strarting first collection *******************
// create sechamatic
var Schema1 = new mongoose.Schema({
  name: String
});
//create the collection
var items = mongoose.model("items", Schema1);
// ******************* ending the first collection

// strarting second collection *******************

//creating schematic for the first collection

var Schema2 = new mongoose.Schema({
  route: String,
  itsList: [Schema1]
});
// create the collection
var parametersWithItems = mongoose.model("routeDatabase",Schema2);



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
res.render("index", {Data: [], route: "/"});
}else {
res.render("index", {Data: arrayOfInsertedData, route: "/"});
}
}

});
});

app.get("/:para", function(req, res){

var parameter = req.params.para;

currentPara = parameter;

parametersWithItems.findOne({route: parameter}, function(error, data){

if(data){

res.render("index", {Data: data, route:parameter});

}else{
  parametersWithItems.create({route: parameter, itsList: []}, function(error, passed){
    if(error){
      console.log("there is an error creating parameter with list");
    }
    if(passed){
      console.log("parameter and list are saved");
    }
  });
}

});

res.redirect("/"+currentPara);

});

app.get("/" + currentPara, function(req, res){

parametersWithItems.find({route: currentPara}, function(error, data){
  res.render("index", {Data: data, route:currentPara});
});

});


// collection.insertOne({},function(error, data){})
app.post("/post", function(req,res){
var insertedData = req.body.addedData;
var route = req.body.route;

var rowOfItem = new items({name: insertedData});

parametersWithItems.findOneAndUpdate({route: route}, {itsList: insertedData}, function(error, succ){

if(error){
  console.log("error while updating the itsList");
}

if(succ){
  console.log("data is updated");
}

});

//*********
// items.create({name: insertedData}, function(error, sucess){
//   if (error){
//     console.log("error Occured");
//   }
//
// if(sucess){
//   console.log("Data is saved");
// }
//
// });
//*********
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
