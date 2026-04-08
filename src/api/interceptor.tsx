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
        // console.log("Unauthorized → logout");
      }
      return Promise.reject(error);
    }
  );
};



// import API from "./client";
// // import { useNavigation } from "@react-navigation/native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Alert } from "react-native";

// export const setupInterceptors = (navigation: any) => {
//   API.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       if (error.response?.status === 401) {
//         Alert.alert(
//           "Session Expired",
//           "Your session has timed out. Please login again.",
//           [{
//             text: "OK",
//             onPress: async () => {
//               await AsyncStorage.removeItem("cid");
//               await AsyncStorage.removeItem("user");
//               await AsyncStorage.removeItem("token");

//               navigation.reset({
//                 index: 0,
//                 routes: [{ name: "Login" }],
//               });
//             }
//           }],
//           { cancelable: false }
//         );
//       }
//       return Promise.reject(error);
//     }
//   );
// };