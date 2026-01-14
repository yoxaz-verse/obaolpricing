"use client";

import React from "react";
import { Spacer, Chip, Card, CardBody } from "@nextui-org/react";
import Title from "@/components/titles";
import EssentialTabContent from "@/components/dashboard/Essentials/essential-tab-content";
import { motion } from "framer-motion";
import Link from "next/link";

export default function OSPricing() {
  const spices = [
    { key: "cardamom", name: "Cardamom", commission: 50, isPrimary: true },
    { key: "pepper", name: "Pepper", commission: 15 },
    { key: "cinnamon", name: "Cinnamon", commission: 20 },
    { key: "nutmeg", name: "Nutmeg", commission: 20 },
    { key: "mace", name: "Mace", commission: 25 },
    { key: "honey", name: "Honey", commission: 15 },
    { key: "tea", name: "Tea", commission: 10 },
  ];

  // Company information
  const companyName = "GAIN - Global Agro Industry Network";
  const contactNumber = "+91 9019351483";
  const whatsappNumber = "919019351483"; // WhatsApp number without + and spaces

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-[95%] max-w-7xl">
        <div className="my-8 space-y-8">
          {/* Main Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="md:flex items-center justify-between ml-[2.5%]">
              <div>
                <Title title="Pricing Library" />
                <p className="text-gray-400 text-sm md:text-base ">
                  Comprehensive pricing dashboard
                </p>
              </div>
              <div className="hidden md:block">
                <Chip 
                  color="success" 
                  variant="flat" 
                  className="text-green-400 bg-green-500/20 border border-green-400/30"
                >
                  Live Updates
                </Chip>
              </div>
            </div>
            
            {/* Header Info Section - Last Updated (Left) and Contact (Right) */}
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg">
              <CardBody className="p-5">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  {/* Left Side - Last Updated */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white">Last Updated</h3>
                    <div className="flex gap-3 flex-wrap">
                      <Chip 
                        color="primary" 
                        className="text-blue-300 bg-blue-500/20 border border-blue-400/30" 
                        variant="dot"
                      >
                        Before
                      </Chip>
                      <Chip 
                        color="warning" 
                        className="text-yellow-300 bg-yellow-500/20 border border-yellow-400/30" 
                        variant="dot"
                      >
                        Yesterday
                      </Chip>
                      <Chip 
                        color="success" 
                        className="text-green-300 bg-green-500/20 border border-green-400/30" 
                        variant="dot"
                      >
                        Today
                      </Chip>
                    </div>
                  </div>

                  {/* Right Side - Company Name and Contact */}
                  <div className="text-right space-y-2">
                    <h3 className="text-lg font-semibold text-white">{companyName}</h3>
                    <p className="text-base text-gray-300">
                      Contact:{" "}
                      <Link
                        href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lime-400 font-medium hover:text-lime-300 underline transition-colors"
                      >
                        {contactNumber}
                      </Link>
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <Spacer y={6} />

          {/* Spices Sections */}
          {spices.map((spice, index) => (
            <motion.div
              key={spice.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className={spice.isPrimary ? "space-y-6" : "space-y-4"}
            >
              <Card 
                className={
                  spice.isPrimary 
                    ? "bg-gradient-to-r from-lime-500/15 to-emerald-500/15 border-2 border-lime-400/40 shadow-xl backdrop-blur-sm" 
                    : "bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg"
                }
              >
                <CardBody className="p-6 md:p-8">
                  <EssentialTabContent
                    essentialName={spice.key}
                    showActions={false}
                    commission={spice.commission}
                    spiceName={spice.name}
                    isPrimary={spice.isPrimary || false}
                  />
                  
                  {spice.isPrimary && (
                    <section>
                      <Spacer y={8} />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
                        className="w-full font-extralight text-gray-500"
                      >
                        Welcome to our real-time cardamom auction rate panel, your trusted
                        source for the latest market prices. This platform provides
                        up-to-the-minute data from authorized auction centers, ensuring
                        transparency and accuracy in the cardamom trade.
                        <Spacer y={5} />
                        <b className="text-gray-700"> Key Highlights:</b> <Spacer y={1} />
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>
                            <b className="text-gray-700"> Real-Time Updates: </b>Stay informed with the latest auction
                            prices as they happen.
                          </li>
                          <li>
                            <b className="text-gray-700"> Authorized Sources:</b> All data is sourced from licensed
                            auctioneers, adhering to Indian Spices Board regulations.
                          </li>
                        </ul>
                        <Spacer y={5} />
                        Empower your trading decisions with accurate and timely market insights,
                        all consolidated in one reliable source.
                      </motion.div>
                    </section>
                  )}
                </CardBody>
              </Card>
              
              {index < spices.length - 1 && <Spacer y={4} />}
            </motion.div>
          ))}

          <Spacer y={8} />
        </div>
      </div>
    </div>
  );
}
