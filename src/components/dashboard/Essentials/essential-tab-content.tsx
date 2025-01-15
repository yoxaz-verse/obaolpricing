"use client";
import React from "react";

import QueryComponent from "@/components/queryComponent";
import { Chip, Divider, Spacer } from "@nextui-org/react";
import AddModal from "@/components/CurdTable/add-model";
import UserDeleteModal from "@/components/CurdTable/delete";
import CommonTable from "@/components/CurdTable/common-table";
import { motion } from "framer-motion";

import DetailsModal from "@/components/CurdTable/details";
import EditModal from "@/components/CurdTable/edit-model";
import {
  apiRoutesByRole,
  generateColumns,
  initialTableConfig,
} from "@/utlis/tableValues";
import { SubTitle } from "@/components/titles";

const EssentialTabContent = ({
  essentialName,
  showActions,
}: {
  essentialName: string;
  showActions: boolean;
}) => {
  const tableConfig = { ...initialTableConfig }; // Create a copy to avoid mutations

  // Generate columns
  let columns = generateColumns(essentialName, tableConfig);

  // Ensure columns is iterable and properly structured
  columns = Array.isArray(columns) ? columns : Object.values(columns);
  columns = columns.filter((column: any) => column && column.uid); // Ensure no invalid columns

  // Filter out 'action' column if showActions is false
  const newColumns = showActions
    ? columns
    : columns.filter((column: any) => column.type !== "action");

  console.log("Final columns (post-filter):", newColumns);

  const refetchData = () => {
    // Implement refetch logic if necessary
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-[95%]">
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          // exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut", delay: 1 }}
        >
          <SubTitle title="Obaol Supreme" />
        </motion.div>{" "}
        <div className="">
          <h2 className="font-bold  text-[24px]">Updated </h2> <Spacer y={2} />
          <Chip color="primary" className={"text-blue-700"} variant="dot">
            Before
          </Chip>{" "}
          <Chip color="warning" className={"text-yellow-700"} variant="dot">
            Yesterday
          </Chip>{" "}
          <Chip color="success" className={"text-green-700"} variant="dot">
            Today
          </Chip>{" "}
          {showActions && (
            <AddModal
              currentTable={essentialName}
              formFields={tableConfig[essentialName]}
              apiEndpoint={apiRoutesByRole[essentialName]}
              refetchData={refetchData}
            />
          )}
          <Divider className="my-2" />
          <QueryComponent
            api={apiRoutesByRole[essentialName]}
            queryKey={[essentialName, apiRoutesByRole[essentialName]]}
            page={1}
            limit={1000}
          >
            {(data: any) => {
              const fetchedData = data || [];

              const formFields = tableConfig[essentialName];

              const tableData = fetchedData.map((item: any) => {
                const { isDeleted, isActive, password, __v, ...rest } = item;

                if (essentialName === "location") {
                  return {
                    ...rest,
                    locationType: item.locationType
                      ? item.locationType.name
                      : "N/A",
                    locationManager: item.locationManager
                      ? item.locationManager.map(
                          (loc: { code: string; name: string }) => loc
                        )
                      : "N/A",
                  };
                }

                return rest;
              });

              return (
                <>
                  <Spacer y={5} />
                  <CommonTable
                    TableData={tableData}
                    columns={newColumns} // Use the filtered array of columns
                    isLoading={false}
                    editModal={(item: any) => (
                      <div>
                        <EditModal
                          item={item}
                          currentTable={essentialName}
                          formFields={formFields}
                          apiEndpoint={apiRoutesByRole[essentialName]} // Assuming API endpoint for update
                          refetchData={refetchData}
                        />
                      </div>
                    )}
                    deleteModal={(item: any) => (
                      <UserDeleteModal
                        _id={item.id}
                        name={item.name}
                        deleteApiEndpoint={apiRoutesByRole[essentialName]}
                        refetchData={refetchData}
                      />
                    )}
                  />
                </>
              );
            }}
          </QueryComponent>
        </div>
      </div>
    </div>
  );
};

export default EssentialTabContent;
