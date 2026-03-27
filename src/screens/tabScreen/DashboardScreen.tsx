// screens/Dashboard/Dashboard.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import LinearGradient from "react-native-linear-gradient";
import BannerCarousel, { BannerItem } from "../../components/bannerCarousal";
import DashboardCard from "../../components/DashboardCard";
import AssetsCard from "../../components/DashboardAssetCard";

const BASE_WIDTH = 390;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

const LOCAL_BANNERS: BannerItem[] = [
  { id: "1", source: require("../../images/headerImage/banner.png") },
];

const Dashboard = () => {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Header */}
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

      {/* Dashboard Card */}
      <View style={styles.cardContainer}>
        <DashboardCard />
      </View>

      {/* Banner Carousel */}
      <View style={styles.bannerContainer}>
        <BannerCarousel banners={LOCAL_BANNERS} autoPlayInterval={1000} />
      </View>

      {/* Assets Card */}
      <View style={styles.assetContainer}>
        <AssetsCard />
      </View>
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // backgroundColor: "#FFFFFF",ß
  },

  scrollContent: {
    paddingBottom: scale(40),
    minHeight: scale(750),
  },

  // ── Header ──────────────────────────────────────────────────────────────
  headerBlock: {
    marginTop: scale(10),
    marginLeft: scale(15),
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

  // ── Dashboard Card ───────────────────────────────────────────────────────
  cardContainer: {
    marginTop: scale(25),
    alignItems: "center",
  },

  // ── Banner ───────────────────────────────────────────────────────────────
  bannerContainer: {
    marginTop: scale(20),
    marginLeft: scale(12),
  },

  // ── Assets Card ──────────────────────────────────────────────────────────
  assetContainer: {
    marginTop: scale(20),
    marginLeft: scale(13),
  },
});