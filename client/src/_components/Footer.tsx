import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="w-full flex justify-between items-center px-10 py-4 lg:mt-32">
      <h1 className="font-outfit font-semibold lg:text-4xl">EdTech</h1>
      <div className="flex justify-start items-center gap-x-8">
        <p className="text-sm text-stone-500 font-semibold">
          Powered by nXtribe &copy; 2025
        </p>
        <Link
          className="text-sm text-stone-500 font-semibold flex items-center gap-x-1 duration-300 hover:underline"
          to="https://nxtribe.com"
          target="_blank"
        >
          Visit <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default Footer;
