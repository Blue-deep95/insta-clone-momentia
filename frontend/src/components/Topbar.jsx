import React, { useState, useEffect } from "react";
import { SquarePlus, Heart } from "lucide-react";

export default function Topbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div
      className={`fixed top-0 left-0 w-full bg-white border-b z-50 transition-transform duration-300 md:hidden ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex justify-between items-center px-4 h-14">
        {/* Left: Plus Symbol */}
        <div className="cursor-pointer hover:opacity-70 transition">
          <SquarePlus size={26} />
        </div>

        {/* Center: Instagram Text */}
        <h1 className="text-2xl font-bold font-serif italic tracking-tight">
          Momentia
        </h1>

        {/* Right: Heart Symbol */}
        <div className="cursor-pointer hover:opacity-70 transition">
          <Heart size={26} />
        </div>
      </div>
    </div>
  );
}

