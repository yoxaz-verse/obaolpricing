// src/core/api/apiRoutes.ts

// Remove unnecessary imports
// import { count } from "console"; // Removed as it's not used

// Define base paths as constants for clarity and reusability
const BASE_PATHS = {
  USER: "/user",
  ADMIN: "/admin",
  ACTIVITY_MANAGER: "/activityManager",
  PROJECT_MANAGER: "/projectManager",
  LOCATION_MANAGER: "/locationManager",
  LOCATION: "/location",
  SERVICE_COMPANY: "/serviceCompany",
  LOCATION_TYPE: "/locationType",
  ACTIVITY: "/activity",
  ACTIVITY_TYPE: "/activityType",
  ACTIVITY_STATUS: "/activityStatus",
  ACTIVITY_FILE: "/activityFile",
  PROJECT: "/projects",
  PROJECT_TYPE: "/projectType",
  PROJECT_STATUS: "/projectStatus",
  TIME_SHEET: "/timeSheet",
  CUSTOMER: "/customer",
  WORKER: "/worker",
  STATUS: "/status",
  SUB_STATUS: "/subStatus",
};

// Define account-related routes separately
export const accountRoutes = {
  superAdminLogin: "/superadmin/login",
  adminLogin: "/admin/login",
  managerLogin: "/manager/login",
  customerLogin: "/customer/login",
  servicesLogin: "/services/login",
  workerLogin: "/worker/login",
};

// Helper function to generate standard CRUD routes
const createCRUDRoutes = (basePath: string) => ({
  getAll: `${basePath}`,
  delete: `${basePath}`,
});

// Helper function to add custom routes to the standard CRUD routes
const addCustomRoutes = (
  crudRoutes: Record<string, string>,
  customRoutes: Record<string, string>
) => ({
  ...crudRoutes,
  ...customRoutes,
});

// Define resource-specific routes using the CRUD generator
export const userRoutes = createCRUDRoutes(BASE_PATHS.USER);
export const adminRoutes = createCRUDRoutes(BASE_PATHS.ADMIN);
export const activityManagerRoutes = createCRUDRoutes(
  BASE_PATHS.ACTIVITY_MANAGER
);
export const activityFileRoutes = createCRUDRoutes(BASE_PATHS.ACTIVITY_FILE);
export const projectManagerRoutes = createCRUDRoutes(
  BASE_PATHS.PROJECT_MANAGER
);
export const locationManagerRoutes = createCRUDRoutes(
  BASE_PATHS.LOCATION_MANAGER
);
export const locationRoutes = addCustomRoutes(
  createCRUDRoutes(BASE_PATHS.LOCATION),
  {
    // If you have other custom routes for location, add them here
  }
);
export const serviceCompanyRoutes = addCustomRoutes(
  createCRUDRoutes(BASE_PATHS.SERVICE_COMPANY),
  {
    // If you have other custom routes for serviceCompany, add them here
  }
);
export const timeSheetRoutes = addCustomRoutes(
  createCRUDRoutes(BASE_PATHS.TIME_SHEET),
  {
    // If you have other custom routes for serviceCompany, add them here
  }
);
export const locationTypeRoutes = addCustomRoutes(
  createCRUDRoutes(BASE_PATHS.LOCATION_TYPE),
  {
    // If you have other custom routes for locationType, add them here
  }
);
export const activityTypeRoutes = addCustomRoutes(
  createCRUDRoutes(BASE_PATHS.ACTIVITY_TYPE),
  {
    // If you have other custom routes for activityType, add them here
  }
);

export const activityStatusRoutes = addCustomRoutes(
  createCRUDRoutes(BASE_PATHS.ACTIVITY_STATUS),
  {
    // If you have other custom routes for activityType, add them here
  }
);
export const projectTypeRoutes = addCustomRoutes(
  createCRUDRoutes(BASE_PATHS.PROJECT_TYPE),
  {
    // If you have other custom routes for projectType, add them here
  }
);
export const projectStatusRoutes = addCustomRoutes(
  createCRUDRoutes(BASE_PATHS.PROJECT_STATUS),
  {
    // If you have other custom routes for projectType, add them here
  }
);
export const customerRoutes = addCustomRoutes(
  createCRUDRoutes(BASE_PATHS.CUSTOMER),
  {
    // If you have other custom routes for customer, add them here
  }
);
export const workerRoutes = addCustomRoutes(
  createCRUDRoutes(BASE_PATHS.WORKER),
  {
    // If you have other custom routes for worker, add them here
  }
);
export const statusRoutes = createCRUDRoutes(BASE_PATHS.STATUS);
export const subStatusRoutes = createCRUDRoutes(BASE_PATHS.SUB_STATUS);

// Define project routes with additional custom endpoints
export const projectRoutes = addCustomRoutes(
  createCRUDRoutes(BASE_PATHS.PROJECT),
  {
    count: `${BASE_PATHS.PROJECT}/count`,
  }
);

// Define activity routes with additional custom endpoints
export const activityRoutes =
  // addCustomRoutes(
  createCRUDRoutes(BASE_PATHS.ACTIVITY);
// {
//   getByProject: `${BASE_PATHS.ACTIVITY}/projects`,
// }
// );

// Optionally, group all routes into a single object for easier imports
export const apiRoutes = {
  account: accountRoutes,
  user: userRoutes,
  admin: adminRoutes,
  locationManager: locationManagerRoutes,
  location: locationRoutes,
  serviceCompany: serviceCompanyRoutes,
  locationType: locationTypeRoutes,
  activityType: activityTypeRoutes,
  activityFile: activityFileRoutes,
  projectType: projectTypeRoutes,
  projectStatus: projectStatusRoutes,
  customer: customerRoutes,
  worker: workerRoutes,
  status: statusRoutes,
  subStatus: subStatusRoutes,
  project: projectRoutes,
  activity: activityRoutes,
  activityStatus: activityStatusRoutes,
  timeSheet: timeSheetRoutes,
};
