import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { useAppTheme } from "../../../hooks/useTheme";
import { wp, hp, scaleFont } from "../../../utils/responcive/responcive";
import { useNavigation } from "@react-navigation/native";

// Mock Data for SIP/STP
const SIP_DATA = [
  {
    id: "1",
    schemeName: "SBI Equity Hybrid Fund - Direct Growth",
    amount: "₹5,000",
    frequency: "Monthly",
    nextDate: "15 Feb 2025",
    type: "SIP",
    status: "Active",
  },
  {
    id: "2",
    schemeName: "HDFC Mid-Cap Opportunities - Direct",
    amount: "₹2,500",
    frequency: "Monthly",
    nextDate: "10 Feb 2025",
    type: "STP",
    status: "Active",
  },
];

const SipDetailsScreen = () => {
  const { colors, mode } = useAppTheme();
  const navigation = useNavigation();

  const isDark = mode === "dark";

  const renderSipCard = ({ item }: { item: typeof SIP_DATA[0] }) => (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.schemeName, { color: colors.text }]} numberOfLines={1}>
          {item.schemeName}
        </Text>
        <View style={[styles.typeBadge, { backgroundColor: colors.primary + "20" }]}>
          <Text style={[styles.typeText, { color: colors.primary }]}>{item.type}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.cardBody}>
        <View style={styles.infoCol}>
          <Text style={styles.label}>Amount</Text>
          <Text style={[styles.value, { color: colors.text }]}>{item.amount}</Text>
        </View>
        <View style={styles.infoCol}>
          <Text style={styles.label}>Frequency</Text>
          <Text style={[styles.value, { color: colors.text }]}>{item.frequency}</Text>
        </View>
        <View style={styles.infoCol}>
          <Text style={styles.label}>Next Date</Text>
          <Text style={[styles.value, { color: colors.text }]}>{item.nextDate}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={isDark ? "#000000" : "#FAFAFA"}
      />

      {/* --- HEADER --- */}
      <View style={[styles.header, { backgroundColor: isDark ? "#000000" : "#FAFAFA" }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backBtn}
        onPress={() => navigation.goBack()}
          >
            <Image
              source={require("../../../images/loginImage/back_arrow.png")}
              style={[styles.backIcon, { tintColor: colors.text }]}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            SIP/STP Details
          </Text>
        </View>
      </View>

      {/* --- CONTENT --- */}
      <View style={[styles.body, { backgroundColor: colors.background }]}>
        <FlatList
          data={SIP_DATA}
          keyExtractor={(item) => item.id}
          renderItem={renderSipCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No SIP/STP records found.
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default SipDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: wp(390),
    height: hp(119),
    justifyContent: "flex-end", // Aligns content to the bottom of the 119px height
  },
  headerContent: {
    width: wp(390),
    height: hp(61),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(10),
    gap: wp(10),
    marginBottom: hp(10),
  },
  backBtn: {
    width: wp(41),
    height: wp(41),
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    width: wp(19),
    height: hp(19),
  },
  headerTitle: {
    fontFamily: "Urbanist",
    fontWeight: "600",
    fontSize: scaleFont(24),
    letterSpacing: 0.37,
    lineHeight: hp(41),
  },
  body: {
    flex: 1,
    width: wp(390),
  },
  listContainer: {
    padding: wp(20),
    paddingTop: hp(20),
  },
  card: {
    borderRadius: 12,
    padding: wp(16),
    marginBottom: hp(16),
    // Shadow for Light Mode
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(12),
  },
  schemeName: {
    flex: 1,
    fontFamily: "Urbanist",
    fontWeight: "700",
    fontSize: scaleFont(16),
    marginRight: wp(10),
  },
  typeBadge: {
    paddingHorizontal: wp(8),
    paddingVertical: hp(4),
    borderRadius: 6,
  },
  typeText: {
    fontFamily: "Urbanist",
    fontWeight: "700",
    fontSize: scaleFont(12),
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(150,150,150,0.1)",
    marginBottom: hp(12),
  },
  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoCol: {
    flex: 1,
  },
  label: {
    fontFamily: "Urbanist",
    fontSize: scaleFont(12),
    color: "#888888",
    marginBottom: hp(4),
  },
  value: {
    fontFamily: "Urbanist",
    fontWeight: "600",
    fontSize: scaleFont(14),
  },
  emptyText: {
    textAlign: "center",
    marginTop: hp(50),
    fontFamily: "Urbanist",
    fontSize: scaleFont(16),
    opacity: 0.6,
  },
});