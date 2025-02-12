// import React from 'react'
import { Routes, Route } from "react-router-dom";
import { Layout } from "../admin/components/Layout";
import { Requests } from "../admin/pages/Requests/Requests";
import { Users } from "../admin/pages/Users/Users";
import Dashboard from "../admin/pages/Dashboard/dashboard";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index path={"/dashboard"} element={<Dashboard />} />
        <Route path={"/users"} element={<Users />} />
        <Route path={"/requests"} element={<Requests />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
