import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { fetchActiveBoards } from "@/api/boards";

const chartConfig = {
  boards: {
    label: "Boards",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function BoardsChart() {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const getBoards = async () => {
      const response = await fetchActiveBoards();
      const boards = response.data.data;

      // Define months you want to track
      const months = ["January", "February", "March", "April", "May", "June"];

      // Initialize count object
      const monthCounts = months.map((month) => ({
        month,
        boards: 0,
      }));

      // Count boards per month
      boards.forEach((board: any) => {
        const createdMonth = dayjs(board.createdAt).format("MMMM");
        const monthEntry = monthCounts.find((m) => m.month === createdMonth);
        if (monthEntry) {
          monthEntry.boards += 1;
        }
      });

      setChartData(monthCounts);
    };

    getBoards();
  }, []);

  return (
    <Card className="max-w-[400px] max-h-[450px]">
      <CardHeader className="items-center pb-4 font-redhat">
        <CardTitle>Boards Charts</CardTitle>
        <CardDescription>Number of boards created per month</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarGrid className="fill-blue-300 opacity-20" />
            <PolarAngleAxis dataKey="month" />
            <Radar dataKey="boards" fill="navy" fillOpacity={0.5} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          January - June 2024
        </div>
      </CardFooter>
    </Card>
  );
}
