const { doesNotMatch } = require("assert");
const { assert, Console } = require("console");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const fs = require("fs");
const { default: mongoose } = require("mongoose");
const db = require("../models/db.js");
const async = require("hbs/lib/async");

//the single products route
let myProducts = db.products;

router.get("/products/:urlPath", async (req, res, next) => {
  let urlPath = req.params.urlPath;
  let id = req.body.id;

  let productsData = await myProducts.find({ _urlpath: urlPath }).exec();

  const result = productsData.filter((product) => {
    return product.urlPath === urlPath;
  });
  console.log(result[0].commentCount, ">>>>>>>>>>>>>comment count");

  if (productsData) {
    res.render("products", {
      title: "AcmeInc",
      description: "We sell the finest goods and services.",
      products: result
    });
  } else {
    res.end("invalid request");
  }
});

let ratingCountArr = [];

router.post("/products/:urlPath", async (req, res, next) => {
  let id = req.body._id;
  let urlPath = req.params.urlPath;

  let comment = req.body.textarea;
  let newratingInput = +req.body.ratingInput;

  let productsData = await myProducts.find({ _id: id }).exec();
  console.log(productsData, ">>>>>...productsData");

  console.log(productsData[0].ratingCounter, ">>>>>>>>>>ratingcounter");
  ratingCountArr.push(newratingInput);
  console.log(ratingCountArr.length);
  let ratingSum = Number(ratingCountArr.reduce((a, b) => a + b, 0));
  console.log(ratingSum, ">>>>>>>>>>>>sum");
  let ratingAvrage = Math.round((ratingSum / ratingCountArr.length) * 10) / 10;
  console.log(ratingAvrage);

  let count = productsData[0].commentCount;
  let rating = productsData[0].rating;
  let ratingString = `${ratingAvrage}/5`;
  console.log(ratingString, ">>>>>>>>>ratingString");
  if (comment.length > 0 || comment != " ") {
    myProducts
      .findOneAndUpdate({ commentCount: count }, { commentCount: count + 1 })
      .then(function() {
        myProducts.findOne({ urlPath: urlPath }).then(function(x) {
          assert(x.commentCount === count + 1);
          increase = +1;
        });
      });
  }
  myProducts.findOneAndUpdate({ rating: rating }, { rating: ratingString }).then(function() {
    myProducts.findOne({ urlPath: urlPath }).then(function(x) {
      assert(x.rating === ratingString);
    });
  });

  res.render("products", {
    title: "AcmeInc",
    description: "We sell the finest goods and services.",
    products: productsData,
    comments: productsData.comments
  });
});

/* GET home page. */
router.get("/", async (req, res, next) => {
  /**
   * Define a callback function to render the
   * homepage once the products data has been loaded
   */

  let productsData = await myProducts.find({}).exec();
  console.log(productsData, ">>>>>>>>>>>>>>all data");

  let allData = [...productsData];

  productsData.sort((a, b) => {
    return Number(b.rating.replace("/5", "")) - Number(a.rating.replace("/5", ""));
  });
  console.log(productsData, ">>>>>>>>>.. sortedData");
  productsData.forEach((product, i) => {
    let highRated = product.isTopRated;
    let rating = product.rating;
    let id = product._id;
    let urlPath = product.urlPath;
    console.log(id, ">>>>>>>>>>>>>id");

    if (i === 0 && rating != null) {
      myProducts.findOneAndUpdate({ isTopRated: highRated }, { isTopRated: true }).then(function() {
        myProducts.findOne({ _id: id }).then(function(x) {
          assert(x.isTopRated === true);
        });
      });
    } else {
      myProducts
        .findOneAndUpdate({ isTopRated: highRated }, { isTopRated: false })
        .then(function() {
          myProducts.findOne({ _id: id }).then(function(x) {
            assert(x.isTopRated === false);
          });
        });
    }
  });

  res.render("index", {
    title: "AcmeInc",
    description: "We sell the finest goods and services.",
    products: productsData
  });
});

module.exports = router;
