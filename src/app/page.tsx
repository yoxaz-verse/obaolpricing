"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Chip } from "@nextui-org/react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6"
          >
            <Chip
              color="success"
              variant="flat"
              className="text-green-400 bg-green-500/20 border border-green-400/30 mb-6"
            >
              Live Platform
            </Chip>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-lime-400 via-green-400 to-emerald-400 bg-clip-text text-transparent">
            Spice Pricing Platform
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            Real-time market rates for premium spices. 
            <span className="text-lime-400 font-semibold"> Live. Accurate. Transparent.</span>
          </p>
        </motion.div>

        {/* Introduction Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-5xl mx-auto mb-20"
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
            <CardBody className="p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
                Welcome to Our Platform
              </h2>
              <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                <p>
                  We provide a comprehensive, real-time pricing platform for premium spices, 
                  giving you instant access to the latest market rates directly from authorized 
                  auction centers across India.
                </p>
                <p>
                  Our platform offers up-to-the-minute data for cardamom, pepper, cinnamon, 
                  nutmeg, mace, honey, and tea, ensuring you always have the most current 
                  pricing information at your fingertips.
                </p>
                <p className="text-lime-400 font-semibold">
                  This is a live platform that updates continuously, providing transparent 
                  and accurate market insights to empower your trading decisions.
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20"
        >
          {[
            {
              title: "Real-Time Updates",
              description: "Stay informed with live pricing data that updates continuously throughout the day.",
              icon: "⚡",
            },
            {
              title: "Authorized Sources",
              description: "All data is sourced from licensed auctioneers, adhering to Indian Spices Board regulations.",
              icon: "✓",
            },
            {
              title: "Comprehensive Coverage",
              description: "Access pricing information for multiple premium spices all in one place.",
              icon: "📊",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
            >
              <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-lime-400/30 transition-all duration-300 h-full">
                <CardBody className="p-6 text-center">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-lime-400">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-lime-500/10 to-emerald-500/10 border border-lime-400/20 backdrop-blur-md">
            <CardBody className="p-8">
              <p className="text-xl md:text-2xl text-gray-700">
                Empowering your trading decisions with{" "}
                <span className="text-lime-400 font-bold">accurate</span> and{" "}
                <span className="text-lime-400 font-bold">timely</span> market insights
              </p>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
