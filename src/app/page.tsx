"use client";
import EssentialTabContent from "@/components/dashboard/Essentials/essential-tab-content";
import Title from "@/components/titles";
// import AuthContext from "@/context/AuthContext";
import {
  Card,
  CardBody,
  CardFooter,
  Chip,
  CircularProgress,
} from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Home() {
  // const { isAuthenticated } = useContext(AuthContext);

  // useEffect(() => {
  //   // Since AuthContext checks auth status on mount, we need to wait for it
  //   const checkAuthentication = () => {
  //     if (isAuthenticated) {
  //       router.push("/dashboard");
  //     } else {
  //       router.push("/auth");
  //     }
  //   };

  //   checkAuthentication();
  // }, [isAuthenticated, router]);
  return (
    <div className="bg-[#000000] h-screen overflow-hidden">
      <div
        className="
            w-[100vw] h-[100vh] absolute opacity-15 flex items-center justify-center"
      >
        <Image
          src={"/cardamom (1).png"}
          width={2000}
          height={2000}
          alt=""
          className="   max-w-[90vw] max-h-[90vh] object-contain"
        />
      </div>
      <div className="flex  items-center">
        <Image
          src={"/cardamom (3).png"}
          width={200}
          height={200}
          alt=""
          className=""
        />

        <Title title="Cardamom" />
      </div>{" "}
      <EssentialTabContent essentialName="cardamom" showActions={false} />
    </div>
  );
}
