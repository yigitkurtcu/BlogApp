const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");
const app = express();

//APP CONFİG
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());//MUST BE UNDER BODYPARSER

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);

//RESTFUL ROUTES

app.get("/", (req,res) =>{
    res.redirect("/blogs");
})
// INDEX ROUTE
app.get("/blogs", (req,res) =>{
    Blog.find({}, (err,blogs) => {
        if(err){
            console.log("Error : " + err);
        }else {
                res.render("index", {blogs:blogs});
        }
    })
})
// NEW ROUTE
app.get("/blogs/new", (req,res) =>{
     res.render("new");
})
// CREATE ROUTE
app.post("/blogs", (req,res) =>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err,newBlog) => {
        if(err){
            console.log("Error : " + err);
            res.render("new");
        }else{
             res.redirect("/blogs");
             console.log("Blog created : " + newBlog);
        }
    })
})

//SHOW ROUTE
app.get("/blogs/:id", (req,res) =>{
    Blog.findById(req.params.id, (err ,foundBlog) => {
        if(err){
            res.redirect("/blogs")
        }else{
            res.render("show", {blog: foundBlog})
        }
    })
})

//EDIT ROUTE
app.get("/blogs/:id/edit", (req,res) => {
    Blog.findById(req.params.id, (err, editBlog) => {
        if(err){
            res.send("err");
        }else{
            res.render("edit",{blog:editBlog})
        }
    })
})

//UPDATE ROUTE
app.put("/blogs/:id", (req,res) =>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    //blog.finbyidandupdate(id,newdata,callback)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog) =>{
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/" + req.params.id);
            console.log("Blog updated : " + updatedBlog);
        }   
    })
})

//DELETE ROUTE
app.delete("/blogs/:id", (req,res)=>{
    Blog.findByIdAndRemove(req.params.id, (err) =>{
        if(err){
            res.redirect("/blogs");
        }else {
            res.redirect("/blogs");
            console.log("Blog deleted!");
        }
    })
}) 


app.listen(3000, () =>{
    console.log("SERVER IS RUNNING...");
});
