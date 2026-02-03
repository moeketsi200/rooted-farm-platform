import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotificationBell() {
  return (
    <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-rooted-primary">
      <Bell className="h-5 w-5" />
      <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full" />
      <span className="sr-only">Notifications</span>
    </Button>
  );
}