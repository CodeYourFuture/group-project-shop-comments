const mongoose = require("mongoose");
const schema = mongoose.Schema;

let productsSchema = new schema({
  urlPath: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: String, required: true },
  commentCount: { type: Number, required: true },
  isTopRated: { type: Boolean, required: true },
  comments: { type: Array, required: true },
  ratingCounter: { type: Array, required: true },
  productss: { type: schema.Types.ObjectId, ref: "productss" }
});

let products = mongoose.model("products", productsSchema, "products");
let myTable = { products: products };
module.exports = myTable;
