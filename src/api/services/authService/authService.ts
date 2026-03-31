import API from "../../client";

// Example: LOGIN API
export const loginService = async (data: {
  username: string;
  password: string;
}) => {
  const response = await API.post("api/auth/client-login", data);
  return response.data;
};


