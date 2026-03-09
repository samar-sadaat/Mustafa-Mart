import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {

  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}