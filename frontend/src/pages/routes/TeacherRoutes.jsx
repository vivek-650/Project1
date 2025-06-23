// import React from 'react'
import { Routes, Route } from "react-router-dom";
import { Layout } from "../admin/components/Layout";
import { Requests } from "../admin/pages/Requests/Requests";
import { Users } from "../admin/pages/Users/Users";
import Dashboard from "../admin/pages/Dashboard/dashboard";
import { AddUsers } from "../admin/pages/AddUsers/AddUsers";

const TeacherRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index path={"/dashboard"} element={<Dashboard />} />
        <Route path={"/users"} element={<Users />} />
        <Route path={"/add-users"} element={<AddUsers />} />
        <Route path={"/requests"} element={<Requests />} />
      </Route>
    </Routes>
  );
};

export default TeacherRoutes;
