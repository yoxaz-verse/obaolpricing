"use client";
import {
  activityFileRoutes,
  activityManagerRoutes,
  activityRoutes,
  activityStatusRoutes,
  activityTypeRoutes,
  adminRoutes,
  customerRoutes,
  locationManagerRoutes,
  locationRoutes,
  locationTypeRoutes,
  projectManagerRoutes,
  projectRoutes,
  projectStatusRoutes,
  projectTypeRoutes,
  serviceCompanyRoutes,
  timeSheetRoutes,
  workerRoutes,
} from "@/core/api/apiRoutes";

// Helper function to generate columns based on the current table
export const generateColumns = (currentTable: string, tableConfig: any) => {
  // Filter out the "Actions" column initially
  const nonActionColumns = tableConfig[currentTable]
    .filter(
      (field: any) =>
        field.inTable && field.type !== "select" && field.key !== "actions2"
    )
    .map((field: any) => ({
      name: field.label.toUpperCase(),
      uid: field.key,
      type: field.type,
    }));

  if (currentTable === "worker") {
    nonActionColumns.push({ name: "SERVICE COMPANY", uid: "serviceCompany" });
  } else if (currentTable === "location") {
    nonActionColumns.push({ name: "LOCATION TYPE", uid: "type" });
  } else if (currentTable === "projects") {
    // nonActionColumns.push({ name: "Admin Name", uid: "adminName" });
    nonActionColumns.push({
      name: "Project Manager",
      uid: "projectManagerName",
    });
    nonActionColumns.push({ name: "Customer", uid: "customerName" });
    nonActionColumns.push({ name: "ProjectStatus", uid: "projectStatus" });
    nonActionColumns.push({ name: "Project Type", uid: "projectType" });
    nonActionColumns.push({ name: "Location", uid: "location" });
  } else if (currentTable === "activity") {
    // nonActionColumns.push({ name: "Admin Name", uid: "adminName" });
    nonActionColumns.push({
      name: "Activity Manager",
      uid: "activityManagerName",
    });
    nonActionColumns.push({ name: "Activity Status", uid: "activityStatus" });
    nonActionColumns.push({ name: "Activity Type", uid: "activityType" });
  } else if (
    currentTable === "projectManager" ||
    currentTable === "activityManager"
  ) {
    nonActionColumns.push({ name: "ADMIN", uid: "admin" });
  }

  // Find the "Actions" column separately
  const actionsColumn = tableConfig[currentTable].find(
    (field: any) => field.type === "action" && field.inTable
  );

  // Append the "Actions" column at the end
  if (actionsColumn) {
    nonActionColumns.push({
      name: actionsColumn.label.toUpperCase(),
      uid: actionsColumn.key,
      type: actionsColumn.type,
    });
  }

  return nonActionColumns;
};

export const apiRoutesByRole: Record<string, string> = {
  admin: adminRoutes.getAll,
  activityManager: activityManagerRoutes.getAll,
  projectManager: projectManagerRoutes.getAll,
  customer: customerRoutes.getAll,
  worker: workerRoutes.getAll,
  location: locationRoutes.getAll,
  locationManager: locationManagerRoutes.getAll,
  locationType: locationTypeRoutes.getAll,
  projectType: projectTypeRoutes.getAll,
  serviceCompany: serviceCompanyRoutes.getAll,
  projectStatus: projectStatusRoutes.getAll,
  projects: projectRoutes.getAll,
  activity: activityRoutes.getAll,
  activityType: activityTypeRoutes.getAll,
  activityStatus: activityStatusRoutes.getAll,
  timeSheet: timeSheetRoutes.getAll,
  activityFile: activityFileRoutes.getAll,
  cardamom: "cardamom",
};

export const initialTableConfig: Record<
  any,
  {
    label: string;
    type:
      | "text"
      | "select"
      | "multiselect"
      | "multiselectValue"
      | "file"
      | "textarea"
      | "boolean"
      | "image"
      | "action"
      | "email"
      | "date"
      | "number"
      | "time"
      | "link"
      | "dateTime"
      | "password"; // Define specific types
    key: string;
    inForm: boolean;
    inTable: boolean;
    inEdit?: boolean;
    values?: { key: string; value: string }[];
    accept?: string;
    required?: boolean;
  }[]
> = {
  // User
  admin: [
    { label: "Name", type: "text", key: "name", inForm: true, inTable: true },
    {
      label: "Email",
      type: "email",
      key: "email",
      inForm: true,
      inTable: true,
    },
    {
      label: "Password",
      type: "password",
      key: "password",
      inForm: true,
      inTable: false,
      inEdit: true,
    },
    {
      label: "Created At",
      type: "dateTime",
      key: "createdAt",
      inForm: false,
      inTable: true,
    },
    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },
  ],
  projectManager: [
    { label: "Name", type: "text", key: "name", inForm: true, inTable: true },
    {
      label: "Email",
      type: "email",
      key: "email",
      inForm: true,
      inTable: true,
    },
    {
      label: "Password",
      type: "password",
      key: "password",
      inForm: true,
      inTable: false,
      inEdit: true,
    },

    {
      label: "Admin",
      type: "select",
      key: "admin",
      values: [], // We'll populate this dynamically
      inEdit: true,
      inForm: true,
      inTable: false,
    },
    {
      label: "Created At",
      type: "dateTime",
      key: "createdAt",
      inForm: false,
      inTable: true,
    },
    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },
  ],
  activityManager: [
    { label: "Name", type: "text", key: "name", inForm: true, inTable: true },
    {
      label: "Email",
      type: "email",
      key: "email",
      inForm: true,
      inTable: true,
    },
    {
      label: "Password",
      type: "password",
      key: "password",
      inForm: true,
      inTable: false,
      inEdit: true,
    },

    {
      label: "Admin",
      type: "select",
      key: "admin",
      values: [], // We'll populate this dynamically
      inEdit: true,
      inForm: true,
      inTable: false,
    },
    {
      label: "Created At",
      type: "dateTime",
      key: "createdAt",
      inForm: false,
      inTable: true,
    },
    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },
  ],
  customer: [
    {
      label: "Customer Name",
      type: "text",
      key: "name",
      inForm: true,
      inTable: true,
    },
    {
      label: "Email",
      type: "email",
      key: "email",
      inForm: true,
      inTable: true,
    },
    {
      label: "Password",
      type: "password",
      key: "password",
      inForm: true,
      inEdit: true,
      inTable: false,
    },
    {
      label: "Created At",
      type: "dateTime",
      key: "createdAt",
      inForm: false,
      inTable: true,
    },
    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },
  ],
  worker: [
    {
      label: "Worker Name",
      type: "text",
      key: "name",
      inForm: true,
      inTable: true,
    },
    {
      label: "Password",
      type: "password",
      key: "password",
      inForm: true,
      inEdit: true,
      inTable: false,
    },
    {
      label: "Email",
      type: "email",
      key: "email",
      inForm: true,
      inTable: true,
    },
    {
      label: "Skill",
      type: "text",
      key: "skill",
      inForm: true,
      inTable: true,
    },
    {
      label: "Service Company",
      type: "select",
      key: "serviceCompany",
      values: [], // We'll populate this dynamically
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Created At",
      type: "dateTime",
      key: "createdAt",
      inForm: false,
      inTable: true,
    },
    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },
  ],
  cardamom: [
    {
      label: "Quality",
      type: "text",
      key: "quality",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Normal",
      type: "number",
      key: "normal",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Export",
      type: "number",
      key: "export",
      inForm: true,
      inTable: true,
      inEdit: true,
    },

    // {
    //   label: "Active",
    //   type: "checkbox",
    //   key: "isActive",
    //   inForm: false,
    //   inTable: true,
    // },
    // {
    //   label: "Actions",
    //   type: "action",
    //   key: "action",
    //   inForm: false,
    //   inTable: true,
    // },
    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },
  ],
  serviceCompany: [
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
      label: "Description",
      type: "textarea",
      key: "description",
      inForm: true,
      inTable: false,
    },
    {
      label: "Map URL",
      type: "link",
      key: "map",
      inForm: true,
      inTable: true,
    },
    {
      label: "Website URL",
      type: "text",
      key: "url",
      inForm: true,
      inTable: true,
    },
    // {
    //   label: "Active",
    //   type: "checkbox",
    //   key: "isActive",
    //   inForm: false,
    //   inTable: true,
    // },
    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },
    {
      label: "Created At",
      type: "dateTime",
      key: "createdAt",
      inForm: false,
      inTable: true,
    },
  ],
  // Location
  location: [
    {
      label: "Name",
      type: "text",
      key: "name",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Custom ID",
      type: "text",
      key: "customId",
      inForm: false,
      inTable: true,
      inEdit: false,
    },

    {
      label: "Owner",
      type: "text",
      key: "owner",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Address",
      type: "text",
      key: "address",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Location Manager",
      type: "multiselectValue",
      key: "locationManager",
      values: [],
      inForm: true,
      inTable: false,
      inEdit: true,
    },
    {
      label: "City",
      type: "text",
      key: "city",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Street",
      type: "text",
      key: "street",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Province",
      type: "text",
      key: "province",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Region",
      type: "text",
      key: "region",
      inForm: true,
      inTable: true,
      inEdit: true,
    },

    {
      label: "Nation",
      type: "text",
      key: "nation",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Latitude",
      type: "text",
      key: "latitude",
      inForm: false,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Longitude",
      type: "text",
      key: "longitude",
      inForm: false,
      inTable: true,
      inEdit: true,
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
      inForm: false,
      inTable: false,
      accept: "image/*",
    },
    {
      label: "Description",
      type: "textarea",
      key: "description",
      inForm: true,
      inTable: false,
      inEdit: true,
    },
    {
      label: "Location Type",
      type: "select",
      key: "locationType",
      values: [],
      inForm: true,
      inTable: false,
    },
    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },

    {
      label: "Created At",
      type: "dateTime",
      key: "createdAt",
      inForm: false,
      inTable: true,
    },
  ],

  locationType: [
    {
      label: "Name",
      type: "text",
      key: "name",
      inForm: true,
      inTable: true,
    },

    {
      label: "Created At",
      type: "dateTime",
      key: "createdAt",
      inForm: false,
      inTable: true,
    }, // {
    //   label: "Active",
    //   type: "checkbox",
    //   key: "isActive",
    //   inForm: false,
    //   inTable: true,
    // },
    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },
  ],
  locationManager: [
    {
      label: "Name",
      type: "text",
      key: "name",
      inForm: true,
      inTable: true,
    },

    {
      label: "Created At",
      type: "dateTime",
      key: "createdAt",
      inForm: false,
      inTable: true,
    },
    // {
    //   label: "Active",
    //   type: "checkbox",
    //   key: "isActive",
    //   inForm: false,
    //   inTable: true,
    // },
    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },
  ],
  // Project
  projects: [
    {
      label: "Title",
      type: "text",
      key: "title",
      inForm: false,
      inTable: false,
    },
    {
      label: "Description",
      type: "textarea",
      key: "description",
      inForm: true,
      inTable: false,
      inEdit: true,
    },
    {
      label: "Custom ID",
      type: "text",
      key: "customId",
      inForm: false,
      inTable: true,
    },
    {
      label: "Customer",
      type: "select",
      key: "customer",
      values: [],
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    // {
    //   label: "Admin",
    //   type: "select",
    //   key: "admin",
    //   values: [],
    //   inForm: false,
    //   inTable: false,
    // },
    {
      label: "Project Manager",
      type: "select",
      key: "projectManager",
      values: [],
      inForm: true,
      inTable: false,
      inEdit: true,
    },
    {
      label: "Assignment Date ",
      type: "date",
      key: "assignmentDate",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Status",
      type: "select",
      key: "status",
      values: [],
      inForm: false,
      inTable: false,
    },
    {
      label: "Project Type",
      type: "select",
      key: "type",
      values: [],
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Location",
      type: "select",
      key: "location",
      values: [],
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Task",
      type: "textarea",
      key: "task",
      inForm: true,
      inTable: false,
      inEdit: true,
    },
    {
      label: "Order Number",
      type: "text",
      key: "orderNumber",
      inForm: true,
      inTable: false,
      inEdit: true,
    },

    {
      label: "Scheda Radio Date",
      type: "date",
      key: "schedaRadioDate",
      inForm: true,
      inEdit: true,
      inTable: true,
    },

    {
      label: "Created At",
      type: "text",
      key: "createdAt",
      inForm: false,
      inTable: false,
    },
    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },
  ],
  projectType: [
    {
      label: "Name",
      type: "text",
      key: "name",
      inForm: true,
      inTable: true,
    },

    {
      label: "Created At",
      type: "dateTime",
      key: "createdAt",
      inForm: false,
      inTable: true,
    },
    // {
    //   label: "Active",
    //   type: "checkbox",
    //   key: "isActive",
    //   inForm: false,
    //   inTable: true,
    // },
    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },
  ],
  projectStatus: [
    {
      label: "Name",
      type: "text",
      key: "name",
      inForm: true,
      inTable: true,
    },
    {
      label: "Created At",
      type: "dateTime",
      key: "createdAt",
      inForm: false,
      inTable: true,
    },
    // {
    //   label: "Active",
    //   type: "checkbox",
    //   key: "isActive",
    //   inForm: false,
    //   inTable: true,
    // },
    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },
  ],
  // Activity
  activity: [
    {
      label: "Title",
      type: "text",
      key: "title",
      inForm: false,
      inTable: true,
      inEdit: false,
    },
    {
      label: "Description",
      type: "textarea",
      key: "description",
      inForm: true,
      inTable: false,
      inEdit: true,
    },

    {
      label: "Project",
      type: "select",
      key: "project",
      values: [],
      inForm: false,
      inTable: false,
      inEdit: false,
    },

    {
      label: "Activity Manager",
      type: "select",
      key: "activityManager",
      values: [],
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Workers",
      type: "multiselect",
      key: "worker",
      values: [],
      inForm: true,
      inTable: false,
      inEdit: true,
    },
    {
      label: "Status",
      type: "select",
      key: "status",
      values: [],
      inForm: false,
      inTable: false,
      inEdit: false,
    },
    {
      label: "Forecast Date",
      type: "date",
      key: "forecastDate",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Actual Date",
      type: "date",
      key: "actualDate",
      inForm: false,
      inTable: false,
      inEdit: true,
    },
    {
      label: "Target Operation Date",
      type: "date",
      key: "targetOperationDate",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Target Finance  Date",
      type: "date",
      key: "targetFinanceDate",
      inForm: false,
      inTable: false,
      inEdit: true,
    },

    {
      label: "Updated By ",
      type: "text",
      key: "updatedBy",
      inForm: false,
      inTable: true,
      inEdit: false,
    },
    {
      label: "Hours Spent",
      type: "number",
      key: "hoursSpent",
      inForm: false,
      inTable: true,
      // inEdit: true,
    },

    {
      label: "Rejection Reason",
      type: "textarea",
      key: "rejectionReason",
      inForm: false,
      inTable: false,
    },

    {
      label: "Activity Type",
      type: "select",
      key: "type",
      inForm: true,
      inTable: false,
    },
    {
      label: "Created At",
      type: "dateTime",
      key: "createdAt",
      inForm: false,
      inTable: false,
    },
    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },
  ],
  activityStatus: [
    {
      label: "Name",
      type: "text",
      key: "name",
      inForm: true,
      inTable: true,
    },

    {
      label: "Created At",
      type: "dateTime",
      key: "createdAt",
      inForm: false,
      inTable: true,
    },
    // {
    //   label: "Active",
    //   type: "checkbox",
    //   key: "isActive",
    //   inForm: false,
    //   inTable: true,
    // },
    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },
  ],
  activityType: [
    {
      label: "Name",
      type: "text",
      key: "name",
      inForm: true,
      inTable: true,
    },
    {
      label: "Created At",
      type: "dateTime",
      key: "createdAt",
      inForm: false,
      inTable: true,
    },
    // {
    //   label: "Active",
    //   type: "checkbox",
    //   key: "isActive",
    //   inForm: false,
    //   inTable: true,
    // },
    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },
  ],
  // TimeSheet
  timeSheet: [
    {
      label: "Activity",
      type: "select",
      key: "activity",
      values: [],
      inForm: false,
      inTable: true,
    },
    {
      label: "Note",
      type: "textarea",
      key: "note",
      inForm: true,
      inTable: true,
    },
    // {
    //   label: "Created By",
    //   type: "text",
    //   key: "createdBy",
    //   inForm: false,
    //   inTable: true,
    // },
    {
      label: "Role",
      type: "text",
      key: "createdByRole",
      inForm: false,
      inTable: true,
    },
    {
      label: "Date",
      type: "date",
      key: "date",
      inForm: true,
      inTable: true,
    },
    {
      label: "Start Time",
      type: "time",
      key: "startTime",
      inForm: true,
      inTable: true,
    },
    {
      label: "End Time",
      type: "time",
      key: "endTime",
      inForm: true,
      inTable: true,
    },
    {
      label: "Created At",
      type: "dateTime",
      key: "createdAt",
      inForm: false,
      inTable: true,
    },
    {
      label: "Updated At",
      type: "dateTime",
      key: "updatedAt",
      inForm: false,
      inTable: false,
    },

    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },
  ],
};
