// backend/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  category: String,
  colorA: String,
  colorB: String
});

module.exports = mongoose.model("Product", productSchema);
