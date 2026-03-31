import API from "../client";

// Example: LOGIN API
export const loginService = async (data: {
  username: string;
  password: string;
}) => {
  const response = await API.post("/login", data);
  return response.data;
};

// Example: GET USER PROFILE
export const getProfileService = async () => {
  const response = await API.get("/profile");
  return response.data;
};

// Example: GENERIC POST
export const postService = async (url: string, data: any) => {
  const response = await API.post(url, data);
  return response.data;
};

// Example: GENERIC GET
export const getService = async (url: string, params?: any) => {
  const response = await API.get(url, { params });
  return response.data;
};