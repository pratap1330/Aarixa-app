import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { wp, hp } from "../utils/responcive/responcive";

interface DashboardCardProps {
  currentValue?: string;
  investedValue?: string;
  unrealisedGain?: string;
  xirr?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  currentValue = "₹14,12,780",
  investedValue = "₹10,00,000",
  unrealisedGain = "+ ₹4,12,780",
  xirr = "14.05%",
}) => {
  return (
    <View style={styles.outerCard}>
      {/* Top Section — Current Value & Invested Value */}
      <View style={styles.topCard}>
        {/* Current Value */}
        <View style={styles.valueBlock}>
          <Text style={styles.label}>Current Value</Text>
          <Text style={styles.amount}>{currentValue}</Text>
        </View>

        {/* Invested Value */}
        <View style={styles.valueBlock}>
          <Text style={styles.label}>Invested Value</Text>
          <Text style={styles.amount}>{investedValue}</Text>
        </View>
        
      </View>

      {/* Horizontal Divider */}
      <View style={styles.horizontalDivider} />

      {/* Bottom Section — Unrealised Gain & XIRR */}
      <View style={styles.bottomSection}>
        <View style={styles.valueBlock}>
          <Text style={styles.labelBottom}>Unrealised Gain</Text>
          <Text style={styles.gainAmount}>{unrealisedGain}</Text>
        </View>

        <View style={styles.valueBlock}>
          <Text style={styles.labelBottom}>XIRR</Text>
          <Text style={styles.xirrAmount}>{xirr}</Text>
        </View>
      </View>
    </View>
  );
};

export default DashboardCard;

const styles = StyleSheet.create({
  outerCard: {
    width: wp(358),
    height: hp(180),
    borderRadius: wp(30),
    backgroundColor: "#152C5B",
    alignSelf: "center",
    shadowColor: "#EEEEEE",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.93,
    shadowRadius: 20,
    elevation: 8,
    overflow: "hidden",
  },

  topCard: {
    width: wp(358),
    height: hp(103),
    borderRadius: wp(25),
    backgroundColor: "#3A6FF8",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(27),
    justifyContent: "space-between",
  },

  valueBlock: {
    gap: hp(6),
  },

  label: {
    fontFamily: "Urbanist-SemiBold",
    fontWeight: "600",
    fontSize: wp(16),
    lineHeight: wp(16),
    color: "#FFFFFF",
  },

  amount: {
    fontFamily: "Urbanist-Bold",
    fontWeight: "700",
    fontSize: wp(18),
    color: "#FFFFFF",
  },

  verticalDivider: {
    width: 1,
    height: hp(50),
    backgroundColor: "rgba(255,255,255,0.3)",
  },

  horizontalDivider: {
    alignSelf: "center",
    width: wp(40),
    height: hp(3),
    borderRadius: hp(2),
    backgroundColor: "rgba(255,255,255,0.4)",
    marginVertical: hp(4),
  },

  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: wp(27),
    paddingTop: hp(4),
  },

  labelBottom: {
    fontFamily: "Urbanist",
    fontWeight: "600",
    fontSize: wp(14),
    color: "rgba(255,255,255,0.7)",
    marginBottom: hp(4),
  },

  gainAmount: {
    fontFamily: "Urbanist",
    fontWeight: "700",
    fontSize: wp(16),
    color: "#4ADE80",
  },

  xirrAmount: {
    fontFamily: "Urbanist",
    fontWeight: "700",
    fontSize: wp(16),
    color: "#FFFFFF",
  },
});
