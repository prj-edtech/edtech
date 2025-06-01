import { apiURL } from "@/api/apiURL";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { CloudDownload } from "lucide-react";
import { useEffect, useState } from "react";

const SubmissionsChart = () => {
  const [subtopicsTotal, setSubtopicsTotal] = useState(0);
  const [questionsTotal, setQuestionsTotal] = useState(0);

  const loadSubtopics = async () => {
    const response = await axios.get(`${apiURL}/subtopics`);
    console.log(response.data.total);
    setSubtopicsTotal(response.data.total);
  };

  const loadQuestions = async () => {
    const response = await axios.get(`${apiURL}/questions`);
    console.log(response.data.total);
    setQuestionsTotal(response.data.total);
  };

  useEffect(() => {
    loadSubtopics();
    loadQuestions();
  }, []);

  return (
    <Card className="w-full max-w-xs border rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">
          Submissions Chart
        </CardTitle>
        <CloudDownload className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 mt-2 font-medium text-sm text-muted-foreground">
          <li className="flex justify-between items-center">
            <span className="text-base text-foreground">Subtopics</span>
            <span className="font-bold text-foreground">{subtopicsTotal}</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-base text-foreground">Questions</span>
            <span className="font-bold text-foreground">{questionsTotal}</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-base text-foreground">Total</span>
            <span className="font-bold text-foreground">
              {subtopicsTotal + questionsTotal}
            </span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default SubmissionsChart;
