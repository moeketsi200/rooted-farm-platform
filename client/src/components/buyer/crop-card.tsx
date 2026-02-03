import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function CropCard({ crop }: { crop: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleContact = () => {
    toast({
      title: "Message Sent",
      description: `Your message to ${crop.farmerName || "the farmer"} has been sent!`,
    });
    setIsOpen(false);
    setMessage("");
  };

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
        <div className="h-48 bg-gray-200 relative">
          <img 
            src={`https://source.unsplash.com/random/400x300/?vegetable,${crop.cropName}`} 
            alt={crop.cropName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=400&h=300";
            }}
          />
          <Badge className="absolute top-2 right-2 bg-white text-black hover:bg-white">
            R{Number(crop.price).toFixed(2)} / kg
          </Badge>
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl mb-1">{crop.cropName}</CardTitle>
              <div className="flex items-center text-sm text-gray-500">
                <User className="h-3 w-3 mr-1" />
                {crop.farmerName || "Unknown Farmer"}
              </div>
            </div>
            <Badge variant={crop.status === 'available' ? 'default' : 'secondary'}>
              {crop.status === 'available' ? 'In Stock' : 'Low Stock'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            {crop.location || "Location not specified"}
          </div>
          <p className="text-sm text-gray-600">
            Available Quantity: <span className="font-semibold">{crop.quantity} kg</span>
          </p>
        </CardContent>
        <CardFooter className="mt-auto">
          <Button 
            className="w-full bg-rooted-primary hover:bg-rooted-secondary"
            onClick={() => setIsOpen(true)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Contact Farmer
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact {crop.farmerName || "Farmer"}</DialogTitle>
            <DialogDescription>
              Send a message to inquire about {crop.cropName}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea 
              placeholder="Hi, I'm interested in purchasing..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleContact} className="bg-rooted-primary text-white">Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}