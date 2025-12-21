// import React from 'react'

import { Routes, Route } from "react-router-dom";
import { Layout } from "../admin/components/Layout";
import Dashboard from "../admin/pages/Dashboard";
import Notices from "../admin/pages/notices/Notices";
import { AddStudents } from "../admin/pages/AddUsers/AddUsers";
import { Users } from "../admin/pages/Users/Users";

// Simple Coming Soon banner component
const ComingSoon = () => (
  <div
    style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}
  >
    <div className="text-center">
      <div className="text-3xl font-bold mb-4">🚧 Coming Soon 🚧</div>
      <div className="text-lg text-muted-foreground">This page is under construction.</div>
    </div>
  </div>
);

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Users />} />
        <Route path="/add-students" element={<AddStudents />} />
        <Route path="/notices" element={<Notices />} />
        {/* Example: Add more routes below, using ComingSoon for unavailable pages */}
        <Route path="/settings" element={<ComingSoon />} />
        <Route path="/reports" element={<ComingSoon />} />
        <Route path="*" element={<ComingSoon />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
