import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="">
      <div className="min-h-screen flex justify-center">
        <div className="w-px min-h-screen  bg-gray-200"></div>
        <div className="w-[85%] min-[1350px]:max-w-[1200px]">
          <div className="w-[1000%] bg-gray-200 h-px relative left-[-10%] min-[1350px]:left-[-100%] mt-15"></div>
          <div>
            <Outlet />
          </div>
        </div>
        <div className="w-px min-h-screen  bg-gray-200"></div>
      </div>
    </div>
  );
};

export default AuthLayout;
