import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { wp, hp, scaleFont } from '../utils/responcive/responcive'; // adjust path as needed

const AssetsCard = () => {
  return (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        {/* "Asset Class" Label */}
        <Text style={styles.headerText}>Asset Class</Text>

        {/* Dot icon (top-right) */}
        <Image
          source={require('../images/card/dot.png')}
          style={styles.dotIcon}
          resizeMode="contain"
        />
      </View>

      {/* Inner Content Container */}
      <View style={styles.innerContainer}>
        {/* Left: Asset Image */}
        <Image
          source={require("../images/card/asset.png")}
          style={styles.assetImage}
          resizeMode="contain"
        />

        {/* Right: Frame Image */}
        <Image
          source={require("../images/card/frame.png")}
          style={styles.frameImage}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: wp(350),
    height: hp(237),
    borderRadius: wp(25),
    borderWidth: 1,
    borderColor: "#F3F3F3",
    backgroundColor: "#FFFFFF",
    opacity: 1,
    // Shadow (iOS)
    shadowColor: "#EEEEEE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: wp(20),
    // Elevation (Android)
    elevation: 8,
    overflow: "visible",
  },

  headerRow: {
    position: "absolute",
    top: hp(15),
    left: wp(15),
    right: wp(15),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerText: {
    width: wp(100),
    height: hp(19),
    fontFamily: "Urbanist-Bold",
    // fontWeight: "700",
    fontSize: scaleFont(16),
    lineHeight: scaleFont(16),
    letterSpacing: 0,
    color: "#000000",
  },

  dotIcon: {
    width: wp(16),
    height: hp(16),
    opacity: 1,
  },

  innerContainer: {
    position: "absolute",
    top: hp(44),
    left: wp(29),
    width: wp(298),
    height: hp(170),
    flexDirection: "row",
    alignItems: "center",
    gap: wp(38),
    opacity: 1,
  },

  assetImage: {
    width: wp(90),
    height: hp(118),
    opacity: 1,
  },

  frameImage: {
    flex: 1,
    height: hp(118),
    opacity: 1,
  },
});

export default AssetsCard;