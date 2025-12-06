import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface DonationRequestProps {
  donation: {
    id: string;
    cropName: string;
    quantity: number;
    farmerName: string;
    location: string;
    communityName: string;
    status: string;
  };
}

export default function DonationRequest({ donation }: DonationRequestProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateDonationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/donations/${id}`, { status });
      return response.json();
    },
    onSuccess: (_, { status }) => {
      toast({
        title: `Donation ${status}`,
        description: `Request has been ${status.toLowerCase()}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
    },
    onError: () => {
      toast({
        title: "Error updating donation",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleAccept = () => {
    updateDonationMutation.mutate({ id: donation.id, status: 'accepted' });
  };

  const handleDecline = () => {
    updateDonationMutation.mutate({ id: donation.id, status: 'declined' });
  };

  return (
    <Card className="bg-gray-50 border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="https://images.unsplash.com/photo-1551754655-cd27e38d2076?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
              alt={`Fresh ${donation.cropName}`}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h5 className="font-semibold text-gray-900">{donation.cropName}</h5>
              <p className="text-gray-600">
                {donation.quantity} lbs • {donation.farmerName} • {donation.location}
              </p>
              <p className="text-sm text-gray-500">
                Requested by {donation.communityName}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={handleAccept}
              className="bg-green-600 text-white hover:bg-green-700 font-medium"
              disabled={updateDonationMutation.isPending}
            >
              Accept
            </Button>
            <Button 
              onClick={handleDecline}
              variant="outline"
              className="bg-gray-300 text-gray-700 hover:bg-gray-400 font-medium"
              disabled={updateDonationMutation.isPending}
            >
              Decline
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
