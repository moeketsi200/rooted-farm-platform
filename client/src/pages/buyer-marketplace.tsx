import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CropCard from "@/components/buyer/crop-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

export default function BuyerMarketplace() {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState([10]); // Default max price $10
  
  const { data: crops, isLoading } = useQuery<any[]>({
    queryKey: ["/api/crops/marketplace"],
  });

  const filteredCrops = crops?.filter(crop => {
    const matchesSearch = 
      crop.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (crop.farmerName && crop.farmerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (crop.location && crop.location.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesPrice = Number(crop.price) <= priceRange[0];
    return matchesSearch && matchesPrice;
  });

  const activeFiltersCount = (priceRange[0] < 10 ? 1 : 0);

  return (
    <div className="min-h-screen bg-rooted-bg p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-rooted-primary">Marketplace</h1>
            <p className="text-gray-600">Fresh produce directly from local farmers</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search crops, farmers, or location..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <Filter className="h-4 w-4 mr-2" /> 
                  Filter
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-rooted-primary text-white">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Crops</SheetTitle>
                  <SheetDescription>
                    Narrow down your search results.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Max Price per kg</Label>
                      <span className="text-sm font-medium">R{priceRange[0].toFixed(2)}</span>
                    </div>
                    <Slider
                      defaultValue={[10]}
                      max={20}
                      step={0.5}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="py-4"
                    />
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button className="w-full bg-rooted-primary">Show Results</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-[350px] rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {filteredCrops && filteredCrops.length > 0 ? (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCrops.map((crop) => (
                  <CropCard key={crop.id} crop={crop} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-500">No crops found matching your criteria.</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchTerm("");
                    setPriceRange([10]);
                  }}
                  className="mt-2 text-rooted-primary"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}