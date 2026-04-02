import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { wp, hp } from "../utils/responcive/responcive";
import { useGet } from "../hooks/useGet";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTheme } from "../hooks/useTheme";

const formatNumber = (num: number = 0) => {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(num);
};

const DashboardCard: React.FC = () => {
  const { mode } = useAppTheme();
const [cid, setCid] = useState<string | null>(null);

 useEffect(() => {
  const getData = async () => {
    const storedId = await AsyncStorage.getItem("uniqueId");

    if (!storedId) return;

    setCid(storedId);
  };

  getData();
}, []);

  const { data, loading, error } = useGet(
    cid ? "/api/investor/getInvestorData" : null,
    cid
      ? {
          cid: cid,
          levelNo: 98,
        }
      : null
  );

  if (cid === null || loading) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  if (error) {
    return <Text style={{ color: "red", textAlign: "center" }}>Error loading data</Text>;
  }

  const investor = data?.status === 0 ? data?.result?.[0] : null;

  const currentValue = `₹${formatNumber(investor?.investorCurrentValue)}`;
  const investedValue = `₹${formatNumber(investor?.investorInvestedValue)}`;
  const gainValue = investor?.investorGain || 0;

  const unrealisedGain = `${gainValue >= 0 ? "+" : "-"} ₹${formatNumber(
    Math.abs(gainValue)
  )}`;

  const xirr = `${investor?.investorXirr?.toFixed(2) || "0.00"}%`;

  return (
    <View style={styles.outerCard}>

      <View style={styles.topCard}>
        <View style={styles.valueBlock}>
          <Text style={styles.label}>Current Value</Text>
          <Text style={styles.amount}>{currentValue}</Text>
        </View>

        <View style={styles.valueBlock}>
          <Text style={styles.label}>Invested Value</Text>
          <Text style={styles.amount}>{investedValue}</Text>
        </View>

        <View style={styles.horizontalDivider} />
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.valueBlock}>
          <Text style={styles.labelBottom}>Unrealised Gain</Text>
          <Text
            style={[
              styles.gainAmount,
              { color: gainValue >= 0 ? "#00E676" : "#FF4D4F" },
            ]}
          >
            {unrealisedGain}
          </Text>
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
    marginTop: 10,
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

  horizontalDivider: {
    position: "absolute",
    bottom: hp(6),
    alignSelf: "center",
    left: wp(155),
    width: wp(50),
    height: 0,
    borderWidth: 1.9,
    borderColor: "#FFF7F7",
    borderRadius: 2,
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
    fontFamily: "Urbanist-SemiBold",
    fontWeight: "700",
    fontSize: wp(16),
  },

  xirrAmount: {
    fontFamily: "Urbanist-Medium",
    fontWeight: "700",
    fontSize: wp(16),
    color: "#FFFFFF",
  },
});