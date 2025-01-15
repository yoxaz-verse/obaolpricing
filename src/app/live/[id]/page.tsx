"use client";
import EssentialTabContent from "@/components/dashboard/Essentials/essential-tab-content";
import Title, { SubTitle } from "@/components/titles";
import { Spacer } from "@nextui-org/react";
// import AuthContext from "@/context/AuthContext";
import Image from "next/image";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function Home() {
  const pathname = usePathname().split("/").pop()?.toString() || ""; // Gets the current URL pathname
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
    <div className="h-screen overflow-hidden">
      <div
        className="
            w-[100vw] h-[100vh] absolute opacity-15 flex items-center justify-center"
      >
        <Image
          src={"/cardamom (3).png"}
          width={2000}
          height={2000}
          alt=""
          className="   max-w-[90vw] max-h-[90vh] object-contain"
        />
      </div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        // exit={{ y: -50, opacity: 0 }}
        transition={{ duration: 1, ease: "easeInOut", delay: 0.5 }}
      >
        <div className="md:flex   items-center ml-[2.5%]">
          <Title title="Cardamom Live Pricing" />
        </div>{" "}
      </motion.div>
      <Spacer y={6} />
      <EssentialTabContent
        associate={pathname}
        essentialName="cardamom"
        showActions={false}
      />
    </div>
  );
}
