import { useEffect, useState } from "react";
import { fetchBoards } from "@/api/boards";
import { fetchStandards } from "@/api/standards";
import { getAllSubjects } from "@/api/subjects";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const OverviewChart = () => {
  const [data, setData] = useState([
    { name: "Boards", total: 0 },
    { name: "Standards", total: 0 },
    { name: "Subjects", total: 0 },
  ]);

  const loadData = async () => {
    const boardsRes = await fetchBoards();
    const standardsRes = await fetchStandards();
    const subjectsRes = await getAllSubjects();

    setData([
      { name: "Boards", total: boardsRes.data.total },
      { name: "Standards", total: standardsRes.data.length },
      { name: "Subjects", total: subjectsRes.data.total },
    ]);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Card className="w-[65%] font-redhat">
      <CardHeader className="font-bold text-xl">
        Admin Management Overview
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis domain={[0, 10]} fontSize={12} />
            <Tooltip />
            <Bar
              dataKey="total"
              fill="#60A5FA"
              barSize={60}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default OverviewChart;
