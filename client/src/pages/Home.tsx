import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "@/_components/Navbar.tsx";
import { Button } from "@/components/ui/button";
import Footer from "@/_components/Footer";

const Home = () => {
  const { user, isAuthenticated, logout, loginWithRedirect } = useAuth0();

  console.log(user); // <- check the console for custom claims here

  const roles = user && user["https://edtechadmin.dev/roles"];
  console.log("Roles: ", roles);

  return (
    <>
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
        <>
          <Navbar />
          <div className="flex justify-start items-center w-full flex-col gap-y-6">
            <div className="flex justify-start items-center w-full flex-col gap-y-8">
              <h1 className="lg:text-7xl font-outfit capitalize w-[50%] text-center font-semibold lg:mt-20">
                Your Ideas, Documents & Plans. Unified. Welcome to{" "}
                <span className="underline">EdTech</span>
              </h1>
              <h3 className="lg:text-3xl font-outfit capitalize w-[40%] text-center">
                EdTech is the connected workspace where better thing happens.
              </h3>
              <Button
                className="px-8 py-2 cursor-pointer rounded text-lg"
                onClick={() => loginWithRedirect()}
              >
                Log in
              </Button>
              <div className="flex justify-center items-center w-full lg:gap-x-20 lg:mt-6">
                <img
                  src="/images/home/img1.png"
                  alt="Image"
                  className="max-w-[380px] max-h-[380px]"
                />
                <img
                  src="/images/home/img2.png"
                  alt="Image"
                  className="max-w-[380px] max-h-[380px]"
                />
              </div>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
};

export default Home;
