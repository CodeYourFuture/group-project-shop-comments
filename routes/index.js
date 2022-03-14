const { doesNotMatch } = require("assert");
const { assert, Console } = require("console");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const fs = require("fs");
const { default: mongoose } = require("mongoose");
const db = require("../models/db.js");

//the single products route

router.get("/products/:urlPath", async (req, res, next) => {
  let urlPath = req.params.urlPath;
  let id = req.body.id;
  let myProducts = db.products;

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
  let myProducts = db.products;
  let comment = req.body.textarea;
  let newratingInput = +req.body.ratingInput;

  let productsData = await myProducts.find({ _id: id }).exec();
  console.log(productsData, ">>>>>...productsData");

  console.log(productsData[0].ratingCounter, ">>>>>>>>>>ratingcounter");
  ratingCountArr.push(newratingInput);
  console.log(ratingCountArr.length);
  let ratingSum = Number(ratingCountArr.reduce((a, b) => a + b, 0));
  console.log(ratingSum, ">>>>>>>>>>>>sum");
  let ratingAvrage = Math.round(ratingSum / ratingCountArr.length);
  console.log(ratingAvrage);

  let count = productsData[0].commentCount;
  let rating = productsData[0].rating;
  let ratingString = `${ratingAvrage}/5`;
  console.log(ratingString, ">>>>>>>>>ratingString");

  myProducts
    .findOneAndUpdate({ commentCount: count }, { commentCount: count + 1 })
    .then(function() {
      myProducts.findOne({ urlPath: urlPath }).then(function(x) {
        assert(x.commentCount === count + 1);
        increase = +1;
      });
    });
  myProducts.findOneAndUpdate({ rating: rating }, { rating: ratingString }).then(function() {
    myProducts.findOne({ urlPath: urlPath }).then(function(x) {
      assert(x.rating === ratingString);
    });
  });

  res.render("products", {
    title: "AcmeInc",
    description: "We sell the finest goods and services.",
    products: productsData
  });
});

/* GET home page. */
router.get("/", function(req, res, next) {
  /**
   * Define a callback function to render the
   * homepage once the products data has been loaded
   */
  const renderProducts = function(error, file) {
    if (error) {
      throw error;
    }

    const fileData = file.toString();
    const productsData = JSON.parse(fileData);
    res.render("index", {
      title: "AcmeInc",
      description: "We sell the finest goods and services.",
      products: productsData
    });
  };

  /**
   * Load the products file
   */
  const productsFilePath = __dirname + "/../data/products.json";
  fs.readFile(productsFilePath, renderProducts);
});

module.exports = router;
