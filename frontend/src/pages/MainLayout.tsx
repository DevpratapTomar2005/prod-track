import { useState } from "react";
import { Outlet } from "react-router";
import Topbar from "../components/Topbar.tsx";
import Sidebar from "../components/Sidebar.tsx";
import { useLocation, useParams } from "react-router";
const MainLayout = () => {
  const location = useLocation();
  const { name } = useParams();
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div>
      <div className="flex relative h-screen">
        <div className="fixed left-0 top-0 md:z-10 lg:z-0 sidebar-layout-div">
          <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
        </div>
        <div
          className={`relative overflow-hidden transition-width duration-20 ease-in-out layout-outlet-div ${isExpanded ? "lg:ml-[200px] lg:w-[calc(100%-200px)]" : "ml-[53px] w-[calc(100%-53px)] layout-outlet-not-expanded"}`}
        >
          {location.pathname !== `/${name}/calendar` ? (
            <Topbar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
          ) : null}
          <Outlet context={{ isExpanded, setIsExpanded }} />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
