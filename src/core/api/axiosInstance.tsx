// src/core/api/axiosInstance.js

import axios from "axios";

export const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api/v1/web";

const instance = axios.create({
  baseURL: baseUrl,
  headers: {
    IDENTIFIER: process.env.IDENTIFIER || "A2hG9tE4rB6kY1sN",
    "ngrok-skip-browser-warning": "123",
  },
  withCredentials: true, // Important for sending cookies
});

// Remove any interceptors that set Authorization headers since tokens are in cookies

// Optionally, keep response interceptor for handling 401 errors
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login or show a notification
      // window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);

export default instance;
