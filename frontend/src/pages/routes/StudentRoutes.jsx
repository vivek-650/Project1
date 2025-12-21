// import React from 'react'
import { Routes, Route } from "react-router-dom";
import { Layout } from "../student/components/Layout";
import Dashboard from "../student/pages/dashboard/Dashboard";
import Recepies from "../student/pages/Recepies/Recepies";
import Drafts from "../student/pages/drafts/Drafts";
import Uploaded from "../student/pages/uploaded/Uploaded";
import AddRecepies from "../student/pages/AddRecepies/AddRecepies";
import AccoutSetting from "../student/pages/accountSetting/AccoutSetting";
import TeamFormation from "../student/pages/teamFormation/TeamFormation";

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

const StudentRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path={"/dashboard"} element={<Dashboard />} />
        {/* <Route path={"/recepies"} element={<Recepies />} /> */}
        {/* <Route path={"/drafts"} element={<Drafts />} /> */}
        {/* <Route path={"/uploaded"} element={<Uploaded />} /> */}
        {/* <Route path={"/new-recepie"} element={<AddRecepies />} /> */}
        <Route path={"/account-setting"} element={<AccoutSetting />} />
        <Route path={"/team-formation"} element={<TeamFormation />} />
        {/* Example: Add more routes below, using ComingSoon for unavailable pages */}
        <Route path="/settings" element={<ComingSoon />} />
        <Route path="/reports" element={<ComingSoon />} />
        <Route path="*" element={<ComingSoon />} />
      </Route>
    </Routes>
  );
};

export default StudentRoutes;
