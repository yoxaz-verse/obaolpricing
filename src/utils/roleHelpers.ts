export const routeRoles: { [key: string]: string[] } = {
  "/dashboard": [
    "Admin",
    "Customer",
    "ActivityManager",
    "ProjectManager",
    "Worker",
  ],
  "/dashboard/projects": [
    "Admin",
    "Customer",
    "ActivityManager",
    "ProjectManager",
    "Worker",
  ],
  "/dashboard/essentials": ["Admin"],
  "/dashboard/activity": ["Admin"],
  "/dashboard/users": ["Admin"],
  "/project/:projectname": [
    "Admin",
    "Customer",
    "ActivityManager",
    "ProjectManager",
    "Worker",
  ],
};

export const getAllowedRoles = (pathname: string): string[] => {
  const dynamicRoute = Object.keys(routeRoles).find((route) => {
    const dynamicPattern = new RegExp(
      `^${route.replace(/:\w+/g, "[^/]+")}$` // Replace ":param" with dynamic segments
    );
    return dynamicPattern.test(pathname);
  });
  return routeRoles[dynamicRoute || ""] || [];
};
