import { useNavigate } from "react-router-dom";
import { MoveRight, ScrollTextIcon, UserIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    if (role === "members") navigate("/members");
    if (role === "notice") navigate("/notice");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center font-sans overflow-hidden text-foreground bg-background">
      {/* Background gradients per theme */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#f5f7ff] via-white to-[#f5f7ff] dark:hidden" />
      <div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
      {/* Global ThemeToggle renders from App.jsx; no local toggle here */}
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
  <div className="pointer-events-none absolute top-[-10%] left-[-20%] w-[50vw] h-[50vw] bg-gradient-to-tr from-[#4F46E5] to-[#60A5FA] rounded-full blur-[120px] opacity-30 dark:opacity-15" />
  <div className="pointer-events-none absolute bottom-[-15%] right-[-20%] w-[60vw] h-[60vw] bg-gradient-to-tr from-pink-400 to-[#FFB6C1] rounded-full blur-[120px] opacity-30 dark:opacity-15" />

       {/* Floating Shapes */}
      <div className="absolute top-10 right-20 w-20 h-20 bg-gradient-to-br from-[#4F46E5] to-[#60A5FA] rounded-full blur-2xl opacity-60 animate-float" />
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-pink-400 to-[#ff7186] rounded-full blur-xl opacity-40 animate-floatReverse" />

      {/* Hero Section */}
      <div className="text-center mt-20 z-10 px-4 max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
          Aecura – Smart Project Management, Engineered for Excellence.
        </h1>
        <p className="mt-4 text-muted-foreground text-sm md:text-lg leading-relaxed">
          Seamlessly connecting{" "}
          <span className="font-semibold"> students and professors </span> for
          project management, notice sharing, and academic collaboration.
        </p>
      </div>

      {/* Cards Section */}
      <div className="mt-16 flex flex-wrap justify-center gap-8 px-6 z-10">
        {/* Card 1 */}
        <Card className="w-full sm:w-[280px] max-w-xs rounded-2xl border border-border shadow-2xl backdrop-blur-xl bg-card/80 transition-all duration-300 hover:shadow-[#60A5FA]/40">
          <CardHeader className="items-center text-center">
            <UserIcon className="w-10 h-10 mb-2 text-primary" />
            <CardTitle className="text-xl text-foreground">Members Area</CardTitle>
            <CardDescription className="text-center">
              Manage student and faculty details efficiently in one central space.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full min-h-[42px] bg-gradient-to-r from-[#6366F1] to-[#60A5FA] text-white hover:opacity-90 transition-opacity dark:from-primary dark:to-primary/80 dark:text-primary-foreground"
              onClick={() => handleRoleSelection("members")}
            >
              Get Started
              <MoveRight className="ml-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="w-full sm:w-[280px] max-w-xs rounded-2xl border border-border shadow-2xl backdrop-blur-xl bg-card/80 transition-all duration-300 hover:shadow-[#60A5FA]/40">
          <CardHeader className="items-center text-center">
            <ScrollTextIcon className="w-10 h-10 mb-2 text-primary" />
            <CardTitle className="text-xl text-foreground">Notice Board</CardTitle>
            <CardDescription className="text-center">
              Post important updates and announcements for all students.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full min-h-[40px] bg-gradient-to-r from-[#6366F1] to-[#60A5FA] text-white hover:opacity-90 transition-opacity dark:from-primary dark:to-primary/80 dark:text-primary-foreground"
              onClick={() => handleRoleSelection("notice")}
            >
              Get Started
              <MoveRight className="ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
