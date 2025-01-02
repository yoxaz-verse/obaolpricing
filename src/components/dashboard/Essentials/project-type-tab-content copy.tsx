// components/project/projectTypeTabContent.tsx
"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getData } from "@/core/api/apiHandler";
import QueryComponent from "@/components/queryComponent";
import { projectTypeRoutes } from "@/core/api/apiRoutes";
import { showToastMessage } from "@/utils/utils";
import { queryClient } from "@/app/provider";
import UserDeleteModal from "@/components/CurdTable/delete";
import AddModal from "@/components/CurdTable/add-model";
import CommonTable from "../../CurdTable/common-table";
import { Spacer } from "@nextui-org/react";

const ProjectTypeTabContent: React.FC = () => {
  const queryKey = ["projectType"];
  const apiEndpoint = projectTypeRoutes.getAll;

  const refetchData = () => {
    // queryClient.invalidateQueries();
  };

  return (
    <QueryComponent api={apiEndpoint} queryKey={queryKey} page={1} limit={100}>
      {(data: any) => {
        const fetchedData = data.data || [];

        // Define columns
        const columns = [
          { name: "NAME", uid: "name" },
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
        ];

        return (
          <>
            <AddModal
              currentTable="ProjectType"
              formFields={formFields}
              apiEndpoint={projectTypeRoutes.getAll}
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
                  deleteApiEndpoint={projectTypeRoutes.getAll}
                  refetchData={refetchData}
                />
                // <div>ss</div>
              )}
            />
          </>
        );
      }}
    </QueryComponent>
  );
};

export default ProjectTypeTabContent;
