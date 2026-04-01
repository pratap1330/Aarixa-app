import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomTabBar from "../../components/CustomTabBar";
import Dashboard from "../../screens/tabScreen/DashboardScreen";
import CustomHeader from "../../components/CustomHeader";
import { TabParamList } from "../../utils/NavigationType/type";

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        header: () => <CustomHeader />,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: 111,
        },
      }}
    >
      <Tab.Screen
        name="dashboard"
        component={Dashboard}
      />

    </Tab.Navigator>
  );
}