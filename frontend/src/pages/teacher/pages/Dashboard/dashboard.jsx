import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Users, FileCheck, Bell, Settings } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const name = sessionStorage.getItem("name") || "Teacher";

  const quickActions = [
    {
      title: "Add Users",
      description: "Add new students to the system",
      icon: UserPlus,
      path: "/supervisor/dashboard/add-users",
      color: "text-blue-500",
    },
    {
      title: "View Users",
      description: "Manage student accounts",
      icon: Users,
      path: "/supervisor/dashboard/users",
      color: "text-green-500",
    },
    {
      title: "Team Requests",
      description: "Review team formation requests",
      icon: FileCheck,
      path: "/supervisor/dashboard/requests",
      color: "text-purple-500",
    },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Welcome, {name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Teacher Dashboard
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/supervisor/dashboard/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
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
              <p className="text-xs text-muted-foreground mt-1">
                Active student accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teams</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground mt-1">
                Formed teams
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground mt-1">
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Announcements</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground mt-1">
                Posted notices
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Access frequently used management tools
            </CardDescription>
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
                      <div className="text-sm text-muted-foreground mt-1">
                        {action.description}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              No recent activity to display
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
