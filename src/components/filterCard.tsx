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
    <View style={styles.outerContainer}>
      {/* ── FILTER ROW ── */}
      {/* Figma: width:356, height:45, left:16, justify-content:space-between */}
      <View style={styles.filterRow}>

        {/* Filter Button — Figma: width:83, height:30, border-radius:50, shadow:0 0 20 #EEEEEE */}
        <TouchableOpacity
          style={[
            styles.filterBtn,
            { backgroundColor: mode === "dark" ? "#1E1E1E" : "#FFFFFF" },
          ]}
        >
          <Image
            source={
              mode === "dark"
                ? require("../images/dashboard/filter_dark.png")
                : require("../images/dashboard/filter.png")
            }
            style={styles.filterIcon}
          />
          <Text style={[styles.filterText, { color: colors.text }]}>
            Filters
          </Text>
        </TouchableOpacity>

        {/* Chips — gap:10 between each chip */}
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
                    { color: "#434343" },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── FUND CARD ── */}
      <View
        style={[
          styles.fundCard,
          { backgroundColor: mode === "dark" ? "#1E1E1E" : "#FFFFFF" },
        ]}
      >
        {/* Header: logo + name + dots */}
        <View style={styles.cardHeader}>
          <View style={styles.logoCircle}>
            <Image
              source={require("../images/dashboard/sbi.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <Text
            style={[styles.fundName, { color: colors.text }]}
            numberOfLines={2}
          >
            SBI Equity - Hybrid Fund -{"\n"}Direct Growth
          </Text>

          <TouchableOpacity style={styles.dotsBtn}>
            <Image
              source={require("../images/card/dot.png")}
              style={styles.dotIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Account number + tags */}
        <View style={styles.tagsRow}>
          <Text style={[styles.accountNum, { color: colors.text }]}>
            (1234567789)
          </Text>
          <View style={styles.tag}>
            <View style={styles.greenDot} />
            <Text style={styles.tagText}>Direct Plan- Growth</Text>
          </View>
          <View style={styles.tag}>
            <View style={styles.greenDot} />
            <Text style={styles.tagText}>Hybrid</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Current Value + Invested Value */}
        <View style={styles.valuesRow}>
          <View style={styles.valueCol}>
            <Text style={styles.valueLabel}>Current Value</Text>
            <Text style={[styles.valueAmount, { color: colors.text }]}>
              ₹14,12,780
            </Text>
          </View>
          <View style={styles.valueCol}>
            <Text style={styles.valueLabel}>Invested Value</Text>
            <Text style={[styles.valueAmount, { color: colors.text }]}>
              ₹10,00,000
            </Text>
          </View>
        </View>

        {/* Unrealised Gain + Today's Gain/Loss */}
        <View style={styles.valuesRow}>
          <View style={styles.valueCol}>
            <Text style={styles.valueLabel}>Unrealised Gain</Text>
            <Text style={styles.gainText}>+ ₹4,12,780</Text>
          </View>
          <View style={styles.valueCol}>
            <Text style={styles.valueLabel}>Today's Gain/Loss</Text>
            <Text style={styles.lossText}>- ₹ 780</Text>
          </View>
        </View>

        {/* Units + View Transactions */}
        <View style={styles.valuesRow}>
          <View style={styles.valueCol}>
            <Text style={styles.valueLabel}>Units</Text>
            <Text style={[styles.valueAmount, { color: colors.text }]}>
              43.173
            </Text>
          </View>
          <TouchableOpacity style={styles.viewTxnBtn}>
            <Text style={styles.viewTxnText}>View Transactions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FilterCard;

const styles = StyleSheet.create({
  /* ── OUTER CONTAINER — Figma: width:356, left:16 ── */
  outerContainer: {
    width: scale(356),
    marginLeft: scale(1),
    marginBottom: scale(16),
  },

  /* ── FILTER ROW — Figma: width:356, height:45, justify-content:space-between ── */
  filterRow: {
    width: scale(356),
    height: scale(45),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: scale(8),
  },

  /* Filter Button — Figma: width:83, height:30, border-radius:50, shadow: 0 0 20px #EEEEEE */
  filterBtn: {
    width: scale(83),
    height: scale(30),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(10),
    borderRadius: scale(50),
    shadowColor: "#EEEEEE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: scale(20),
    elevation: 5,
  },

  filterIcon: {
    width: scale(16),
    height: scale(16),
    resizeMode: "contain",
  },

  filterText: {
    fontFamily: "Urbanist-SemiBold",
    fontWeight: "600",
    fontSize: scale(12),
    letterSpacing: -0.3,
    color: "#434343",
  },

  scrollView: {
    flex: 1,
    marginLeft: scale(10),
  },

  chipsWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
  },

  chip: {
    height: scale(30),
    paddingHorizontal: scale(14),
    borderRadius: scale(50),
    justifyContent: "center",
    alignItems: "center",
  },

  activeChip: {
    minWidth: scale(83),
    backgroundColor: "#FFDD6D",
  },

  inactiveChip: {
    minWidth: scale(76),
    backgroundColor: "#EDEDED",
  },

  chipText: {
    fontFamily: "Urbanist-SemiBold",
    fontWeight: "600",
    fontSize: scale(12),
    lineHeight: scale(12),
    letterSpacing: -0.24,
    textAlign: "center",
    color: "#434343",
  },

  /* ── FUND CARD ── */
  fundCard: {
    flex: 1,
    borderRadius: scale(16),
    paddingHorizontal: scale(16),
    paddingVertical: scale(14),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
    marginBottom: scale(10),
  },

  logoCircle: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: "#2D2580",
    justifyContent: "center",
    alignItems: "center",
  },

  logoText: {
    fontFamily: "Urbanist-Bold",
    fontWeight: "700",
    fontSize: scale(11),
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  fundName: {
    flex: 1,
    fontFamily: "Urbanist-Bold",
    fontWeight: "700",
    fontSize: scale(14),
    lineHeight: scale(19),
    letterSpacing: -0.2,
  },

  dotsBtn: {
    padding: scale(4),
  },

  dotIcon: {
    width: scale(4),
    height: scale(16),
    resizeMode: "contain",
  },

  tagsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(6),
    flexWrap: "nowrap",
    marginBottom: scale(10),
  },

  accountNum: {
    fontFamily: "Urbanist-SemiBold",
    fontWeight: "600",
    fontSize: scale(11),
    letterSpacing: -0.2,
  },

  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
    paddingHorizontal: scale(8),
    paddingVertical: scale(4),
    borderRadius: scale(20),
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  greenDot: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    backgroundColor: "#4CAF50",
  },

  tagText: {
    fontFamily: "Urbanist-SemiBold",
    fontWeight: "600",
    fontSize: scale(10),
    color: "#333333",
    letterSpacing: -0.2,
  },

  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginBottom: scale(10),
  },

  valuesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: scale(8),
  },

  valueCol: {
    gap: scale(2),
  },

  valueLabel: {
    fontFamily: "Urbanist-SemiBold",
    fontWeight: "600",
    fontSize: scale(12),
    color: "#9E9E9E",
    letterSpacing: -0.2,
  },

  valueAmount: {
    fontFamily: "Urbanist-Bold",
    fontWeight: "700",
    fontSize: scale(14),
    letterSpacing: -0.3,
  },

  gainText: {
    fontFamily: "Urbanist-Bold",
    fontWeight: "700",
    fontSize: scale(14),
    color: "#2E7D32",
    letterSpacing: -0.3,
  },

  lossText: {
    fontFamily: "Urbanist-Bold",
    fontWeight: "700",
    fontSize: scale(14),
    color: "#C62828",
    letterSpacing: -0.3,
  },

  viewTxnBtn: {
    alignSelf: "flex-end",
  },

  logoImage: {
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
  },

  viewTxnText: {
    fontFamily: "Urbanist-SemiBold",
    fontWeight: "600",
    fontSize: scale(13),
    color: "#3A6FF8",
    textDecorationLine: "underline",
    letterSpacing: -0.2,
  },
});