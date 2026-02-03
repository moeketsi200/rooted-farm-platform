import { useAuth } from "@/contexts/auth-context";
import AddCropForm from "@/components/farmer/add-crop-form";
import CropList from "@/components/farmer/crop-list";
import WeatherWidget from "@/components/farmer/weather-widget";
import PlatformStats from "@/components/analytics/platform-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FarmerDashboard() {
  const { userProfile } = useAuth();

  if (!userProfile) return null;

  return (
    <div className="min-h-screen bg-rooted-bg p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-rooted-primary">Farmer Dashboard</h1>
          <p className="text-gray-600">Welcome back, {userProfile.name}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <PlatformStats />
            
            <Tabs defaultValue="crops" className="w-full">
              <TabsList>
                <TabsTrigger value="crops">My Crops</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
              </TabsList>
              <TabsContent value="crops" className="space-y-4">
                <AddCropForm farmerId={userProfile.id} />
                <CropList farmerId={userProfile.id} />
              </TabsContent>
              <TabsContent value="orders">
                <div className="p-4 bg-white rounded-lg border">
                  No active orders at the moment.
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-8">
            <WeatherWidget location={userProfile.location || "San Francisco"} />
          </div>
        </div>
      </div>
    </div>
  );
}