
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useFeatureCache } from "@/hooks/useFeatureCache";

const UniverseProtectedRoute = () => {
  const { user, loading } = useAuth();
  const { hasFeature, isLoading } = useFeatureCache();
  
  if (loading || isLoading) {
    // Return a loading indicator if authentication or features are still being checked
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // If user is not authenticated, redirect to sign in page
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // If universe feature is not enabled, redirect to dashboard
  if (!hasFeature("donors")) {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and feature is enabled, render the child routes
  return <Outlet />;
};

export default UniverseProtectedRoute;
