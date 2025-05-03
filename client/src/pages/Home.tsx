import { useAuth0 } from "@auth0/auth0-react";

const Home = () => {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  console.log(user); // <- check the console for custom claims here

  const roles = user && user["https://edtechadmin.dev/roles"];
  console.log("Roles: ", roles);

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h2>Welcome, {user?.name}</h2>
          <button
            onClick={() => logout()}
            className="px-6 py-2 bg-purple-500 text-white rounded cursor-pointer"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => loginWithRedirect()}
          className="px-6 py-2 bg-purple-500 text-white rounded cursor-pointer"
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Home;
