import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface UserProfile {
  name: string;
  email: string;
  joined: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Later: Fetch from backend `/api/user/profile`
    setUser({
      name: "John Doe",
      email: "john@example.com",
      joined: "2024-05-01",
    });

    // Later: Fetch from backend `/api/user/orders`
    setOrders([
      { id: "ORD123", date: "2025-08-02", total: 750, status: "Delivered" },
      { id: "ORD124", date: "2025-08-08", total: 320, status: "Pending" },
    ]);
  }, []);

  if (!user) {
    return <div className="p-6">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow rounded-xl p-6"
      >
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-gray-500">Manage your account details and orders</p>

        <div className="mt-6">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Joined:</strong> {new Date(user.joined).toLocaleDateString()}</p>
        </div>

        <div className="mt-4">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Edit Profile
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow rounded-xl p-6 mt-8"
      >
        <h2 className="text-xl font-bold mb-4">Order History</h2>
        {orders.length === 0 ? (
          <p>You have no orders yet. <Link to="/" className="text-indigo-600 underline">Start shopping</Link></p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-t">
                    <td className="p-3">{order.id}</td>
                    <td className="p-3">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="p-3">₹{order.total}</td>
                    <td className={`p-3 font-semibold ${order.status === "Delivered" ? "text-green-600" : "text-yellow-600"}`}>
                      {order.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
