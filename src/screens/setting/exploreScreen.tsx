// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Image,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { wp, hp } from "../../utils/responcive/responcive";
// import { useAppTheme } from "../../hooks/useTheme";

// const ExploreScreen = () => {
//   const navigation = useNavigation<any>();
//   const { colors } = useAppTheme();

//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
      
//       {/* Header */}
//       <View style={styles.header}>
        
//         {/* Back Button */}
//        <TouchableOpacity
//   onPress={() => navigation.goBack()}
//   style={styles.backContainer}
//   activeOpacity={0.7}
// >
//   <Image
//     source={require("../../images/loginImage/back_arrow.png")}
//     style={styles.backIcon}
//   />
// </TouchableOpacity>

//         {/* Title */}
//         <Text style={[styles.title, { color: colors.text }]}>
//           Settings
//         </Text>

//         {/* Empty View for spacing */}
//         <View style={{ width: wp(41) }} />
//       </View>

//       {/* Body */}
//       <View style={styles.body}>
//         <Text style={{ color: colors.text }}>Your content here...</Text>
//       </View>
//     </View>
//   );
// };

// export default ExploreScreen;


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },

//   header: {
//     width: wp(390),
//     height: hp(61),
//     marginTop: hp(59),
//     paddingHorizontal: wp(10),
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   backContainer: {
//   width: wp(41),
//   height: wp(41),
//   alignItems: "center",
//   justifyContent: "center",
// },

// backIcon: {
//   width: wp(19),
//   height: wp(19),
//   resizeMode: "contain",
// },
//   title: {
//     fontSize: wp(24),
//     // fontWeight: "600",
//    fontFamily: "Urbanist-SemiBold",
//     letterSpacing: 0.37,
//   },

//   body: {
//     flex: 1,
//     padding: wp(15),
//   },
// });


import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { wp, hp } from "../../utils/responcive/responcive";
import { useAppTheme } from "../../hooks/useTheme";
import { toggleTheme } from "../../redux/slices/themeSlice";

// ─── Types ────────────────────────────────────────────────────────────────────
interface RowItem {
  label: string;
  icon: any;
  onPress?: () => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Chevron arrow on the right side of every row */
const ArrowIcon = () => {
  const { mode } = useAppTheme();
  return (
    <Image
      source={require("../../images/setting/arrow.png")}
      style={[styles.arrow, { tintColor: mode === "dark" ? "#FFFFFF80" : "#0000009f" }]}
      resizeMode="contain"
    />
  );
};

/** Generic tappable row with left icon + label + right arrow */
const SettingsRow = ({ label, icon, onPress }: RowItem) => {
  const { colors } = useAppTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.row}
      onPress={onPress}
    >
      {/* Left icon */}
      <View style={styles.iconCircle}>
        <Image source={icon} style={styles.rowIcon} resizeMode="contain" />
      </View>

      {/* Label */}
      <Text style={[styles.rowLabel, { color: colors.text }]} numberOfLines={1}>
        {label}
      </Text>

      {/* Right arrow */}
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

  const cardBg    = mode === "dark" ? "#1E1E1E" : "#FFFFFF";
  const sepColor  = mode === "dark" ? "#FFFFFF18" : "#3C3C4329";

  // Rows for the second card (all simple nav rows)
  const navRows: RowItem[] = [
    {
      label: "Onboarding",
      icon: require("../../images/setting/onboard.png"),
      onPress: () => navigation.navigate("Onboarding 1"),
    },
    {
      label: "What's New",
      icon: require("../../images/setting/news.png"),
    },
    {
      label: "SIP Details",
      icon: require("../../images/setting/sip.png"),
    },
    {
      label: "Wallet",
      icon: require("../../images/setting/wallet.png"),
    },
    {
      label: "Reports",
      icon: require("../../images/setting/reports.png"),
    },
    {
      label: "News",
      icon: require("../../images/setting/news1.png"),
    },
    {
      label: "Customer Support",
      icon: require("../../images/setting/support.png"),
    },
    {
      label: "Login Details",
      icon: require("../../images/setting/login.png"),
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
              <Image
                source={require("../../images/headerImage/user.png")}
                style={styles.rowIcon}
                resizeMode="contain"
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

        {/* ── Card 2 – Feature rows ── */}
        <View style={[styles.card, styles.cardTall, { backgroundColor: cardBg }]}>
          {/* Night Mode row (has toggle instead of arrow) */}
          <View style={styles.row}>
            {/* Left icon */}
            <View style={styles.iconCircle}>
              <Image
                source={require("../../images/setting/darkmode.png")}
                style={styles.rowIcon}
                resizeMode="contain"
              />
            </View>

            {/* Label */}
            <Text style={[styles.rowLabel, { color: colors.text }]} numberOfLines={1}>
              Night Mode
            </Text>

            {/* Toggle */}
            <View style={styles.toggleWrap}>
              {/* Background image */}
              <Image
                source={require("../../images/setting/Background.png")}
                style={styles.toggleBg}
                resizeMode="contain"
              />
              {/* Knob image, shifts right when ON */}
              <Image
                source={require("../../images/setting/Knob.png")}
                style={[
                  styles.toggleKnob,
                  nightMode ? styles.knobOn : styles.knobOff,
                ]}
                resizeMode="contain"
              />
              {/* Invisible pressable overlay */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={StyleSheet.absoluteFillObject}
                onPress={() => dispatch(toggleTheme())}
              />
            </View>
          </View>

          {/* Separator */}
          <View style={[styles.separator, { backgroundColor: sepColor }]} />

          {/* All navigation rows */}
          {navRows.map((item, idx) => (
            <React.Fragment key={item.label}>
              <SettingsRow {...item} />
              {idx < navRows.length - 1 && <View style={[styles.separator, { backgroundColor: sepColor }]} />}
            </React.Fragment>
          ))}
        </View>

        {/* ── Logout Card ── */}
        <View style={[styles.logoutCard, { backgroundColor: cardBg }]}>
          <TouchableOpacity activeOpacity={0.7} style={styles.logoutRow}>
            {/* Icon */}
            <View style={styles.iconCircle}>
              <Image
                source={require("../../images/setting/logout.png")}
                style={styles.rowIcon}
                resizeMode="contain"
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