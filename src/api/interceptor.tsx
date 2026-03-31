import API from "./client";
import { RootState } from "../redux/store/store";

type AppStore = {
  getState: () => RootState;
};

export const setupInterceptors = (store: AppStore) => {
  API.interceptors.request.use(
    (config) => {
      const token = store.getState().auth?.token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  API.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        console.log("Unauthorized → logout");
      }
      return Promise.reject(error);
    }
  );
};