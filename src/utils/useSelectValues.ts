// import { useQuery } from "@tanstack/react-query";
// import { getData } from "@/core/api/apiHandler";
// import { apiRoutesByRole } from "./tableValues";

// // Define the custom hook to fetch and format data for select fields
// const useSelectValues = (queryKey: string) => {
//   const { data, isLoading, isError } = useQuery({
//     queryKey: [queryKey],
//     queryFn: () => getData(apiRoutesByRole[queryKey]),
//   });

//   // Return the mapped data if available, else an empty array
//   const formattedData =
//     data?.data?.data?.map((item: any) => ({
//       key: String(item._id),
//       value: item.name,
//     })) || [];

//   return { data: formattedData.data };
// };

// export default useSelectValues;
