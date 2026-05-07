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
    {
      path: "/",
      label: "Home",
      icon: <Home size={26} />,
    },
    {
      path: "/search",
      label: "Search",
      icon: <Search size={26} />,
    },
    {
      path: "/reels",
      label: "Reels",
      icon: <Clapperboard size={26} />,
    },
    {
      path: "/messages",
      label: "Send",
      icon: <Send size={26} />,
    },
    {
      path: "/profile",
      label: "Profile",
      icon: <UserCircle size={26} />,
    },
  ];

  return (
    <>
      {/* MOBILE NAVBAR */}
      <div className="fixed bottom-0 left-0 w-full bg-black border-t border-gray-800 flex justify-around items-center py-3 z-50 md:hidden">

        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center ${
              location.pathname === item.path
                ? "text-white"
                : "text-gray-500"
            }`}
          >
            {item.icon}

            <span className="text-xs mt-1">
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      {/* TABLET/DESKTOP SIDEBAR */}
      <div className="hidden md:flex fixed top-0 left-0 h-screen w-64 bg-black border-r border-gray-800 flex-col p-5">

        {/* Logo */}
        <h1 className="text-3xl font-bold text-white mb-10">
          Momentia
        </h1>

        {/* Menu Items */}
        <div className="flex flex-col gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:bg-gray-900 hover:text-white"
              }`}
            >
              {item.icon}

              <span className="text-lg">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}