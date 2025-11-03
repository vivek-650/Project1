import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const coordinatorLogin = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/coordinator/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
      console.log("Login successful:", data);
      sessionStorage.setItem("coordinatorToken", data.token);
      navigate("/coordinator/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      // alert(error.message || "An error occurred during login");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    let isValid = true;

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Enter a valid email");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (isValid) {
      coordinatorLogin();
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-sans bg-background text-foreground">
      {/* Themed background layers */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-[#cbd8ff] via-white to-[#ffcffa] dark:hidden" />
      <div className="pointer-events-none absolute inset-0 -z-10 hidden dark:block bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />

      {/* Top bar with theme toggle */}
      <div className="absolute top-4 right-4 z-[99999]">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md border border-border shadow-sm">
        <CardHeader className="items-center text-center">
          <img
            className="w-24 h-24 rounded-full border border-border"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS9WDX7JlmoXx1-KXqPeJAwiS0xWGDmjBEWw&s"
            alt="logo"
          />
          <CardTitle className="text-2xl">Welcome back!</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="loginForm" className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                type="email"
                id="email"
                placeholder="Enter username"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            </div>

            <Button type="submit" id="loginButton" className="w-full mt-2">Sign in</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
