import { Sprout, ShoppingCart, LogOut, User } from "lucide-react";
import logo from "@assets/logo.png";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Link } from "wouter";
import LoginModal from "@/components/auth/login-modal";
import NotificationBell from "@/components/notifications/notification-bell";

export default function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginType, setLoginType] = useState<'farmer' | 'buyer'>('farmer');
  
  // Get auth data
  const { currentUser, userProfile, logout, loading } = useAuth();

  const handleFarmerLogin = () => {
    setLoginType('farmer');
    setShowLoginModal(true);
  };

  const handleBuyerLogin = () => {
    setLoginType('buyer');
    setShowLoginModal(true);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="ROOTED" className="w-12 h-12 object-contain" />
              <div>
                <h1 className="text-2xl font-bold text-rooted-primary">ROOTED</h1>
                <p className="text-xs text-rooted-muted -mt-1">Empowering Small-Scale Farmers</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="/#about" className="text-gray-600 hover:text-rooted-primary transition-colors">About</a>
              <a href="/#features" className="text-gray-600 hover:text-rooted-primary transition-colors">Features</a>
              <a href="/#contact" className="text-gray-600 hover:text-rooted-primary transition-colors">Contact</a>
            </nav>

            <div className="flex items-center space-x-3">
              {currentUser && userProfile ? (
                <>
                  <nav className="hidden md:flex items-center space-x-4 mr-4">
                    <Link href={userProfile.userType === 'farmer' ? '/farmer-dashboard' : '/buyer-marketplace'}>
                      <Button variant="ghost" className="text-gray-600 hover:text-rooted-primary">
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                    </Link>
                    {userProfile.userType === 'buyer' && (
                      <Link href="/donation-panel">
                        <Button variant="ghost" className="text-gray-600 hover:text-rooted-primary">
                          Donations
                        </Button>
                      </Link>
                    )}
                  </nav>
                  <NotificationBell />
                  <span className="text-sm text-gray-600 hidden sm:inline">
                    Welcome, {userProfile.name}
                  </span>
                  <Button 
                    onClick={logout}
                    variant="outline" 
                    size="sm"
                    className="border-rooted-primary text-rooted-primary hover:bg-rooted-primary hover:text-white"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={handleFarmerLogin}
                    className="bg-rooted-primary text-white hover:bg-rooted-secondary font-medium"
                  >
                    <img src={logo} alt="Farmer" className="mr-2 h-4 w-4 object-contain brightness-0 invert" />
                    Login as Farmer
                  </Button>
                  <Button 
                    onClick={handleBuyerLogin}
                    variant="outline" 
                    className="border-rooted-primary text-rooted-primary hover:bg-rooted-primary hover:text-white font-medium"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Login as Buyer
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        userType={loginType}
      />
    </>
  );
}
