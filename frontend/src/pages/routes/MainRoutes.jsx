import { Routes, Route } from "react-router-dom";
import UserLogin from "../user/components/login/UserLogin";
import AdminLogin from "../admin/components/login/AdminLogin";
import AdminRoutes from "./AdminRoutes";
import UserRoutes from "./UserRoutes";
import MainPage from "../main/MainPage";
const MainRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/admin" element={<AdminLogin />}></Route>
      <Route path="/user" element={<UserLogin />}></Route>
      <Route path="/admin/*" element={<AdminRoutes />}></Route>
      <Route path="/user/*" element={<UserRoutes />}></Route>
    </Routes>
  );
};

export default MainRoutes;
