
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationsProvider } from "./context/NotificationsContext";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import Personas from "./pages/Personas";
import Universe from "./pages/Universe";
import FeatureProtectedRoute from "./components/Auth/FeatureProtectedRoute";
import UniverseProtectedRoute from "./components/Auth/UniverseProtectedRoute";
import Logs from "./pages/Logs";
import Connections from "./pages/Connections";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 10 * 60 * 1000, // 10 minutes (replaced cacheTime with gcTime)
      refetchOnWindowFocus: false,
    },
  },
});

// Define the App component with brackets instead of parentheses
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <ThemeProvider>
            <AuthProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/auth/signin" element={<SignIn />} />
                <Route path="/login" element={<Navigate to="/auth/signin" replace />} />
                <Route path="/auth/signup" element={<SignUp />} />
                
                {/* Protected routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/account" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Account />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Updated routes for navigation items */}
                <Route 
                  path="/logs" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Logs />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/personas" 
                  element={
                    <FeatureProtectedRoute featureId="personas">
                      <Layout>
                        <Personas />
                      </Layout>
                    </FeatureProtectedRoute>
                  } 
                />
                <Route 
                  path="/universe" 
                  element={
                    <UniverseProtectedRoute>
                      <Layout>
                        <Universe />
                      </Layout>
                    </UniverseProtectedRoute>
                  } 
                />
                <Route 
                  path="/connections" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Connections />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Redirects for old routes */}
                <Route path="/donors" element={<Navigate to="/universe" replace />} />
                <Route path="/segments" element={<Navigate to="/personas" replace />} />
                <Route path="/activity" element={<Navigate to="/logs" replace />} />
                
                {/* 404 route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </AuthProvider>
          </ThemeProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
