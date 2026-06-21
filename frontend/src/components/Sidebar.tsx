import { NavLink } from "react-router";
import BotIcon from "../assets/bot.svg";
import DashboardIcon from "../assets/dashboard_icon.svg";
import ProjectIcon from "../assets/project_icon.svg";
import TaskIcon from "../assets/tasks_icon.svg";
import Logo from "../assets/temp_logo.svg";
import SidebarIcon from "../assets/sidebar_icon.svg";
const Sidebar = () => {
  return (
    <div className="p-2 w-[200px] h-screen border-r border-gray-200">
      <div className="p-2 flex items-center justify-between mt-1">
        <div className="flex items-center">
          <span className="p-1 bg-black rounded">
            <img src={Logo} alt="logo" className="invert-100 h-5 w-5" />
          </span>
          <span className="ml-1.5 font-bold text-[14px] leading-3">
            <p>Prod</p>
            <p>Track</p>
          </span>
        </div>
        <div className="p-1 hover:bg-gray-100 cursor-ew-resize rounded-md">
          <img src={SidebarIcon} alt="sidebar icon" className="h-5 w-5" />
        </div>
      </div>
      <div className="w-full mt-15 text-neutral-800 font-poppins font-medium text-[15px]">
        <NavLink
          to="/devpratap/dashboard"
          className={({ isActive }) =>
            `w-full flex items-center gap-3 py-1.5 px-2 rounded-md cursor-pointer my-4 ${isActive ? "bg-gray-100" : "hover:bg-gray-100"}`
          }
        >
          <img src={DashboardIcon} alt="Dashboard Icon" className="h-5 w-5" />
          <p>Dashboard</p>
        </NavLink>
        <NavLink
          to="/devpratap/tasks"
          className={({ isActive }) =>
            `w-full flex items-center gap-3 py-1.5 px-2 rounded-md cursor-pointer my-4 ${isActive ? "bg-gray-100" : "hover:bg-gray-100"}`
          }
        >
          <img src={TaskIcon} alt="Task Icon" className="h-5 w-5" />
          <p>Tasks</p>
        </NavLink>
        <NavLink
          to="/devpratap/projects"
          className={({ isActive }) =>
            `w-full flex items-center gap-3 py-1.5 px-2 rounded-md cursor-pointer my-4 ${isActive ? "bg-gray-100" : "hover:bg-gray-100"}`
          }
        >
          <img src={ProjectIcon} alt="Project Icon" className="h-5 w-5" />
          <p>Projects</p>
        </NavLink>
        <NavLink
          to="/devpratap/calendar"
          className={({ isActive }) =>
            `w-full flex items-center gap-3 py-1.5 px-2 rounded-md cursor-pointer my-4 ${isActive ? "bg-gray-100" : "hover:bg-gray-100"}`
          }
        >
          <img src={BotIcon} alt="Bot Icon" className="h-5 w-5" />
          <p>Calendar</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
