"use client";

import Template from "../template";
// import PrivateRoute from "@/components/Login/private-route";
import { usePathname } from "next/navigation";
import { Spacer } from "@nextui-org/react";
import { getAllowedRoles } from "@/utils/roleHelpers";

// export const routeRoles: { [key: string]: string[] } = {
//   "/dashboard": [
//     "Admin",
//     "Customer",
//     "ActivityManager",
//     "ProjectManager",
//     "Worker",
//   ],
//   "/dashboard/projects": [
//     "Admin",
//     "Customer",
//     "ActivityManager",
//     "ProjectManager",
//     "Worker",
//   ],
//   "/dashboard/essentials": ["Admin"],
//   "/dashboard/activity": [],
//   "/dashboard/users": ["Admin"],
// };
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Gets the current URL pathname

  const allowedRoles = getAllowedRoles(pathname); // Dynamically determine allowed roles

  return (
    <section className="w-full h-full flex">
      {/* <PrivateRoute allowedRoles={allowedRoles}> */}
      <div className="w-1/6 h-screen hidden xl:block">
        <Sidebar />
      </div>
      <div className="w-full xl:w-5/6 lg:h-screen ">
        <div>
          {/* Check if user data is available before rendering TopBar */}

          <Spacer y={2} />
          <div className="max-h-[90vh] w-full overflow-y-auto">
            {/* Optionally, handle role-specific loading or error */}
            {/* {roleDataLoading && <p>Loading role-specific data...</p>} */}
            {/* {roleDataError && <p>Error loading role-specific data</p>} */}

            <Template>{children}</Template>
          </div>
        </div>
      </div>
      {/* </PrivateRoute> */}
    </section>
  );
}
