"use client";
import React from "react";

import QueryComponent from "@/components/queryComponent";
import AddModal from "@/components/CurdTable/add-model";
import UserDeleteModal from "@/components/CurdTable/delete";
import CommonTable from "@/components/CurdTable/common-table";

import EditModal from "@/components/CurdTable/edit-model";
import {
  apiRoutesByRole,
  generateColumns,
  initialTableConfig,
} from "@/utlis/tableValues";

const EssentialTabContent = ({
  essentialName,
  showActions,
  commission = 0,
  spiceName,
  isPrimary = false,
}: {
  essentialName: string;
  showActions: boolean;
  commission?: number;
  spiceName?: string;
  isPrimary?: boolean;
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

  const queryKey = [essentialName, apiRoutesByRole[essentialName]];

  return (
    <QueryComponent
      api={apiRoutesByRole[essentialName]}
      queryKey={queryKey}
      page={1}
      limit={1000}
    >
      {(data: any, refetch?: () => void) => {
        const fetchedData = data || [];
        
        // Hide entire component if product is empty and showActions is false
        if (fetchedData.length === 0 && !showActions) {
          return null;
        }
        
        const formFields = tableConfig[essentialName];

        // Store original data for edit/delete operations
        const originalDataMap = new Map();
        fetchedData.forEach((item: any) => {
          originalDataMap.set(item.id, item);
        });

        // Adjust prices by adding commission when commission is provided (only for display)
        const shouldApplyCommission = commission > 0;
        const adjustedData = fetchedData.map((item: any) => {
          const { normal, export: exportPrice, price, ...rest } = item;

          // Adjust prices if commission is provided and prices exist
          const adjustedNormal =
            shouldApplyCommission && normal > 0
              ? Number(normal) + Number(commission)
              : normal;
          const adjustedExport =
            shouldApplyCommission && exportPrice > 0
              ? Number(exportPrice) + Number(commission)
              : exportPrice;
          const adjustedPrice =
            shouldApplyCommission && price > 0
              ? Number(price) + Number(commission)
              : price;

          return {
            ...rest,
            normal: adjustedNormal,
            export: adjustedExport,
            price: adjustedPrice,
          };
        });

        const tableData = adjustedData.map((item: any) => {
          const { isDeleted, isActive, password, __v, ...rest } = item;

          return rest;
        });

        return (
          <div className="flex flex-col items-center justify-center">
            <div className="w-full">
              <div className="space-y-4">
                {/* Spice Name Title and GST Info */}
                {spiceName && (
                  <div className="space-y-2 mb-4">
                    <h2
                      className={`text-2xl md:text-3xl font-bold capitalize ${
                        isPrimary ? "text-lime-600" : "text-white"
                      }`}
                    >
                      {spiceName}
                    </h2>
                    <p className="text-sm md:text-base text-gray-400">
                      Excluding GST and the Prices are in INR
                    </p>
                  </div>
                )}

                {showActions && (
                  <AddModal
                    currentTable={essentialName}
                    formFields={formFields}
                    apiEndpoint={apiRoutesByRole[essentialName]}
                  />
                )}

                <CommonTable
                  TableData={tableData}
                  columns={newColumns}
                  isLoading={false}
                  editModal={(item: any) => {
                    // Get original item data (without commission adjustment) for editing
                    const originalItem = originalDataMap.get(item.id) || item;
                    return (
                      <div>
                        <EditModal
                          item={originalItem}
                          currentTable={essentialName}
                          formFields={formFields}
                          apiEndpoint={apiRoutesByRole[essentialName]}
                          refetchData={refetch || (() => {})}
                        />
                      </div>
                    );
                  }}
                  deleteModal={(item: any) => {
                    // Get original item data for delete
                    const originalItem = originalDataMap.get(item.id) || item;
                    return (
                      <UserDeleteModal
                        _id={originalItem.id}
                        name={originalItem.name}
                        deleteApiEndpoint={apiRoutesByRole[essentialName]}
                        queryKey={queryKey}
                        refetchData={() => {}}
                      />
                    );
                  }}
                />
              </div>
            </div>
          </div>
        );
      }}
    </QueryComponent>
  );
};

export default EssentialTabContent;
