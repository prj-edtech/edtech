import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="flex justify-between items-center w-full px-12 py-6">
      <h1 className="font-outfit font-semibold lg:text-4xl">EdTech</h1>
      <div className="flex justify-start items-center gap-x-4">
        <Button
          className="px-8 py-1 cursor-pointer rounded"
          onClick={() => loginWithRedirect()}
        >
          Log in
        </Button>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
