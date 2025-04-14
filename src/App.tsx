
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
import Segments from "./pages/Segments";
import Prospects from "./pages/prospects/Prospects";
import FeatureProtectedRoute from "./components/Auth/FeatureProtectedRoute";
import DonorsProtectedRoute from "./components/Auth/UniverseProtectedRoute";
import Logs from "./pages/Logs";
import NotFound from "./pages/NotFound";
import { ROUTES } from "./constants/routes";

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

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <ThemeProvider>
            <AuthProvider>
              <Routes>
                {/* Public routes */}
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.AUTH.SIGNIN} element={<SignIn />} />
                <Route path="/login" element={<Navigate to={ROUTES.AUTH.SIGNIN} replace />} />
                <Route path={ROUTES.AUTH.SIGNUP} element={<SignUp />} />
                
                {/* Protected routes */}
                <Route 
                  path={ROUTES.DASHBOARD} 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Prospects routes */}
                <Route 
                  path={ROUTES.PROSPECTS.ROOT} 
                  element={<Navigate to={ROUTES.PROSPECTS.PROSPECTS} replace />} 
                />
                <Route 
                  path={ROUTES.PROSPECTS.PROSPECTS} 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Prospects />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Account routes */}
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
                
                {/* Logs routes */}
                <Route 
                  path={ROUTES.LOGS.ROOT} 
                  element={<Navigate to={ROUTES.LOGS.ALL} replace />}
                />
                <Route 
                  path={ROUTES.LOGS.ALL} 
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
                    <FeatureProtectedRoute featureId="segments">
                      <Layout>
                        <Segments />
                      </Layout>
                    </FeatureProtectedRoute>
                  } 
                />
                <Route 
                  path="/universe" 
                  element={
                    <DonorsProtectedRoute>
                      <Layout>
                        <Donors />
                      </Layout>
                    </DonorsProtectedRoute>
                  } 
                />
                
                {/* Redirects for old routes */}
                <Route path="/donors" element={<Navigate to="/universe" replace />} />
                <Route path="/segments" element={<Navigate to="/personas" replace />} />
                <Route path="/activity" element={<Navigate to={ROUTES.LOGS.ALL} replace />} />
                <Route path="/connections" element={<Navigate to="/dashboard" replace />} />
                
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
