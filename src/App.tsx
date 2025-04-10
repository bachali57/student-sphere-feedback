
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SubmitFeedback from "./pages/SubmitFeedback";
import FeedbackDetail from "./pages/FeedbackDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Create the App component with React context properly established
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/submit-feedback" element={<SubmitFeedback />} />
            <Route path="/feedback/:id" element={<FeedbackDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Sonner />
        <Toaster />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
