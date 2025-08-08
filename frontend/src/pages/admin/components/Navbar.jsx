import { LogOut } from "lucide-react";

const Navbar = ({ userName, onLogout }) => {
  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-100 z-50 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-gray-800 tracking-wide">{userName}</h1>
      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-4 py-2 text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-md transition text-sm shadow"
      >
        <LogOut size={16} /> Logout
      </button>
    </header>
  );
};


export default Navbar;
