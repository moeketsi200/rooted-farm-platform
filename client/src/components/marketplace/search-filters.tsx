import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter, MapPin, Calendar, DollarSign } from "lucide-react";
import { useState } from "react";

interface SearchFiltersProps {
  onFiltersChange: (filters: MarketplaceFilters) => void;
}

export interface MarketplaceFilters {
  searchTerm: string;
  cropType: string;
  location: string;
  priceRange: [number, number];
  harvestDateRange: string;
  donationFlag?: boolean;
  sortBy: string;
}

const cropTypes = [
  "All Crops", "Tomatoes", "Carrots", "Lettuce", "Spinach", "Potatoes", 
  "Onions", "Peppers", "Cucumbers", "Corn", "Beans", "Peas"
];

const harvestDateOptions = [
  { value: "all", label: "Any Time" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "season", label: "This Season" }
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "harvest-soon", label: "Harvest Date: Soonest" },
  { value: "quantity", label: "Quantity Available" }
];

export default function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [cropType, setCropType] = useState("All Crops");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [harvestDateRange, setHarvestDateRange] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFiltersChange = () => {
    onFiltersChange({
      searchTerm,
      cropType: cropType === "All Crops" ? "" : cropType,
      location,
      priceRange,
      harvestDateRange,
      sortBy
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCropType("All Crops");
    setLocation("");
    setPriceRange([0, 100]);
    setHarvestDateRange("all");
    setSortBy("newest");
    onFiltersChange({
      searchTerm: "",
      cropType: "",
      location: "",
      priceRange: [0, 100],
      harvestDateRange: "all",
      sortBy: "newest"
    });
  };

  const activeFiltersCount = [
    searchTerm,
    cropType !== "All Crops" ? cropType : "",
    location,
    harvestDateRange !== "all" ? harvestDateRange : "",
    priceRange[0] > 0 || priceRange[1] < 100 ? "price" : ""
  ].filter(Boolean).length;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search crops, farmers, or locations..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleFiltersChange();
              }}
              className="pl-10 h-12 text-lg"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Select value={cropType} onValueChange={(value) => {
                setCropType(value);
                handleFiltersChange();
              }}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Crop Type" />
                </SelectTrigger>
                <SelectContent>
                  {cropTypes.map((crop) => (
                    <SelectItem key={crop} value={crop}>
                      {crop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Select value={sortBy} onValueChange={(value) => {
                setSortBy(value);
                handleFiltersChange();
              }}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Advanced</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="flex items-center space-x-2 text-gray-500"
              >
                <X className="h-4 w-4" />
                <span>Clear</span>
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="grid md:grid-cols-3 gap-6 pt-4 border-t">
              {/* Location Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Location</span>
                </label>
                <Input
                  placeholder="City, State, or Region"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    handleFiltersChange();
                  }}
                />
              </div>

              {/* Harvest Date Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Harvest Date</span>
                </label>
                <Select value={harvestDateRange} onValueChange={(value) => {
                  setHarvestDateRange(value);
                  handleFiltersChange();
                }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {harvestDateOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Price Range (per kg)</span>
                </label>
                <div className="px-3">
                  <Slider
                    value={priceRange}
                    onValueChange={(value) => {
                      setPriceRange(value as [number, number]);
                      handleFiltersChange();
                    }}
                    max={100}
                    step={1}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>R{priceRange[0]}</span>
                    <span>R{priceRange[1]}+</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}