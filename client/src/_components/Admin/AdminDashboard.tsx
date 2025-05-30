import { createUser } from "@/api/user";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import UserChart from "./Charts/UsersChart";
import Overview from "./Charts/Overview";
import SubmissionRates from "./Charts/SubmissionRates";
import AuditChart from "./Charts/AuditChart";
import SubmissionsChart from "./Charts/SubmissionCharts";
import ContentChart from "./Charts/ContentChart";

const AdminDashboard = () => {
  const addUser = async (
    auth0Id: string,
    email: string,
    name: string,
    role: string,
    picture?: string
  ) => {
    try {
      const response = await createUser(auth0Id, email, name, role, picture);
      console.log("Adding user: ", response);
    } catch (error) {
      console.log("User already signed up", error);
    }
  };

  const { user } = useAuth0();
  const roles = user && user["https://edtechadmin.dev/roles"];

  useEffect(() => {
    if (user) {
      const fullName =
        user.name && user.family_name
          ? `${user.name} ${user.family_name}`
          : user.name;

      addUser(
        user.sub!,
        user.email!,
        fullName!,
        Array.isArray(roles) ? roles[0] : roles,
        user.picture
      );
    }
  }, [user, roles]);

  return (
    <div className="flex justify-center items-center w-full flex-col lg:gap-y-10">
      <div className="flex justify-center items-center w-full lg:gap-x-4">
        <UserChart />
        <SubmissionsChart />
        <ContentChart />
      </div>
      <div className="flex justify-start items-start lg:gap-x-6 w-full">
        <Overview />
        <SubmissionRates />
      </div>
      <div className="w-full">
        <AuditChart />
      </div>
    </div>
  );
};

export default AdminDashboard;
