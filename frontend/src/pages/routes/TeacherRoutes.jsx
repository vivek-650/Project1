// import React from 'react'
import { Routes, Route } from "react-router-dom";
import { Layout } from "../teacher/components/Layout";
import { Requests } from "../teacher/pages/Requests/Requests";
import { Users } from "../teacher/pages/Users/Users";
import Dashboard from "../teacher/pages/Dashboard/dashboard";
import Teams from "../teacher/pages/Teams/Teams";
import { AddUsers } from "../teacher/pages/AddUsers/AddUsers";

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

const TeacherRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path={"/dashboard"} element={<Dashboard />} />
        <Route path={"/users"} element={<Users />} />
        <Route path={"/add-users"} element={<AddUsers />} />
        <Route path={"/requests"} element={<Requests />} />
        {/* Example: Add more routes below, using ComingSoon for unavailable pages */}
        <Route path="/settings" element={<ComingSoon />} />
        <Route path="/reports" element={<ComingSoon />} />
        <Route path="*" element={<ComingSoon />} />
        <Route path={"/teams"} element={<Teams />} />
      </Route>
    </Routes>
  );
};

export default TeacherRoutes;
