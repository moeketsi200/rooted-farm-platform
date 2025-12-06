import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import CropCard from "@/components/buyer/crop-card";
import SearchFilters, { MarketplaceFilters } from "@/components/marketplace/search-filters";

export default function BuyerMarketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<MarketplaceFilters>({
    searchTerm: "",
    cropType: "",
    location: "",
    priceRange: [0, 100],
    harvestDateRange: "all",
    sortBy: "newest"
  });

  const { data: crops, isLoading } = useQuery({
    queryKey: ["/api/crops/marketplace"],
  });

  const mockCrops = [
    {
      id: "1",
      cropName: "Organic Tomatoes",
      quantity: 500,
      price: "3.50",
      farmerName: "Thompson Farm",
      location: "Green Valley, CA",
      status: "available"
    },
    {
      id: "2",
      cropName: "Bell Peppers Mix",
      quantity: 200,
      price: "4.00",
      farmerName: "Sunrise Farms",
      location: "Valley Springs, CA",
      status: "available"
    },
    {
      id: "3",
      cropName: "Mixed Greens",
      quantity: 75,
      price: "5.25",
      farmerName: "Greenleaf Organic",
      location: "Coastal Hills, CA",
      status: "low_stock"
    }
  ];

  const displayCrops = crops || mockCrops;

  return (
    <div className="min-h-screen bg-rooted-bg">
      {/* Header */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-semibold">Local Produce Marketplace</h4>
              <p className="text-blue-200">Fresh from local farms</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search crops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:bg-white/20 focus:outline-none"
                />
                <Search className="absolute left-3 top-3 text-blue-200 h-4 w-4" />
              </div>
              <Button className="bg-white/10 text-white border border-white/20 hover:bg-white/20">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Advanced Search Filters */}
        <SearchFilters onFiltersChange={setFilters} />
        
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-80"></div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(displayCrops) ? displayCrops
              .filter((crop: any) => 
                crop.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                crop.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                crop.location.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((crop: any) => (
                <CropCard key={crop.id} crop={crop} />
              )) : []}
          </div>
        )}

        {(!displayCrops || !Array.isArray(displayCrops) || displayCrops.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No crops available at the moment.</p>
            <p className="text-gray-400">Check back later for fresh produce!</p>
          </div>
        )}
      </div>
    </div>
  );
}
