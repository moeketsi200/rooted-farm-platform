import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Sprout, 
  ShoppingCart, 
  Heart, 
  TrendingUp, 
  DollarSign, 
  MapPin,
  Calendar
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface PlatformStats {
  totalFarmers: number;
  totalBuyers: number;
  activeCrops: number;
  totalTransactions: number;
  donationsPounds: number;
  monthlyRevenue: number;
  topRegions: Array<{ name: string; count: number }>;
  recentActivity: Array<{ type: string; message: string; timestamp: Date }>;
}

export default function PlatformStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/analytics/platform-stats'],
    queryFn: async () => {
      // In a real app, this would fetch from your analytics API
      // For now, return mock data
      return {
        totalFarmers: 245,
        totalBuyers: 1832,
        activeCrops: 567,
        totalTransactions: 3421,
        donationsPounds: 15673,
        monthlyRevenue: 89400,
        topRegions: [
          { name: "California Central Valley", count: 89 },
          { name: "Oregon Wine Country", count: 67 },
          { name: "Washington State", count: 45 },
          { name: "Arizona Desert", count: 32 }
        ],
        recentActivity: [
          {
            type: "farmer_joined",
            message: "Green Valley Organics joined the platform",
            timestamp: new Date(Date.now() - 2 * 60 * 1000)
          },
          {
            type: "transaction",
            message: "500 lbs of tomatoes sold to Fresh Market Co",
            timestamp: new Date(Date.now() - 15 * 60 * 1000)
          },
          {
            type: "donation",
            message: "200 lbs of mixed vegetables donated to Community Kitchen",
            timestamp: new Date(Date.now() - 45 * 60 * 1000)
          },
          {
            type: "buyer_inquiry",
            message: "Farm-to-Table Restaurant requested organic herbs",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
          }
        ]
      } as PlatformStats;
    },
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'farmer_joined':
        return <Users className="h-4 w-4 text-green-500" />;
      case 'transaction':
        return <ShoppingCart className="h-4 w-4 text-blue-500" />;
      case 'donation':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'buyer_inquiry':
        return <TrendingUp className="h-4 w-4 text-purple-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">Analytics data not available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-green-600">{stats.totalFarmers}</p>
                <p className="text-gray-600 text-sm">Active Farmers</p>
              </div>
              <Users className="text-green-600 text-2xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-600">{stats.totalBuyers.toLocaleString()}</p>
                <p className="text-gray-600 text-sm">Registered Buyers</p>
              </div>
              <ShoppingCart className="text-blue-600 text-2xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-orange-600">{stats.activeCrops}</p>
                <p className="text-gray-600 text-sm">Available Crops</p>
              </div>
              <Sprout className="text-orange-600 text-2xl" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-600">${(stats.monthlyRevenue / 1000).toFixed(0)}k</p>
                <p className="text-gray-600 text-sm">Monthly Revenue</p>
              </div>
              <DollarSign className="text-purple-600 text-2xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Transaction & Impact Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Platform Impact</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="h-8 w-8 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">Total Transactions</p>
                  <p className="text-sm text-green-600">Connecting farmers & buyers</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg font-bold">
                {stats.totalTransactions.toLocaleString()}
              </Badge>
            </div>

            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Heart className="h-8 w-8 text-red-600" />
                <div>
                  <p className="font-semibold text-red-800">Food Donations</p>
                  <p className="text-sm text-red-600">Supporting communities</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg font-bold">
                {stats.donationsPounds.toLocaleString()} lbs
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Top Regions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Top Growing Regions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topRegions.map((region, index) => (
                <div key={region.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium">{region.name}</span>
                  </div>
                  <Badge variant="outline">
                    {region.count} farms
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Recent Platform Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.message}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}