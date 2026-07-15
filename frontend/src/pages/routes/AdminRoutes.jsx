// import React from 'react'

import { Routes, Route } from "react-router-dom";
import { Layout } from "../admin/components/Layout";
import Dashboard from "../admin/pages/Dashboard";
import Notices from "../admin/pages/notices/Notices";
import Students from "../admin/pages/students";
import ProjectReportsManager from "../admin/pages/projectReports/ProjectReportsManager";
import Supervisors from "../admin/pages/supervisors";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Users />} />
        <Route path="/add-students" element={<AddStudents />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/project-reports" element={<ProjectReportsManager />} />
        <Route path="/supervisors" element={<Supervisors />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
