import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AddCropFormProps {
  farmerId: string;
}

export default function AddCropForm({ farmerId }: AddCropFormProps) {
  const [cropName, setCropName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [donationFlag, setDonationFlag] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addCropMutation = useMutation({
    mutationFn: async (cropData: any) => {
      const response = await apiRequest("POST", "/api/crops", cropData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Crop added successfully!",
        description: "Your crop has been added to your inventory.",
      });
      
      // Reset form
      setCropName("");
      setQuantity("");
      setPrice("");
      setHarvestDate("");
      setDonationFlag(false);
      
      // Invalidate crops query to refetch
      queryClient.invalidateQueries({ queryKey: ["/api/crops", farmerId] });
    },
    onError: () => {
      toast({
        title: "Error adding crop",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cropName || !quantity || !price || !harvestDate) {
      toast({
        title: "Please fill all fields",
        description: "All fields are required to add a crop.",
        variant: "destructive",
      });
      return;
    }

    addCropMutation.mutate({
      farmerId,
      cropName,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      harvestDate: new Date(harvestDate).toISOString(),
      donationFlag,
    });
  };

  return (
    <Card className="bg-gray-50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Add New Crop</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="cropName">Crop Name</Label>
            <Input
              id="cropName"
              type="text"
              placeholder="e.g., Organic Tomatoes"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              className="focus:ring-2 focus:ring-rooted-primary focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity (lbs)</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="500"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="focus:ring-2 focus:ring-rooted-primary focus:border-transparent"
              />
            </div>
            <div>
              <Label htmlFor="price">Price per lb</Label>
              <Input
                id="price"
                type="number"
                placeholder="3.50"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="focus:ring-2 focus:ring-rooted-primary focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="harvestDate">Harvest Date</Label>
            <Input
              id="harvestDate"
              type="date"
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
              className="focus:ring-2 focus:ring-rooted-primary focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <Checkbox
              id="donationFlag"
              checked={donationFlag}
              onCheckedChange={(checked) => setDonationFlag(checked as boolean)}
              className="border-gray-300 focus:ring-rooted-primary"
            />
            <Label htmlFor="donationFlag" className="text-sm text-gray-700">
              Mark for community donation
            </Label>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-rooted-primary text-white hover:bg-rooted-secondary font-medium"
            disabled={addCropMutation.isPending}
          >
            {addCropMutation.isPending ? "Adding..." : "Add Crop"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
