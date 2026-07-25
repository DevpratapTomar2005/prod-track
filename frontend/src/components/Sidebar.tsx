import { NavLink } from "react-router";
import DashboardIcon from "../assets/dashboard_icon.svg";
import ProjectIcon from "../assets/project_icon.svg";
import TaskIcon from "../assets/tasks_icon.svg";
import Logo from "../assets/temp_logo.svg";
import SidebarIcon from "../assets/sidebar_icon.svg";
import CalendarIcon from "../assets/calendar.svg";

const Sidebar = ({isExpanded=true, setIsExpanded}: { isExpanded?: boolean; setIsExpanded: (arg: boolean) => void }) => {
  

  return (
    <div
      className={`h-screen bg-white border-r border-gray-200 transition-width duration-20 ease-in-out ${isExpanded ? "p-2 sidebar-expanded" : "p-1 sidebar-collapsed"}`}
    >
      <div
        className={`p-2 flex items-center justify-between mt-1 ${isExpanded ? null : "flex-col-reverse"}`}
      >
        <div
          className={`flex items-center ${isExpanded ? null : "hidden"}`}
        >
          <span className="p-1 bg-black rounded">
            <img src={Logo} alt="logo" className="invert-100 h-5 w-5" />
          </span>
          <span className="ml-1.5 font-bold text-[14px] leading-3">
            <p>Tick</p>
            <p>Trackerz</p>
          </span>
        </div>
        <div
          className="p-1 hover:bg-gray-100 cursor-ew-resize rounded-md sidebar-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <img src={SidebarIcon} alt="sidebar icon" className={`h-5 w-5`} />
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
          <p
            className={`${isExpanded ? null : "hidden"}`}
          >
            Dashboard
          </p>
        </NavLink>
        <NavLink
          to="/devpratap/tasks"
          className={({ isActive }) =>
            `w-full flex items-center gap-3 py-1.5 px-2 rounded-md cursor-pointer my-4 ${isActive ? "bg-gray-100" : "hover:bg-gray-100"}`
          }
        >
          <img src={TaskIcon} alt="Task Icon" className="h-5 w-5" />
          <p
            className={`${isExpanded ? null : "hidden"}`}
          >
            Tasks
          </p>
        </NavLink>
        <NavLink
          to="/devpratap/projects"
          className={({ isActive }) =>
            `w-full flex items-center gap-3 py-1.5 px-2 rounded-md cursor-pointer my-4 ${isActive ? "bg-gray-100" : "hover:bg-gray-100"}`
          }
        >
          <img src={ProjectIcon} alt="Project Icon" className="h-5 w-5" />
          <p
            className={`${isExpanded ? null : "hidden"}`}
          >
            Projects
          </p>
        </NavLink>
        <NavLink
          to="/devpratap/calendar"
          className={({ isActive }) =>
            `w-full flex items-center gap-3 py-1.5 px-2 rounded-md cursor-pointer my-4 ${isActive ? "bg-gray-100" : "hover:bg-gray-100"}`
          }
        >
          <img src={CalendarIcon} alt="Calendar Icon" className="h-5 w-5" />
          <p
            className={`${isExpanded ? null : "hidden"}`}
          >
            Calendar
          </p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
