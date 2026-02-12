import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Communities from "@/pages/Communities";
import CommunityDetail from "@/pages/CommunityDetail";
import CreatorDashboard from "@/pages/CreatorDashboard";
import Membership from "@/pages/Membership";
import About from "@/pages/About";
import Events from "@/pages/Events";
import Careers from "@/pages/Careers";
import CreateCommunity from "@/pages/CreateCommunity";
import { ProtectedRoute, CreatorRoute } from "@/components/ProtectedRoute";

// Scroll to top component - this ensures every page starts at the top
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant' // Use 'smooth' if you want animated scrolling
    });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes - Anyone can access */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/about" element={<About />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/events" element={<Events />} />
          <Route path="/careers" element={<Careers />} />
          
          {/* Community Routes - Public viewing, protected actions */}
          <Route path="/communities" element={<Communities />} />
          <Route path="/communities/:id" element={<CommunityDetail />} />
          
          {/* Protected Routes - Login required */}
          <Route
            path="/create-community"
            element={
              <ProtectedRoute>
                <CreateCommunity />
              </ProtectedRoute>
            }
          />
          
          {/* Creator Routes - Creator account required */}
          <Route
            path="/creator-dashboard"
            element={
              <CreatorRoute>
                <CreatorDashboard />
              </CreatorRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
