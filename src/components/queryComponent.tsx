"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Spinner } from "@nextui-org/react";
import { getData } from "@/backend/Services/firestore";

interface QueryComponentProps<T> {
  api: string;
  queryKey: any[];
  children: (data: T, refetch?: () => void) => React.ReactNode; // Added refetch as a parameter
  page?: number; // Optional for paginated data
  limit?: number; // Optional for paginated data
  search?: string | null;
  additionalParams?: Record<string, any>; // Dynamic additional parameters
}

function QueryComponent<T>(props: QueryComponentProps<T>) {
  const { api, queryKey, children, page, limit, search, additionalParams } =
    props;

  // Dynamically construct parameters, excluding undefined or null values
  const params = {
    ...(page !== undefined && { page }),
    ...(limit !== undefined && { limit }),
    ...(search && { search }),
    ...(additionalParams || {}), // Include additional dynamic params
  };
  console.log(api);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: () => getData(api),
  });

  if (isLoading) {
    toast.loading(`Fetching API for ${queryKey.join(", ")}`, {
      position: "top-right",
    });
    return <Spinner label="Loading..." color="primary" labelColor="primary" />;
  }

  if (isError) {
    toast.error("Failed to fetch data.", {
      position: "top-right",
    });
    return <div>Query Failed...</div>;
  }

  toast.success("Data fetched successfully.", {
    position: "top-right",
  });

  // Pass the correct data structure to children based on the presence of `page`
  const responseData = page ? data?.data : data?.data;

  return (
    <div>
      {children && children(responseData as T, refetch)} {/* Pass refetch */}
    </div>
  );
}

export default QueryComponent;
