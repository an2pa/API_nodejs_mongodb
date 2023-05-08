
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));





app.use(express.static("public"));


app.get("/", function (req, res) {
    res.send("hello there")
})




//connecting to database:


const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/WikiDB');
        console.log("MongoDB connected");
    } catch (err) {
        console.log("Failed", err);
    }
}
connectDB();


const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "No name specified!"]
    },
    content: String
})

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get(function (req, res) {
        const promise = Article.find().exec();
        promise.then(function (err, doc) {
            if (!err) {
                res.send(doc);
            }
            else {
                res.send(err);
            }
        })
    })
    .post(function (req, res) {

        const article = new Article({
            title: req.body.title,
            content: req.body.content
        })
        article.save()

        console.log(req.body.title)

    })
    .delete(function (req, res) {

        Article.deleteMany().exec();

    })


app.route("/articles/:articleTitle")
    .get(function (req, res) {
        console.log(req.params.articleTitle)
        const foundArticle = Article.findOne({ title: req.params.articleTitle }).exec();
        foundArticle.then(function (doc) {
            if (doc) {
                res.send(doc);
            }
            else {
                res.send("No such document!")
            }
        })

    })
    .put(function(req,res){
        const update=Article.findOneAndUpdate({title: req.params.articleTitle},{title: req.body.title,
            content: req.body.content} , {
            overwrite:true
          });
        update.then(function(doc){
            console.log(doc)
        })
    })
    .patch(function(req,res){
        const update=Article.findOneAndUpdate({title: req.params.articleTitle},{$set:req.body});
        update.then(function(doc){
            if(!doc){
                res.send("Failed to update!")
            }
            else{
                res.send("successfully updated!")
            }
        })

    })
    .delete(function (req, res) {
        console.log(req.params.articleTitle)
        const deleteF = Article.findOneAndDelete({ title:req.params.articleTitle  }).exec();
        deleteF.then(function (doc) {
            console.log("Successfully deleted " + doc.title)
        })
    })




app.listen(3000, function () {
    console.log("Server started on 3000")
})