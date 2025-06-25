import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "../admin/components/login/AdminLogin";
import TeacherLogin from "../teacher/components/login/TeacherLogin";
import StudentLogin from "../student/components/login/StudentLogin";
import MainPage from "../main/MainPage";
import StudentRoutes from "./StudentRoutes";
import TeacherRoutes from "./TeacherRoutes";
import AdminRoutes from "./AdminRoutes";
import StudentHome from "../student/pages/landingPage/StudentHome";
import TeacherHome from "../teacher/pages/landingPage/TeacherHome";

const MainRoutes = () => {
  const AdminPrivateRoute = ({ children }) => {
    const adminToken = sessionStorage.getItem("adminToken");
    // const adminToken = true;
    return adminToken ? children : <Navigate to="/admin" replace />;
  };
  const TeacherPrivateRoute = ({ children }) => {
    const teacherToken = sessionStorage.getItem("teacherToken");
    // const teacherToken = true;
    return teacherToken ? children : <Navigate to="/teacher/login" replace />;
  };
  const StudentPrivateRoute = ({ children }) => {
    const studentToken = sessionStorage.getItem("studentToken");
    // const studentToken = true;
    return studentToken ? children : <Navigate to="/student/login" replace />;
  };
  const OpenRoutes = ({ children }) => {
    const studentToken = sessionStorage.getItem("studentToken");
    const teacherToken = sessionStorage.getItem("teacherToken");
    const adminToken = sessionStorage.getItem("adminToken");
    return teacherToken ? (
      <Navigate to="/teacher/dashboard" replace />
    ) : studentToken ? (
      <Navigate to="/student/dashboard" replace />
    ) : adminToken ? (
      <Navigate to="/admin/dashboard" replace />
    ) : (
      children
    );
  };
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route
        path="/teacher"
        element={
          <OpenRoutes>
            <TeacherHome />
          </OpenRoutes>
        }
      ></Route>
      <Route
        path="/teacher/login"
        element={
          <OpenRoutes>
            <TeacherLogin />
          </OpenRoutes>
        }
      />

      <Route
        path="/student"
        element={
          <OpenRoutes>
            <StudentHome />
          </OpenRoutes>
        }
      ></Route>
      <Route
        path="/student/login"
        element={
          <OpenRoutes>
            <StudentLogin />
          </OpenRoutes>
        }
      />

      <Route
        path="/admin"
        element={
          <OpenRoutes>
            <AdminLogin />
          </OpenRoutes>
        }
      />

      <Route
        path="/admin/dashboard/*"
        element={
          <AdminPrivateRoute>
            <AdminRoutes />
          </AdminPrivateRoute>
        }
      />

      <Route
        path="/teacher/dashboard/*"
        element={
          <TeacherPrivateRoute>
            <TeacherRoutes />
          </TeacherPrivateRoute>
        }
      />

      <Route
        path="/student/dashboard/*"
        element={
          <StudentPrivateRoute>
            <StudentRoutes />
          </StudentPrivateRoute>
        }
      />
    </Routes>
  );
};

export default MainRoutes;
