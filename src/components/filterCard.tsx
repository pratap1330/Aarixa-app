import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { useAppTheme } from "../hooks/useTheme";

const BASE_WIDTH = 390;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const scale = (size: number) => (SCREEN_WIDTH / BASE_WIDTH) * size;

const FILTERS = ["Equity Funds", "Debt Funds", "Hybrid Funds"];

const FilterCard = () => {
  const { colors, mode } = useAppTheme();
  const [active, setActive] = useState("Equity Funds");

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        
        {/* FILTER BUTTON */}
        <TouchableOpacity
          style={[
            styles.filterBtn,
            {
              backgroundColor: mode === "dark" ? "#1E1E1E" : "#FFFFFF",
            },
          ]}
        >
          <Image
            source={
              mode === "dark"
                ? require("../images/dashboard/filter_dark.png")
                : require("../images/dashboard/filter.png")
            }
            style={styles.icon}
          />
          <Text style={[styles.filterText, { color: colors.text }]}>
            Filters
          </Text>
        </TouchableOpacity>

        {/* SCROLLABLE CHIPS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.chipsWrapper}
        >
          {FILTERS.map((item) => {
            const isActive = active === item;

            return (
              <TouchableOpacity
                key={item}
                onPress={() => setActive(item)}
                style={[
                  styles.chip,
                  isActive ? styles.activeChip : styles.inactiveChip,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: isActive ? "#000" : colors.text },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default FilterCard;

const styles = StyleSheet.create({
  /* ✅ OUTER WRAPPER - handles bottom spacing only */
  wrapper: {
    marginBottom: scale(16),    // ✅ BOTTOM GAP
  },

  /* MAIN CONTAINER - handles left/right padding */
  container: {
    width: "100%",
    height: scale(45),
    paddingLeft: scale(16),     // ✅ LEFT GAP (16px)
    paddingRight: scale(16),    // ✅ RIGHT GAP (16px)
    flexDirection: "row",
    alignItems: "center",
  },

  /* FILTER BUTTON */
  filterBtn: {
        width: scale(70),
    height: scale(30),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(6),
    borderRadius: scale(50),

    shadowColor: "#EEEEEE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },

  icon: {
    width: scale(16),
    height: scale(16),
    resizeMode: "contain",
  },

  filterText: {
    fontFamily: "Urbanist-SemiBold",
    fontWeight: "600",
    fontSize: scale(12),
    letterSpacing: -0.3,
  },

  /* SCROLL VIEW */
  scrollView: {
    flex: 1,
    marginLeft: scale(8),
  },

  /* CHIPS WRAPPER - ✅ proper padding ensures "Hybrid" stays visible */
  chipsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: scale(16),    // ✅ RIGHT padding matches container (16px total)
    // gap: scale(4),
  },

  /* CHIP */
  chip: {
    height: scale(30),
    paddingHorizontal: scale(14),
    borderRadius: scale(50),
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,              // ✅ prevents compression
  },

  activeChip: {
    backgroundColor: "#FFDD6D",
  },

  inactiveChip: {
    backgroundColor: "#EDEDED",
  },

  chipText: {
    fontFamily: "Urbanist-SemiBold",
    fontWeight: "600",
    fontSize: scale(12),
    letterSpacing: -0.3,
  },
});