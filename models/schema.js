const mongoose = require("mongoose");
const schema = mongoose.Schema;

let productssSchema = new schema({
  urlPath: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: String, required: true },
  rating: { type: String, required: true },
  commentCount: { type: String, required: true },
  isTopRated: { type: Boolean, required: true },
  productss: { type: schema.Types.ObjectId, ref: "productss" }
});

let products = mongoose.model("products", productssSchema, "products");
let myShemas = { products: products };
module.exports = myShemas;
