// components/LocationTabContent.tsx
"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/core/api/apiHandler";
import QueryComponent from "@/components/queryComponent";
import {
  locationRoutes,
  locationManagerRoutes,
  locationTypeRoutes,
} from "@/core/api/apiRoutes";
import { queryClient } from "@/app/provider";
import UserDeleteModal from "@/components/CurdTable/delete";
import AddModal from "@/components/CurdTable/add-model";
import CommonTable from "../../CurdTable/common-table";
import { Spacer } from "@nextui-org/react";

interface LocationTabContentProps {
  currentType: string; // LocationType _id or "all"
}

const LocationTabContent: React.FC<LocationTabContentProps> = ({
  currentType,
}) => {
  const queryKey = ["locations", currentType];
  const refetchData = () => {
    queryClient.invalidateQueries();
  };

  // Fetch LocationManagers for the select field
  const { data: locationManagerData } = useQuery({
    queryKey: ["locationManager"],
    queryFn: () => getData(locationManagerRoutes.getAll),
  });

  const locationManagers = locationManagerData?.data?.data.data || [];

  // Fetch LocationTypes for the select field
  const { data: locationTypeData } = useQuery({
    queryKey: ["locationType"],
    queryFn: () => getData(locationTypeRoutes.getAll),
  });

  const locationType = locationTypeData?.data?.data.data || [];

  return (
    <QueryComponent
      api={locationRoutes.getAll}
      queryKey={queryKey}
      page={1}
      limit={100}
    >
      {(data: any) => {
        const fetchedData = data?.data || [];

        // Filter data based on currentType if not "all"
        const filteredData =
          currentType === "all"
            ? fetchedData
            : fetchedData.filter(
                (item: any) => item.locationType?._id === currentType
              );

        // Define columns
        const columns = [
          { name: "IMAGE", uid: "imageUrl" },
          { name: "NAME", uid: "name" },
          { name: "ADDRESS", uid: "address" },
          { name: "CITY", uid: "city" },
          { name: "PROVINCE", uid: "province" },
          { name: "REGION", uid: "region" },
          { name: "NATION", uid: "nation" },
          { name: "LOCATION TYPE", uid: "locationTypeName" },
          { name: "LOCATION MANAGERS", uid: "locationManagerNames" },
          { name: "CREATED AT", uid: "createdAt" },
          { name: "ACTIONS", uid: "actions2" },
        ];

        // Define form fields for AddModal
        const formFields = [
          {
            label: "Name",
            type: "text",
            key: "name",
            inForm: true,
            inTable: true,
          },
          {
            label: "Address",
            type: "text",
            key: "address",
            inForm: true,
            inTable: true,
          },
          {
            label: "City",
            type: "text",
            key: "city",
            inForm: true,
            inTable: true,
          },
          {
            label: "Province",
            type: "text",
            key: "province",
            inForm: true,
            inTable: true,
          },
          {
            label: "Region",
            type: "text",
            key: "region",
            inForm: true,
            inTable: true,
          },
          {
            label: "Nation",
            type: "text",
            key: "nation",
            inForm: true,
            inTable: true,
          },
          {
            label: "Latitude",
            type: "text",
            key: "latitude",
            inForm: true,
            inTable: false,
          },
          {
            label: "Longitude",
            type: "text",
            key: "longitude",
            inForm: true,
            inTable: false,
          },
          {
            label: "Map",
            type: "text",
            key: "map",
            inForm: true,
            inTable: false,
          },
          {
            label: "Image",
            type: "file",
            key: "image",
            inForm: true,
            inTable: false,
            accept: "image/*",
          },
          {
            label: "Description",
            type: "textarea",
            key: "description",
            inForm: true,
            inTable: false,
          },
          {
            label: "Location Type",
            type: "select",
            key: "locationType",
            values: locationType.map((type: any) => ({
              key: type._id,
              value: type.name,
            })),
            inForm: true,
            inTable: false,
          },
          {
            label: "Location Managers",
            type: "multiselect",
            key: "locationManagers",
            values: locationManagers.map((manager: any) => ({
              key: manager._id,
              value: manager.name,
            })),
            inForm: true,
            inTable: false,
          },
        ];

        // Map data to include location manager names, location type name, and image URL
        const tableData = filteredData.map((item: any) => ({
          ...item,
          locationManagerNames: item.locationManagers
            .map((manager: any) => manager?.name)
            .join(", "),
          locationTypeName: item.locationType?.name || "N/A",
          imageUrl: item.image?.path, // Assuming 'path' contains the image URL
        }));

        return (
          <>
            <AddModal
              currentTable="Location"
              formFields={formFields}
              apiEndpoint={locationRoutes.getAll}
              refetchData={refetchData}
            />
            <Spacer y={5} />
            <CommonTable
              TableData={tableData}
              columns={columns}
              isLoading={false}
              viewModal={(item: any) => (
                // Implement view modal if needed
                <div></div>
              )}
              deleteModal={(item: any) => (
                <UserDeleteModal
                  _id={item._id}
                  name={item.name}
                  deleteApiEndpoint={locationRoutes.delete}
                  refetchData={refetchData}
                />
              )}
            />
          </>
        );
      }}
    </QueryComponent>
  );
};

export default LocationTabContent;
