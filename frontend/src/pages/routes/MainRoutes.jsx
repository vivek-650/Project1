import { Routes, Route, Navigate } from "react-router-dom";
import UserLogin from "../user/components/login/UserLogin";
import AdminLogin from "../admin/components/login/AdminLogin";
import AdminRoutes from "./AdminRoutes";
import UserRoutes from "./UserRoutes";
import MainPage from "../main/MainPage";
const MainRoutes = () => {
  const AdminPrivateRoute = ({ children }) => {
    const adminToken = sessionStorage.getItem("adminToken");
    // const adminToken = true;
    return adminToken ? children : <Navigate to="/admin" replace />;
  };
  const UserPrivateRoute = ({ children }) => {
    const userToken = sessionStorage.getItem("userToken");
    // const userToken = true;
    return userToken ? children : <Navigate to="/user" replace />;
  };
  const OpenRoutes = ({ children }) => {
    const adminToken = sessionStorage.getItem("adminToken");
    const userToken = sessionStorage.getItem("userToken");
    return adminToken ? (
      <Navigate to="/admin/dashboard" replace />
    ) : userToken ? (
      <Navigate to="/user/dashboard" replace />
    ) : (
      children
    );
  };
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route
        path="/admin"
        element={
          <OpenRoutes>
            <AdminLogin />
          </OpenRoutes>
        }
      ></Route>
      <Route
        path="/user"
        element={
          <OpenRoutes>
            <UserLogin />
          </OpenRoutes>
        }
      ></Route>

      <Route
        path="/admin/*"
        element={
          <AdminPrivateRoute>
            <AdminRoutes />
          </AdminPrivateRoute>
        }
      />

      <Route
        path="/user/*"
        element={
          <UserPrivateRoute>
            <UserRoutes />
          </UserPrivateRoute>
        }
      />
    </Routes>
  );
};

export default MainRoutes;
