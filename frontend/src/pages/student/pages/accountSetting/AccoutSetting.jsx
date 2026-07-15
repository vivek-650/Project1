import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AccoutSetting = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const roll = sessionStorage.getItem("roll");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/user/user-details/${roll}`);
        if (!res.ok) throw new Error("Failed to fetch user details");
        const data = await res.json();
        setUser(data[0]);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    if (roll) fetchUser();
  }, [roll]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center py-12 px-4">
      {/* SVG background */}
      <svg
        className="absolute top-0 left-0 w-full h-96 -z-10"
        viewBox="0 0 1440 754"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="720" cy="-146" r="900" fill="#5379F6" />
        <circle cx="720" cy="-146" r="900" fill="url(#paint0_linear_68_26)" />
        <defs>
          <linearGradient
            id="paint0_linear_68_26"
            x1="720"
            y1="-1046"
            x2="720"
            y2="754"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#246AD4" />
            <stop offset="1" stopColor="#5379F6" />
          </linearGradient>
        </defs>
      </svg>

      <Card className="w-full max-w-2xl shadow-2xl border-0 bg-white/90 backdrop-blur-md">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <div className="text-blue-700 font-semibold">Loading profile...</div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-12">
            <div className="text-red-600 font-semibold">{error}</div>
          </div>
        ) : user ? (
          <>
            <CardHeader className="flex flex-row items-center gap-6 pb-0">
              <Avatar className="h-24 w-24 border-4 border-blue-200 shadow-lg">
                <AvatarImage src={user.avatar || "/assets/MemberAreaImage.png"} alt={user.name} />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold text-blue-900 flex items-center gap-2">
                  {user.name}
                  <Badge
                    variant="secondary"
                    className="ml-2 px-3 py-1 text-xs bg-blue-100 text-blue-700 border-blue-200"
                  >
                    {user.role || "Student"}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-lg text-blue-700">
                  {user.branch || "Branch"} &bull; {user.year || "Year"}
                </CardDescription>
                <div className="mt-2 flex gap-2">
                  <span className="text-sm text-gray-500">
                    Roll: <span className="font-mono text-blue-800">{user.roll}</span>
                  </span>
                  <span className="text-sm text-gray-500">
                    Status:{" "}
                    {user.isActive ? (
                      <span className="text-green-600 font-semibold">Active</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Inactive</span>
                    )}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div>
                <div className="text-gray-500 text-xs uppercase mb-1">Email</div>
                <div className="text-base font-medium text-gray-800">{user.email || "-"}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs uppercase mb-1">Phone</div>
                <div className="text-base font-medium text-gray-800">{user.phone || "-"}</div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-4">
              <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                Edit Profile
              </Button>
              <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                Logout
              </Button>
            </CardFooter>
          </>
        ) : null}
      </Card>

      <div className="mt-10 flex flex-col items-center">
        <img
          src="/assets/NoticeImage.png"
          alt="Student Area"
          className="w-64 h-auto opacity-90 mb-4"
        />
        <div className="text-center text-blue-900 text-lg font-semibold">
          Welcome to your student profile!
          <br />
          Keep your details up to date for a seamless campus experience.
        </div>
      </div>
    </div>
  );
};

export default AccoutSetting;
