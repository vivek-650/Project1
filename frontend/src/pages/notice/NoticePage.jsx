import { useNavigate } from "react-router-dom";
import { UserCheck, Bell, LogIn } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const NoticePage = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    if (role === "supervisor") navigate("/supervisor/notice");
    else if (role === "student") navigate("/student/notice");
    else if (role === "studentLogin") navigate("/student/login");
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 py-16 font-sans text-foreground bg-background">
      {/* Theme-aware background layers */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#f5f7ff] via-white to-[#f5f7ff] dark:hidden" />
      <div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />

      {/* Local animation helpers (if not global) */}
      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-12px) translateX(8px)} }
        @keyframes floatReverse { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(12px) translateX(-8px)} }
        .animate-float{ animation: float 2.4s ease-in-out infinite; }
        .animate-floatReverse{ animation: floatReverse 2.4s ease-in-out infinite; }
      `}</style>

      {/* Global ThemeToggle renders from App.jsx; no local toggle here */}

      {/* Decorative Background Blobs */}
      <div className="pointer-events-none absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-br from-[#4F46E5] to-[#60A5FA] rounded-full blur-2xl opacity-30 dark:opacity-15 animate-float" />
      <div className="pointer-events-none absolute top-10 left-10 w-44 h-34 bg-gradient-to-br from-pink-400 to-[#FFB6C1] rounded-full blur-xl opacity-30 dark:opacity-15 animate-floatReverse" />

      {/* Main Content */}
      <div className="w-full max-w-5xl z-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Official Notices & Access</h1>
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Navigate by your role to view relevant notices or access your dashboard.
        </p>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Supervisor Notices */}
          <Card
            role="button"
            tabIndex={0}
            onClick={() => handleRoleSelection("supervisor")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleRoleSelection("supervisor"); }
            }}
            className="group rounded-2xl border border-border bg-card/80 backdrop-blur-xl shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <CardHeader className="items-center text-center">
              <div className="w-10 h-10 mb-2 rounded-lg bg-muted/60 grid place-items-center">
                <UserCheck className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Supervisor Notices</CardTitle>
              <CardDescription>All notices tailored for supervisors</CardDescription>
            </CardHeader>
          </Card>

          {/* Student Notices */}
          <Card
            role="button"
            tabIndex={0}
            onClick={() => handleRoleSelection("student")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleRoleSelection("student"); }
            }}
            className="group rounded-2xl border border-border bg-card/80 backdrop-blur-xl shadow-sm hover:shadow-md transition cursor-pointer"
          >
            <CardHeader className="items-center text-center">
              <div className="w-10 h-10 mb-2 rounded-lg bg-muted/60 grid place-items-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Student Notices</CardTitle>
              <CardDescription>All notices intended for students</CardDescription>
            </CardHeader>
          </Card>

          {/* Student Portal Login (full width on sm) */}
          <Card
            role="button"
            tabIndex={0}
            onClick={() => handleRoleSelection("studentLogin")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleRoleSelection("studentLogin"); }
            }}
            className="group rounded-2xl border border-border bg-card/80 backdrop-blur-xl shadow-sm hover:shadow-md transition sm:col-span-2 cursor-pointer"
          >
            <CardHeader className="items-center text-center">
              <div className="w-10 h-10 mb-2 rounded-lg bg-muted/60 grid place-items-center">
                <LogIn className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-xl">Student Portal Login</CardTitle>
              <CardDescription>Access your dashboard and submissions</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NoticePage;
