import { Routes, Route, Navigate } from "react-router-dom";
// import UserLogin from "../user/components/login/UserLogin";
import AdminLogin from "../admin/components/login/AdminLogin";
import MainPage from "../main/MainPage";
import StudentRoutes from "./StudentRoutes";
import TeacherRoutes from "./TeacherRoutes";
import StudentHome from "../user/pages/landingPage/StudentHome";
import TeacherHome from "../admin/pages/landingPage/TeacherHome";

const MainRoutes = () => {
  const TeacherPrivateRoute = ({ children }) => {
    const teacherToken = sessionStorage.getItem("teacherToken");
    // const teacherToken = true;
    return teacherToken ? children : <Navigate to="/teacher" replace />;
  };
  const StudentPrivateRoute = ({ children }) => {
    const studentToken = sessionStorage.getItem("studentToken");
    // const studentToken = true;
    return studentToken ? children : <Navigate to="/student" replace />;
  };
  const OpenRoutes = ({ children }) => {
    const studentToken = sessionStorage.getItem("studentToken");
    const teacherToken = sessionStorage.getItem("teacherToken");
    return teacherToken ? (
      <Navigate to="/teacher/dashboard" replace />
    ) : studentToken ? (
      <Navigate to="/student/dashboard" replace />
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
            {/* <AdminLogin /> */}
          </OpenRoutes>
        }
      ></Route>
      <Route
        path="/student"
        element={
          <OpenRoutes>
            <StudentHome />
            {/* <UserLogin /> */}
          </OpenRoutes>
        }
      ></Route>

      <Route
        path="/teacher/*"
        element={
          <TeacherPrivateRoute>
            <TeacherRoutes />
          </TeacherPrivateRoute>
        }
      />

      <Route
        path="/student/*"
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
