import { Outlet } from "react-router";
import Topbar from "../components/Topbar.tsx";
import Sidebar from "../components/Sidebar.tsx";
import { useLocation, useParams } from "react-router";
const MainLayout = () => {
  const location = useLocation();
  const { name } = useParams();
  return (
    <div>
      <div className="flex relative h-screen">
        <div className="fixed left-0 top-0">
        <Sidebar />
        </div>
        <div className="ml-[200px] w-[calc(100%-200px)] relative overflow-hidden">
          {
            location.pathname !==`/${name}/calendar`?<Topbar />:null
          }
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
