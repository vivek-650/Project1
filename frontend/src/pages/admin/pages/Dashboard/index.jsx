import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Bell, Settings, Shield, FileText, Activity } from "lucide-react";
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const adminName = sessionStorage.getItem("name") || "Admin";

  const quickActions = [
    {
      title: "Manage Students",
      description: "View and manage student accounts",
      icon: Users,
      path: "/administrator/dashboard/students",
      color: "text-blue-500",
    },
    {
      title: "Post Notices",
      description: "Create announcements for students",
      icon: Bell,
      path: "/administrator/dashboard/notices",
      color: "text-orange-500",
    },
    {
      title: "System Settings",
      description: "Configure system preferences",
      icon: Settings,
      path: "/administrator/dashboard/settings",
      color: "text-purple-500",
    },
  ];

  //fetch students data
  const fetchStudents = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/users`);
      if (!response.ok) throw new Error("Failed to fetch students");
      const data = await response.json();
      console.log("Fetched students:", data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
              <Badge variant="secondary" className="px-3">
                <Shield className="mr-1 h-3 w-3" />
                Administrator
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">Welcome back, {adminName}</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/administrator/dashboard/profile")}>
            <Settings className="mr-2 h-4 w-4" />
            Profile Settings
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground mt-1">Registered students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Teams</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground mt-1">Formed teams</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notices</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground mt-1">Published announcements</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-lg font-semibold">Operational</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">All systems running</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Access administrative tools and features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.path}
                    variant="outline"
                    className="h-auto flex-col items-start p-6 hover:bg-accent"
                    onClick={() => navigate(action.path)}
                  >
                    <Icon className={`h-8 w-8 mb-3 text-primary`} />
                    <div className="text-left">
                      <div className="font-semibold text-base">{action.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{action.description}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* System Overview */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">System initialized</p>
                    <p className="text-xs text-muted-foreground">
                      Ready to manage students and teams
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>System metrics overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Sessions</span>
                  <Badge variant="outline">-</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending Approvals</span>
                  <Badge variant="outline">-</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Recent Uploads</span>
                  <Badge variant="outline">-</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
