// Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  Clapperboard,
  Heart,
  UserCircle,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      path: "/",
      name: "Home",
      icon: <Home size={24} />,
    },
    {
      path: "/reels",
      name: "Reels",
      icon: <Clapperboard size={24} />,
    },
    {
      path: "/notifications",
      name: "Notifications",
      icon: <Heart size={24} />,
    },
    {
      path: "/search",
      name: "Search",
      icon: <Search size={24} />,
    },
    {
      path: "/profile",
      name: "Profile",
      icon: <UserCircle size={24} />,
    },
  ];

  return (
    <div className="sidebar">
      <h2 className="logo">Momentia</h2>

      <div className="menu">
        {menuItems.map((item) => (
          <Link
            to={item.path}
            key={item.path}
            className={`menu-item ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}