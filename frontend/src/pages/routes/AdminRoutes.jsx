// import React from 'react'
import { Routes, Route } from "react-router-dom";
import { Layout } from "../admin/components/Layout";
import Dashboard from "../admin/pages/Dashboard";
import Notices from "../admin/pages/notices/Notices";
import Students from "../admin/pages/students";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index path={"/"} element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/teachers" element={<Dashboard />} />
        <Route path="/notices" element={<Notices />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
