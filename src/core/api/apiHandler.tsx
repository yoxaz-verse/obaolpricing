// // src/core/api/apiHandler.ts

// import instance from "@/core/api/axiosInstance";

// // GET request to the API
// export const getData = async (url: string, params: any = {}) => {
//   try {
//     return await instance.get(url, { params });
//   } catch (error) {
//     console.error("Error in getData:", error);
//     throw error;
//   }
// };

// // POST request to the API
// export const postData = async (url: string, data: any, params: any = {}) => {

//   try {
//     const headers: any = {
//       Accept: "application/json",
//       // "Content-Type" is managed by Axios instance or specific functions
//     };

//     return await instance.post(url, data, { params, headers });
//   } catch (error) {
//     console.error("Error in postData:", error);
//     throw error;
//   }
// };

// // Define and export postMultipart
// export const postMultipart = async (
//   url: string,
//   data: FormData,
//   params: any = {}
// ) => {
//   try {
//     const headers: any = {
//       Accept: "application/json",
//       "Content-Type": "multipart/form-data",
//     };

//     return await instance.post(url, data, { params, headers });
//   } catch (error) {
//     console.error("Error in postMultipart:", error);
//     throw error;
//   }
// };

// // PUT request to the API
// export const putData = async (url: string, data: any, params: any = {}) => {
//   try {
//     const headers: any = {
//       Accept: "application/json",
//     };

//     return await instance.put(url, data, { params, headers });
//   } catch (error) {
//     console.error("Error in putData:", error);
//     throw error;
//   }
// };

// // PATCH request to the API
// export const patchData = async (url: string, data: any, params: any = {}) => {
//   try {
//     const headers: any = {
//       Accept: "application/json",
//     };

//     return await instance.patch(url, data, { params, headers });
//   } catch (error) {
//     console.error("Error in patchData:", error);
//     throw error;
//   }
// };

// // DELETE request to the API
// export const deleteData = async (url: string, params: any = {}) => {
//   try {
//     return await instance.delete(url, { params });
//   } catch (error) {
//     console.error("Error in deleteData:", error);
//     throw error;
//   }
// };

// // DELETE request with a request body
// export const deleteDataBody = async (
//   url: string,
//   params: any = {},
//   data: any
// ) => {
//   try {
//     return await instance.request({
//       method: "DELETE",
//       url,
//       params,
//       data,
//     });
//   } catch (error) {
//     console.error("Error in deleteDataBody:", error);
//     throw error;
//   }
// };
