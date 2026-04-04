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
import { useAppTheme } from "../hooks/useTheme";


const CustomTabBar: React.FC<BottomTabBarProps> = ({ navigation, state }) => {
  const { mode } = useAppTheme();

  const pillBg      = mode === "dark" ? "#1E1E1E" : "#FFFFFF";
  const iconTint    = mode === "dark" ? "#CCCCCC" : undefined;
  const labelColor  = mode === "dark" ? "#CCCCCC" : "#A2A2A2";
  const borderColor = mode === "dark" ? "#000000" : "#FFFFFF";

  return (
    <View style={styles.container}>

      {/* INNER CONTAINER */}
      <View style={[styles.innerContainer, { backgroundColor: pillBg }]}>

        {TAB_CONFIG.map((tab, index) => {

          // ✅ CENTER BUTTON
          if (tab.center) {
            return (
              <View key={tab.key} style={styles.centerWrapper}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate("center")}
                >
                  <LinearGradient
                    colors={["#527EFF", "#3366FF"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={[styles.centerButton, { borderColor }]}
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

          const isFocused = state.index === index;

          // ✅ NORMAL TAB
          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(tab.key as never)}
            >
              <Image
                source={tab.icon}
                style={[styles.icon, iconTint ? { tintColor: isFocused ? "#527EFF" : iconTint } : undefined]}
                resizeMode="contain"
              />
              <Text style={[styles.label, { color: isFocused ? "#527EFF" : labelColor }]}>
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
//  container: {
//   width: wp(367),
//   height: hp(58),
//   alignSelf: "center",
//   justifyContent: "center",
//   alignItems: "center",
//   backgroundColor: 'transparent',
//   marginBottom: hp(24)
// },

container: {
  position: "absolute",
  bottom: hp(30), 
  alignSelf: "center",

  width: wp(367),
  height: hp(58),

  justifyContent: "center",
  alignItems: "center",

  backgroundColor: "transparent",
},


  // inner container (358 x 71, radius 50)
  innerContainer: {
    width: wp(358),
    height: hp(71),
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 6,

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