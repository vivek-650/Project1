import { useNavigate } from "react-router-dom";
import { MoveRight, ScrollTextIcon, UserIcon} from "lucide-react";
const HomePage = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    if (role === "members") navigate("/members");
    if (role === "notice") navigate("/notice");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center font-sans overflow-hidden bg-gradient-to-br from-[#f5f7ff] via-[#ffffff] to-[#f5f7ff]">
      {/* Custom Floating Animation Styles */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); }
          50% { transform: translateY(-15px) translateX(10px) scale(1.05); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0) translateX(0) scale(1); }
          50% { transform: translateY(15px) translateX(-10px) scale(1.05); }
        }
        .animate-float {
          animation: float 2s ease-in-out infinite, pulse 3s ease-in-out infinite;
        }
        .animate-floatReverse {
          animation: floatReverse 2s ease-in-out infinite, pulse 3s ease-in-out infinite;
        }
      `}</style>

      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] left-[-20%] w-[50vw] h-[50vw] bg-gradient-to-tr from-[#4F46E5] to-[#60A5FA] rounded-full blur-[120px] opacity-40" />
      <div className="absolute bottom-[-15%] right-[-20%] w-[60vw] h-[60vw] bg-gradient-to-tr from-pink-400 to-[#FFB6C1] rounded-full blur-[120px] opacity-40" />

       {/* Floating Shapes */}
      <div className="absolute top-10 right-20 w-20 h-20 bg-gradient-to-br from-[#4F46E5] to-[#60A5FA] rounded-full blur-2xl opacity-60 animate-float" />
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-pink-400 to-[#ff7186] rounded-full blur-xl opacity-40 animate-floatReverse" />

      {/* Hero Section */}
      <div className="text-center mt-20 z-10 px-4 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-700 leading-tight">
          Aecura – Smart Project Management, Engineered for Excellence.
        </h1>
        <p className="mt-4 text-gray-600 text-sm md:text-lg leading-relaxed">
          Seamlessly connecting{" "}
          <span className="font-semibold"> students and professors </span> for
          project management, notice sharing, and academic collaboration.
        </p>
      </div>

      {/* Cards Section */}
      <div className="mt-16 flex flex-wrap justify-center gap-8 px-6 z-10">
        {/* Card 1 */}
        <div className="flex flex-col items-center bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-500/20 p-6 w-full sm:w-[280px] max-w-xs transition-all duration-300 hover:shadow-[#60A5FA]/40">
          <UserIcon
            className="w-[90%] mb-4 rounded-xl"
          />
          <p className="text-xl font-semibold text-gray-900 mb-2">
            Members Area
          </p>
          <p className="text-sm text-gray-500 text-center mb-5">
            Manage student and faculty details efficiently in one central space.
          </p>
          <button
            className="flex items-center justify-center gap-1 w-full min-h-[42px] bg-gradient-to-r from-[#6366F1] to-[#60A5FA] text-white rounded-xl cursor-pointer font-semibold text-sm hover:opacity-90 transition-opacity"
            onClick={() => handleRoleSelection("members")}
          >
            Get Started
            <MoveRight />
          </button>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col items-center bg-white/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-blue-500/20 p-6 w-full sm:w-[280px] max-w-xs transition-all duration-300 hover:shadow-[#60A5FA]/40">
          <ScrollTextIcon
            className="text-2xl mb-4"
          />
          <p className="text-xl font-semibold text-gray-900 mb-2">
            Notice Board
          </p>
          <p className="text-sm text-gray-600 text-center mb-4">
            Post important updates and announcements for all students.
          </p>
          <button
            className=" flex items-center justify-center gap-1 w-full min-h-[40px] bg-gradient-to-r from-pink-400 to-[#fa99a7] text-white rounded-xl cursor-pointer font-semibold text-sm hover:opacity-90 transition-opacity"
            onClick={() => handleRoleSelection("notice")}
          >
            Get Started
            <MoveRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
