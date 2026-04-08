

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";
import { wp, hp } from "../../utils/responcive/responcive";
import { useAppTheme } from "../../hooks/useTheme";
import { toggleTheme } from "../../redux/slices/themeSlice";
import User from "../../images/setting/user.svg";
import Onboarding from '../../images/setting/onboarding.svg';
import News from '../../images/setting/whatsnews.svg';
import Sip from '../../images/setting/Sip.svg';
import Wallet from '../../images/setting/Wallet.svg';
import Reports from '../../images/setting/Reports.svg';
import News1 from '../../images/setting/News1.svg';
import Support from '../../images/setting/Support.svg';
import Login from '../../images/setting/Login.svg';
import Logout from '../../images/setting/Logout.svg'; 
import Arrow from '../../images/setting/arrow.svg';

// ─── Types ────────────────────────────────────────────────────────────────────
interface RowItem {
  label: string;
  icon: React.FC<any>
  onPress?: () => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Chevron arrow on the right side of every row */
// const ArrowIcon = () => {
//   const { mode } = useAppTheme();
//   return (
//     <Image
//       source={require("../../images/setting/arrow.png")}
//       style={[styles.arrow, { tintColor: mode === "dark" ? "#FFFFFF80" : "#0000009f" }]}
//       resizeMode="contain"
//     />
//   );
// };


const ArrowIcon = () => {
  const { mode } = useAppTheme();
  
  return (
    <Arrow
      style = {styles.arrow}  
      fill={mode === "dark" ? "#ede0e0" : "#0000009f"} 
    />
  );
};

/** Generic tappable row with left icon + label + right arrow */
const SettingsRow = ({ label, icon: Icon, onPress }: RowItem) => {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.row}
      onPress={onPress}
    >
      {/* Left icon - Using the exact same View style */}
      <View style={styles.iconCircle}>
        {/* 
          Instead of <Image source={icon} />, we use <Icon /> 
          We apply your exact 'styles.rowIcon' here.
        */}
        <Icon style={styles.rowIcon} />
      </View>

      {/* Label - Same style */}
      <Text style={[styles.rowLabel, { color: colors.text }]} numberOfLines={1}>
        {label}
      </Text>

      {/* Right arrow - Same style */}
      <View style={styles.arrowWrap}>
        <ArrowIcon />
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const { colors, mode } = useAppTheme();
  const dispatch = useDispatch();
  const nightMode = mode === "dark";


//   const navigation = useNavigation<any>();

const handleLogout = async () => {
  try {
    // 🔥 confirmation (optional but best UX)
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          // ✅ remove specific keys
          await AsyncStorage.removeItem("cid");
          await AsyncStorage.removeItem("user");

          // 🚀 reset navigation (important)
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  } catch (error) {
    console.log("Logout Error:", error);
  }
};

  const cardBg    = mode === "dark" ? "#1E1E1E" : "#FFFFFF";
  const sepColor  = mode === "dark" ? "#FFFFFF18" : "#3C3C4329";

  // Rows for the second card (all simple nav rows)
  const navRows: RowItem[] = [
    {
      label: "Onboarding",
      icon: Onboarding,
      onPress: () => navigation.navigate("Onboarding 1"),
    },
    {
      label: "What's New",
      icon: News,
    },
    {
      label: "SIP/STP Details",
      icon: Sip,
    onPress: () => navigation.navigate("SipDetailsScreen"),
    },
    {
      label: "Wallet",
      icon: Wallet,
    },
    {
      label: "Reports",
      icon: Reports,
      onPress: () => navigation.navigate("reports"),
    },
    {
      label: "News",
      icon: News1,
    },
    {
      label: "Customer Support",
      icon: Support,
    },
    {
      label: "Login Details",
      icon: Login,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backContainer}
          activeOpacity={0.7}
        >
          <Image
            source={require("../../images/loginImage/back_arrow.png")}
            style={[styles.backIcon, mode === "dark" && { tintColor: "#FFFFFF" }]}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

        {/* Spacer to keep title centred */}
        <View style={{ width: wp(41) }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Card 1 – My Profile ── */}
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          {/* Single row: My Profile */}
          <TouchableOpacity activeOpacity={0.7} style={styles.profileRow}>
            {/* Left icon */}
            <View style={styles.iconCircle}>
              {/* <Image
                source={require("../../images/headerImage/user.png")}
                style={styles.rowIcon}
                resizeMode="contain"
              /> */}
              <User
                 style={styles.rowIcon}
            
              />

            </View>

            {/* Label */}
            <Text style={[styles.profileLabel, { color: colors.text }]} numberOfLines={1}>
              My Profile
            </Text>

            {/* Right arrow */}
            <View style={styles.arrowWrap1}>
              <ArrowIcon />
            </View>
          </TouchableOpacity>
        </View>

       
        <View style={[styles.card, styles.cardTall, { backgroundColor: cardBg }]}>
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              {/* <Image
                source={require("../../images/setting/darkmode.png")}
                style={styles.rowIcon}
                resizeMode="contain"
              /> */}
            </View>

            {/* <Text style={[styles.rowLabel, { color: colors.text }]} numberOfLines={1}>
              Night Mode
            </Text> */}

            {/* <View style={styles.toggleWrap}>
              <Image
                source={require("../../images/setting/Background.png")}
                style={styles.toggleBg}
                resizeMode="contain"
              />
              <Image
                source={require("../../images/setting/Knob.png")}
                style={[
                  styles.toggleKnob,
                  nightMode ? styles.knobOn : styles.knobOff,
                ]}
                resizeMode="contain"
              />
              <TouchableOpacity
                activeOpacity={0.8}
                style={StyleSheet.absoluteFillObject}
                onPress={() => dispatch(toggleTheme())}
              />
            </View> */}
          </View>

          <View style={[styles.separator, { backgroundColor: sepColor }]} />

          {navRows.map((item, idx) => (
            <React.Fragment key={item.label}>
              <SettingsRow {...item} />
              {idx < navRows.length - 1 && <View style={[styles.separator, { backgroundColor: sepColor }]} />}
            </React.Fragment>
          ))}
        </View>

        {/* ── Logout Card ── */}
        <View style={[styles.logoutCard, { backgroundColor: cardBg }]}>
          <TouchableOpacity activeOpacity={0.7} style={styles.logoutRow}
           onPress={handleLogout}>
            {/* Icon */}
            <View style={styles.iconCircle}>
           
              <Logout
                 style={styles.rowIcon} 
                 />
            </View>

            {/* Label */}
            <Text style={[styles.logoutLabel, { color: colors.text }]} numberOfLines={1}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // ── Header
  header: {
    width: wp(390),
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
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    width: wp(19),
    height: wp(19),
  },
  title: {
    fontSize: wp(24),
    fontFamily: "Urbanist-SemiBold",
    letterSpacing: 0.37,
  },

  // ── Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: wp(14),
    paddingTop: hp(12),
    paddingBottom: hp(32),
    gap: hp(12),
  },

  // ── Cards
  card: {
    width: wp(350),
    borderRadius: 100,
    backgroundColor: "#FFFFFF",
    paddingLeft: wp(16),
    overflow: "hidden",
  },
  cardTall: {
    borderRadius: 20,
    // marginTop: hp(),
  },

  // ── Profile row (card 1)
  profileRow: {
    width: wp(297),
    height: hp(45),
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0,        // single row, no separator needed
  },
  profileLabel: {
    flex: 1,
    fontFamily: "Urbanist-SemiBold",
    fontSize: wp(16),
    lineHeight: 28,
    marginLeft : 20,
    letterSpacing: 0.35,
    color: "#000000",
  },

  // ── Generic row
  row: {
    height: hp(45),
    flexDirection: "row",
    alignItems: "center",
    gap: wp(16),
    paddingLeft: 0,              // card already has paddingLeft
    paddingRight: wp(16),
  },
  iconCircle: {
    width: wp(30),
    height: wp(30),
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  rowIcon: {
    width: wp(30),
    height: wp(30),
  },
  rowLabel: {
    flex: 1,
    fontFamily: "Urbanist-Medium",
    fontSize: wp(17),
    lineHeight: 22,
    letterSpacing: -0.41,
    color: "#000000",
  },
  arrowWrap: {
    width: wp(23),
    height: hp(45),
    alignItems: "center",
    justifyContent: "center",
    gap: wp(14),
    paddingRight: wp(16),
  },
 arrowWrap1: {
    width: wp(7),
    height: hp(20),
    alignItems: "center",
    justifyContent: "center",
  },
  arrow: {
    width: wp(7),
    height: hp(20),
    tintColor: "#0000009f",

  },

  // ── Toggle (Night Mode)
  toggleWrap: {
    width: wp(51),
    height: hp(23),
    position: "relative",
    justifyContent: "center",
  },
  toggleBg: {
    width: wp(51),
    height: hp(23),
    position: "absolute",
  },
  toggleKnob: {
    width: wp(20),
    height: wp(20),
    position: "absolute",
    // shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
  },
  knobOff: {
    left: wp(4),
  },
  knobOn: {
    left: wp(27),
  },

  // ── Separator
  separator: {
    height: 0.5,
    width: wp(297),
    backgroundColor: "#3C3C4329",
    alignSelf: "flex-end",
    marginRight: wp(16),
  },

  // ── Logout card
  logoutCard: {
    width: wp(361),
    height: hp(57),
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    paddingLeft: wp(16),
    overflow: "hidden",
    marginTop: hp(84),
    justifyContent: "center",
  },
  logoutRow: {
    width: wp(302),
    height: hp(45),
    flexDirection: "row",
    alignItems: "center",
    gap: wp(16),
  },
  logoutLabel: {
    flex: 1,
    fontFamily: "Urbanist-Bold",
    fontSize: wp(16),
    lineHeight: 28,
    letterSpacing: 0.35,
    color: "#000000",
  },
});