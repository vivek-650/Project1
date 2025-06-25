// import React from 'react'
import { Routes, Route } from "react-router-dom";
import { Layout } from "../admin/components/Layout";
import Dashboard from "../admin/pages/Dashboard";
import Notices from "../admin/components/notices/Notices";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index path={"/"} element={<Dashboard />} />
        <Route path="/teachers" element={<Dashboard />} />
        <Route path="/notices" element={<Notices />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
