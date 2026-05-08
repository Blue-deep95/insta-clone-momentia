import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  Clapperboard,
  Send,
  UserCircle,
} from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: <Home size={26} /> },
    { path: "/search", icon: <Search size={26} /> },
    { path: "/reels", icon: <Clapperboard size={26} /> },
    { path: "/messages", icon: <Send size={26} /> },
    { path: "/profile", icon: <UserCircle size={26} /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t shadow-md z-50">
      {/* Mobile-style bar but stretched */}
      <div className="max-w-2xl mx-auto flex justify-between items-center px-6 h-16">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Link key={index} to={item.path}>
              <div
                className={`transition ${
                  isActive ? "text-black" : "text-gray-400"
                }`}
              >
                {item.icon}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}