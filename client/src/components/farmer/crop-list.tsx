import { useQuery } from "@tanstack/react-query";
import { Crop } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function CropList({ farmerId }: { farmerId: string }) {
  const { data: crops, isLoading } = useQuery<Crop[]>({
    queryKey: [`/api/crops/${farmerId}`],
  });

  if (isLoading) {
    return <div className="space-y-4">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>;
  }

  if (!crops?.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No crops listed yet. Add your first crop above!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Crops</h3>
      {crops.map((crop) => (
        <Card key={crop.id}>
          <CardContent className="p-4 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold">{crop.cropName}</h4>
                <Badge variant={crop.status === 'available' ? 'default' : 'secondary'}>
                  {crop.status}
                </Badge>
                {crop.donationFlag && <Badge variant="outline" className="text-purple-600 border-purple-600">Donation</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">
                Harvest: {format(new Date(crop.harvestDate), 'MMM d, yyyy')}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold">{crop.quantity} kg</p>
              <p className="text-sm text-muted-foreground">R{Number(crop.price).toFixed(2)}/kg</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}