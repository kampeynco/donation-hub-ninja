
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Return a loading indicator if authentication is still being checked
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // If user is not authenticated, redirect to sign in page
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
