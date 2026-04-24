import React from "react";
import { Outlet } from "react-router";
import Topbar from "../components/Topbar.tsx";
import Sidebar from "../components/Sidebar.tsx";

const MainLayout = () => {
  return (
    <div>
      <div className="flex relative h-screen">
        <div className="fixed left-0 top-0">
        <Sidebar />
        </div>
        <div className="ml-[200px] w-[calc(100%-200px)] relative">
          <Topbar />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
