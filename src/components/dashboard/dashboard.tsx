import React from "react";
import DashboardTilesComponent from "./dashboard-tiles-component";
import DashboardCharts from "./dashboard-charts";
import DashboardTile from "./dashboard-tile";
import { NextPage } from "next";

const Dashboard: NextPage = () => {
  return (
    <div className="w-full">
      <DashboardTilesComponent />
      <div className="flex px-4 py-5 justify-between w-full flex-col lg:flex-row">
        <div className="lg:w-[70%]">
          <DashboardCharts />
        </div>
        <div className="flex flex-col lg:w-[23%] lg:pt-12">
          <div className="flex flex-col">

            <DashboardTile type="add new" />
          </div>
          <div className="flex flex-col">
            <div className="text-[#5F5F5F] font-medium pt-5">
              Recent Projects
            </div>
            <div className="pb-5">
              <DashboardTile
                type="percentage charts"
                heading="Total Projects"
              />
            </div>
            <DashboardTile
              type="percentage charts"
              heading="Completed Projects"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
