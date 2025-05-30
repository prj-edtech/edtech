import { apiURL } from "@/api/apiURL";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { Users } from "lucide-react";
import { useEffect, useState } from "react";

const UsersChart = () => {
  const [adminTotal, setAdminTotal] = useState(0);
  const [editorTotal, setEditorTotal] = useState(0);
  const [reviewerTotal, setReviewerTotal] = useState(0);

  const loadAdmins = async () => {
    const response = await axios.get(`${apiURL}/users/admin`);
    console.log(response.data.total);
    setAdminTotal(response.data.total);
  };

  const loadEditors = async () => {
    const response = await axios.get(`${apiURL}/users/editor`);
    setEditorTotal(response.data.total);
  };

  const loadReviewer = async () => {
    const response = await axios.get(`${apiURL}/users/reviewer`);
    console.log(response.data.total);
    setReviewerTotal(response.data.total);
  };

  useEffect(() => {
    loadAdmins();
    loadEditors();
    loadReviewer();
  }, []);

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
            <span className="font-bold text-foreground">{adminTotal}</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-base text-foreground">Editors</span>
            <span className="font-bold text-foreground">{editorTotal}</span>
          </li>
          <li className="flex justify-between items-center">
            <span className="text-base text-foreground">Reviewers</span>
            <span className="font-bold text-foreground">{reviewerTotal}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default UsersChart;
