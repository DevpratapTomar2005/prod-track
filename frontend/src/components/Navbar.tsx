import Logo from "../assets/temp_logo.svg";
import ArrowRight from "../assets/arrow_right.svg";
import { Link } from "react-router";
const Navbar = () => {
  return (
    <div className="bg-white text-black w-full fixed top-0 left-0 z-10 border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-2 mx-2">
        <div className="flex items-center">
          <span className="p-1 bg-black rounded">
            <img src={Logo} alt="logo" className="invert-100 h-5 w-5" />
          </span>
          <span className="ml-2 font-bold text-lg">Time Clarity</span>
        </div>
        <div className="flex items-center space-x-7 ">
          <button className="text-gray-500 hover:text-gray-700 font-semibold cursor-pointer">
            Login
          </button>
          <Link to="choose-path">
          <button className="relative px-3 py-2 font-semibold text-white cursor-pointer group shadow rounded active:shadow-none transition-all duration-100 ease-in-out ">
            <div className="absolute inset-0 bg-neutral-800 rounded transition-all duration-100 ease-in-out group-active:scale-97"></div>
            <span className="relative flex items-center justify-center gap-1"><p>Get Started</p> <img src={ArrowRight} alt="arrow right" className=" invert-100" /></span>
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
