export interface authenticationProps {
  isAuthenticated?: boolean;
}
export interface adminLogin {
  url: string;
}

export interface ToastMessage {
  type: string;
  message: string;
  position?: string;
}
export interface TopbarProps {
  username: string;
  role: string;
}
export interface DashboardTileProps {
  heading?: string;
  data?: string;
  type: string;
  stats?: string;
}
export interface sidebarProps {
  tabChange: (tabname: string) => void;
}
export interface TableDataInterface {
  createdAt?: string;
  _id?: string;
  name?: string;
  Role?: {
    roleName?: string;
  };
  avatar?: string;
  email?: string;
  team?: string;
  age?: string;
  status?: string;
  actions?: string;
}
// export interface TableProps {
//   TableData: any[]; // Array of data to be displayed in the table
//   columns: Column[]; // Array of column configurations
//   viewProjectDetails?: (data: any) => void; // Optional handler for viewing project details
//   verifyActivity?: (data: any) => void; // Optional handler for verifying activity
//   deleteModal?: (data: any) => ReactNode; // Optional ReactNode for delete modal
//   viewModal?: (data: any) => ReactNode; // Optional ReactNode for view modal
//   redirect?: (data: any) => void; // Optional handler for redirecting
//   isLoading?: boolean; // Optional flag for loading state
//   deleteData?: {
//     endpoint: string; // API endpoint to call for deleting data
//     key: any[]; // Keys associated with the delete action
//     type: string; // Type of item being deleted (for display purposes)
//   };
// }
export interface Column {
  name: string;
  uid: string;
}
export interface ProjectDetailProps {
  id: string;
  role: string;
  setProjectDetail: (data: any) => void;
}
export interface ProjectDetailProgressProps {
  heading: string;
  subheading: string;
  progress: number;
}
export interface ProjectDetailCardProps {
  data: {
    projectName: string;
    projectManager: {
      name: string;
      role: string;
      avatar: string;
    };
    description: string;
    statusOptions: statusOptions[];
  };
}
export interface ActivityDetailCardProps {
  data: {
    projectName: string;
    projectManager: {
      name: string;
      role: string;
      avatar: string;
    };
    actualdate: string;
    forecastdate: string;
    targetdate: string;
    description: string;
    statusOptions: statusOptions[];
  };
}
export interface statusOptions {
  key: string;
  text: string;
  color: string;
}

export interface EditModalProps {
  _id: string;
  currentTable: string;
  formFields: FormField[];
  apiEndpoint: string;
  refetchData: () => void;
  initialData?: any; // Existing data to populate the form
}

export interface QueryComponentProps<T> {
  api: string;
  queryKey: string[];
  children: (data: T, refetch?: () => void) => React.ReactNode; // Added refetch as a parameter
  page?: number; // Optional for paginated data
  limit?: number; // Optional for paginated data
  search?: string | null;
  additionalParams?: Record<string, any>; // Dynamic additional parameters
}

export interface StatusUpdateProps {
  currentEntity: string; // E.g., "Project", "Activity", "Timesheet"
  statusOptions: { key: string; label: string }[]; // E.g., [{ key: "pending", label: "Pending" }, ...]
  apiEndpoint: string; // API endpoint for status update
  recordId: string; // Unique ID for the entity
  currentStatus: {
    key: string;
    label: string;
  }; // Current status of the entity
  refetchData: () => void; // Callback to refresh the data
}
export interface DeleteModalProps {
  _id: string;
  name: string;
  queryKey?: string[];
  deleteApiEndpoint: string;
  refetchData: () => void;
  useBody?: boolean;
}
export interface DetailsModalProps {
  data: Record<string, any>; // Use a generic record to handle dynamic fields
  columns: { name: string; uid: string; type?: string }[]; // Add column metadata to handle type
}

export interface TableProps {
  TableData?: any[]; // Optional, with a default fallback
  columns: { name: string; uid: string; type?: string }[];
  viewModal?: (item: any) => React.ReactNode;
  deleteModal?: (item: any) => React.ReactNode;
  editModal?: (item: any) => React.ReactNode;
  otherModal?: (item: any) => React.ReactNode;
  isLoading?: boolean;
}

export interface BulkAddProps {
  apiEndpoint: string; // Endpoint to upload the JSON data
  refetchData: () => void; // Function to refresh data after successful upload
  currentTable: string;
}
export interface AddModalProps {
  currentTable: string;
  formFields: FormField[];
  apiEndpoint: string;
  refetchData?: () => void;
  additionalVariable?: Record<string, any>; // Dynamic additional parameters
}

export interface FormField {
  label: string;
  type: string; // e.g., "text", "email", "select", "multiselect", "file", "textarea"
  key: string;
  inForm: boolean;
  inEdit?: boolean;
  inTable: boolean;
  values?: { key: string; value: string }[]; // For select and multiselect
  accept?: string; // For file inputs (e.g., "image/*")
  multiple?: boolean; // For file inputs
}
