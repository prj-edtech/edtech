import { apiURL } from "@/api/apiURL";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SubmissionRates = () => {
  const [data, setData] = useState([
    { name: "Approved", value: 0 },
    { name: "Rejected", value: 0 },
    { name: "Pending", value: 0 },
  ]);

  const loadSubmissionRates = async () => {
    try {
      const [approvedRes, rejectedRes, pendingRes] = await Promise.all([
        axios.get(`${apiURL}/subtopics/approved`),
        axios.get(`${apiURL}/subtopics/rejected`),
        axios.get(`${apiURL}/subtopics/pending`),
      ]);

      setData([
        { name: "Approved", value: approvedRes.data.total },
        { name: "Rejected", value: rejectedRes.data.total },
        { name: "Pending", value: pendingRes.data.total },
      ]);
    } catch (err) {
      console.error("Failed to load submission rates", err);
    }
  };

  useEffect(() => {
    loadSubmissionRates();
  }, []);

  return (
    <Card className="w-full max-w-xs border rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">
          Submission Rates
        </CardTitle>
        <TrendingUp className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4f46e5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionRates;
