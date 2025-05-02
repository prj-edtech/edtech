import { useAuth0 } from "@auth0/auth0-react";

const Dashboard = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  console.log(user); // <- check the console for custom claims here

  const roles = user && user["https://edtechadmin.dev/roles"];
  console.log("Roles: ", roles);

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h2>Welcome, {user?.name}</h2>
          <button onClick={() => logout()}>Logout</button>
        </div>
      ) : (
        <button onClick={() => loginWithRedirect()}>Login</button>
      )}
    </div>
  );
};

export default Dashboard;
