import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // or spinner while auth state is loading
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
}
