
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider"
import Index from "@/pages/Index";
import Home from "@/pages/Home";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import Account from "@/pages/Account";
import Logs from "@/pages/Logs";
import Connections from "@/pages/Connections";
import Segments from "@/pages/Segments";
import Universe from "@/pages/Universe";
import Donors from "@/pages/Donors";
import Layout from "@/components/Layout/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import SegmentsProtectedRoute from "@/components/SegmentsProtectedRoute";
import UniverseProtectedRoute from "@/components/UniverseProtectedRoute";
import FeaturesTab from "@/components/Account/FeaturesTab";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<NotFound />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
              <Route path="/account" element={<Layout><Account /></Layout>} />
              <Route path="/account/notifications" element={<Layout><Account /></Layout>} />
              <Route path="/account/billing" element={<Layout><Account /></Layout>} />
              <Route path="/account/webhooks" element={<Layout><Account /></Layout>} />
              <Route path="/account/features" element={<Layout><FeaturesTab /></Layout>} />
              <Route path="/logs" element={<Layout><Logs /></Layout>} />
              <Route path="/logs/donors" element={<Layout><Logs /></Layout>} />
              <Route path="/logs/account" element={<Layout><Logs /></Layout>} />
              <Route path="/logs/system" element={<Layout><Logs /></Layout>} />
              <Route path="/connections" element={<Layout><Connections /></Layout>} />
              <Route path="/prospects" element={<Layout><Donors /></Layout>} />
              <Route path="/prospects/donors" element={<Layout><Donors /></Layout>} />
              <Route path="/prospects/merge" element={<Layout><Donors /></Layout>} />
            </Route>
            
            {/* Feature protected routes */}
            <Route element={<SegmentsProtectedRoute />}>
              <Route path="/segments" element={<Layout><Segments /></Layout>} />
            </Route>
            <Route element={<UniverseProtectedRoute />}>
              <Route path="/universe" element={<Layout><Universe /></Layout>} />
            </Route>
          </Routes>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
