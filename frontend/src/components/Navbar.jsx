import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/search", label: "Search" },
    { path: "/reels", label: "Reels" },
    { path: "/messages", label: "Send" },
    { path: "/profile", label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md z-50">
      
      {/* Mobile-style bar but stretched */}
      <div className="max-w-2xl mx-auto flex justify-between items-center px-6 h-16">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <Link key={index} to={item.path}>
              <span
                className={`text-sm font-medium transition ${
                  isActive
                    ? "text-black border-b-2 border-black pb-1"
                    : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}