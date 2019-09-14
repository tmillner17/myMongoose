const cheerio = require('cherrio');
const axios = require('axios');
const express = require('express');
const handlebars = require('handlebars');

var db = require('./models');
var port = 8081;
var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

app.get("/scrape", function (req, res) {
    axios.get("").then(function (response) {
        var $ = cheerio.load(response.data);
        $('article h2').each(function (i, element) {
            var result = {};
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr('href');
            db.article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
        res.send("Scrape complete");
    });
});

app.get("/aritcles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findone({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err)
        });
});

app.post("/article/:id", function (req.res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }), ({ note: dbNote._id }), ({ new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle)
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.listen(PORT, function () {
    console.log("Server is listening on port" + PORT + "!");
});

