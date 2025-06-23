// import React from 'react'
import { Routes, Route } from "react-router-dom";
import { Layout } from "../admin/components/Layout";
import Dashboard from "../admin/pages/Dashboard";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index path={"/"} element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
