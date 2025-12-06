import { Card, CardContent } from "@/components/ui/card";
import { Home, Users, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import DonationRequest from "@/components/donation/donation-request";

export default function DonationPanel() {
  const { data: donations, isLoading } = useQuery({
    queryKey: ["/api/donations"],
  });

  const mockDonations = [
    {
      id: "1",
      cropName: "Fresh Corn",
      quantity: 300,
      farmerName: "Valley Farm",
      location: "Riverside, CA",
      communityName: "Downtown Community Center",
      status: "pending"
    },
    {
      id: "2",
      cropName: "Winter Squash",
      quantity: 150,
      farmerName: "Harvest Moon Farm",
      location: "Oak Valley, CA",
      communityName: "Sunset Elementary School",
      status: "pending"
    }
  ];

  const displayDonations = donations || mockDonations;

  return (
    <div className="min-h-screen bg-rooted-bg">
      {/* Header */}
      <div className="bg-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-semibold">Community Impact Dashboard</h4>
              <p className="text-purple-200">Supporting local communities through surplus sharing</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">2,847</p>
              <p className="text-purple-200">lbs donated this month</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Impact Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-purple-600">8</p>
                  <p className="text-gray-600">Communities Reached</p>
                </div>
                <Home className="text-purple-600 text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-green-600">156</p>
                  <p className="text-gray-600">Families Helped</p>
                </div>
                <Users className="text-green-600 text-2xl" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-blue-600">23</p>
                  <p className="text-gray-600">Active Requests</p>
                </div>
                <Heart className="text-blue-600 text-2xl" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Donations */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Available for Donation</h4>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-24"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {(!displayDonations || !Array.isArray(displayDonations) || displayDonations.length === 0) ? (
                <Card className="bg-gray-50">
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">No donation requests at the moment.</p>
                    <p className="text-gray-400 text-sm">Check back later for community needs.</p>
                  </CardContent>
                </Card>
              ) : (
                displayDonations.map((donation: any) => (
                  <DonationRequest key={donation.id} donation={donation} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
