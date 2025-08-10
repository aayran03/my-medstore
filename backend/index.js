const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Declare your products here:
let products = [];

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const product = products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json(product);
});

app.post("/api/products", (req, res) => {
  const { id, title, price, description, category, colorA, colorB } = req.body;
  if (!id || !title || !price) {
    return res.status(400).json({ error: "id, title, and price are required" });
  }
  if (products.find((p) => p.id === id)) {
    return res.status(409).json({ error: "Product with this ID already exists" });
  }
  const newProduct = { id, title, price, description, category, colorA, colorB };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
