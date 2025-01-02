import React from "react";

interface UnderDevelopmentProps {
  children: React.ReactNode;
}

function UnderDevelopment({ children }: UnderDevelopmentProps) {
  return (
    <div className="relative inline-block   bg-opacity-50 opacity-10">
      {children}
      <div
        className="absolute top-0 left-0 w-full h-full z-50"
        // style={{ filter: "grayscale(100%)" }}
      >
        <div className="absolute top-0 left-0 w-full h-full "></div>
        <div className="absolute top-0 left-0 w-full h-full bg-pattern"></div>
      </div>
    </div>
  );
}

export default UnderDevelopment;
