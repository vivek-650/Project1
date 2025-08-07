import { MoveRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    title: "Administrator",
    description: "Manage system-wide configurations and user privileges.",
    route: "/administrator",
    bgColor: "bg-red-100/80",
  },
  {
    title: "Coordinator",
    description: "Oversee projects, assign supervisors, and manage schedules.",
    route: "/coordinator",
    bgColor: "bg-purple-100/80",
  },
  {
    title: "Supervisor",
    description: "Guide students and monitor project progress.",
    route: "/supervisor/login",
    bgColor: "bg-green-100/80",
  },
  {
    title: "Student",
    description: "Access your dashboard, submit projects, and track feedback.",
    route: "/student/login",
    bgColor: "bg-yellow-100/80",
  },
];

const MainPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (route) => navigate(route);

  return (
    <div className="relative min-h-screen flex flex-col items-center font-sans overflow-hidden bg-gradient-to-br from-[#f5f7ff] via-[#ffffff] to-[#f5f7ff]">
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] left-[-20%] w-[50vw] h-[50vw] bg-gradient-to-tr from-[#4F46E5] to-[#60A5FA] rounded-full blur-[120px] opacity-40" />
      <div className="absolute bottom-[-15%] right-[-20%] w-[60vw] h-[60vw] bg-gradient-to-tr from-pink-400 to-[#FFB6C1] rounded-full blur-[120px] opacity-40" />

      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-bold text-center text-[#1e2a46] m mt-8 mb-4 z-10">
        Member Area
      </h1>
      <p className="text-lg text-center text-[#3b4a63] mb-12 max-w-xl z-10">
        Select your role to continue. Access and functionality are tailored for each role.
      </p>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-3xl z-10">
        {roles.map((role) => (
          <div
            key={role.title}
            className={`relative rounded-2xl border-1 border-blue-500/20  transition-transform shadow-xl cursor-pointer`}
            onClick={() => handleNavigate(role.route)}
          >
            <div
              className={`rounded-2xl backdrop-blur-xl ${role.bgColor} p-6`}
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-3xl font-semibold text-[#262727] mb-2">
                    {role.title}
                  </h2>
                  <p className="text-md text-[#374151] mb-5">{role.description}</p>
                </div>
                <button className="flex items-center justify-center gap-2 w-full min-h-[42px] bg-gradient-to-r from-[#a2a3ff] to-[#60A5FA] text-white rounded-xl cursor-pointer font-semibold text-sm hover:opacity-90 transition-opacity">
                  Go to {role.title}
                  <MoveRight />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
