// import React from 'react'
import { Routes, Route } from "react-router-dom"
import UserLogin from "../user/components/login/UserLogin"
import AdminLogin from "../admin/components/login/AdminLogin"
import AdminRoutes from "./AdminRoutes"
import UserRoutes from "./UserRoutes"
const MainRoutes = () => {
  return (
    <Routes>
        <Route path="/admin-login" element={<AdminLogin />}></Route>
        <Route path="/user-login" element={<UserLogin />}></Route>
        <Route path="/admin-login/*" element={<AdminRoutes/>}></Route>
        <Route path="/user-login/*" element={<UserRoutes />}></Route>
    </Routes>
  )
}

export default MainRoutes