"use client";
import LoginComponent from "@/components/Login/login-component";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SuperadminLoginPage() {
  return (
    <>
      <div className="flex h-screen relative w-full m-0 p-0 justify-center items-center flex-col bg-[#F6F8FB]">
        <LoginComponent />
      </div>
    </>
  );
}
