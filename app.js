//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// creation connection
mongoose.connect("mongodb+srv://admin-ask:qwerty%4064@todolist.qcgrr.mongodb.net/todolistDB",{useNewUrlParser:true});

// creating schema
const itemsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name : "to-do-list"
});
const item2 = new Item({
  name :"click on + button to item"
});
const item3 = new Item({
  name : "<-- click to delete this"
});

const defaultItems = [item1,item2,item3]

const listSchema = new mongoose.Schema({
  title : String,
  items : [itemsSchema]
});
  

const List = mongoose.model("List",listSchema);




app.get("/", function (req, res) {
  Item.find({}, function (err, founditems) {
    if (founditems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("succesfully inserted");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "today", newListItems: founditems });
    }
  });
});



app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const upcomingItem = new Item({
    name : itemName
  })

  upcomingItem.save();

  res.redirect("/");

});

app.post("/delete",function(req,res){

  const deleteItemId = req.body.checkbox;
 Item.findByIdAndRemove({_id: deleteItemId},function(err){
   if (err){
     console.log(err)
   }else{
    res.redirect("/")
     console.log("successfully deleted item")
   }
 });

})

app.get("/:customListName",function(req,res){
  const customListName = req.params.customListName;

  List.findOne({name: customListName},function(err, foundList){
    if(!err){
      if(!foundList){
        //create list
        const newListItem = new List({
          name : customListName,
          items : defaultItems
        });
        newListItem.save();
        res.redirect("/"+ customListName);
      }else{
        // show existing list 
        res.render("list",{ listTitle: foundList.name, newListItems: foundList.items });
      }
    }
  });
});



// app.get("/work", function (req, res) {
//   res.render("list", { listTitle: "Work List", newListItems: workItems });
// });

app.get("/about", function (req, res) {
  res.render("about");
});


let port = process.env.PORT 
if (port== null || port==""){
  port = 3000
}
app.listen(port, function () {
  console.log("http://localhost:" + 3000);
});
