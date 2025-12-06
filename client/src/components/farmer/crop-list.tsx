import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface CropListProps {
  farmerId: string;
}

export default function CropList({ farmerId }: CropListProps) {
  const { data: crops, isLoading } = useQuery({
    queryKey: ["/api/crops", farmerId],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Crops</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-16"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Current Crops</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {!crops || !Array.isArray(crops) || crops.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No crops added yet. Add your first crop to get started!</p>
          ) : (
            crops.map((crop: any) => (
              <div key={crop.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">{crop.cropName}</h5>
                    <p className="text-sm text-gray-600">
                      {crop.quantity} lbs • ${crop.price}/lb • {new Date(crop.harvestDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      className={
                        crop.donationFlag
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {crop.donationFlag ? "For Donation" : "For Sale"}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
