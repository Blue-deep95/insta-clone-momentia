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
    { path: "/", label: "Home" },
    { path: "/search", label: "Search" },
    { path: "/create-post", label: "Create" },
    { path: "/reels", label: "Reels" },
    { path: "/messages", label: "Send" },
    { path: "/profile", label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-white shadow-md">
      
      {/* Mobile-style bar but stretched */}
      <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-6">
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