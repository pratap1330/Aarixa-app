import React from "react";
import { View, Text, StyleSheet } from "react-native";
// import ScreenContainer from "../../components/ScreenContainer";
import { wp, hp } from "../../utils/responcive/responcive";
import DashboardCard from "../../components/DashboardCard";


const Dashboard = () => {
  return (
   <View style={styles.screen}>
      <View style={styles.header} />

      <View style={styles.cardContainer}>
        <DashboardCard
          currentValue="₹14,12,780"
          investedValue="₹10,00,000"
          unrealisedGain="+ ₹4,12,780"
          xirr="14.05%"
        />
      </View>
    </View>
    
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  header: {
    paddingHorizontal: wp(16),
    paddingTop: hp(10),
  },

  cardContainer: {
    marginTop: hp(16),
    alignItems: "center",
  },

  title: {
    fontSize: hp(22),
    fontWeight: "600",
  },
});