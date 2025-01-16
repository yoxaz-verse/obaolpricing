"use client";
import React, { useState } from "react";

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
import { getData } from "@/backend/Services/firestore";
import { useQuery } from "@tanstack/react-query";
import { query } from "firebase/firestore";

const EssentialTabContent = ({
  essentialName,
  showActions,
  associate,
}: {
  associate?: string;
  essentialName: string;
  showActions: boolean;
}) => {
  const tableConfig = { ...initialTableConfig }; // Create a copy to avoid mutations
  const queryKey = "associates";
  const [Commission, setCommission] = useState(50);
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
        <div className="">
          {associate ? (
            <QueryComponent
              api={apiRoutesByRole["associates"]}
              queryKey={["associates", apiRoutesByRole["associates"]]}
              page={1}
              limit={1000}
            >
              {(data: any) => {
                const fetchedData = data || [];
                const filteredData = fetchedData.filter(
                  (item: any) => item.url === associate
                );

                setCommission(filteredData[0].commission);
                console.log(Commission);

                return (
                  <>
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      // exit={{ y: -50, opacity: 0 }}
                      transition={{ duration: 1, ease: "easeInOut", delay: 1 }}
                    >
                      <SubTitle title={filteredData[0].name} />
                    </motion.div>{" "}
                  </>
                );
              }}
            </QueryComponent>
          ) : (
            <SubTitle title="Obaol Supreme" />
          )}
          <div>
            <h2 className="font-bold  text-[24px]">Updated </h2>{" "}
            <Spacer y={2} />
            <Chip color="primary" className={"text-blue-700"} variant="dot">
              Before
            </Chip>{" "}
            <Chip color="warning" className={"text-yellow-700"} variant="dot">
              Yesterday
            </Chip>{" "}
            <Chip color="success" className={"text-green-700"} variant="dot">
              Today
            </Chip>{" "}
          </div>{" "}
          <Divider className="my-2" />
          {showActions && (
            <AddModal
              currentTable={essentialName}
              formFields={tableConfig[essentialName]}
              apiEndpoint={apiRoutesByRole[essentialName]}
              refetchData={refetchData}
            />
          )}{" "}
          <QueryComponent
            api={apiRoutesByRole[essentialName]}
            queryKey={[essentialName, apiRoutesByRole[essentialName]]}
            page={1}
            limit={1000}
          >
            {(data: any) => {
              const fetchedData = data || [];
              const formFields = tableConfig[essentialName];
              console.log(fetchedData);

              // Adjust prices by adding commission
              const adjustedData = fetchedData.map((item: any) => {
                const { normal, export: exportPrice, ...rest } = item;

                // Adjust prices if 'normal' and 'export' exist
                const adjustedNormal =
                  normal > 0 ? Number(normal) + Number(Commission) : normal;
                const adjustedExport =
                  exportPrice > 0
                    ? Number(exportPrice) + Number(Commission)
                    : exportPrice;

                return {
                  ...rest,
                  normal: showActions ? normal : adjustedNormal,
                  export: showActions ? exportPrice : adjustedExport,
                };
              });

              const tableData = adjustedData.map((item: any) => {
                const { isDeleted, isActive, password, __v, ...rest } = item;

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
