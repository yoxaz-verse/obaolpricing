// components/dashboard/Projects/project-tab-content.tsx
"use client";

import React, { useContext, useMemo } from "react";
import QueryComponent from "@/components/queryComponent";
import { Spacer } from "@nextui-org/react";
import CommonTable from "../../CurdTable/common-table";
import DeleteModal from "@/components/CurdTable/delete";
import {
  apiRoutesByRole,
  generateColumns,
  initialTableConfig,
} from "@/utils/tableValues";
import { User } from "@/context/AuthContext";
import StatusUpdate from "@/components/CurdTable/status-update";

interface TimeSheetTabContentProps {
  currentTable: string;
  activityId?: string;
  isMode?: string | null;
  user?: User | null;
}

interface Option {
  key: string;
  value: string;
}

interface FormField {
  label: string;
  type: string;
  key: string;
  inForm: boolean;
  inTable: boolean;
  values?: Option[];
  accept?: string;
  multiple?: boolean;
}
const tabs = [
  { key: "isPending", label: "Pending" },
  { key: "isAccepted", label: "Accepted" },
  { key: "isResubmitted", label: "Resubmitted" },
  { key: "isRejected", label: "Rejected" },
  // Add more tabs if needed, e.g., "Archived Projects"
];
const TimeSheetTabContent: React.FC<TimeSheetTabContentProps> = ({
  currentTable = "timeSheet",
  activityId,
  isMode,
  user,
}) => {
  const tableConfig = { ...initialTableConfig }; // Create a copy to avoid mutations
  const columns = generateColumns(currentTable, tableConfig);

  return (
    <>
      {
        <QueryComponent
          api={apiRoutesByRole[currentTable]}
          queryKey={[currentTable, apiRoutesByRole[currentTable]]}
          page={1}
          limit={100}
          additionalParams={{ activityId, isMode }}
        >
          {(data: any, refetch) => {
            const fetchedData = data?.data || [];
            // Generate formFields with updated values
            const refetchData = () => {
              refetch?.(); // Safely call refetch if it's available
            };

            const tableData = fetchedData.map((item: any) => {
              const { isDeleted, isActive, password, __v, ...rest } = item;
              if (currentTable === "timeSheet") {
                return {
                  ...rest,
                };
                // Handle other user types similarly if needed
              }
              return rest;
            });

            return (
              <>
                <Spacer y={5} />
                {tableData.length > 0 ? (
                  <CommonTable
                    TableData={tableData}
                    columns={columns}
                    isLoading={false}
                    // viewModal={(item: any) => (
                    //   <DetailsModal columns={columns} data={item} />
                    // )}
                    // editModal={(item: any) => (
                    //   <EditModal
                    //     initialData={item}
                    //     currentTable={currentTable}
                    //     formFields={tableConfig[currentTable]}
                    //     apiEndpoint={`${apiRoutesByRole[currentTable]}/${item._id}`} // Assuming API endpoint for update
                    //     refetchData={refetchData}
                    //   />
                    // )}
                    otherModal={(item: any) => {
                      // Determine the current status dynamically
                      const currentStatus = tabs.find(
                        (tab) => item[tab.key]
                      ) || { key: "Unknown", label: "Unknown" };

                      // Dynamically filter status options based on user roles
                      const filteredStatusOptions = tabs.filter((tab) => {
                        if (user?.role === "Worker") {
                          // Exclude "Approved" and "Rejected" for Workers
                          return (
                            tab.key !== "isAccepted" && tab.key !== "isRejected"
                          );
                        }
                        return true; // Allow all statuses for other roles
                      });

                      return (
                        user?.role != "Customer" && (
                          <StatusUpdate
                            currentEntity="Time Sheet"
                            statusOptions={filteredStatusOptions}
                            apiEndpoint={apiRoutesByRole[currentTable]}
                            recordId={item._id}
                            currentStatus={currentStatus}
                            refetchData={refetchData}
                          />
                        )
                      );
                    }}
                    deleteModal={(item: any) => (
                      <DeleteModal
                        _id={item._id}
                        name={item.name}
                        queryKey={[currentTable, apiRoutesByRole[currentTable]]}
                        deleteApiEndpoint={apiRoutesByRole[currentTable]}
                        refetchData={refetchData}
                        useBody={true}
                      />
                    )}
                  />
                ) : (
                  <div>No data available</div>
                )}
              </>
            );
          }}
        </QueryComponent>
      }{" "}
    </>
  );
};
export default TimeSheetTabContent;
