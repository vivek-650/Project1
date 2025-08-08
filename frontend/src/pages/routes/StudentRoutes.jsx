// import React from 'react'
import { Routes, Route } from "react-router-dom";
import { Layout } from "../student/components/Layout";
import Dashboard from "../student/pages/dashboard/Dashboard";
import Recepies from "../student/pages/Recepies/Recepies";
import Drafts from "../student/pages/drafts/Drafts";
import Uploaded from "../student/pages/uploaded/Uploaded";
import AddRecepies from "../student/pages/AddRecepies/AddRecepies";
import AccoutSetting from "../student/pages/accountSetting/AccoutSetting";
import TeamFormation from "../student/pages/TeamFormation/TeamFormation";
const StudentRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index path={"/"} element={<Dashboard />} />
        <Route path={"/recepies"} element={<Recepies />} />
        <Route path={"/drafts"} element={<Drafts />} />
        <Route path={"/uploaded"} element={<Uploaded />} />
        <Route path={"/new-recepie"} element={<AddRecepies />} />
        <Route path={"/user-setting"} element={<AccoutSetting />} />
        <Route path={"/team-formation"} element={<TeamFormation />} />
      </Route>
    </Routes>
  );
};

export default StudentRoutes;
