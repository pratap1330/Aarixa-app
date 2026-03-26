// screens/Dashboard/Dashboard.tsx

import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import LinearGradient from "react-native-linear-gradient";
import BannerCarousel, { BannerItem } from "../../components/bannerCarousal";
import DashboardCard from "../../components/DashboardCard";

const BASE_WIDTH = 390;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

const LOCAL_BANNERS: BannerItem[] = [
  { id: "1", source: require('../../images/headerImage/banner.png') },
];


const Dashboard = () => {
  return (
    <View style={styles.screen}>
      <View style={styles.headerBlock}>

        <Text style={styles.welcomeText}>Welcome back</Text>

        <MaskedView
          style={styles.nameMask}
          maskElement={<Text style={styles.nameText}>Priyanka Sharma</Text>}
        >
          <LinearGradient
            colors={["#527EFF", "#3366FF"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.nameGradient}
          />
        </MaskedView>
      </View>
       <View style={styles.cardContainer}>
       <DashboardCard/>
      </View>
      <View style={styles.bannerContainer}>
        <BannerCarousel
          banners={LOCAL_BANNERS}
          autoPlayInterval={1000}
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

  cardContainer: {
    marginTop: 98,
    alignItems: "center",
  },
  headerBlock: {
    position: "absolute",
    top: scale(10),
    left: scale(15),
    width: scale(211),
    height: scale(73),
    gap: scale(5),
  },

  welcomeText: {
    width: scale(211),
    height: scale(34),
    fontFamily: "Urbanist-Bold",
    fontWeight: "700",
    fontSize: scale(28),
    lineHeight: scale(28) * 1.0,
    letterSpacing: scale(28) * -0.02,
    color: "#000000",
    includeFontPadding: false,
  },

  nameMask: {
    width: scale(211),
    height: scale(34),
  },

  nameText: {
    width: scale(211),
    height: scale(34),
    fontFamily: "Urbanist-Bold",
    fontWeight: "700",
    fontSize: scale(28),
    lineHeight: scale(28) * 1.0,
    letterSpacing: scale(28) * -0.02,
    textAlign: "center",
    includeFontPadding: false,
    color: "#000",
  },

  nameGradient: {
    width: scale(211),
    height: scale(34),
  },

  bannerContainer: {
    position: "absolute",
    top: scale(293),
    left: scale(12),
    // left: scale(16),
  },
});