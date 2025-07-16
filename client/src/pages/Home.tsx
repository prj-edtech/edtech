import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Home = () => {
  const { user, isAuthenticated, logout, loginWithRedirect } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      {isAuthenticated ? (
        <div>
          <h2>Welcome, {user?.name}</h2>
          <Button onClick={() => logout()} className="rounded-none">
            Logout
          </Button>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full min-h-screen">
          <Card className="lg:max-w-full max-w-[320px]">
            <CardContent className="flex justify-center items-center flex-col gap-y-4">
              <h4 className="font-semibold font-redhat lg:text-2xl text-xl">
                Authorized Users Only
              </h4>
              <p className="font-redhat lg:w-[80%] text-center">
                This is a secured application and requires user authentication
                to access its features and services.
              </p>
              <Button
                className="rounded-none"
                onClick={() => loginWithRedirect()}
              >
                Log in
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default Home;
