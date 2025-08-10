import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import {type Product} from "../data/products"

// 1. Define the Product type

export default function Home() {
  // 2. Tell useState what type of array it stores
  const [products, setProducts] = useState<Product[]>([]); // fetched products
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetch("http://localhost:4000/api/products") // adjust backend URL as needed
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data)) // type fetched data
      .catch((err) => console.error("Failed to fetch products:", err));
  }, []);

  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      const matchesCategory = category === "All" || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold">Medical Store</h1>
          <p className="text-sm text-slate-600">
            Fast, reliable and friendly — order medicines & health essentials.
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medicines, devices..."
            className="px-3 py-2 rounded-full border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-md border"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </header>

      <AnimatePresence>
        <motion.section
          layout="position"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
