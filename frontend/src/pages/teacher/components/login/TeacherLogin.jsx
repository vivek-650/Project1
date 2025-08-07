import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

const TeacherLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

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
      sessionStorage.setItem("adminToken", "AdminToken001");
      alert("Login successful!");
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#cbd8ff] via-[#ffffff] to-[#ffcffa] font-sans">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-gray-300 rounded-xl shadow-lg px-8 py-10">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS9WDX7JlmoXx1-KXqPeJAwiS0xWGDmjBEWw&s"
            alt="Logo"
            className="w-20 h-20 mb-3 rounded-full shadow-md"
          />
          <h1 className="text-2xl font-semibold text-gray-800">Welcome back!</h1>
          <p className="text-gray-500 text-sm">Sign in to your teacher account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2">
              <Mail className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full focus:outline-none text-sm bg-transparent"
              />
            </div>
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2">
              <Lock className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full focus:outline-none text-sm bg-transparent"
              />
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-2 bg-black text-white rounded-md font-semibold hover:bg-gray-900 transition duration-200"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherLogin;
