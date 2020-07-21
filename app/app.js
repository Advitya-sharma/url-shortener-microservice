"use strict";

var express = require("express");
var mongo = require("mongodb");
var mongoose = require("mongoose");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();
var dns = require("dns");
require("dotenv").config();
const urlExists = require("url-exists");

// Basic Configuration
var port = process.env.PORT || 3000;
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Schema = mongoose.Schema;

const urlObjSchema = new Schema({
  url: { type: String },
  urlId: { type: Number },
});

const urlObj = mongoose.model("urlObj", urlObjSchema);

app.use("/public", express.static(process.cwd() + "/public"));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.get("/api/shorturl/:id", (req, res) => {
  urlObj.findOne({ urlId: req.params.id }, (err, data) => {
    if (err) return console.error(err);
    if (data) {
      if (data.url.slice(0, 8) == "https://") {
        res.redirect(data.url);
      } else {
        res.redirect(`https://${data.url}`);
      }
    } else {
      res.json({ error: "No short URL found for the given input" });
    }
  });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const getOrCreate = (url, res) => {
  urlObj.findOne({ url: url }, (err, data) => {
    if (err) return console.error(err);
    if (data) {
      res.json({ original_url: url, short_url: data.urlId });
    } else {
      urlObj.create(
        { url: url, urlId: Math.floor(Math.random() * 1000) },
        (err, data) => {
          if (err) return console.error(err);
          res.json({ original_url: url, short_url: data.urlId });
        }
      );
    }
  });
};

app.post("/api/shorturl/new", (req, res) => {
  const url = req.body.url;

  urlExists(url, function (err, exists) {
    if (exists) {
      getOrCreate(url, res);
    } else {
      res.json({ error: "enter valid url" });
    }
  });
});

app.listen(port, function () {
  console.log("Node.js listening ...");
});
