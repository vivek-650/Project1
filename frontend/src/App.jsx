// import React from 'react'
import { ToastContainer } from "react-fox-toast"
import MainRoutes from "./pages/routes/MainRoutes"
import { ThemeToggle } from "@/components/theme-toggle"
import { useLocation } from "react-router-dom"

const App = () => {
  const location = useLocation()
  const path = location.pathname || ""
  const isDashboard = (
    path.startsWith("/student/dashboard") ||
    path.startsWith("/supervisor/dashboard") ||
    path.startsWith("/coordinator/dashboard") ||
    path.startsWith("/administrator/dashboard")
  )
  return (
    <div>
      <ToastContainer /> 
      {!isDashboard && (
        <div className="fixed top-4 right-4 z-[99999]">
          <ThemeToggle />
        </div>
      )}
      <MainRoutes />
    </div>
  )
}

export default App