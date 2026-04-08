// screens/Dashboard/Dashboard.tsx

import React from "react";
import { useState, useEffect } from "react";
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
import FilterCard from "../../components/filterCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
const BASE_WIDTH = 390;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

const LOCAL_BANNERS: BannerItem[] = [
  { id: "1", source: require("../../images/headerImage/banner.png") },
  { id: "2", source: require("../../images/headerImage/banner.png") },
  { id: "3", source: require("../../images/headerImage/banner.png") },
];

// const USER_NAME = "Bhanu Pratap Singh";

const Dashboard = () => {
  const { colors, mode } = useAppTheme();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    debugger
    const getUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");

        if (userData) {
          const parsedUser = JSON.parse(userData);

          // 👇 yaha check kar structure kya hai
          console.log("USER DATA:", parsedUser);

          setUserName(parsedUser?.username || "");
        }
      } catch (error) {
        console.log("Error fetching user:", error);
      }
    };

    getUser();
  }, []);

  return (
    <View style={[styles.parentContainer, { backgroundColor: mode === "dark" ? "#000000" : "#FFFFFF" }]}>
      <ScrollView
        style={[styles.screen, { backgroundColor: mode === "dark" ? "#000000" : "#FFFFFF" }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header Block ── */}
        <View style={styles.headerBlock}>

          {/* Row 1 — Welcome Back */}
          <View style={styles.welcomeRow}>
            <Text style={[styles.welcomeText, { color: colors.text }]}>
              Welcome Back,
            </Text>
          </View>

          {/* Row 2 — Name (auto-width, capped at screen safe area) */}
          <View style={styles.nameRow}>
            <MaskedView
              style={styles.nameMask}
              maskElement={
                <Text style={styles.nameText} numberOfLines={1}>
                  {userName || "User"}
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

        <View
          style={{ marginTop: scale(20), alignItems: "center", marginBottom :scale(80) }}
        >

          <FilterCard />
        </View>
      </ScrollView>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
  },

  screen: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  // ── Outer header container ──
  // Fixed Figma specs: top=10, left=15, height=73, gap=5
  // Width is NOT fixed — stretches to fit name up to safe right margin
  headerBlock: {
    marginTop: scale(10),
    marginLeft: scale(15),
    // width is intentionally left out — children define it
    maxWidth: SCREEN_WIDTH - scale(30), // 15px padding on each side
    height: scale(73),
    gap: scale(5),
  },

  // ── Welcome Back row (always 211 wide per Figma) ──
  welcomeRow: {
    width: scale(211),
    height: scale(34),
    justifyContent: "center",
  },

  // Change these three style objects:

  welcomeText: {
    fontFamily: "Urbanist-Bold",
    fontWeight: "700",
    fontSize: scale(28),
    lineHeight: scale(34),            // ✅ was scale(28) — increased to match row height
    letterSpacing: scale(28) * -0.02,
    includeFontPadding: false,
  },

  nameText: {
    fontFamily: "Urbanist-Bold",
    fontWeight: "700",
    fontSize: scale(28),
    lineHeight: scale(34),            // ✅ was scale(28) — increased to match row height
    letterSpacing: scale(28) * -0.02,
    includeFontPadding: false,
    color: "#000",
  },


  nameRow: {
    height: scale(38),
    alignSelf: "flex-start",
  },

  nameMask: {
    height: scale(38),
    maxWidth: SCREEN_WIDTH - scale(30),
    alignSelf: "flex-start",
  },

  nameGradient: {
    height: scale(38),
    width: SCREEN_WIDTH - scale(30),
  },

  cardContainer: {
    // marginTop: scale(93),         
    alignItems: "center",
  },

  bannerContainer: {
    marginTop: scale(20),
    marginLeft: scale(9),
  },

  assetContainer: {
    marginTop: scale(20),
    marginLeft: scale(13),
  },
});