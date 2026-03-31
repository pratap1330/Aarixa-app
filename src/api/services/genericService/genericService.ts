// Example: GENERIC POST
import API from "../../client";
export const postService = async (url: string, data: any) => {
  const response = await API.post(url, data);
  return response.data;
};

// Example: GENERIC GET
export const getService = async (url: string, params?: any) => {
  const response = await API.get(url, { params });
  return response.data;
};