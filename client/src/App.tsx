import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/auth-context";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import FarmerDashboard from "@/pages/farmer-dashboard";
import BuyerMarketplace from "@/pages/buyer-marketplace";
import DonationPanel from "@/pages/donation-panel";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/farmer-dashboard" component={FarmerDashboard} />
      <Route path="/buyer-marketplace" component={BuyerMarketplace} />
      <Route path="/donation-panel" component={DonationPanel} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
