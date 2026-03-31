import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

import { TAB_CONFIG } from "../utils/tab/tabConfig";
import { wp, hp } from "../utils/responcive/responcive";


const CustomTabBar: React.FC<BottomTabBarProps> = ({
  navigation,
}) => {
  return (
    <View style={styles.container}>

      <View style={styles.innerContainer}>

        {TAB_CONFIG.map((tab) => {

          if (tab.center) {
            return (
              <View key={tab.key} style={styles.centerWrapper}>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.navigate("center")
                  }
                >
                  <LinearGradient
                    colors={["#527EFF", "#3366FF"]}
                    locations={[0, 1]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.centerButton}
                  >
                    <Image
                      source={tab.icon}
                      style={styles.centerIcon}
                      resizeMode="contain"
                    />
                  </LinearGradient>
                </TouchableOpacity>

              </View>
            );
          }

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate(
                  tab.key as never
                )
              }
            >
              <Image
                source={tab.icon}
                style={styles.icon}
                resizeMode="contain"
              />

              <Text style={styles.label}>
                {tab.label}
              </Text>

            </TouchableOpacity>
          );
        })}

      </View>

    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({

  // outer container
  container: {
    width: wp(367),
    height: hp(58),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(30)
  },


  // inner container (358 x 71, radius 50)
  innerContainer: {
    width: wp(358),
    height: hp(71),
    borderRadius: 50,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    paddingHorizontal: wp(12),

    backgroundColor: "#ffffff",
  },


  // normal tab
  tab: {
    width: wp(68.6),
    height: hp(45),
    alignItems: "center",
    justifyContent: "center",
    gap: hp(6),
  },


  // icon 24x24
  icon: {
    width: wp(24),
    height: hp(24),
  },


  // label
  label: {
    width: wp(70),
    height: hp(15),

    fontFamily: "Urbanist-SemiBold",
    fontSize: hp(12),
    color : '#A2A2A2',
    lineHeight: hp(12) * 1.25,
    letterSpacing: hp(12) * 0.02,

    textAlign: "center",
  },


  // center wrapper — Figma: 68.6 x 70, paddingBottom: 18
  centerWrapper: {
    width: wp(68.6),
    height: hp(70),
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: hp(18),
  },

  // circle button — Figma: 58 x 58, borderRadius: 100, border: 4px white
  centerButton: {
    width: wp(60),
    height: wp(60),
    borderRadius: wp(60) / 2,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom :10
  },


  // center icon — Figma Vector: 27.5 x 25, top: 1.25, left: 2.5, color: #FFFFFF
  centerIcon: {
    width: wp(27.5),
    height: wp(25),
    marginTop: - 5,
    marginLeft: - 5,
    tintColor: "#FFFFFF",
  },

});