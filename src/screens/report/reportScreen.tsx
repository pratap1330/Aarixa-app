import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { wp, hp } from "../../utils/responcive/responcive";
import { useAppTheme } from "../../hooks/useTheme";

const ReportsScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useAppTheme();

  const [selected, setSelected] = useState("Portfolio Valuation");

  const tabs = [
    "Portfolio Valuation",
    "Portfolio Summary",
    "Assets Allocation",
    "Transaction Reports",
    "Capital Gain",
    "Dividend Report",
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backContainer}
        >
          <Image
            source={require("../../images/loginImage/back_arrow.png")}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.text }]}>
          Reports
        </Text>

        <View style={{ width: wp(41) }} />
      </View>

      {/* Scrollable Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.chipContainer}
        >
          {tabs.map((item, index) => {
            const isActive = selected === item;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => setSelected(item)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isActive
                      ? colors.primary
                      : colors.card,
                    borderColor: isActive
                      ? colors.primary
                      : colors.text + "20",
                  },
                  item === "Portfolio Summary" && !isActive && styles.yellowBorder,
                  item === "Assets Allocation" && !isActive && styles.purpleBorder,
                  item === "Transaction Reports" &&
                    isActive &&
                    styles.pinkActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: isActive ? "#fff" : colors.text },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={[styles.text, { color: colors.text }]}>
          Selected: {selected}
        </Text>
      </View>
    </View>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    height: hp(61),
    marginTop: hp(59),
    paddingHorizontal: wp(10),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backContainer: {
    width: wp(41),
    height: wp(41),
    justifyContent: "center",
    alignItems: "center",
  },

  backIcon: {
    width: wp(19),
    height: wp(19),
  },

  title: {
    fontSize: wp(24),
    fontFamily: "Urbanist-SemiBold",
  },

  // 🔥 IMPORTANT FIX
  tabsWrapper: {
    height: hp(50),
  },

  chipContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(16),
  },

  chip: {
    height: hp(30),
    paddingHorizontal: wp(15),
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    marginRight: wp(8), // 🔥 replaces gap
  },

  chipText: {
    fontSize: wp(12),
    fontFamily: "Urbanist-Medium",
  },

  yellowBorder: {
    borderColor: "#E6A928",
  },

  purpleBorder: {
    borderColor: "#8657D9",
  },

  pinkActive: {
    backgroundColor: "#E75480",
    borderColor: "#E75480",
  },

  body: {
    flex: 1,
    padding: wp(16),
  },

  text: {
    fontSize: wp(16),
    fontFamily: "Urbanist-Medium",
  },
});