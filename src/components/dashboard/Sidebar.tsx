"use client";

import React, { useState, useEffect, useContext } from "react";
import {
  FiFileText,
  FiInbox,
  FiMessageCircle,
  FiSettings,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { RiBuildingLine } from "react-icons/ri";
import { useRouter, usePathname } from "next/navigation";
// import AuthContext from "@/context/AuthContext";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  // const { user } = useContext(AuthContext); // Get current user from context
  const [selectedOption, setSelectedOption] = useState<string>("dashboard");

  useEffect(() => {
    const pathSegments = pathname.split("/").filter(Boolean);
    let currentOption = "dashboard"; // Default option

    if (pathSegments[0] === "dashboard") {
      currentOption = pathSegments[1] || "dashboard";
    } else {
      currentOption = pathSegments[0];
    }

    setSelectedOption(currentOption.toLowerCase());
  }, [pathname]);

  const handleOptionClick = (optionLink: string, optionName: string) => {
    setSelectedOption(optionName.toLowerCase());
    router.push(optionLink);
  };

  return (
    <div className="flex fixed flex-col justify-between w-1/6 h-full">
      <div className="bg-white p-2 sm:p-4 rounded-lg shadow-lg justify-evenly h-full hidden md:block">
        <div className="flex py-[50px] justify-center items-center">LOGO</div>
      </div>
    </div>
  );
};

export default Sidebar;
