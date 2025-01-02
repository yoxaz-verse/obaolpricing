"use client";

import { TopbarProps } from "@/data/interface-data";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import React, { useContext } from "react";
import { CiMenuBurger } from "react-icons/ci";

import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthContext from "@/context/AuthContext";
import { routeRoles } from "@/utils/roleHelpers";
import { sidebarOptions } from "@/utils/utils";

const TopBar = ({ username, role }: TopbarProps) => {
  const { logout } = useContext(AuthContext);
  const router = useRouter();

  // Filter options based on the user's role
  const filteredOptions = sidebarOptions.filter((option) => {
    const allowedRoles = routeRoles[option.link] || [];
    return allowedRoles.includes(role);
  });

  return (
    <div className="flex justify-between p-5 bg-gray-100 shadow-md">
      {/* Menu for small screens */}
      <Dropdown className="items-center justify-center h-full flex xl:hidden">
        <DropdownTrigger>
          <div className="w-6 h-6 flex items-center justify-center xl:hidden">
            <CiMenuBurger size={24} />
          </div>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Sidebar Options"
          disallowEmptySelection
          selectionMode="single"
        >
          {filteredOptions.map((option) => (
            <DropdownItem key={option.name}>
              <Link href={option.link}>
                <div className="flex items-center gap-2">
                  {option.icon}
                  {option.name}
                </div>
              </Link>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>

      {/* Title Section */}
      <div className="hidden md:block">
        <div className="text-lg font-bold">
          {role.charAt(0).toUpperCase() + role.slice(1)} Panel
        </div>
        <div className="text-sm">
          {new Date().getHours() < 12
            ? "Good Morning"
            : new Date().getHours() < 18
            ? "Good Afternoon"
            : "Good Evening"}
        </div>
      </div>

      {/* User and Notifications Section */}
      <div className="flex items-center gap-5">
        {/* <Dropdown placement="bottom-start">
          <DropdownTrigger>
            <div className="h-6 flex items-center justify-center px-1">
              <GrNotification className="text-xl" />
            </div>
          </DropdownTrigger>
          <DropdownMenu aria-label="Notifications">
            <DropdownItem key="profile">No new notifications</DropdownItem>
          </DropdownMenu>
        </Dropdown> */}

        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <User
              as="button"
              avatarProps={{
                isBordered: true,
                color: "primary",
              }}
              name={username}
              description={role}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions">
            <DropdownItem key="profile">
              <div>
                Signed in as <strong>{username}</strong>
              </div>
            </DropdownItem>
            <DropdownItem
              key="logout"
              color="danger"
              onClick={async () => {
                try {
                  await logout(); // Call logout from AuthContext
                  router.push("/auth");
                } catch (err) {
                  console.error("Logout failed:", err);
                }
              }}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default TopBar;
