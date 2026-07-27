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
import ProjectsPage from "./pages/ProjectsPage.tsx"
import Dashboard from "./components/Dashboard.tsx"
import ProjectAnalytics from "./pages/ProjectAnalytics.tsx"
import EventCalendarPage from "./pages/EventCalendarPage.tsx"
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
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:project-name-id" element={<ProjectAnalytics/>}/>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="calendar" element={<EventCalendarPage />} />
      </Route>
    </Routes>
    </div>
  )
}

export default App
