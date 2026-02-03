import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', sales: 4000, donations: 2400 },
  { name: 'Feb', sales: 3000, donations: 1398 },
  { name: 'Mar', sales: 2000, donations: 9800 },
  { name: 'Apr', sales: 2780, donations: 3908 },
  { name: 'May', sales: 1890, donations: 4800 },
  { name: 'Jun', sales: 2390, donations: 3800 },
];

export default function PlatformStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#2F5233" name="Sales (R)" />
                <Bar dataKey="donations" fill="#76B041" name="Donations (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">New Order</p>
                <p className="text-sm text-muted-foreground">
                  Buyer #1234 purchased 50kg of Corn
                </p>
              </div>
              <div className="ml-auto font-medium">+R250.00</div>
            </div>
            <div className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">Donation Matched</p>
                <p className="text-sm text-muted-foreground">
                  Community Center accepted 20lbs Tomatoes
                </p>
              </div>
              <div className="ml-auto font-medium text-green-600">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}