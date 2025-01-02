// components/Location/LocationManagerTabContent.tsx
"use client";
import React from "react";
import QueryComponent from "@/components/queryComponent";
import { locationManagerRoutes } from "@/core/api/apiRoutes";
import UserDeleteModal from "@/components/CurdTable/delete";
import AddModal from "@/components/CurdTable/add-model";
import CommonTable from "../../CurdTable/common-table";
import { Spacer } from "@nextui-org/react";

const LocationManagerTabContent: React.FC = () => {
  const queryKey = ["locationManager"];
  const apiEndpoint = locationManagerRoutes.getAll;

  const refetchData = () => {
    // queryClient.invalidateQueries(queryKey);
  };

  return (
    <>
      <QueryComponent
        api={apiEndpoint}
        queryKey={queryKey}
        page={1}
        limit={100}
      >
        {(data: any) => {
          const fetchedData = data?.data || [];
          console.log(fetchedData);

          // Define columns
          const columns = [
            { name: "CODE", uid: "code" },
            { name: "NAME", uid: "name" },
            { name: "CREATED AT", uid: "createdAt" },
            { name: "ACTIONS", uid: "actions2" },
          ];

          // Define form fields for AddModal
          const formFields = [
            {
              label: "Code",
              type: "text",
              key: "code",
              inForm: true,
              inTable: true,
            },
            {
              label: "Name",
              type: "text",
              key: "name",
              inForm: true,
              inTable: true,
            },
          ];

          return (
            <>
              <AddModal
                currentTable="LocationManager"
                formFields={formFields}
                apiEndpoint={apiEndpoint}
                refetchData={refetchData}
              />
              <Spacer y={5} />
              <CommonTable
                TableData={fetchedData}
                columns={columns}
                isLoading={false}
                viewModal={(item: any) => (
                  // Implement view modal if needed
                  <div></div>
                )}
                deleteModal={(item: any) => (
                  // Implement delete modal
                  <UserDeleteModal
                    _id={item._id}
                    name={item.name}
                    deleteApiEndpoint={locationManagerRoutes.delete}
                    refetchData={refetchData}
                  />
                )}
              />
            </>
          );
        }}
      </QueryComponent>
    </>
  );
};

export default LocationManagerTabContent;
