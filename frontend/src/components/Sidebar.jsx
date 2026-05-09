import React from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Home,
  Search,
  Plus,
  Send,
  UserCircle,
} from "lucide-react";

export default function Sidebar() {
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
      path: "/create-post",
      label: "Create Post",
      icon: <Plus size={26} />,
    },
    {
      path: "/messages",
      label: "Messages",
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
      <div className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around border-t border-gray-800 bg-black py-3 md:hidden">

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

            <span className="mt-1 text-xs">
              {item.label}
            </span>
          </Link>
        ))}
      </div>

      {/* TABLET/DESKTOP SIDEBAR */}
      <div className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-gray-800 bg-black p-5 md:flex">

        {/* Logo */}
        <h1 className="mb-10 text-3xl font-bold text-white">
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