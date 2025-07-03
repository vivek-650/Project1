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
import HomePage from "../home/HomePage";
import NoticePage from "../notice/NoticePage";

const MainRoutes = () => {
  const AdministratorPrivateRoute = ({ children }) => {
    const administratorToken = sessionStorage.getItem("administratorToken");
    return administratorToken ? (
      children
    ) : (
      <Navigate to="/administrator" replace />
    );
  };
  const CoordinatorPrivateRoute = ({ children }) => {
    const coordinatorToken = sessionStorage.getItem("coordinatorToken");
    return coordinatorToken ? children : <Navigate to="/coordinator" replace />;
  };
  const SupervisorPrivateRoute = ({ children }) => {
    const supervisorToken = sessionStorage.getItem("supervisorToken");
    return supervisorToken ? (
      children
    ) : (
      <Navigate to="/supervisor/login" replace />
    );
  };
  const StudentPrivateRoute = ({ children }) => {
    const studentToken = sessionStorage.getItem("studentToken");
    return studentToken ? children : <Navigate to="/student/login" replace />;
  };
  const OpenRoutes = ({ children }) => {
    const studentToken = sessionStorage.getItem("studentToken");
    const supervisorToken = sessionStorage.getItem("supervisorToken");
    const coordinatorToken = sessionStorage.getItem("coordinatorToken");
    const administratorToken = sessionStorage.getItem("administratorToken");

    return administratorToken ? (
      <Navigate to="/administrator/dashboard" replace />
    ) : coordinatorToken ? (
      <Navigate to="/coordinator/dashboard" replace />
    ) : supervisorToken ? (
      <Navigate to="/supervisor/dashboard" replace />
    ) : studentToken ? (
      <Navigate to="/student/dashboard" replace />
    ) : (
      children
    );
  };
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/members" element={<MainPage />} />
      <Route path="/notice" element={<NoticePage />} />

      {/* Administrator Routes */}
      <Route
        path="/administrator"
        element={
          <OpenRoutes>
            <></>
          </OpenRoutes>
        }
      />
      <Route
        path="/administrator/dashboard/*"
        element={
          <AdministratorPrivateRoute>
            <AdminRoutes />
          </AdministratorPrivateRoute>
        }
      />

      {/* Coordinator Routes */}
      <Route
        path="/coordinator"
        element={
          <OpenRoutes>
            <AdminLogin />
          </OpenRoutes>
        }
      />
      <Route
        path="/coordinator/dashboard/*"
        element={
          <CoordinatorPrivateRoute>
            <AdminRoutes />
          </CoordinatorPrivateRoute>
        }
      />

      {/* Supervisor (Teacher) Routes */}
      <Route
        path="/supervisor/notice"
        element={
          <OpenRoutes>
            <TeacherHome />
          </OpenRoutes>
        }
      />
      <Route
        path="/supervisor/login"
        element={
          <OpenRoutes>
            <TeacherLogin />
          </OpenRoutes>
        }
      />
      <Route
        path="/supervisor/dashboard/*"
        element={
          <SupervisorPrivateRoute>
            <TeacherRoutes />
          </SupervisorPrivateRoute>
        }
      />

      {/* Student Routes */}
      <Route
        path="/student/notice"
        element={
          // <OpenRoutes>
          <StudentHome />
          // </OpenRoutes>
        }
      />
      <Route
        path="/student/login"
        element={
          <OpenRoutes>
            <StudentLogin />
          </OpenRoutes>
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
