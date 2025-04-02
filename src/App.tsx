
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import Personas from "./pages/Personas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
                      <div className="p-8 text-center">
                        <h1 className="text-2xl font-semibold mb-4">Logs Page</h1>
                        <p>This page is under construction.</p>
                      </div>
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/personas" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Personas />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirects for old routes */}
              <Route path="/donors" element={<Navigate to="/logs" replace />} />
              <Route path="/donations" element={<Navigate to="/personas" replace />} />
              <Route path="/reports" element={<Navigate to="/account" replace />} />
              
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

export default App;
