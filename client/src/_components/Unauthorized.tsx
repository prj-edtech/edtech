import { useAuth0 } from "@auth0/auth0-react";

const Unauthorized = () => {
  const { isAuthenticated, logout, loginWithRedirect, user } = useAuth0();
  return (
    <div>
      <h1>Unauthorized</h1>
      <p>You don't have permission to access this dashboard.</p>
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

export default Unauthorized;
