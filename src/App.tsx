
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AuthGuard from "@/components/AuthGuard";
import AdminGuard from "@/components/AdminGuard";
import ErrorBoundary from "@/components/ErrorBoundary";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Order from "./pages/Order";
import Payment from "./pages/Payment";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={
                <AuthGuard requireAuth={false}>
                  <Auth />
                </AuthGuard>
              } />
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/services" element={<Layout><Services /></Layout>} />
              <Route path="/order" element={
                <AuthGuard requireAuth={true}>
                  <Layout><Order /></Layout>
                </AuthGuard>
              } />
              <Route path="/payment" element={
                <AuthGuard requireAuth={true}>
                  <Layout><Payment /></Layout>
                </AuthGuard>
              } />
              <Route path="/dashboard" element={
                <AuthGuard requireAuth={true}>
                  <Layout><Dashboard /></Layout>
                </AuthGuard>
              } />
              <Route path="/profile" element={
                <AuthGuard requireAuth={true}>
                  <Layout><Profile /></Layout>
                </AuthGuard>
              } />
              <Route path="/admin" element={
                <AuthGuard requireAuth={true}>
                  <AdminGuard>
                    <Layout><Admin /></Layout>
                  </AdminGuard>
                </AuthGuard>
              } />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
