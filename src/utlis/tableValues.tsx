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
  pepper: "pepper",
  nutmeg: "nutmeg",
  mace: "mace",
  cinnamon: "cinnamon",
  honey: "honey",
  tea: "tea",
  associates: "associates",




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
  // Cardamom

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
  pepper: [
    {
      label: "Quality",
      type: "text",
      key: "quality",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Price",
      type: "number",
      key: "price",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },
  ],
  nutmeg: [
    {
      label: "Quality",
      type: "text",
      key: "quality",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Price",
      type: "number",
      key: "price",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },
  ],
  mace: [
    {
      label: "Quality",
      type: "text",
      key: "quality",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Price",
      type: "number",
      key: "price",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },
  ],
  cinnamon: [
    {
      label: "Quality",
      type: "text",
      key: "quality",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Price",
      type: "number",
      key: "price",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },
  ],
  honey: [
    {
      label: "Quality",
      type: "text",
      key: "quality",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Price",
      type: "number",
      key: "price",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },
  ],
  tea: [
    {
      label: "Quality",
      type: "text",
      key: "quality",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Price",
      type: "number",
      key: "price",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Actions",
      type: "action",
      key: "actions2",
      inForm: false,
      inTable: true,
    },
  ],
  associates: [
    {
      label: "Associate Name",
      type: "text",
      key: "name",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Associate Company",
      type: "text",
      key: "company",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Associate URL",
      type: "text",
      key: "url",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Associate Number",
      type: "number",
      key: "number",
      inForm: true,
      inTable: true,
      inEdit: true,
    },
    {
      label: "Commission ",
      type: "number",
      key: "commission",
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
};
