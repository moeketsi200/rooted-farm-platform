import { Card, CardContent } from "@/components/ui/card";
import {
  User,
  Calendar,
  DollarSign,
  Heart,
  Sprout,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddCropForm from "@/components/farmer/add-crop-form";
import CropList from "@/components/farmer/crop-list";
import WeatherWidget from "@/components/farmer/weather-widget";
import PlatformStats from "@/components/analytics/platform-stats";

export default function FarmerDashboard() {
  const { userProfile, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<"crops" | "analytics">("crops");

  // If no authenticated user or not a farmer, show access denied
  if (!currentUser || !userProfile || userProfile.userType !== "farmer") {
    return (
      <div className="min-h-screen bg-rooted-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            This page is only accessible to farmers.
          </p>
        </div>
      </div>
    );
  }

  const farmer = {
    id: userProfile.id,
    name: userProfile.name,
    location: userProfile.location || "Location not specified",
  };

  return (
    <div className="min-h-screen bg-rooted-bg">
      {/* Header */}
      <div className="bg-rooted-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <User className="text-white" />
              </div>
              <div>
                <h4 className="font-semibold">{farmer.name}</h4>
                <p className="text-rooted-accent text-sm">{farmer.location}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-rooted-accent">Current Season</p>
              <p className="font-semibold">Fall 2024</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-rooted-primary">12</p>
                  <p className="text-gray-600">Active Crops</p>
                </div>
                <Sprout className="text-rooted-primary text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-blue-600">3</p>
                  <p className="text-gray-600">This Week</p>
                </div>
                <Calendar className="text-blue-600 text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-yellow-600">$2,400</p>
                  <p className="text-gray-600">This Month</p>
                </div>
                <DollarSign className="text-yellow-600 text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-purple-600">156</p>
                  <p className="text-gray-600">lbs Donated</p>
                </div>
                <Heart className="text-purple-600 text-2xl" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-sm border">
          <Button
            variant={activeTab === "crops" ? "default" : "ghost"}
            onClick={() => setActiveTab("crops")}
            className="flex items-center space-x-2"
          >
            <Sprout className="h-4 w-4" />
            <span>Crop Management</span>
          </Button>
          <Button
            variant={activeTab === "analytics" ? "default" : "ghost"}
            onClick={() => setActiveTab("analytics")}
            className="flex items-center space-x-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Platform Analytics</span>
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "crops" ? (
          /* Weather and Crop Management Section */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Weather Widget */}
            <div className="lg:col-span-1">
              <WeatherWidget location={farmer.location} />
            </div>

            {/* Crop Management Section */}
            <div className="lg:col-span-2">
              <AddCropForm farmerId={farmer.id} />
              <CropList farmerId={farmer.id} />
            </div>
          </div>
        ) : (
          /* Platform Analytics Section */
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Platform Analytics
              </h2>
              <p className="text-gray-600">
                Track the impact and growth of the ROOTED community
              </p>
            </div>
            <PlatformStats />
          </div>
        )}
      </div>
    </div>
  );
}
