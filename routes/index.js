const express = require("express");
const router = express.Router();
const { assert } = require("console");
const db = require("../models/db.js");

const myProducts = db.products;

router.get("/", async (req, res, next) => {
  try {
    // Fetch products data and sort it
    const productsData = await myProducts
      .find({})
      .sort({ rating: -1 })
      .exec();

    // Mark the top-rated product (assuming you have a field named "isTopRated")
    if (productsData.length > 0) {
      productsData[0].isTopRated = true;
      await productsData[0].save();
    }

    res.render("index", {
      title: "AcmeInc",
      description: "We sell the finest goods and services.",
      products: productsData
    });
  } catch (error) {
    next(error);
  }
});

// ...

module.exports = router;
