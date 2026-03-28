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
import { useAppTheme } from "../../hooks/useTheme";

const BASE_WIDTH = 390;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

const LOCAL_BANNERS: BannerItem[] = [
  { id: "1", source: require("../../images/headerImage/banner.png") },
];

const Dashboard = () => {
  const { colors, mode } = useAppTheme();

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerBlock}>
        <Text style={[styles.welcomeText, { color: colors.text }]}>
          Welcome back
        </Text>

        <MaskedView
          style={styles.nameMask}
          maskElement={
            <Text style={[styles.nameText, { color: colors.text }]}>
              Priyanka Sharma
            </Text>
          }
        >
          <LinearGradient
            colors={
              mode === "dark"
                ? ["#6A8DFF", "#3B5BDB"]   
                : ["#527EFF", "#3366FF"] 
            }
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.nameGradient}
          />
        </MaskedView>
      </View>

      {/* Main Card */}
      <View style={styles.cardContainer}>
        <DashboardCard />
      </View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <BannerCarousel banners={LOCAL_BANNERS} autoPlayInterval={3000} />
      </View>

      {/* Assets */}
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
  },

  scrollContent: {
    paddingBottom: scale(40),
    minHeight: scale(750),
  },

  headerBlock: {
    marginTop: scale(10),
    marginLeft: scale(15),
    width: scale(211),
    height: scale(73),
    gap: scale(5),
  },

  welcomeText: {
    fontFamily: "Urbanist-Bold",
    fontWeight: "700",
    fontSize: scale(28),
    lineHeight: scale(28),
    letterSpacing: scale(28) * -0.02,
    includeFontPadding: false,
  },

  nameMask: {
    width: scale(211),
    height: scale(34),
  },

  nameText: {
    fontFamily: "Urbanist-Bold",
    fontWeight: "700",
    fontSize: scale(28),
    lineHeight: scale(28),
    letterSpacing: scale(28) * -0.02,
    textAlign: "center",
    includeFontPadding: false,
  },

  nameGradient: {
    width: scale(211),
    height: scale(34),
  },

  cardContainer: {
    marginTop: scale(25),
    alignItems: "center",
  },

  bannerContainer: {
    marginTop: scale(20),
    marginLeft: scale(12),
  },

  assetContainer: {
    marginTop: scale(20),
    marginLeft: scale(13),
  },
});