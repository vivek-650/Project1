// import React from 'react'
import { Routes, Route } from "react-router-dom";
import { Layout } from "../user/components/Layout";
// import Dashboard from "../user/pages/Dashboard/Dashboard";
import Dashboard from "../user/pages/dashboard/Dashboard";

const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index path={"/dashboard"} element={<Dashboard />} />
        {/* <Route path={"/users"} element={<Users />} /> */}
        {/* <Route path={"/requests"} element={<Requests />} /> */}
      </Route>
    </Routes>
  )
}

export default UserRoutes
