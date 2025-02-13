// import React from 'react'
import { Routes, Route } from "react-router-dom";
import { Layout } from "../user/components/Layout";
import Dashboard from "../user/pages/dashboard/Dashboard";
import Recepies from "../user/pages/Recepies/Recepies";
import Drafts from "../user/pages/drafts/Drafts";
import Uploaded from "../user/pages/uploaded/Uploaded";
import AddRecepies from "../user/pages/AddRecepies/AddRecepies";

const UserRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index path={"/dashboard"} element={<Dashboard />} />
        <Route path={"/recepies"} element={<Recepies />} />
        <Route path={"/drafts"} element={<Drafts />} />
        <Route path={"/uploaded"} element={<Uploaded />} />
        <Route path={"/new-recepie"} element={<AddRecepies />} />
      </Route>
    </Routes>
  )
}

export default UserRoutes
