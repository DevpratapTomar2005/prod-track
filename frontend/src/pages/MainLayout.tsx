import { useState } from "react";
import { Outlet } from "react-router";
import Topbar from "../components/Topbar.tsx";
import Sidebar from "../components/Sidebar.tsx";
import { useLocation, useParams } from "react-router";
const MainLayout = () => {
  const location = useLocation();
  const { name } = useParams();
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <div>
      <div className="flex relative h-screen">
        <div className="fixed left-0 top-0">
          <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        </div>
        <div className={`relative overflow-hidden transition-width duration-20 ease-in-out ${isExpanded ? 'ml-[200px] w-[calc(100%-200px)]' : "ml-[53px] w-[calc(100%-53px)]"}`}>
          {location.pathname !== `/${name}/calendar` ? <Topbar isExpanded={isExpanded} /> : null}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
