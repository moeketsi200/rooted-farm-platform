import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/header";
import { Sprout, Store, Heart, Users, Handshake, Tractor, ShoppingBasket } from "lucide-react";
import rootedLogo from "@assets/0E49E1FA-15E2-4BCA-8F70-FFFA26020759_1755549797327.png";

export default function LandingPage() {
  return (
    <div className="font-inter bg-rooted-bg text-gray-900 min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-rooted-bg to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Empowering 
                <span className="text-rooted-primary"> Small-Scale</span> 
                Farmers
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Connect farmers directly with buyers, manage crop schedules, and support communities through our donation platform. Building sustainable agricultural networks one harvest at a time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-rooted-primary text-white hover:bg-rooted-secondary font-semibold text-lg shadow-lg">
                  <Sprout className="mr-3 h-5 w-5" />
                  Start as Farmer
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-rooted-primary text-rooted-primary hover:bg-rooted-primary hover:text-white font-semibold text-lg"
                >
                  <Store className="mr-3 h-5 w-5" />
                  Browse Marketplace
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Farmers working in green agricultural fields" 
                className="rounded-2xl shadow-2xl w-full h-auto" 
              />
              <Card className="absolute -bottom-6 -left-6 shadow-lg border border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-rooted-accent rounded-full flex items-center justify-center">
                      <Users className="text-rooted-primary text-xl" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">1,200+</p>
                      <p className="text-gray-600">Active Farmers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="absolute -top-6 -right-6 shadow-lg border border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Handshake className="text-rooted-primary text-xl" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">5,000+</p>
                      <p className="text-gray-600">Successful Trades</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete Agricultural Platform</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Everything you need to manage crops, connect with buyers, and support your community in one integrated platform.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-green-50 to-rooted-bg border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-rooted-primary rounded-xl flex items-center justify-center mb-6">
                  <Sprout className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Farmer Dashboard</h3>
                <p className="text-gray-600 mb-4">Manage your crops, track harvest schedules, and monitor your agricultural calendar with our intuitive dashboard.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-rooted-primary rounded-full mr-2"></div>
                    Crop management system
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-rooted-primary rounded-full mr-2"></div>
                    Harvest scheduling
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-rooted-primary rounded-full mr-2"></div>
                    Weather integration
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <Store className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Buyer Marketplace</h3>
                <p className="text-gray-600 mb-4">Discover fresh, local produce directly from farmers. Search, filter, and connect with sellers in your area.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    Direct farmer connection
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    Smart search & filters
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                    Real-time availability
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border border-gray-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Heart className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Donations</h3>
                <p className="text-gray-600 mb-4">Flag surplus crops for donation and help support local communities in need. Track your social impact.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                    Easy donation flagging
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                    Community matching
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                    Impact tracking
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-rooted-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Join the Rooted Community?</h2>
          <p className="text-xl text-rooted-accent mb-8">Connect with local farmers, access fresh produce, and support sustainable agriculture in your area.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-rooted-primary hover:bg-gray-100 font-semibold text-lg shadow-lg">
              <Tractor className="mr-3 h-5 w-5" />
              Register as Farmer
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-rooted-primary font-semibold text-lg"
            >
              <ShoppingBasket className="mr-3 h-5 w-5" />
              Register as Buyer
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={rootedLogo} 
                  alt="ROOTED Logo" 
                  className="w-12 h-12 object-contain filter brightness-0 invert"
                />
                <div>
                  <h3 className="text-2xl font-bold">ROOTED</h3>
                  <p className="text-gray-400 text-sm">Empowering Small-Scale Farmers</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Building sustainable connections between farmers, buyers, and communities. 
                Together, we're creating a more resilient agricultural future.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">&copy; 2024 Rooted. All rights reserved.</p>
            <p className="text-gray-400 mt-4 md:mt-0">Made with <Heart className="inline h-4 w-4 text-red-500" /> for sustainable agriculture</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
