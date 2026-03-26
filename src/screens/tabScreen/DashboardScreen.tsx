import React from "react";
import { View, Text, StyleSheet } from "react-native";
// import ScreenContainer from "../../components/ScreenContainer";
import { wp, hp } from "../../utils/responcive/responcive";

const Dashboard = () => {
  return (
    // <ScreenContainer>
      <View style={styles.header}>
        {/* <Text style={styles.title}>Dashboard</Text> */}
      </View>
    // </ScreenContainer>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: wp(16),
    paddingTop: hp(10),
  },

  title: {
    fontSize: hp(22),
    fontWeight: "600",
  },
});