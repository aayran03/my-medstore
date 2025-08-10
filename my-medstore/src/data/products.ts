export type Product = {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  colorA: string;
  colorB: string;
};

export const PRODUCTS: Product[] = [];

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("http://localhost:4000/api/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}