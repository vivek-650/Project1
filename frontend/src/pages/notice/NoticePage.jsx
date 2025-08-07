import { useNavigate } from "react-router-dom";
import { UserCheck, Bell, LogIn } from "lucide-react";

const NoticePage = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    if (role === "supervisor") navigate("/supervisor/notice");
    else if (role === "student") navigate("/student/notice");
    else if (role === "studentLogin") navigate("/student/login");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-[#92acff91] via-[#eff2ff] to-[#ffdbfa] overflow-hidden px-6 py-16 flex items-center justify-center">
      {/* Animated Background Blobs */}
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-[#362eda] to-[#60a5fa] rounded-full blur-2xl opacity-30 animate-float" />
      <div className="absolute top-10 left-10 w-44 h-34 bg-gradient-to-br from-[#ff5fa2] to-[#ffc0cb] rounded-full blur-xl opacity-30 animate-floatReverse" />

      {/* Main Content */}
      <div className="w-full max-w-5xl z-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-700 mb-4">
          Official Notices & Access
        </h1>
        <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
          Navigate by your role to view relevant notices or access your dashboard—designed for an immersive AI-like feel.
        </p>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div
            onClick={() => handleRoleSelection("supervisor")}
            className="cursor-pointer border border-blue-300/70 rounded-xl bg-pink-200/85 backdrop-blur-lg shadow-sm transition p-6 flex flex-col items-center"
          >
            <UserCheck className="text-4xl text-pink-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-1">Supervisor Notices</h3>
            <p className="text-sm text-gray-600">All notices tailored for supervisors</p>
          </div>

          <div
            onClick={() => handleRoleSelection("student")}
            className="cursor-pointer bg-[#fef9c3]/80 border border-blue-300/70 rounded-xl backdrop-blur-md shadow-sm transition p-6 flex flex-col items-center"
          >
            <Bell className="text-4xl text-yellow-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-1">Student Notices</h3>
            <p className="text-sm text-gray-600">All notices intended for students</p>
          </div>

          <div
            onClick={() => handleRoleSelection("studentLogin")}
            className="cursor-pointer bg-[#f0f9ff]/80 border border-blue-300/70 rounded-xl backdrop-blur-md shadow-sm transition p-6 flex flex-col items-center sm:col-span-2"
          >
            <LogIn className="text-4xl text-cyan-700 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-1">Student Portal Login</h3>
            <p className="text-sm text-gray-600">Access your dashboard and submissions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticePage;
