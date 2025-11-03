import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, FileText, Bell, UserCircle, BookOpen, Calendar } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const roll = sessionStorage.getItem("roll");
  const name = sessionStorage.getItem("name") || "Student";
  const [team, setTeam] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch team status
        if (roll) {
          const teamRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/team/status/${roll}`);
          setTeam(teamRes.data.team);
        }
        
        // Fetch recent notices
        const noticesRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/super-admin/notices/students`);
        setNotices(noticesRes.data.slice(0, 3)); // Get only 3 recent notices
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [roll]);

  const quickActions = [
    { title: "Team Formation", description: "Create or join a team", icon: Users, path: "/student/dashboard/team-formation", color: "text-blue-500" },
    { title: "Recipes", description: "Browse and manage recipes", icon: BookOpen, path: "/student/dashboard/recepies", color: "text-green-500" },
    { title: "Add Recipe", description: "Submit a new recipe", icon: FileText, path: "/student/dashboard/new-recepie", color: "text-purple-500" },
    { title: "Notices", description: "View all announcements", icon: Bell, path: "/student/notice", color: "text-orange-500" },
  ];

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Welcome back, {name}!</h1>
            <p className="text-muted-foreground mt-1">Roll: {roll}</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/student/dashboard/account-setting")}>
            <UserCircle className="mr-2 h-4 w-4" />
            Account Settings
          </Button>
        </div>

        <Separator />

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Status</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {team ? (
                  <Badge variant={team.status === "active" ? "default" : "secondary"}>
                    {team.status}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">No team</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {team ? `${team.members?.length || 0} members` : "Create or join a team"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recipes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground mt-1">View all recipes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notices</CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notices.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Recent announcements</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submissions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground mt-1">Total uploads</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Access frequently used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.path}
                    variant="outline"
                    className="h-auto flex-col items-start p-4 hover:bg-accent"
                    onClick={() => navigate(action.path)}
                  >
                    <Icon className={`h-6 w-6 mb-2 text-primary`} />
                    <div className="text-left">
                      <div className="font-semibold">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Team Info Card */}
        {team && (
          <Card>
            <CardHeader>
              <CardTitle>Your Team</CardTitle>
              <CardDescription>Team members and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <Badge variant={team.status === "active" ? "default" : "secondary"} className="mt-1">
                      {team.status}
                    </Badge>
                  </div>
                  <Button onClick={() => navigate("/student/dashboard/team-formation")}>
                    View Details
                  </Button>
                </div>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-2">Members</p>
                  <div className="grid gap-2">
                    {team.members?.map((member) => (
                      <div key={member.roll} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                        <div className="flex items-center gap-2">
                          <UserCircle className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.roll}</p>
                          </div>
                        </div>
                        {team.leaderRoll === member.roll && (
                          <Badge variant="outline">Leader</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Notices */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Notices</CardTitle>
            <CardDescription>Latest announcements and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-sm text-muted-foreground">Loading notices...</p>
            ) : notices.length > 0 ? (
              <div className="space-y-4">
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="flex items-start gap-4 p-4 rounded-lg border hover:bg-accent cursor-pointer transition"
                    onClick={() => {
                      if (notice.documentUrl) {
                        window.open(notice.documentUrl, "_blank");
                      }
                    }}
                  >
                    <Bell className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold">{notice.title}</h4>
                      <p className="text-sm text-muted-foreground">{notice.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notice.createdAt?.seconds * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/student/notice")}
                >
                  View All Notices
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No notices available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
