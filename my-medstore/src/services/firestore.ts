import { db } from "../firebaseConfig";
import { doc, setDoc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore";

// Save or update user data
export const saveUserProfile = async (uid: string, data: any) => {
  try {
    await setDoc(doc(db, "users", uid), data, { merge: true });
  } catch (error) {
    console.error("Error saving user profile:", error);
  }
};

// Get user profile
export const getUserProfile = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// Fetch all products
export const fetchProducts = async () => {
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Update a product (example)
export const updateProduct = async (productId: string, data: any) => {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, data);
  } catch (error) {
    console.error("Error updating product:", error);
  }
};
