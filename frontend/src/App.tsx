import { Route, Routes } from "react-router"
import LandingLayout from "./pages/LandingLayout.tsx"
import LandingPage from "./pages/LandingPage.tsx"
import ChooseSignupRolePage from "./pages/ChooseSignupRolePage.tsx"
import AuthLayout from "./pages/AuthLayout.tsx"
import Register from "./components/Register.tsx"
import Login from "./components/Login.tsx"
import VerifyOTP from "./components/VerifyOTP.tsx"
import MainLayout from "./pages/MainLayout.tsx"
import TaskPage from "./pages/TaskPage.tsx"

function App() {
  

  return (
    <div className="bg-white overflow-x-hidden">
    <Routes>
      <Route path="/" element={<LandingLayout />} >
       <Route index element={<LandingPage/>} />
       <Route path="choose-path" element={<ChooseSignupRolePage />} />
      </Route>
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="register/:roleType" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="verify-otp" element={<VerifyOTP />} /> 
      </Route>
      <Route path="/:name" element={<MainLayout />}>
        <Route path="tasks" element={<TaskPage />} />
      </Route>
    </Routes>
    </div>
  )
}

export default App
