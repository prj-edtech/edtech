import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

const UsersChart = () => {
  return (
    <Card className="w-full max-w-xs border rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Active Users</CardTitle>
        <Users className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 mt-2 font-medium text-sm text-muted-foreground">
          <li className="flex justify-between items-center">
            <span className="text-base text-foreground">Admins</span>
            <span className="font-bold text-foreground">24</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-base text-foreground">Editors</span>
            <span className="font-bold text-foreground">15</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-base text-foreground">Reviewers</span>
            <span className="font-bold text-foreground">3</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default UsersChart;
