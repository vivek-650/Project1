// import React from 'react'
import { Routes, Route } from "react-router-dom";
import { Layout } from "../teacher/components/Layout";
import { Requests } from "../teacher/pages/Requests/Requests";
import { Users } from "../teacher/pages/Users/Users";
import Dashboard from "../teacher/pages/Dashboard/dashboard";
import { AddUsers } from "../teacher/pages/AddUsers/AddUsers";

const TeacherRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index path={"/"} element={<Dashboard />} />
        <Route path={"/users"} element={<Users />} />
        <Route path={"/add-users"} element={<AddUsers />} />
        <Route path={"/requests"} element={<Requests />} />
      </Route>
    </Routes>
  );
};

export default TeacherRoutes;
