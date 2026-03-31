// src/components/CustomTabBar.tsx

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

      {/* INNER CONTAINER */}
      <View style={styles.innerContainer}>

        {TAB_CONFIG.map((tab) => {

          // ✅ CENTER BUTTON
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


          // ✅ NORMAL TAB
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



// ================= STYLES =================

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


  // center wrapper
  centerWrapper: {
    width: wp(68.6),
    height: hp(70),

    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: hp(30),
  },


  // circle button
  centerButton: {
    width: wp(58),
    height: wp(58),

    borderRadius: 100,
    borderWidth: wp(4),
    borderColor: "#fff",

    padding: wp(14),

    justifyContent: "center",
    alignItems: "center",
  },


  // center icon
  centerIcon: {
    width: wp(30),
    height: hp(30),
  },

});