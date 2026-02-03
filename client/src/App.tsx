import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/landing";
import FarmerDashboard from "@/pages/farmer-dashboard";
import BuyerMarketplace from "@/pages/buyer-marketplace";
import DonationPanel from "@/pages/donation-panel";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/farmer-dashboard" component={FarmerDashboard} />
          <Route path="/buyer-marketplace" component={BuyerMarketplace} />
          <Route path="/donation-panel" component={DonationPanel} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}