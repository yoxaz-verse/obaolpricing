// pages/locations.tsx
"use client";

import React from "react";
import { Tabs, Tab, Spacer } from "@nextui-org/react";
import Title from "@/components/titles";
import EssentialTabContent from "@/components/dashboard/Essentials/essential-tab-content";
import BulkAdd from "@/components/CurdTable/bulk-add";
import { locationRoutes } from "@/core/api/apiRoutes";

export default function Essentials() {
  const [locationTab, setLocationTab] = React.useState("location");

  const locationTabs = [{ key: "cardamom", title: "Cardamom" }];

  // Optionally, add dynamic tabs based on fetched data
  // For example, if ProjectStatus or ActivityStatus have sub-categories
  // For simplicity, we'll stick to static tabs in this example
  const refetchData = () => {
    // Implement refetch logic if necessary
  };

  return (
    <div className="flex items-center justify-center ">
      <div className="w-[95%]">
        <div className="my-4">
          <div className="md:flex   items-center ml-[2.5%]">
            <Title title="Cardamom " />
          </div>{" "}
          {/* <Tabs
            aria-label="Cardamom Tabs"
            selectedKey={locationTab}
            onSelectionChange={(key) => setLocationTab(key as string)}
          > */}
          {/* {locationTabs.map((tab) => (
              <Tab key={tab.key} title={tab.title}>
                {tab.key === "cardamom" && (
                  // <LocationTabContent currentType="all" />
                  <> */}
          <EssentialTabContent essentialName="cardamom" showActions={true} />
          {/* </>
                )}
              </Tab>
            ))}
          </Tabs>{" "} */}
          <Spacer y={4} />
        </div>
      </div>
    </div>
  );
}
