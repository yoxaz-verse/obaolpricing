// components/dashboard/Activity/activity-status-tab-content.tsx
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/core/api/apiHandler";
import { activityStatusRoutes } from "@/core/api/apiRoutes";
import QueryComponent from "@/components/queryComponent";
import { showToastMessage } from "@/utils/utils";
import { queryClient } from "@/app/provider";
import UserDeleteModal from "@/components/CurdTable/delete";
import AddModal from "@/components/CurdTable/add-model";
import CommonTable from "../../CurdTable/common-table";
import { Spacer } from "@nextui-org/react";

const ActivityStatusTabContent: React.FC = () => {
  const queryKey = ["activityStatus"];
  const apiEndpoint = activityStatusRoutes.getAll;

  const refetchData = () => {
    // queryClient.invalidateQueries(queryKey);
  };

  return (
    <QueryComponent api={apiEndpoint} queryKey={queryKey} page={1} limit={100}>
      {(data: any) => {
        const fetchedData = data.data || [];

        // Define columns
        const columns = [
          { name: "NAME", uid: "name" },
          { name: "DESCRIPTION", uid: "description" },
          { name: "CREATED AT", uid: "createdAt" },
          { name: "ACTIONS", uid: "actions" },
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
            label: "Description",
            type: "textarea",
            key: "description",
            inForm: true,
            inTable: false,
          },
        ];

        return (
          <>
            <AddModal
              currentTable="ActivityStatus"
              formFields={formFields}
              apiEndpoint={activityStatusRoutes.getAll}
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
                <UserDeleteModal
                  _id={item._id}
                  name={item.name}
                  deleteApiEndpoint={activityStatusRoutes.delete}
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

export default ActivityStatusTabContent;
