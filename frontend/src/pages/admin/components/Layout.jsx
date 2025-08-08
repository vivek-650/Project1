import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { LayoutDashboard, FileText, Users, Book } from "lucide-react";

const menuItems = [
  { id: "2", name: "Notices", link: "notices", icon: <FileText className="w-5 h-5" /> },
  { id: "3", name: "Students", link: "students", icon: <Users className="w-5 h-5" /> },
  { id: "4", name: "Projects", link: "projects", icon: <Book className="w-5 h-5" /> },
  { id: "5", name: "Supervisors", link: "supervisors", icon: <LayoutDashboard className="w-5 h-5" /> },
];

export const Layout = () => {
  const [activeTab, setActiveTab] = useState("Notices");
  const navigate = useNavigate();

  const handleMenuClick = (item) => {
    setActiveTab(item.name);
    navigate(`/coordinator/dashboard/${item.link}`);
  };

  const handleLogout = () => {
    sessionStorage.clear("coordinatorToken");
    navigate("/");
  };

  return (
    <div className="flex h-screen w-full font-sans text-gray-800 bg-gradient-to-br from-[#f1f4fa] via-white to-[#f1f4fa]">
      
      {/* Sidebar */}
      <div className="w-64 bg-white border border-gray-100 pt-20 px-4">
        <div className="space-y-4">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition 
                ${activeTab === item.name 
                  ? "bg-gradient-to-r from-blue-500 to-teal-200 text-white shadow-sm"
                  : "hover:bg-gray-100 text-gray-700"}`}
              onClick={() => handleMenuClick(item)}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 h-full overflow-auto">
        <Navbar userName="Test Coordinator" onLogout={handleLogout} />
        <main className="p-6 pt-24">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

