import { Outlet } from "react-router";
import Navbar from '../components/Navbar.tsx'

const LandingLayout = () => {
  return (
    <div className="">
        <div className="">
            <Navbar />
        </div>
        <div className="min-h-screen flex justify-center">
            <div className="w-px min-h-screen  bg-gray-200"></div>
            <div className="w-[85%]">
            <Outlet />
            </div>
            <div className="w-px min-h-screen  bg-gray-200"></div>
        </div>
    </div>
  )
}

export default LandingLayout