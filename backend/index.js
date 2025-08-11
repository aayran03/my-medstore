// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// 1. Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://aayushrangra03:2whoElcerRQ9G5L4@cluster0.2akv211.mongodb.net/medicalshop?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 2. Create Product Schema & Model
const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  category: String,
  colorA: String,
  colorB: String,
});

const Product = mongoose.model("Product", productSchema);

// 3. Routes
// GET all products
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET single product
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST create product (auto-generate id if not provided)
app.post("/api/products", async (req, res) => {
  let { id, title, price, description, category, colorA, colorB } = req.body;

  if (!title || !price) {
    return res.status(400).json({ error: "title and price are required" });
  }

  try {
    if (!id) {
      // Find the last product with the highest numeric id
      const lastProduct = await Product.findOne().sort({ id: -1 });
      let nextNumber = 1;

      if (lastProduct && /^p\d+$/.test(lastProduct.id)) {
        nextNumber = parseInt(lastProduct.id.substring(1)) + 1;
      }

      id = `p${nextNumber}`;
    }

    const newProduct = new Product({
      id,
      title,
      price,
      description,
      category,
      colorA,
      colorB,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ error: "Product with this ID already exists" });
    } else {
      res.status(500).json({ error: "Failed to create product" });
    }
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
