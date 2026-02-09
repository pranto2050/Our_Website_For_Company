import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Support from "./pages/Support";
import Reviews from "./pages/Reviews";
import Achievements from "./pages/Achievements";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import Projects from "./pages/Projects";
import ClientDashboard from "./pages/client/Dashboard";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminClients from "./pages/admin/Clients";
import AdminProjects from "./pages/admin/Projects";
import AdminProjectNew from "./pages/admin/ProjectNew";
import AdminProjectDetail from "./pages/admin/ProjectDetail";
import AdminTickets from "./pages/admin/Tickets";
import AdminTicketDetail from "./pages/admin/TicketDetail";
import AdminServices from "./pages/admin/Services";
import AdminSettings from "./pages/admin/Settings";
import AdminPayments from "./pages/admin/Payments";
import AdminCategories from "./pages/admin/Categories";
import AdminTiers from "./pages/admin/Tiers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/support" element={<Support />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/login" element={<Login />} />
            
            {/* Client Routes */}
            <Route path="/client/dashboard" element={
              <ProtectedRoute>
                <ClientDashboard />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requireAdmin requireApproved={false}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/clients" element={
              <ProtectedRoute requireAdmin requireApproved={false}>
                <AdminClients />
              </ProtectedRoute>
            } />
            <Route path="/admin/projects" element={
              <ProtectedRoute requireAdmin requireApproved={false}>
                <AdminProjects />
              </ProtectedRoute>
            } />
            <Route path="/admin/projects/new" element={
              <ProtectedRoute requireAdmin requireApproved={false}>
                <AdminProjectNew />
              </ProtectedRoute>
            } />
            <Route path="/admin/projects/:id" element={
              <ProtectedRoute requireAdmin requireApproved={false}>
                <AdminProjectDetail />
              </ProtectedRoute>
            } />
            <Route path="/admin/payments" element={
              <ProtectedRoute requireAdmin requireApproved={false}>
                <AdminPayments />
              </ProtectedRoute>
            } />
            <Route path="/admin/tickets" element={
              <ProtectedRoute requireAdmin requireApproved={false}>
                <AdminTickets />
              </ProtectedRoute>
            } />
            <Route path="/admin/tickets/:id" element={
              <ProtectedRoute requireAdmin requireApproved={false}>
                <AdminTicketDetail />
              </ProtectedRoute>
            } />
            <Route path="/admin/services" element={
              <ProtectedRoute requireAdmin requireApproved={false}>
                <AdminServices />
              </ProtectedRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedRoute requireAdmin requireApproved={false}>
                <AdminSettings />
              </ProtectedRoute>
            } />
            <Route path="/admin/categories" element={
              <ProtectedRoute requireAdmin requireApproved={false}>
                <AdminCategories />
              </ProtectedRoute>
            } />
            <Route path="/admin/tiers" element={
              <ProtectedRoute requireAdmin requireApproved={false}>
                <AdminTiers />
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
