const { doesNotMatch } = require("assert");
const { assert, Console } = require("console");
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const fs = require("fs");
const { default: mongoose } = require("mongoose");
const db = require("../models/db.js");
const async = require("hbs/lib/async");

const myProducts = db.products;

router.get("/", async (req, res, next) => {
  /**
   * Define a callback function to render the
   * homepage once the products data has been loaded
   */

  const productsData = await myProducts.find({}).exec();
  productsData.sort((a, b) => {
    return Number(b.rating.replace("/5", "")) - Number(a.rating.replace("/5", ""));
  });

  // apply styling to top rated product
  productsData.forEach((product, i) => {
    const isTopRated = productsData.isTopRated;
    const highRated = product.isTopRated;
    const rating = product.rating;
    const id = product.id;
    const urlPath = product.urlPath;

    if (i === 0) {
      myProducts.findOneAndUpdate({ _id: id }, { isTopRated: true }).then(function() {
        myProducts.findOne({ _id: id }).then(function(x) {
          assert(x.isTopRated === true);
        });
      });
    } else {
      myProducts.findOneAndUpdate({ _id: id }, { isTopRated: false }).then(function() {
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

//the single products route
router.get("/products/:urlPath", async (req, res, next) => {
  const urlPath = req.params.urlPath;
  const id = req.body.id;

  // fetching all data
  const productsData = await myProducts.find({ _urlpath: urlPath }).exec();

  // filtering the single product data.
  const result = productsData.filter((product) => {
    return product.urlPath === urlPath;
  });

  //render the single product
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

// posting rating & comments
constratingCountArr = [];
const commentsArr = [];

router.post("/products/:urlPath", async (req, res, next) => {
  const id = req.body._id;
  const urlPath = req.params.urlPath;
  const productsData = await myProducts.find({ _id: id }).exec();
  //comment functionality
  function postComment() {
    const comment = req.body.textarea;
    const count = productsData[0].commentCount;
    const dataComments = productsData[0].comments;
    //increase the comments by 1
    myProducts
      .findOneAndUpdate({ commentCount: count }, { commentCount: count + 1 })
      .then(function() {
        myProducts.findOne({ urlPath: urlPath }).then(function(x) {
          assert(x.commentCount === count + 1);
        });
      });
    //push new comment
    commentsArr.push(comment);
    myProducts
      .findOneAndUpdate({ comments: dataComments }, { comments: commentsArr })
      .then(function() {
        myProducts.findOne({ urlPath: urlPath }).then(function(x) {
          assert(x.comments === commentsArr);
          console.log(commentsArr, "commentsArr");
        });
      });
  }
  postComment();

  //rating functionality
  function postRating() {
    const newratingInput = +req.body.ratingInput;
    const rate = productsData[0].rating;
    console.log(rate, "rating");
    ratingCountArr.push(newratingInput);
    const ratingSum = Number(ratingCountArr.reduce((a, b) => a + b, 0));
    const ratingAvrage = Math.round((ratingSum / ratingCountArr.length) * 10) / 10;
    console.log(typeof ratingAvrage);
    console.log(productsData[0].ratingCounter, ">>>>>>>>>>ratingcounter");
    console.log(ratingCountArr.length);
    console.log(ratingSum, ">>>>>>>>>>>>sum");
    console.log(ratingAvrage);
    myProducts.findOneAndUpdate({ rating: rate }, { rating: ratingAvrage }).then(function() {
      myProducts.findOne({ urlPath: urlPath }).then(function(x) {
        assert(x.rating === ratingAvrage);
      });
    });
  }

  postRating();
  res.render("products", {
    title: "AcmeInc",
    description: "We sell the finest goods and services.",
    products: productsData
  });
});

/* GET home page. */

module.exports = router;
