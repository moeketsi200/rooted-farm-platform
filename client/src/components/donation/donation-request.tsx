import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Sprout } from "lucide-react";

export default function DonationRequest({ donation }: { donation: any }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
              <Sprout className="text-purple-600" />
            </div>
            <div>
              <h5 className="font-semibold text-lg">{donation.cropName}</h5>
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <span className="font-medium mr-2">{donation.quantity} kg</span>
                <span>from {donation.farmerName}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-3 w-3 mr-1" />
                {donation.location}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
              {donation.status}
            </Badge>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white flex-1 md:flex-none">
              Accept Donation
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}