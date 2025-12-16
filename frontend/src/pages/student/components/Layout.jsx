import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  BookOpen,
  FileText,
  Upload,
  PlusCircle,
  Settings,
  Users,
  LogOut,
  Menu,
  ChevronLeft,
  Home,
} from "lucide-react";

export const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userName = sessionStorage.getItem("name") || "Student";
  const roll = sessionStorage.getItem("roll") || "";

  const menuItems = [
    {
      id: "0",
      name: "Dashboard",
      link: "/student/dashboard",
      icon: Home,
    },
    {
      id: "1",
      name: "All Recipes",
      link: "/student/dashboard/recepies",
      icon: BookOpen,
    },
    {
      id: "2",
      name: "Drafts",
      link: "/student/dashboard/drafts",
      icon: FileText,
    },
    {
      id: "3",
      name: "Uploaded",
      link: "/student/dashboard/uploaded",
      icon: Upload,
    },
    {
      id: "4",
      name: "Add Recipe",
      link: "/student/dashboard/new-recepie",
      icon: PlusCircle,
    },
    {
      id: "5",
      name: "Account Settings",
      link: "/student/dashboard/account-setting",
      icon: Settings,
    },
    {
      id: "6",
      name: "Team Formation",
      link: "/student/dashboard/team-formation",
      icon: Users,
    },
  ];

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/student/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="portal-student flex h-screen w-full bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-16" : "w-64"
        } bg-card shadow-sm transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-base text-foreground">
                Student Portal
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {collapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* User Info */}
        {!collapsed && (
          <div className="p-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-medium">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{userName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {roll}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-2">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.link);
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full h-10 justify-start text-sm font-medium ${
                    collapsed ? "px-0 justify-center" : "px-3"
                  } ${
                    active
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => navigate(item.link)}
                >
                  <Icon className={`h-4 w-4 ${collapsed ? "" : "mr-3"}`} />
                  {!collapsed && (
                    <span className="flex-1 text-left text-sm font-medium">{item.name}</span>
                  )}
                </Button>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 space-y-2">
          {!collapsed && (
            <div className="pb-2">
              <ThemeToggle />
            </div>
          )}
          <Button
            variant="ghost"
            className={`w-full justify-start h-10 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50 ${
              collapsed ? "px-0 justify-center" : "px-3"
            }`}
            onClick={handleLogout}
          >
            <LogOut className={`h-4 w-4 ${collapsed ? "" : "mr-3"}`} />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
};
