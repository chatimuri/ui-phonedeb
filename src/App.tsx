
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BloodSugarProvider } from "@/context/BloodSugarContext";
import Home from "@/pages/Home";
import Entry from "@/pages/Entry";
import History from "@/pages/History";
import Detail from "@/pages/Detail";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";
import Notifications from "@/pages/Notifications";
import CaregiverDashboard from "@/pages/CaregiverDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BloodSugarProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/entry" element={<Entry />} />
            <Route path="/history" element={<History />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/caregiver-dashboard" element={<CaregiverDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </BloodSugarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
