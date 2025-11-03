import { MoveRight, Shield, ClipboardList, UserCheck, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

const roles = [
  {
    title: "Administrator",
    description: "Manage system-wide configurations and user privileges.",
    route: "/administrator",
    icon: Shield,
    lightBg: "bg-red-100/80",
    accent: "text-red-600 dark:text-red-400",
    darkRing: "dark:ring-red-500/30",
    darkBorder: "dark:border-red-500/30",
    bar: "bg-red-500 dark:bg-red-500/70",
  },
  {
    title: "Coordinator",
    description: "Oversee projects, assign supervisors, and manage schedules.",
    route: "/coordinator",
    icon: ClipboardList,
    lightBg: "bg-purple-100/80",
    accent: "text-purple-600 dark:text-purple-400",
    darkRing: "dark:ring-purple-500/30",
    darkBorder: "dark:border-purple-500/30",
    bar: "bg-purple-500 dark:bg-purple-500/70",
  },
  {
    title: "Supervisor",
    description: "Guide students and monitor project progress.",
    route: "/supervisor/login",
    icon: UserCheck,
    lightBg: "bg-green-100/80",
    accent: "text-emerald-600 dark:text-emerald-400",
    darkRing: "dark:ring-emerald-500/30",
    darkBorder: "dark:border-emerald-500/30",
    bar: "bg-emerald-500 dark:bg-emerald-500/70",
  },
  {
    title: "Student",
    description: "Access your dashboard, submit projects, and track feedback.",
    route: "/student/login",
    icon: BookOpen,
    lightBg: "bg-yellow-100/80",
    accent: "text-blue-600 dark:text-blue-400",
    darkRing: "dark:ring-blue-500/30",
    darkBorder: "dark:border-blue-500/30",
    bar: "bg-blue-500 dark:bg-blue-500/70",
  },
];

const MainPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (route) => navigate(route);

  return (
    <div className="relative min-h-screen flex flex-col items-center font-sans overflow-hidden text-foreground bg-background">
      {/* Themed background layers */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#f5f7ff] via-white to-[#f5f7ff] dark:hidden" />
      <div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />

      {/* Top bar with theme toggle */}
      <div className="w-full flex justify-end p-4 relative z-[99999]">
        <ThemeToggle />
      </div>

      {/* Decorative Background Blobs */}
      <div className="pointer-events-none absolute top-[-10%] left-[-20%] w-[50vw] h-[50vw] bg-gradient-to-tr from-[#4F46E5] to-[#60A5FA] rounded-full blur-[120px] opacity-30 dark:opacity-15" />
      <div className="pointer-events-none absolute bottom-[-15%] right-[-20%] w-[60vw] h-[60vw] bg-gradient-to-tr from-pink-400 to-[#FFB6C1] rounded-full blur-[120px] opacity-30 dark:opacity-15" />

      {/* Header */}
      {/* Header Card */}
      <Card className="z-10 w-full max-w-3xl bg-transparent border-0 shadow-none">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-3xl md:text-4xl">Member Area</CardTitle>
          <CardDescription className="text-lg">
            Select your role to continue. Access and functionality are tailored for each role.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-3xl z-10">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Card
              key={role.title}
              className={`group relative rounded-2xl border border-border transition-shadow shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer dark:ring-1 ${role.darkRing}`}
              role="button"
              tabIndex={0}
              aria-label={`Go to ${role.title}`}
              onClick={() => handleNavigate(role.route)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleNavigate(role.route);
                }
              }}
            >
              {/* Top accent bar */}
              <div className={`absolute inset-x-0 top-0 h-1.5 rounded-t-2xl ${role.bar}`} />
              <CardHeader className="rounded-t-2xl pt-6">
                <div className="flex items-start gap-4">
                  <div className={`h-10 w-10 rounded-lg bg-muted/60 grid place-items-center shrink-0 ${role.accent}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl md:text-2xl">{role.title}</CardTitle>
                    <CardDescription className="text-sm md:text-base">{role.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-6 pb-6 pt-2">
                <div className="flex items-center justify-end text-sm text-muted-foreground">
                  <span className="mr-2 transition-colors">Enter as {role.title}</span>
                  <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MainPage;
