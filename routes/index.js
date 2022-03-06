const express = require("express");
const router = express.Router();
const fs = require("fs");
const schema = require("../models/schema");

//the single products route

router.get("/products/:urlPath", async (req, res, next) => {
  let urlPath = req.params.urlPath;

  let products = schema.products;

  let productsData = await products.find({ _urlpath: urlPath }).exec();

  const result = productsData.filter((product) => {
    return product.urlPath === urlPath;
  });

  if (productsData) {
    res.render("products", {
      title: "AcmeInc",
      description: "We sell the finest goods and services.",
      data: productsData,
      products: result
    });
  } else {
    res.end("invalid request");
  }
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
