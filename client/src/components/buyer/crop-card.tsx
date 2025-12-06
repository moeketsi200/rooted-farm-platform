import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Weight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CropCardProps {
  crop: {
    id: string;
    cropName: string;
    quantity: number;
    price: string;
    farmerName: string;
    location: string;
    status: string;
  };
}

export default function CropCard({ crop }: CropCardProps) {
  const { toast } = useToast();

  const handleContactSeller = () => {
    toast({
      title: "Contact information",
      description: `Contacting ${crop.farmerName} about ${crop.cropName}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'low_stock':
        return 'Low Stock';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className="border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <img 
        src={`https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250`}
        alt={`Fresh ${crop.cropName}`}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-lg font-semibold text-gray-900">{crop.cropName}</h5>
          <Badge className={getStatusColor(crop.status)}>
            {getStatusText(crop.status)}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <p className="text-gray-600 text-sm flex items-center">
            <User className="mr-2 h-4 w-4" />
            {crop.farmerName}
          </p>
          <p className="text-gray-600 text-sm flex items-center">
            <MapPin className="mr-2 h-4 w-4" />
            {crop.location}
          </p>
          <p className="text-gray-600 text-sm flex items-center">
            <Weight className="mr-2 h-4 w-4" />
            {crop.quantity} lbs available
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-rooted-primary">
              ${crop.price}
              <span className="text-sm font-normal text-gray-600">/lb</span>
            </p>
          </div>
          <Button 
            onClick={handleContactSeller}
            className="bg-rooted-primary text-white hover:bg-rooted-secondary font-medium"
          >
            Contact Seller
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
