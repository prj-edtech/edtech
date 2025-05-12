import { createUser } from "@/api/user";
import AdminLayout from "./AdminLayout";
import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

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
      console.error(error);
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
    <AdminLayout>
      <div />
    </AdminLayout>
  );
};

export default AdminDashboard;
